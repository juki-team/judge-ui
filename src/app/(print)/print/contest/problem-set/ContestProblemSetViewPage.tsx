'use client';

import { ProblemView, ViewOverview } from 'components';
import { Fragment } from 'react';
import { ContestDataResponseDTO, EntityState } from 'types';

export const ContestProblemSetViewPage = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  return (
    <>
      <ViewOverview
        contest={contest}
        reloadContest={async () => {
        }}
        forPrinting
      />
      <div className="page-break" />
      {Object.values(contest.problems).map(problem => (
        <Fragment key={problem.key}>
          <ProblemView
            problem={{
              ...problem,
              user: {
                isOwner: false,
                isAdministrator: false,
                isManager: false,
                tried: false,
                isSpectator: false,
                solved: false,
              },
              state: EntityState.RELEASED,
            }}
            infoPlacement="none"
            codeEditorStoreKey={contest.key + '/' + problem.key}
            forPrinting
          />
          <div className="page-break" />
        </Fragment>
      ))}
    </>
  );
};
