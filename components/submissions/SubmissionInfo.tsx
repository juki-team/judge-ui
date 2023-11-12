import { classNames } from 'helpers';
import { useJukiRouter } from 'hooks';
import React, { PropsWithChildren } from 'react';
import { QueryParam } from 'types';

interface SubmissionInfoProps {
  submitId: string,
  canViewSourceCode: boolean,
}

export const SubmissionInfo = ({ submitId, canViewSourceCode, children }: PropsWithChildren<SubmissionInfoProps>) => {
  
  const { setSearchParams } = useJukiRouter();
  
  return (
    <span
      className={classNames({ link: canViewSourceCode })}
      onClick={() => canViewSourceCode && setSearchParams({ name: QueryParam.SUBMISSION_VIEW, value: submitId })}
    >
      {children}
    </span>
  );
};
