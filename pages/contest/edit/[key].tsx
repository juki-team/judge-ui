import { getProblemJudgeKey, Status } from '@juki-team/commons';
import { FetcherLayer } from 'components';
import { EditContest } from 'components/contest/EditContest';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { authorizedRequest, can, cleanRequest, notifyResponse } from 'helpers';
import { useContestRouter, useNotification, useRouter } from 'hooks';
import React, { useEffect, useRef, useState } from 'react';
import { useUserState } from 'store';
import { ContentResponseType, ContestResponseDTO, ContestTab, EditCreateContestDTO, HTTPMethod } from 'types';
import { ButtonLoaderOnClickType } from '../../../types';
import Custom404 from '../../404';

const parseContest = (data: ContentResponseType<ContestResponseDTO>): EditCreateContestDTO => {
  const problems = {};
  Object.values(data.content.problems).forEach(problem => {
    problems[getProblemJudgeKey(problem.judge, problem.key)] = {
      key: problem.key,
      index: problem.index,
      judge: problem.judge,
      name: problem.name,
      points: problem.points,
      color: problem.color,
      startTimestamp: problem.startTimestamp,
      endTimestamp: problem.endTimestamp,
    };
  });
  
  const members = {
    administrators: Object.keys(data.content.members.administrators),
    judges: Object.keys(data.content.members.judges),
    guests: Object.keys(data.content.members.guests),
    spectators: Object.keys(data.content.members.spectators),
  }
  
  return {
    description: data.content.description,
    key: data.content.key,
    members,
    name: data.content.name,
    problems: problems,
    settings: data.content.settings,
    tags: data.content.tags,
    type: data.content.type,
  };
};

const Edit = ({ data, isLoading, error }: { data: ContentResponseType<ContestResponseDTO>, isLoading: boolean, error: any }) => {
  const [contest, setContest] = useState<EditCreateContestDTO>(parseContest(data));
  const { addNotification } = useNotification();
  const { push } = useRouter();
  const { session } = useUserState();
  const lastContest = useRef(data);
  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(lastContest.current)) {
      console.log('HAY CAMBIOSSS!!, cuidado que se pisen datos');
    }
  }, [data, isLoading, error]);
  const onSave: ButtonLoaderOnClickType = async (setLoaderStatus) => {
    setLoaderStatus(Status.LOADING);
    const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.CONTEST.CONTEST_V1(contest.key, session), {
      method: HTTPMethod.PUT,
      body: JSON.stringify(contest),
    }));
    notifyResponse(response, addNotification);
    if (response.success) {
      push(ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW));
      setLoaderStatus(Status.SUCCESS);
    } else {
      setLoaderStatus(Status.ERROR);
    }
  };
  return <EditContest contest={contest} setContest={setContest} onSave={onSave} editing />;
};

function ContestEdit() {
  
  const user = useUserState();
  const now = new Date();
  now.setSeconds(0, 0);
  const { contestKey } = useContestRouter();
  const { session } = useUserState();
  
  if (!can.createContest(user)) {
    return <Custom404 />;
  }
  
  return (
    <FetcherLayer<ContentResponseType<ContestResponseDTO>>
      url={JUDGE_API_V1.CONTEST.CONTEST_DATA(contestKey, session)}
      errorView={<Custom404 />}
    >
      {({ data, isLoading, error }) => {
        return <Edit data={data} isLoading={isLoading} error={error} />;
      }}
    </FetcherLayer>
  );
}

export default ContestEdit;
