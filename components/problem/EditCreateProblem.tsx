import { ButtonLoader, CheckUnsavedChanges, ProblemStatement, T, Tabs, TwoContentLayout } from 'components';
import { JUDGE_API_V1, PROBLEM_DEFAULT, ROUTES } from 'config/constants';
import { authorizedRequest, cleanRequest, notifyResponse } from 'helpers';
import { useNotification, useRouter } from 'hooks';
import React, { useState } from 'react';
import { mutate } from 'swr';
import {
  ButtonLoaderOnClickType,
  ContentResponseType,
  EditCreateProblemType,
  HTTPMethod,
  ProblemResponseDTO,
  ProblemTab,
  Status,
} from 'types';
import { Input } from '../index';
import { ProblemEditorial } from './ProblemEditorial';
import { ProblemSettings } from './ProblemSettings';
import { ProblemTestCases } from './ProblemTestCases';

export const EditCreateProblem = ({ problem: initialProblem }: { problem?: EditCreateProblemType }) => {
  
  const editing = !!initialProblem;
  const { push } = useRouter();
  const [problem, setProblem] = useState(editing ? initialProblem : PROBLEM_DEFAULT());
  const { addNotification } = useNotification();
  
  console.log({ problem, initialProblem });
  const onSave: ButtonLoaderOnClickType = async (setLoaderStatus) => {
    setLoaderStatus(Status.LOADING);
    const bodyProblem = { ...problem };
    delete bodyProblem.key;
    const response = cleanRequest<ContentResponseType<ProblemResponseDTO>>(await authorizedRequest(
      editing ? JUDGE_API_V1.PROBLEM.PROBLEM(problem.key) : JUDGE_API_V1.PROBLEM.CREATE(),
      {
        method: editing ? HTTPMethod.PUT : HTTPMethod.POST,
        body: JSON.stringify(problem),
      }));
    notifyResponse(response, addNotification);
    if (response.success) {
      await mutate(JUDGE_API_V1.PROBLEM.PROBLEM(response.content.key));
      await push(ROUTES.PROBLEMS.VIEW(response.content?.key, ProblemTab.STATEMENT));
      setLoaderStatus(Status.SUCCESS);
    } else {
      setLoaderStatus(Status.ERROR);
    }
  };
  
  return (
    <TwoContentLayout>
      <div className="jk-row extend center tx-h">
        <h6><T>name</T></h6>:&nbsp;
        <Input
          value={problem.name}
          onChange={value => setProblem({ ...problem, name: value })}
        />
      </div>
      <Tabs
        tabs={[
          {
            key: ProblemTab.STATEMENT,
            header: <T className="tt-ce">statement</T>,
            body: (
              <ProblemStatement
                author={problem.author}
                name={problem.name}
                sampleCases={problem.sampleCases}
                status={problem.status}
                statement={problem.statement}
                settings={problem.settings}
                tags={problem.tags}
                setSampleCases={(sampleCases) => setProblem(prevState => ({ ...prevState, sampleCases }))}
                setStatement={(statement) => setProblem(prevState => ({ ...prevState, statement }))}
              />
            ),
          },
          {
            key: ProblemTab.SETUP,
            header: <T className="tt-ce">settings</T>,
            body: <ProblemSettings problem={problem} setProblem={setProblem} />,
          },
          { key: ProblemTab.TESTS, header: <T className="tt-se">test cases</T>, body: <ProblemTestCases problem={problem}  /> },
          {
            key: ProblemTab.EDITORIAL,
            header: <T className="tt-se">editorial</T>,
            body: (
              <ProblemEditorial
                editorial={problem.editorial}
                setEditorial={(editorial) => setProblem(prevState => ({ ...prevState, editorial }))}
              />
            ),
          },
        ]}
        actionsSection={[
          <CheckUnsavedChanges
            onSafeClick={() => push(editing ? ROUTES.PROBLEMS.VIEW(problem.key, ProblemTab.STATEMENT) : ROUTES.PROBLEMS.LIST())}
            value={problem}
          >
            <div><ButtonLoader size="small"><T>cancel</T></ButtonLoader></div>
          </CheckUnsavedChanges>,
          <ButtonLoader type="secondary" size="small" onClick={onSave}>
            {editing ? <T>update</T> : <T>create</T>}
          </ButtonLoader>,
        ]}
      />
    </TwoContentLayout>
  );
};