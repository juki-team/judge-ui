import { QueryParam } from 'config/constants';
import { classNames, replaceParamQuery } from 'helpers';
import { useRouter } from 'hooks';
import React, { PropsWithChildren } from 'react';

export const SubmissionInfo = ({
  submitId,
  canViewSourceCode,
  children,
}: PropsWithChildren<{ submitId: string, canViewSourceCode: boolean }>) => {
  
  const { query, push } = useRouter();
  
  return (
    <span
      className={classNames({ link: canViewSourceCode })}
      onClick={() => canViewSourceCode && push({ query: replaceParamQuery(query, QueryParam.SUBMISSION_VIEW, submitId) })}
    >
      {children}
    </span>
  );
};
