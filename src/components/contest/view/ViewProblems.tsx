'use client';

import { usePageStore } from '@juki-team/base-ui';
import {
  ButtonLoader,
  CheckIcon,
  CloseIcon,
  DataViewer,
  Field,
  FieldText,
  OpenInNewIcon,
  T,
  TextHeadCell,
} from 'components';
import { jukiApiManager, jukiAppRoutes } from 'config';
import { authorizedRequest, cleanRequest, isSubmissionsCrawlWebSocketResponseEventDTO, lettersToIndex } from 'helpers';
import { useEffect, useJukiNotification, useMemo, useState, useUIStore, useUserStore, useWebsocketStore } from 'hooks';
import { DEFAULT_DATA_VIEWER_PROPS } from 'src/constants';
import { KeyedMutator } from 'swr';
import {
  ContentResponseType,
  ContestDataResponseDTO,
  ContestProblemBlockedByType,
  ContestTab,
  DataViewerHeadersType,
  ObjectIdType,
  QueryParam,
  Status,
  SubmissionRunStatus,
  SubscribeSubmissionsCrawlWebSocketEventDTO,
  WebSocketSubscriptionEvent,
} from 'types';
import { ProblemRequisites } from './ProblemRequisites';

interface ProblemNameFieldProps {
  problem: ContestDataResponseDTO['problems'][string],
  contestKey: string,
  isJudgeOrAdmin: boolean,
}

const ProblemNameField = ({ problem, contestKey, isJudgeOrAdmin }: ProblemNameFieldProps) => {
  
  const { Link } = useUIStore(store => store.components);
  const { addSuccessNotification, addErrorNotification, notifyResponse } = useJukiNotification();
  const userSessionId = useUserStore(state => state.user.sessionId);
  const [ dataCrawled, setDataCrawled ] = useState<{
    [key: string]: { submitId: string, isNewSubmission: boolean }[]
  }>({});
  const [ submissionsCount, setSubmissionsCount ] = useState(0);
  const newSubmissions = Object.values(dataCrawled)
    .flat()
    .reduce((sum, { isNewSubmission }) => sum + +isNewSubmission, 0);
  const oldSubmissions = Object.values(dataCrawled)
    .flat()
    .reduce((sum, { isNewSubmission }) => sum + +!isNewSubmission, 0);
  
  const subscribeToEvent = useWebsocketStore(store => store.subscribeToEvent);
  
  useEffect(() => {
    const event: SubscribeSubmissionsCrawlWebSocketEventDTO = {
      event: WebSocketSubscriptionEvent.SUBSCRIBE_SUBMISSIONS_CRAWL,
      sessionId: userSessionId as ObjectIdType,
      contestKey,
      problemKeys: problem.key,
    };
    return subscribeToEvent(event, ({ data }) => {
      if (isSubmissionsCrawlWebSocketResponseEventDTO(data)) {
        if (data.content.submitId) {
          setDataCrawled(prevState => ({
            ...prevState,
            [data.content.userKey]: [
              ...(prevState[data.content.userKey] || []),
              {
                submitId: data.content.submitId,
                isNewSubmission: data.content.isNewSubmission,
              },
            ],
          }));
        } else {
          setSubmissionsCount(prevState => prevState + data.content.submissionsCount);
        }
      }
    });
  }, [ contestKey, problem.key, subscribeToEvent, userSessionId ]);
  
  return (
    <div className="jk-col nowrap">
      <Link
        href={jukiAppRoutes.JUDGE().contests.view({
          key: contestKey as string,
          tab: ContestTab.PROBLEMS,
          subTab: problem.index,
        })}
      >
        <div className="link fw-bd">{problem.name}</div>
      </Link>
      {isJudgeOrAdmin && problem.judge.isSubmitSupported && (
        <ButtonLoader
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            const { url, ...options } = jukiApiManager.API_V2.contest.problem.rejudge({
              params: {
                key: contestKey,
                problemKey: problem.key,
              },
            });
            const result = cleanRequest<
              ContentResponseType<{ listCount: number, status: SubmissionRunStatus.RECEIVED }>
            >(await authorizedRequest(url, options));
            if (result.success) {
              addSuccessNotification(
                <div><T>rejudging</T>&nbsp;{result.content.listCount}&nbsp;<T>submissions</T></div>,
              );
              setLoaderStatus(Status.SUCCESS);
            } else {
              addErrorNotification(
                <T className="tt-se">{result.message || 'something went wrong, please try again later'}</T>,
              );
              setLoaderStatus(Status.ERROR);
            }
          }}
          size="tiny"
          type="light"
        >
          <T className="tt-se">rejudge problem</T>
        </ButtonLoader>
      )}
      {isJudgeOrAdmin && !problem.judge.isSubmitSupported && (
        <ButtonLoader
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            setDataCrawled({});
            setSubmissionsCount(0);
            const { url, ...options } = jukiApiManager.API_V2.contest.problem.retrieve({
              params: {
                key: contestKey,
                problemKey: problem.key,
              },
            });
            const result = cleanRequest<ContentResponseType<{}>>(await authorizedRequest(url, options));
            notifyResponse(result, setLoaderStatus);
          }}
          size="tiny"
          type="light"
        >
          <T className="tt-se">retrieve new submissions</T>
          {!!Object.values(dataCrawled).length && (
            <>
              &nbsp;
              (
              <span className="cr-ss" data-tooltip-id="jk-tooltip" data-tooltip-content="new retrieved submissions">
                {newSubmissions}
              </span>
              ,
              &nbsp;
              <span data-tooltip-id="jk-tooltip" data-tooltip-content="old retrieved submissions">
                {oldSubmissions}
              </span>
              &nbsp;/&nbsp;
              <span data-tooltip-id="jk-tooltip" data-tooltip-content="total retrieved submissions">
                {submissionsCount}
              </span>
              )
            </>
          )}
        </ButtonLoader>
      )}
    </div>
  );
};

interface ViewProblemsProps {
  contest: ContestDataResponseDTO,
  reloadContest: KeyedMutator<any>,
}

export const ViewProblems = ({ contest, reloadContest }: ViewProblemsProps) => {
  
  const { problems, user, key: contestKey } = contest;
  const { isManager, isAdministrator } = user || {};
  const { notifyResponse } = useJukiNotification();
  const { Link } = useUIStore(store => store.components);
  const isSmallScreen = usePageStore(store => store.viewPort.isSmallScreen);
  const isJudgeOrAdmin = isManager || isAdministrator;
  
  const columns = useMemo(() => [
    {
      head: <TextHeadCell text={<T>index</T>} />,
      index: 'index',
      Field: ({ record: { myAttempts, mySuccess, index, color }, isCard }) => (
        <Field className="jk-row">
          <div>
            <div
              className={'fw-br problem-index bc-g6 jk-br-ie pn-re' +
                (myAttempts ? (mySuccess ? ' accepted' : ' wrong') : '')}
            >
              {!!myAttempts && (mySuccess ? <CheckIcon size="small" /> : <CloseIcon size="small" />)}
              {index}
            </div>
            {!isCard && (
              <div style={{ position: 'absolute', width: 8, height: '100%', top: 0, left: 0, background: color }} />
            )}
          </div>
        </Field>
      ),
      sort: { compareFn: () => (recordA, recordB) => lettersToIndex(recordB.index) - lettersToIndex(recordA.index) },
      cardPosition: isJudgeOrAdmin ? 'topLeft' : 'top',
      minWidth: 110,
    },
    {
      head: <TextHeadCell text={<T>key</T>} />,
      index: 'id',
      Field: ({
                record: {
                  judge: { key: judgeKey, isMain, name, isExternal },
                  key,
                  externalUrl,
                },
              }) => (
        <Field className="jk-row">
          {(isJudgeOrAdmin || contest.isEndless || contest.isPast) ? (
            <Link
              href={isExternal
                ? externalUrl
                : isMain
                  ? jukiAppRoutes.JUDGE().problems.view({ key })
                  : jukiAppRoutes.JUDGE(`https://${judgeKey}.jukijudge.com`).problems.view({ key })
              }
              target="_blank"
            >
              <div className="link tx-t fw-bd jk-col">
                {!isMain && <div>{name}</div>}
                <div>{key}&nbsp;<OpenInNewIcon size="tiny" /></div>
              </div>
            </Link>
          ) : (
            <div className="tx-t fw-bd jk-col">
              {!isMain && <div>{name}</div>}
              <div>{key}</div>
            </div>
          )}
        </Field>
      ),
      sort: { compareFn: () => (recordA, recordB) => +recordB.key - +recordA.key },
      cardPosition: 'topRight',
      minWidth: 128,
    },
    {
      head: <TextHeadCell text={<T>name</T>} />,
      index: 'name',
      Field: ({ record }) => (
        <Field className="jk-col nowrap gap">
          {(isJudgeOrAdmin || record.blockedBy.filter(b => b.type !== ContestProblemBlockedByType.MAX_ACCEPTED_SUBMISSIONS_ACHIEVED).length === 0) && (
            <ProblemNameField problem={record} contestKey={contestKey} isJudgeOrAdmin={isJudgeOrAdmin} />
          )}
          <ProblemRequisites problem={record} reloadContest={reloadContest} contest={contest} />
        </Field>
      ),
      sort: { compareFn: () => (recordA, recordB) => recordB.name.localeCompare(recordA.name) },
      cardPosition: 'center',
      minWidth: 256,
    },
    {
      head: <TextHeadCell text={<T>points</T>} />,
      index: 'points',
      Field: ({ record: { points } }) => (
        <FieldText text={points} label={<T className="tt-se">points</T>} />
      ),
      sort: { compareFn: () => (recordA, recordB) => recordB.points - recordA.points },
      cardPosition: 'bottomLeft',
      minWidth: 128,
    },
    {
      head: <TextHeadCell text={<T>success rate</T>} />,
      index: 'success-rate',
      Field: ({ record: { totalAttempts, totalSuccess } }) => (
        <FieldText
          text={totalAttempts ? (totalSuccess / totalAttempts * 100).toFixed(1) + ' %' : '-'}
          label={<T className="tt-se">success rate</T>}
        />
      ),
      sort: {
        compareFn: () => (recordA, recordB) => {
          const A = recordA.totalAttempts ? recordA.totalSuccess / recordA.totalAttempts : -1;
          const B = recordB.totalAttempts ? recordB.totalSuccess / recordB.totalAttempts : -1;
          return B - A;
        },
      },
      cardPosition: 'bottomRight',
      minWidth: 128,
    },
  ] as DataViewerHeadersType<ContestDataResponseDTO['problems'][string]>[], [ isJudgeOrAdmin, contest, Link, contestKey, reloadContest ]);
  const data = Object.values(problems);
  
  return (
    <DataViewer<ContestDataResponseDTO['problems'][string]>
      extraNodes={isJudgeOrAdmin ? [
        <ButtonLoader
          key="recalculate-prerequisites"
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            const { url, ...options } = jukiApiManager.API_V2.contest.recalculatePrerequisites({
              params: {
                key: contestKey,
              },
            });
            const result = cleanRequest<ContentResponseType<{}>>(await authorizedRequest(url, options));
            notifyResponse(result, setLoaderStatus);
          }}
          size="tiny"
          type="light"
        >
          <T className="tt-se">recalculate prerequisites</T>
        </ButtonLoader>,
      ] : []}
      headers={columns}
      data={data}
      rows={{ height: 128 }}
      rowsView={!isSmallScreen}
      name={QueryParam.CONTEST_PROBLEMS_TABLE + '-' + contest.key}
      getRecordStyle={({ data, index, isCard }) => {
        if (isCard) {
          return { borderTop: '6px solid ' + data[index]?.color, cursor: 'pointer' };
        }
        return { cursor: 'pointer' };
      }}
      cards={{ height: 200 }}
      initializing={false}
      setLoaderStatusRef={setLoaderStatus => setLoaderStatus(Status.NONE)}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
};
