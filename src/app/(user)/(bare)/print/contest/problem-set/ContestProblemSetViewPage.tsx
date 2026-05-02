'use client';

import { ViewOverview } from 'components';
import { ProblemView } from '@juki-team/base-ui';
import { Fragment } from 'react';
import { type ContestDataResponseDTO } from '@juki-team/commons/dto';
import { EntityState } from '@juki-team/commons/enums';

export const ContestProblemSetViewPage = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  return (
    <>
      <ViewOverview contest={contest} forPrinting />
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
