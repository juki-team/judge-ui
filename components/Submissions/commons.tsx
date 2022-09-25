import { DateField, Field, T, TextHeadCell, UserNicknameLink } from 'components';
import { ACCEPTED_PROGRAMMING_LANGUAGES, PROBLEM_VERDICT, PROGRAMMING_LANGUAGE, ROUTES } from 'config/constants';
import Link from 'next/link';
import React from 'react';
import { ContestTab, DataViewerHeadersType, ProblemTab, SubmissionResponseDTO } from 'types';
import { ExternalIcon } from '../index';
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
  filter: { type: 'text-auto' },
  cardPosition: 'top',
  minWidth: 250,
});

export const submissionProblem = (props?: { header?: Pick<DataViewerHeadersType<SubmissionResponseDTO>, 'filter'>, onlyProblem?: boolean, blankTarget?: boolean }): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: (
    <TextHeadCell text={props?.onlyProblem ? <T>problem</T> : <><T>problem</T> / <T className="tt-se">contest</T></>} />
  ),
  index: 'problem',
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
  field: ({ record, isCard }) => (
    <SubmissionInfo submission={record}>
      <div>{PROGRAMMING_LANGUAGE[record.language]?.label || record.language}</div>
    </SubmissionInfo>
  ),
  sort: { compareFn: () => (rowA, rowB) => rowB.language.localeCompare(rowA.language) },
  filter: {
    type: 'select-auto',
    options: ACCEPTED_PROGRAMMING_LANGUAGES.map(language => ({ label: PROGRAMMING_LANGUAGE[language].label, value: language })),
  },
  cardPosition: 'center',
  minWidth: 120,
});

export const submissionVerdict = (): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: <TextHeadCell text={<T>verdict</T>} />,
  index: 'verdict',
  field: ({ record, isCard }) => (
    <SubmissionInfo submission={record}>
      <Verdict verdict={record.verdict} points={record.points} status={record.status} />
    </SubmissionInfo>
  ),
  sort: { compareFn: () => (rowA, rowB) => rowA.verdict.localeCompare(rowB.verdict) },
  filter: {
    type: 'select-auto',
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
    type: 'date-range-auto',
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
  filter: { type: 'text-auto' },
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
  filter: { type: 'text-auto' },
  cardPosition: 'bottom',
  minWidth: 140,
});
