import { EditContest } from 'components/contest/EditContest';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { CONTEST_DEFAULT } from 'config/constants/contest';
import { authorizedRequest, can, cleanRequest, notifyResponse } from 'helpers';
import { useNotification, useRouter } from 'hooks';
import React, { useState } from 'react';
import { useUserState } from 'store';
import { ContentResponseType, ContestTab, EditCreateContestDTO, HTTPMethod } from 'types';
import Custom404 from '../../404';

function ContestCreate() {
  
  const user = useUserState();
  const { push } = useRouter();
  const now = new Date();
  const { addNotification } = useNotification();
  now.setSeconds(0, 0);
  const [contest, setContest] = useState<EditCreateContestDTO>(CONTEST_DEFAULT());
  
  if (!can.createContest(user)) {
    return <Custom404 />;
  }
  const onSave = async () => {
    const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.CONTEST.CONTEST_V1(undefined, user.session), {
      method: HTTPMethod.POST,
      body: JSON.stringify(contest),
    }));
    notifyResponse(response, addNotification);
    if (response.success) {
      push(ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW));
    }
  };
  
  return (
    <EditContest contest={contest} setContest={setContest} onSave={onSave} />
  );
}

export default ContestCreate;
