import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { EditProblem } from '../../../components';
import { JUDGE_API_V1, PROBLEM_DEFAULT, ROUTES } from '../../../config/constants';
import { authorizedRequest, cleanRequest, notifyResponse } from '../../../helpers';
import { useNotification } from '../../../hooks';
import { useUserState } from '../../../store';
import { ButtonLoaderOnClickType, ContentResponseType, ContestTab, EditCreateProblem, HTTPMethod, Status } from '../../../types';
import Custom404 from '../../404';

function ProblemCreate() {
  
  const { canCreateProblem } = useUserState();
  const { push } = useRouter();
  const { addNotification } = useNotification();
  const [problem, setProblem] = useState<EditCreateProblem>(PROBLEM_DEFAULT());
  
  if (!canCreateProblem) {
    return <Custom404 />;
  }
  const onSave: ButtonLoaderOnClickType = async (setLoaderStatus) => {
    setLoaderStatus(Status.LOADING);
    const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.PROBLEM.PROBLEM(), {
      method: HTTPMethod.POST,
      body: JSON.stringify(problem),
    }));
    notifyResponse(response, addNotification);
    if (response.success) {
      push(ROUTES.CONTESTS.VIEW(problem.key, ContestTab.OVERVIEW));
      setLoaderStatus(Status.SUCCESS);
    } else {
      setLoaderStatus(Status.ERROR);
    }
  };
  
  return (
    <EditProblem problem={problem} setProblem={setProblem} onSave={onSave} />
  );
}

export default ProblemCreate;
