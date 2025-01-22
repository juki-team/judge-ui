'use client';

import { LinkLastPath, ProblemStatement, T, TwoContentLayout } from 'components';
import { jukiAppRoutes } from 'config';
import { renderReactNodeOrFunctionP1 } from 'helpers';
import { useEntityDiff, useJukiUI } from 'hooks';
import React, { useState } from 'react';
import { EntityState, LastPathKey, ProblemTab, TabsType, UpsertComponentEntityProps, UpsertProblemUIDTO } from 'types';
import { Input } from '../index';
import { ProblemAccess } from './ProblemAccess';
import { ProblemDelete } from './ProblemDelete';
import { ProblemEditorial } from './ProblemEditorial';
import { ProblemSettings } from './ProblemSettings';
import { ProblemTestCases } from './ProblemTestCases';

export const EditCreateProblem = (props: UpsertComponentEntityProps<UpsertProblemUIDTO, ProblemTab>) => {
  
  const { entity: initialProblem, entityKey: problemJudgeKey, tabButtons } = props;
  
  const editing = !!problemJudgeKey;
  const [ problem, setProblem ] = useState(initialProblem);
  useEntityDiff(initialProblem, true);
  const { components: { Link } } = useJukiUI();
  
  const tabs: TabsType<ProblemTab> = {
    [ProblemTab.STATEMENT]: {
      key: ProblemTab.STATEMENT,
      header: <T className="tt-ce ws-np">statement</T>,
      body: (
        <ProblemStatement
          problem={problem}
          setProblem={setProblem}
        />
      ),
    },
    [ProblemTab.SETUP]: {
      key: ProblemTab.SETUP,
      header: <T className="tt-ce ws-np">settings</T>,
      body: (
        <ProblemSettings problem={problem} setProblem={setProblem} problemJudgeKey={problemJudgeKey} />
      ),
    },
    [ProblemTab.TESTS]: {
      key: ProblemTab.TESTS,
      header: <T className="tt-se ws-np">test cases</T>,
      body: (
        editing
          ? <ProblemTestCases problem={problem} problemJudgeKey={problemJudgeKey} />
          : (
            <div className="jk-col gap jk-pg bc-we jk-br-ie cr-er">
              <T className="tt-se">you will be able to upload test cases once you have created the problem</T>
            </div>
          )
      ),
    },
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
    [ProblemTab.ACCESS]: {
      key: ProblemTab.ACCESS,
      header: <T className="tt-se ws-np">access</T>,
      body: (
        <ProblemAccess
          members={problem.members}
          setMembers={(setStateAction) => {
            if (typeof setStateAction === 'function') {
              setProblem(prevState => (
                { ...prevState, members: setStateAction(prevState.members) }
              ));
            } else {
              setProblem(prevState => (
                { ...prevState, members: setStateAction }
              ));
            }
          }}
          documentOwner={problem.owner}
        />
      ),
    },
    ...(
      editing ? {
        [ProblemTab.DELETE]: {
          key: ProblemTab.DELETE,
          header: <T className="tt-se ws-np">delete</T>,
          body: (
            <ProblemDelete
              problemJudgeKey={problemJudgeKey}
              documentOwner={problem.owner}
              deleted={problem.state === EntityState.ARCHIVED}
            />
          ),
        },
      } : {}),
  };
  
  const breadcrumbs = ({ selectedTabKey }: { selectedTabKey: ProblemTab }) => [
    <LinkLastPath lastPathKey={LastPathKey.PROBLEMS} key="problems"><T className="tt-se">problems</T></LinkLastPath>,
    editing
      ? (
        <Link href={jukiAppRoutes.JUDGE().problems.view({ key: problemJudgeKey })} className="link">
          <div className="ws-np">{problem.name}</div>
        </Link>
      ) : <div className="ws-np">{problem.name}</div>,
    renderReactNodeOrFunctionP1(tabs[selectedTabKey]?.header, { selectedTabKey }),
  ];
  
  return (
    <TwoContentLayout
      breadcrumbs={breadcrumbs}
      tabs={tabs}
      tabButtons={tabButtons({ entityData: problem })}
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
