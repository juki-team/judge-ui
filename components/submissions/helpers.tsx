'use client'

import {
  DateField,
  Field,
  ListenerVerdict,
  OpenInNewIcon,
  RejudgeButton,
  T,
  TextField,
  TextHeadCell,
  UserNicknameLink,
} from 'components';
import { ACCEPTED_PROGRAMMING_LANGUAGES, PROBLEM_VERDICT, PROGRAMMING_LANGUAGE, ROUTES } from 'config/constants';
import { getProblemJudgeKey } from 'helpers';
import Link from 'next/link';
import { ContestTab, DataViewerHeadersType, Judge, ProblemTab, SubmissionResponseDTO } from 'types';
import { SubmissionInfo } from './SubmissionInfo';
import { Memory, Time } from './utils';

export const submissionNickname = (): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: 'user nickname',
  index: 'nickname',
  field: ({ record: { userNickname, userImageUrl }, isCard }) => (
    <TextField
      text={
        <>
          <img src={userImageUrl} className="jk-user-profile-img large" alt={userNickname} />
          <UserNicknameLink nickname={userNickname}>
            <div className="link">{userNickname}</div>
          </UserNicknameLink>
        </>
      }
      label="user nickname"
    />
  ),
  sort: true,
  filter: { type: 'text' },
  cardPosition: 'top',
  minWidth: 250,
});

type SubmissionContestColumnProps = {
  header?: Pick<DataViewerHeadersType<SubmissionResponseDTO>, 'filter'>,
  blankTarget?: boolean,
}

export const submissionContestColumn = (props?: SubmissionContestColumnProps): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: 'contest',
  index: 'contest',
  field: ({ record: { problemName, contestName, contestKey, contestProblemIndex }, isCard }) => (
    <TextField
      text={contestKey ? (
        <Link
          href={ROUTES.CONTESTS.VIEW(contestKey, ContestTab.PROBLEM, contestProblemIndex)}
          target={props?.blankTarget ? '_blank' : ''}
        >
          <div className="jk-row link">
            {contestName} ({contestProblemIndex}) {!!props?.blankTarget && <OpenInNewIcon size="small" />}
          </div>
        </Link>
      ) : <div className="jk-row">-</div>}
      label="contest"
    />
  ),
  sort: true,
  cardPosition: 'top',
  minWidth: 280,
});

type SubmissionProblemColumnProps = {
  header?: Pick<DataViewerHeadersType<SubmissionResponseDTO>, 'filter'>,
  onlyProblem?: boolean,
  blankTarget?: boolean,
}

export const submissionProblemColumn = (props?: SubmissionProblemColumnProps): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: () => (
    <TextHeadCell
      text={props?.onlyProblem ? 'problem' : 'problem / contest'}
    />
  ),
  index: 'problemJudgeKeys',
  field: ({
            record: { problemKey, problemName, contestName, contestKey, contestProblemIndex, problemJudge },
            isCard,
          }) => (
    <TextField
      text={contestKey ? (
        <Link
          href={ROUTES.CONTESTS.VIEW(contestKey, ContestTab.PROBLEM, contestProblemIndex)}
          target={props?.blankTarget ? '_blank' : ''}
        >
          {props?.onlyProblem ? (
            <div className="jk-row link">
              ({contestProblemIndex || '-'})
              &nbsp;
              {problemName} {!!props?.blankTarget && <OpenInNewIcon size="small" />}
            </div>
          ) : (
            <div className="jk-col link">
              <div className="jk-row">
                {contestName}&nbsp;({contestProblemIndex || '-'})
              </div>
              <div className="jk-row">
                {problemKey} {problemName} {!!props?.blankTarget && <OpenInNewIcon size="small" />}
              </div>
            </div>
          )}
        </Link>
      ) : (
        <Link
          href={ROUTES.PROBLEMS.VIEW(problemJudge === Judge.JUKI_JUDGE ? problemKey : getProblemJudgeKey(
            problemJudge,
            problemKey,
          ), ProblemTab.STATEMENT)}
          target={props?.blankTarget ? '_blank' : ''}
        >
          <div className="jk-row link">
            {problemKey} {problemName} {!!props?.blankTarget && <OpenInNewIcon size="small" />}
          </div>
        </Link>
      )}
      label={props?.onlyProblem ? 'problem' : 'problem / contest'}
    />
  ),
  sort: true,
  filter: props?.header?.filter,
  cardPosition: 'top',
  minWidth: 280,
});

export const submissionLanguage = (): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: 'language',
  index: 'language',
  field: ({ record: { submitId, canViewSourceCode, language }, isCard }) => (
    isCard ? null :
      <Field>
        <SubmissionInfo submitId={submitId} canViewSourceCode={canViewSourceCode}>
          <div className="jk-col extend">{PROGRAMMING_LANGUAGE[language]?.label || language}</div>
        </SubmissionInfo>
      </Field>
  ),
  sort: true,
  filter: {
    type: 'select',
    options: ACCEPTED_PROGRAMMING_LANGUAGES.map(language => (
      {
        label: PROGRAMMING_LANGUAGE[language].label,
        value: language,
      }
    )),
  },
  cardPosition: 'bottom',
  minWidth: 140,
});

const TT = ({ children }: { children: string }) => <T className="tt-se">{children}</T>;

const options = Object.values(PROBLEM_VERDICT)
  .map(({ value, label }) => {
    return {
      label: <TT>{label}</TT>,
      value,
    }
  });

export const submissionVerdictColumn = (): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: 'verdict',
  index: 'verdict',
  field: ({ record: { submitId, points, status, verdict, canViewSourceCode, processedCases }, isCard }) => (
    <Field>
      <div className="jk-col nowrap extend" style={{ padding: '4px 0', boxSizing: 'border-box' }}>
        <TextField
          text={
            <SubmissionInfo submitId={submitId} canViewSourceCode={canViewSourceCode}>
              <ListenerVerdict
                verdict={verdict}
                points={points}
                status={status}
                submitId={submitId}
                processedCases={processedCases}
              />
            </SubmissionInfo>
          }
          label="verdict"
        />
      </div>
    </Field>
  ),
  sort: true,
  filter: {
    type: 'select',
    options,
    // options: [],
    // options: Object.values(PROBLEM_VERDICT)
    //   .map(({ value, label }) => (
    //     { label: <T className="tt-se">{label}</T>, value }
    //   )),
  },
  cardPosition: 'bottom',
  minWidth: 220,
});

type SubmissionActionsColumnProps = {
  canRejudge: boolean
}

export const submissionActionsColumn = ({ canRejudge }: SubmissionActionsColumnProps): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: 'actions',
  index: 'actions',
  field: ({ record: { submitId, points, status, verdict, canViewSourceCode }, isCard }) => (
    <Field>
      <div className="jk-col nowrap extend" style={{ padding: '4px 0', boxSizing: 'border-box' }}>
        {canRejudge && <RejudgeButton submissionId={submitId} />}
      </div>
    </Field>
  ),
  cardPosition: 'bottom',
  minWidth: 160,
});

export const submissionDateColumn = (): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: 'date',
  index: 'timestamp',
  field: ({ record: { timestamp }, isCard }) => (
    <DateField className="jk-row" date={new Date(timestamp)} label="date" twoLines={!isCard} />
  ),
  sort: true,
  filter: {
    type: 'date-range',
    pickerType: 'year-month-day-hours-minutes',
  },
  cardPosition: 'center',
  minWidth: 180,
});

export const submissionTimeUsed = (): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: 'time',
  index: 'timeUsed',
  field: ({ record: { timeUsed, submitId, canViewSourceCode, language, verdict, memoryUsed }, isCard }) => (
    isCard ? (
        <SubmissionInfo submitId={submitId} canViewSourceCode={canViewSourceCode}>
          <Field className="jk-row gap nowrap cr-g1">
            <TextField
              text={<div className="jk-col extend">{PROGRAMMING_LANGUAGE[language]?.label || language}</div>}
              label="language"
            />
            <TextField
              text={<Time timeUsed={timeUsed} verdict={verdict} />}
              label="time used"
            />
            <TextField
              text={<Memory memoryUsed={memoryUsed} verdict={verdict} />}
              label="memory used"
            />
          </Field>
        </SubmissionInfo>
      ) :
      <TextField text={<Time timeUsed={timeUsed} verdict={verdict} />} label="time used" />
  ),
  sort: true,
  // filter: { type: 'text-auto' }, // TODO filter by integer
  cardPosition: 'center',
});

export const submissionMemoryUsed = (): DataViewerHeadersType<SubmissionResponseDTO> => ({
  head: 'memory',
  index: 'memoryUsed',
  field: ({ record: { memoryUsed, verdict }, isCard }) => (
    isCard ? null :
      <TextField text={<Memory memoryUsed={memoryUsed} verdict={verdict} />} label="memory used" />
  ),
  sort: true,
  // filter: { type: 'text-auto' }, // TODO filter by integer
  cardPosition: 'center',
});
