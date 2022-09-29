import { ArrowIcon, ButtonLoader, CheckUnsavedChanges, ProblemStatement, T, Tabs, TwoContentLayout } from 'components';
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
import { ProblemEditorial } from './ProblemEditorial';
import { ProblemSettings } from './ProblemSettings';
import { TitleEditable } from './TitleEditable';

export const EditCreateProblem = ({ problem: initialProblem }: { problem?: EditCreateProblemType }) => {
  
  const editing = !!initialProblem;
  const { query: { key }, push } = useRouter();
  const [problem, setProblem] = useState(editing ? initialProblem : PROBLEM_DEFAULT());
  const { addNotification } = useNotification();
  
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
  
  console.log({ problem });
  
  return (
    <TwoContentLayout>
      <div className="jk-col filled">
        <div className="jk-row left gap nowrap">
          <div className="jk-row cr-py back-link">
            <CheckUnsavedChanges
              onSafeClick={() => push(editing ? ROUTES.PROBLEMS.VIEW(problem.key, ProblemTab.STATEMENT) : ROUTES.PROBLEMS.LIST())}
              value={problem}
            >
              <div className="jk-row nowrap fw-bd link">
                <ArrowIcon rotate={-90} />
                <div className="screen lg hg"><T className="tt-se">cancel</T></div>
              </div>
            </CheckUnsavedChanges>
          </div>
          <TitleEditable value={problem.name} onChange={value => setProblem({ ...problem, name: value })} />
        </div>
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
          // { key: ProblemTab.TESTS, header: <T className="tt-se">test cases</T>, body: <div>test cases</div> },
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
          <ButtonLoader
            type="secondary"
            onClick={onSave}
          >
            <T>save</T>
          </ButtonLoader>,
        ]}
      />
    </TwoContentLayout>
  );
};