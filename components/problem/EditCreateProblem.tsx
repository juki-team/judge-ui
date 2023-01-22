import { CloseIcon, SaveIcon, useJukiBase } from '@juki-team/base-ui';
import {
  Breadcrumbs,
  ButtonLoader,
  CheckUnsavedChanges,
  LinkProblems,
  ProblemStatement,
  T,
  TabsInline,
  TwoContentSection,
} from 'components';
import { JUDGE_API_V1, PROBLEM_DEFAULT, ROUTES } from 'config/constants';
import { authorizedRequest, cleanRequest, notifyResponse } from 'helpers';
import { useNotification, useRouter } from 'hooks';
import Link from 'next/link';
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
  const { viewPortSize } = useJukiBase();
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
  const tabs = {
    [ProblemTab.STATEMENT]: {
      key: ProblemTab.STATEMENT,
      header: <T className="tt-ce ws-np">statement</T>,
      body: (
        <ProblemStatement
          problemKey={problem.key}
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
    [ProblemTab.SETUP]: {
      key: ProblemTab.SETUP,
      header: <T className="tt-ce ws-np">settings</T>,
      body: (
        <div className="pad-top-bottom pad-left-right">
          <ProblemSettings problem={problem} setProblem={setProblem} />
        </div>
      ),
    },
    ...(editing ? {
      [ProblemTab.TESTS]: {
        key: ProblemTab.TESTS,
        header: <T className="tt-se ws-np">test cases</T>,
        body: (
          <div className="pad-top-bottom pad-left-right">
            <ProblemTestCases problem={problem} />
          </div>
        ),
      },
    } : {}),
    [ProblemTab.EDITORIAL]: {
      key: ProblemTab.EDITORIAL,
      header: <T className="tt-se ws-np">editorial</T>,
      body: (
        <div className="pad-top-bottom pad-left-right">
          <ProblemEditorial
            editorial={problem.editorial}
            setEditorial={(editorial) => setProblem(prevState => ({ ...prevState, editorial }))}
          />
        </div>
      ),
    },
  };
  
  const extraNodes = [
    <CheckUnsavedChanges
      onSafeClick={() => push(editing ? ROUTES.PROBLEMS.VIEW(problem.key, ProblemTab.STATEMENT) : ROUTES.PROBLEMS.LIST())}
      value={problem}
    >
      <ButtonLoader
        size={viewPortSize !== 'sm' ? 'small' : 'large'}
        icon={<CloseIcon />}
      >
        {viewPortSize !== 'sm' && <T>cancel</T>}
      </ButtonLoader>
    </CheckUnsavedChanges>,
    <ButtonLoader
      type="secondary"
      size={viewPortSize !== 'sm' ? 'small' : 'large'}
      icon={<SaveIcon />}
      onClick={onSave}
    >
      {viewPortSize !== 'sm' && (editing ? <T>update</T> : <T>create</T>)}
    </ButtonLoader>,
  ];
  
  const [tab, setTab] = useState<ProblemTab>(ProblemTab.STATEMENT);
  
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <LinkProblems><T className="tt-se">contests</T></LinkProblems>,
  ];
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="jk-row extend center tx-h">
          <h3 style={{ padding: 'var(--pad-sm) 0' }}><T>name</T></h3>:&nbsp;
          <Input
            value={problem.name}
            onChange={value => setProblem({ ...problem, name: value })}
          />
        </div>
        <div className="pad-left-right" style={{ overflow: 'hidden' }}>
          <TabsInline
            tabs={tabs}
            pushTab={(tab) => setTab(tab)}
            tabSelected={tab}
            extraNodes={extraNodes}
          />
        </div>
      </div>
      {tabs[tab].body}
    </TwoContentSection>
  );
};
