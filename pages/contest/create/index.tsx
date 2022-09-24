import { EditContest } from 'components/contest/EditContest';
import { CONTEST_DEFAULT, JUDGE_API_V1, ROUTES } from 'config/constants';
import { authorizedRequest, cleanRequest, notifyResponse } from 'helpers';
import { useNotification, useRouter } from 'hooks';
import React, { useState } from 'react';
import { useUserState } from 'store';
import { ButtonLoaderOnClickType, ContentResponseType, ContestTab, EditCreateContestDTO, HTTPMethod, Status } from 'types';
import Custom404 from '../../404';

function ContestCreate() {
  
  const { canCreateContest } = useUserState();
  const { push } = useRouter();
  const now = new Date();
  const { addNotification } = useNotification();
  now.setSeconds(0, 0);
  const [contest, setContest] = useState<EditCreateContestDTO>(CONTEST_DEFAULT());
  
  if (!canCreateContest) {
    return <Custom404 />;
  }
  const onSave: ButtonLoaderOnClickType = async (setLoaderStatus) => {
    setLoaderStatus(Status.LOADING);
    const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.CONTEST.CREATE(), {
      method: HTTPMethod.POST,
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
  
  return (
    <EditContest contest={contest} setContest={setContest} onSave={onSave} />
  );
}

export default ContestCreate;
