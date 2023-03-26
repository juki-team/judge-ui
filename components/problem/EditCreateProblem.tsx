import { Judge } from '@juki-team/commons';
import {
  Breadcrumbs,
  ButtonLoader,
  CheckUnsavedChanges,
  CloseIcon,
  LinkProblems,
  ProblemStatement,
  SaveIcon,
  T,
  TabsInline,
  TwoContentSection,
} from 'components';
import { JUDGE_API_V1, PROBLEM_DEFAULT, ROUTES } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useJukiUI, useNotification, useRouter } from 'hooks';
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
  const { query, push } = useRouter();
  const [problem, setProblem] = useState(editing ? initialProblem : PROBLEM_DEFAULT());
  const { notifyResponse } = useNotification();
  const { viewPortSize } = useJukiUI();
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
    if (notifyResponse(response)) {
      setLoaderStatus(Status.LOADING);
      await mutate(JUDGE_API_V1.PROBLEM.PROBLEM(response.content.key));
      await push(ROUTES.PROBLEMS.VIEW(response.content?.key, ProblemTab.STATEMENT));
      setLoaderStatus(Status.SUCCESS);
    }
  };
  const tabs = {
    [ProblemTab.STATEMENT]: {
      key: ProblemTab.STATEMENT,
      header: <T className="tt-ce ws-np">statement</T>,
      body: (
        <ProblemStatement
          judge={Judge.JUKI_JUDGE}
          problemKey={problem.key}
          author={problem.author}
          name={problem.name}
          status={problem.status}
          statement={problem.statement}
          settings={problem.settings}
          tags={problem.tags}
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
      onClickContinue={() => push(editing ? ROUTES.PROBLEMS.VIEW(problem.key, ProblemTab.STATEMENT) : ROUTES.PROBLEMS.LIST())}
      value={problem}
    >
      <ButtonLoader
        size="small"
        icon={<CloseIcon />}
        responsiveMobile
      >
        <T>cancel</T>
      </ButtonLoader>
    </CheckUnsavedChanges>,
    <ButtonLoader
      type="secondary"
      size="small"
      icon={<SaveIcon />}
      onClick={onSave}
      responsiveMobile
    >
      {editing ? <T>update</T> : <T>create</T>}
    </ButtonLoader>,
  ];
  
  const [tab, setTab] = useState<ProblemTab>(ProblemTab.STATEMENT);
  
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <LinkProblems><T className="tt-se">problems</T></LinkProblems>,
    <Link href={{ pathname: ROUTES.PROBLEMS.VIEW(problem.key, ProblemTab.STATEMENT), query }} className="link">
      <div className="ws-np">{problem.name}</div>
    </Link>,
    tabs[tab as string]?.header,
  ];
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="jk-row extend center tx-h">
          <div style={{ padding: 'var(--pad-sm) 0' }}><T className="tt-se fw-bd">name</T></div>
          :&nbsp;
          <Input
            value={problem.name}
            onChange={value => setProblem({ ...problem, name: value })}
            size="auto"
          />
        </div>
        <div className="pad-left-right" style={{ overflow: 'hidden' }}>
          <TabsInline<ProblemTab>
            tabs={tabs}
            onChange={(tab) => setTab(tab)}
            selectedTabKey={tab}
            extraNodes={extraNodes}
            extraNodesPlacement={viewPortSize === 'sm' ? 'bottomRight' : undefined}
          />
        </div>
      </div>
      {tabs[tab].body}
    </TwoContentSection>
  );
};
