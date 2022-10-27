import { ButtonLoader, DateField, ExternalIcon, Field, ReloadIcon, T, TextHeadCell, UserNicknameLink } from 'components';
import { ACCEPTED_PROGRAMMING_LANGUAGES, PROBLEM_VERDICT, PROGRAMMING_LANGUAGE, ROUTES } from 'config/constants';
import Link from 'next/link';
import React from 'react';
import { ContestTab, DataViewerHeadersType, ProblemTab, SubmissionResponseDTO } from 'types';
import { useRejudgeServices } from '../../hooks/rejudge';
import { SubmissionInfo } from './SubmissionInfo';

import { Memory, Time, Verdict } from './utils';

export const submissionNickname = (): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: <TextHeadCell text={<T>nickname</T>} />,
  index: 'nickname',
  field: ({ record: { userNickname, userImageUrl }, isCard }) => (
    <Field className="jk-row center gap">
      <img src={userImageUrl} className="jk-user-profile-img large" alt={userNickname} />
      <UserNicknameLink nickname={userNickname}>
        <div className="link">{userNickname}</div>
      </UserNicknameLink>
    </Field>
  ),
  sort: { compareFn: () => (rowA, rowB) => rowA.userNickname.localeCompare(rowB.userNickname) },
  filter: { type: 'text' },
  cardPosition: 'top',
  minWidth: 250,
});

export const submissionProblem = (props?: { header?: Pick<DataViewerHeadersType<SubmissionResponseDTO>, 'filter'>, onlyProblem?: boolean, blankTarget?: boolean }): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: (
    <TextHeadCell text={props?.onlyProblem ? <T>problem</T> : <><T>problem</T> / <T className="tt-se">contest</T></>} />
  ),
  index: 'problemJudgeKeys',
  field: ({ record: { problemKey, problemName, contestName, contestKey, contestProblemIndex }, isCard }) => (
    <Field className="jk-row">
      {contestKey ? (
        <Link href={ROUTES.CONTESTS.VIEW(contestKey, ContestTab.PROBLEM, contestProblemIndex)}>
          <a target={props?.blankTarget ? '_blank' : ''}>
            {props?.onlyProblem ? (
              <div className="jk-row link">
                {problemName} ({contestProblemIndex}) {!!props?.blankTarget && <ExternalIcon size="small" />}
              </div>
            ) : (
              <div className="jk-row link">
                {contestName} ({contestProblemIndex}) {!!props?.blankTarget && <ExternalIcon size="small" />}
              </div>
            )}
          </a>
        </Link>
      ) : (
        <Link href={ROUTES.PROBLEMS.VIEW(problemKey + '', ProblemTab.STATEMENT)}>
          <a target={props?.blankTarget ? '_blank' : ''}>
            <div className="jk-row link">{problemKey} {problemName} {!!props?.blankTarget && <ExternalIcon size="small" />}</div>
          </a>
        </Link>
      )}
    </Field>
  ),
  sort: { compareFn: () => (rowA, rowB) => +rowA.timestamp - +rowB.timestamp },
  filter: props?.header?.filter,
  cardPosition: 'center',
  minWidth: 280,
});

export const submissionLanguage = (): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: <TextHeadCell text={<T>lang</T>} />,
  index: 'language',
  field: ({ record: { submitId, canViewSourceCode, language }, isCard }) => (
    <Field>
      <SubmissionInfo submitId={submitId} canViewSourceCode={canViewSourceCode}>
        <div className="jk-col extend">{PROGRAMMING_LANGUAGE[language]?.label || language}</div>
      </SubmissionInfo>
    </Field>
  ),
  sort: { compareFn: () => (rowA, rowB) => rowB.language.localeCompare(rowA.language) },
  filter: {
    type: 'select',
    options: ACCEPTED_PROGRAMMING_LANGUAGES.map(language => ({ label: PROGRAMMING_LANGUAGE[language].label, value: language })),
  },
  cardPosition: 'center',
  minWidth: 120,
});

export const RejudgeButton = ({ submissionId }: { submissionId: string }) => {
  const { rejudgeSubmission } = useRejudgeServices();
  return (
    <ButtonLoader
      onClick={rejudgeSubmission(submissionId)}
      size="tiny"
      icon={<ReloadIcon />}
    >
      <T>rejudge</T>
    </ButtonLoader>
  );
};

export const submissionVerdict = (canRejudge: boolean, filterByRequest?: boolean): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: <TextHeadCell text={<T>verdict</T>} />,
  index: 'verdict',
  field: ({ record: { submitId, points, status, verdict, canViewSourceCode }, isCard }) => (
    <Field>
      <div className="jk-col extend">
        <SubmissionInfo submitId={submitId} canViewSourceCode={canViewSourceCode}>
          <Verdict verdict={verdict} points={points} status={status} />
        </SubmissionInfo>
        {canRejudge && <RejudgeButton submissionId={submitId} />}
      </div>
    </Field>
  ),
  sort: { compareFn: () => (rowA, rowB) => rowA.verdict.localeCompare(rowB.verdict) },
  filter: {
    type: 'select',
    options: Object.values(PROBLEM_VERDICT)
      .map(({ value, label }) => ({ label: <T className="tt-se">{label}</T>, value })),
  },
  cardPosition: 'center',
  minWidth: 140,
});

export const submissionDate = (): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: <TextHeadCell text={<T>date</T>} />,
  index: 'timestamp',
  field: ({ record: { timestamp }, isCard }) => (
    <DateField className="jk-row" date={new Date(timestamp)} label={<T>date</T>} />
  ),
  sort: { compareFn: () => (rowA, rowB) => +rowA.timestamp - +rowB.timestamp },
  filter: {
    type: 'date-range',
    getValue: ({ record: { timestamp } }) => new Date(timestamp),
    pickerType: 'year-month-day-hours-minutes',
  },
  cardPosition: 'center',
  minWidth: 280,
});

export const submissionTimeUsed = (): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: <TextHeadCell text={<T>time</T>} />,
  index: 'timeUsed',
  field: ({ record: { timeUsed, verdict, memoryUsed }, isCard }) => (
    <Field className="jk-row center">
      <Time timeUsed={timeUsed} verdict={verdict} />
    </Field>
  ),
  sort: { compareFn: () => (rowA, rowB) => rowA.timeUsed - rowB.timeUsed },
  // filter: { type: 'text-auto' }, // TODO filter by integer
  cardPosition: 'bottom',
  minWidth: 140,
});

export const submissionMemoryUsed = (): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: <TextHeadCell text={<T>memory</T>} />,
  index: 'memoryUsed',
  field: ({ record: { memoryUsed, verdict }, isCard }) => (
    <Field className="jk-row center">
      <Memory memoryUsed={memoryUsed} verdict={verdict} />
    </Field>
  ),
  sort: { compareFn: () => (rowA, rowB) => rowA.memoryUsed - rowB.memoryUsed },
  // filter: { type: 'text-auto' }, // TODO filter by integer
  cardPosition: 'bottom',
  minWidth: 140,
});
