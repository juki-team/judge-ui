import {
  ButtonLoader,
  DateField,
  Field,
  ListenerVerdict,
  OpenInNewIcon,
  ReloadIcon,
  T,
  TextField,
  TextHeadCell,
  UserNicknameLink,
} from 'components';
import { settings } from 'config';
import { ACCEPTED_PROGRAMMING_LANGUAGES, PROBLEM_VERDICT, PROGRAMMING_LANGUAGE, ROUTES } from 'config/constants';
import { getProblemJudgeKey } from 'helpers';
import { useMatchMutate, useRejudgeServices } from 'hooks';
import Link from 'next/link';
import React from 'react';
import { ContestTab, DataViewerHeadersType, Judge, ProblemTab, SubmissionResponseDTO } from 'types';
import { SubmissionInfo } from './SubmissionInfo';
import { Memory, Time } from './utils';

export const submissionNickname = (): DataViewerHeadersType<SubmissionResponseDTO> => (
  {
    head: <TextHeadCell text={<T>user nickname</T>} />,
    index: 'nickname',
    field: ({ record: { userNickname, userImageUrl }, isCard }) => (
      <TextField
        text={<>
          <img src={userImageUrl} className="jk-user-profile-img large" alt={userNickname} />
          <UserNicknameLink nickname={userNickname}>
            <div className="link">{userNickname}</div>
          </UserNicknameLink>
        </>}
        label={<T className="tt-se">user nickname</T>}
      />
    ),
    sort: true,
    filter: { type: 'text' },
    cardPosition: 'top',
    minWidth: 250,
  }
);

export const submissionContestColumn = (props?: {
  header?: Pick<DataViewerHeadersType<SubmissionResponseDTO>, 'filter'>,
  blankTarget?: boolean
}): DataViewerHeadersType<SubmissionResponseDTO> => (
  {
    head: (
      <TextHeadCell
        text={<T className="tt-se">contest</T>}
      />
    ),
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
        label={<T className="tt-se">contest</T>}
      />
    ),
    sort: true,
    cardPosition: 'top',
    minWidth: 280,
  }
);

export const submissionProblemColumn = (props?: {
  header?: Pick<DataViewerHeadersType<SubmissionResponseDTO>, 'filter'>,
  onlyProblem?: boolean,
  blankTarget?: boolean
}): DataViewerHeadersType<SubmissionResponseDTO> => (
  {
    head: (
      <TextHeadCell
        text={props?.onlyProblem ? <T>problem</T> : <><T>problem</T> / <T className="tt-se">contest</T></>}
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
        label={props?.onlyProblem
          ? <T className="tt-se">problem</T>
          : <><T className="tt-se">problem</T> / <T className="tt-se">contest</T></>}
      />
    ),
    sort: true,
    filter: props?.header?.filter,
    cardPosition: 'top',
    minWidth: 280,
  }
);

export const submissionLanguage = (): DataViewerHeadersType<SubmissionResponseDTO> => (
  {
    head: <TextHeadCell text={<T>lang.</T>} />,
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
  }
);

export const RejudgeButton = ({ submissionId }: { submissionId: string }) => {
  const { rejudgeSubmission } = useRejudgeServices();
  const { matchMutate } = useMatchMutate();
  return (
    <ButtonLoader
      onClick={async (...props) => {
        await rejudgeSubmission(submissionId)(...props);
        // TODO Fix the next
        await matchMutate(new RegExp(`^${settings.UTILS_SERVICE_API_URL}/submissions`, 'g'));
      }}
      size="tiny"
      icon={<ReloadIcon />}
    >
      <T>rejudge</T>
    </ButtonLoader>
  );
};

export const submissionVerdictColumn = (): DataViewerHeadersType<SubmissionResponseDTO> => (
  {
    head: <TextHeadCell text={<T>verdict</T>} />,
    index: 'verdict',
    field: ({ record: { submitId, points, status, verdict, canViewSourceCode }, isCard }) => (
      <Field>
        <div className="jk-col nowrap extend" style={{ padding: '4px 0', boxSizing: 'border-box' }}>
          <TextField
            text={
              <SubmissionInfo submitId={submitId} canViewSourceCode={canViewSourceCode}>
                <ListenerVerdict verdict={verdict} points={points} status={status} submitId={submitId} />
              </SubmissionInfo>
            }
            label={
              <T className="tt-se">verdict</T>
            }
          />
        </div>
      </Field>
    ),
    sort: true,
    filter: {
      type: 'select',
      options: Object.values(PROBLEM_VERDICT)
        .map(({ value, label }) => (
          { label: <T className="tt-se">{label}</T>, value }
        )),
    },
    cardPosition: 'bottom',
    minWidth: 180,
  }
);

export const submissionActionsColumn = ({ canRejudge }: {
  canRejudge: boolean
}): DataViewerHeadersType<SubmissionResponseDTO> => (
  {
    head: <TextHeadCell text={<T>actions</T>} />,
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
  }
);

export const submissionDateColumn = (): DataViewerHeadersType<SubmissionResponseDTO> => (
  {
    head: <TextHeadCell text={<T>date</T>} />,
    index: 'timestamp',
    field: ({ record: { timestamp }, isCard }) => (
      <DateField
        className="jk-row" date={new Date(timestamp)} label={<T className="tt-se">date</T>}
        twoLines={!isCard}
      />
    ),
    sort: true,
    filter: {
      type: 'date-range',
      getValue: ({ record: { timestamp } }) => new Date(timestamp),
      pickerType: 'year-month-day-hours-minutes',
    },
    cardPosition: 'center',
    minWidth: 180,
  }
);

export const submissionTimeUsed = (): DataViewerHeadersType<SubmissionResponseDTO> => (
  {
    head: <TextHeadCell text={<T>time</T>} />,
    index: 'timeUsed',
    field: ({ record: { timeUsed, submitId, canViewSourceCode, language, verdict, memoryUsed }, isCard }) => (
      isCard ? (
          <SubmissionInfo submitId={submitId} canViewSourceCode={canViewSourceCode}>
            <Field className="jk-row gap nowrap cr-g1">
              <TextField
                text={<div className="jk-col extend">{PROGRAMMING_LANGUAGE[language]?.label || language}</div>}
                label={<T className="tt-se">language</T>}
              />
              <TextField
                text={<Time timeUsed={timeUsed} verdict={verdict} />}
                label={<T className="tt-se">time used</T>}
              />
              <TextField
                text={<Memory memoryUsed={memoryUsed} verdict={verdict} />}
                label={<T className="tt-se">memory used</T>}
              />
            </Field>
          </SubmissionInfo>
        ) :
        <TextField text={<Time timeUsed={timeUsed} verdict={verdict} />} label={<T>time used</T>} />
    ),
    sort: true,
    // filter: { type: 'text-auto' }, // TODO filter by integer
    cardPosition: 'center',
    minWidth: 140,
  }
);

export const submissionMemoryUsed = (): DataViewerHeadersType<SubmissionResponseDTO> => (
  {
    head: <TextHeadCell text={<T>memory</T>} />,
    index: 'memoryUsed',
    field: ({ record: { memoryUsed, verdict }, isCard }) => (
      isCard ? null :
        <TextField text={<Memory memoryUsed={memoryUsed} verdict={verdict} />} label={<T>memory used</T>} />
    ),
    sort: true,
    // filter: { type: 'text-auto' }, // TODO filter by integer
    cardPosition: 'center',
    minWidth: 140,
  }
);
