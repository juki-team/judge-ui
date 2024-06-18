import { TwoContentLayout } from '@juki-team/base-ui';
import {
  Breadcrumbs,
  ButtonLoader,
  CheckUnsavedChanges,
  CloseIcon,
  LinkLastPath,
  ProblemStatement,
  SaveIcon,
  T,
  TabsInline,
  TwoContentSection,
} from 'components';
import { JUDGE_API_V1, PROBLEM_DEFAULT, ROUTES } from 'config/constants';
import { authorizedRequest, cleanRequest, renderReactNodeOrFunctionP1 } from 'helpers';
import { useJukiRouter, useJukiUI, useNotification } from 'hooks';
import React, { ReactNode, useState } from 'react';
import { mutate } from 'swr';
import {
  ButtonLoaderOnClickType,
  ContentResponseType,
  EditCreateProblemType,
  HTTPMethod,
  Judge,
  LastPathKey,
  ProblemResponseDTO,
  ProblemTab,
  Status,
  TabsType,
} from 'types';
import { Input } from '../index';
import { ProblemEditorial } from './ProblemEditorial';
import { ProblemSettings } from './ProblemSettings';
import { ProblemTestCases } from './ProblemTestCases';

interface EditCreateProblemProps {
  problem?: EditCreateProblemType,
}

export const EditCreateProblem = ({ problem: initialProblem }: EditCreateProblemProps) => {
  
  const editing = !!initialProblem;
  const { pushRoute } = useJukiRouter();
  const [ problem, setProblem ] = useState(editing ? initialProblem : PROBLEM_DEFAULT());
  const { notifyResponse } = useNotification();
  const { viewPortSize, components: { Link } } = useJukiUI();
  const onSave: ButtonLoaderOnClickType = async (setLoaderStatus) => {
    setLoaderStatus(Status.LOADING);
    const response = cleanRequest<ContentResponseType<ProblemResponseDTO>>(
      await authorizedRequest(
        editing ? JUDGE_API_V1.PROBLEM.PROBLEM(problem.key) : JUDGE_API_V1.PROBLEM.CREATE(),
        { method: editing ? HTTPMethod.PUT : HTTPMethod.POST, body: JSON.stringify(problem) },
      ));
    if (notifyResponse(response, setLoaderStatus)) {
      setLoaderStatus(Status.LOADING);
      await mutate(JUDGE_API_V1.PROBLEM.PROBLEM(response.content.key));
      await pushRoute(ROUTES.PROBLEMS.VIEW(response.content?.key, ProblemTab.STATEMENT));
      setLoaderStatus(Status.SUCCESS);
    }
  };
  
  const tabs: TabsType<ProblemTab> = {
    [ProblemTab.STATEMENT]: {
      key: ProblemTab.STATEMENT,
      header: <T className="tt-ce ws-np">statement</T>,
      body: (
        <ProblemStatement
          problem={{
            ...problem,
            judge: Judge.JUKI_JUDGE,
            ownerNickname: '',
            user: { isEditor: false, solved: false, tried: false },
            ownerUserNickname: '',
          }}
          setProblem={setProblem}
        />
      ),
    },
    [ProblemTab.SETUP]: {
      key: ProblemTab.SETUP,
      header: <T className="tt-ce ws-np">settings</T>,
      body: (
        <ProblemSettings problem={problem} setProblem={setProblem} />
      ),
    },
    ...(
      editing ? {
        [ProblemTab.TESTS]: {
          key: ProblemTab.TESTS,
          header: <T className="tt-se ws-np">test cases</T>,
          body: (
            <ProblemTestCases problem={problem} />
          ),
        },
      } : {}
    ),
    [ProblemTab.EDITORIAL]: {
      key: ProblemTab.EDITORIAL,
      header: <T className="tt-se ws-np">editorial</T>,
      body: (
        <ProblemEditorial
          editorial={problem.editorial}
          setEditorial={(editorial) => setProblem(prevState => (
            { ...prevState, editorial }
          ))}
        />
      ),
    },
  };
  
  const extraNodes = [
    <CheckUnsavedChanges
      onClickContinue={() => pushRoute(editing
        ? ROUTES.PROBLEMS.VIEW(problem.key, ProblemTab.STATEMENT)
        : ROUTES.PROBLEMS.LIST())}
      value={problem}
      key="cancel"
    >
      <ButtonLoader
        type="light"
        size="small"
        icon={<CloseIcon />}
        responsiveMobile
      >
        <T>cancel</T>
      </ButtonLoader>
    </CheckUnsavedChanges>,
    <ButtonLoader
      size="small"
      icon={<SaveIcon />}
      onClick={onSave}
      responsiveMobile
      disabled={JSON.stringify(initialProblem) === JSON.stringify(problem)}
      key="update/create"
    >
      {editing ? <T>update</T> : <T>create</T>}
    </ButtonLoader>,
  ];
  
  const [ tab, setTab ] = useState<ProblemTab>(ProblemTab.STATEMENT);
  
  const breadcrumbs: ReactNode[] = [
    <LinkLastPath lastPathKey={LastPathKey.PROBLEMS} key="problems"><T className="tt-se">problems</T></LinkLastPath>,
    editing
      ? (
        <Link href={{ pathname: ROUTES.PROBLEMS.VIEW(problem.key, ProblemTab.STATEMENT) }} className="link">
          <div className="ws-np">{problem.name}</div>
        </Link>
      ) : <div className="ws-np">{problem.name}</div>,
    renderReactNodeOrFunctionP1(tabs[tab]?.header, { selectedTabKey: tab }),
  ];
  
  return (
    <TwoContentLayout
      breadcrumbs={breadcrumbs}
      tabs={tabs}
      tabButtons={extraNodes}
    >
      <div className="jk-row extend center tx-h">
        <Input
          label={<T className="tt-se">name</T>}
          labelPlacement="left"
          value={problem.name}
          onChange={value => setProblem({ ...problem, name: value })}
          size="auto"
        />
      </div>
    </TwoContentLayout>
  );
};
