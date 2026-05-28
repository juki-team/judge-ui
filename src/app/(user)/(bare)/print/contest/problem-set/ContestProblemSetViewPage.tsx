'use client';

import { ViewOverview } from 'components';
import { ProblemView } from '@juki-team/base-ui';
import { Fragment } from 'react';
import { type ContestDataResponseDTO } from '@juki-team/commons/dto';
import { EntityRole, EntityState } from '@juki-team/commons/enums';

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
                role: EntityRole.GUEST,
                tried: false,
                solved: false,
              },
              state: EntityState.RELEASED,
              sharing: { grants: [], links: [] },
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
