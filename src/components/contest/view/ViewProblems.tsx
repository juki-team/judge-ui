'use client';

import { isSubmissionsCrawlWebSocketResponseEventDTO } from '@juki-team/commons';
import {
  ButtonLoader,
  CheckIcon,
  CloseIcon,
  DataViewer,
  Field,
  OpenInNewIcon,
  T,
  TextField,
  TextHeadCell,
} from 'components';
import { jukiAppRoutes } from 'config';
import { authorizedRequest, cleanRequest, lettersToIndex } from 'helpers';
import { useEffect, useJukiNotification, useJukiUI, useMemo, useUserStore, useWebsocketStore } from 'hooks';
import React from 'react';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'src/constants';
import {
  ContentResponseType,
  ContestDataResponseDTO,
  ContestTab,
  DataViewerHeadersType,
  HTTPMethod,
  ObjectIdType,
  QueryParam,
  Status,
  SubmissionRunStatus,
  SubscribeSubmissionsCrawlWebSocketEventDTO,
  WebSocketActionEvent,
  WebSocketResponseEventDTO,
} from 'types';

interface ProblemNameFieldProps {
  problem: ContestDataResponseDTO['problems'][string],
  contestKey: string,
  isJudgeOrAdmin: boolean,
}

const ProblemNameField = ({ problem, contestKey, isJudgeOrAdmin }: ProblemNameFieldProps) => {
  
  const { components: { Link } } = useJukiUI();
  const { addSuccessNotification, addErrorNotification, notifyResponse } = useJukiNotification();
  const websocket = useWebsocketStore(store => store.websocket);
  const userSessionId = useUserStore(state => state.user.sessionId);
  const [ dataCrawled, setDataCrawled ] = React.useState<{
    [key: string]: { submitId: string, isNewSubmission: boolean, submissionsCount: number }[]
  }>({});
  const submissionsCount = Object.values(dataCrawled).reduce((sum, data) => sum + data[0]?.submissionsCount, 0);
  const newSubmissions = Object.values(dataCrawled)
    .flat()
    .reduce((sum, { isNewSubmission }) => sum + +isNewSubmission, 0);
  const oldSubmissions = Object.values(dataCrawled)
    .flat()
    .reduce((sum, { isNewSubmission }) => sum + +!isNewSubmission, 0);
  
  useEffect(() => {
    
    if (!isJudgeOrAdmin) {
      return;
    }
    
    const fun = (data: WebSocketResponseEventDTO) => {
      if (isSubmissionsCrawlWebSocketResponseEventDTO(data)) {
        setDataCrawled(prevState => ({
          ...prevState,
          [data.content.userKey]: [
            ...(prevState[data.content.userKey] || []),
            {
              submitId: data.content.submitId,
              isNewSubmission: data.content.isNewSubmission,
              submissionsCount: data.content.submissionsCount,
            },
          ],
        }));
      }
    };
    
    const event: SubscribeSubmissionsCrawlWebSocketEventDTO = {
      event: WebSocketActionEvent.SUBSCRIBE_SUBMISSIONS_CRAWL,
      sessionId: userSessionId as ObjectIdType,
      contestKey,
      problemKey: problem.key,
    };
    websocket.send(event, fun);
    
    return () => {
      const event: SubscribeSubmissionsCrawlWebSocketEventDTO = {
        event: WebSocketActionEvent.SUBSCRIBE_SUBMISSIONS_CRAWL,
        sessionId: userSessionId as ObjectIdType,
        contestKey,
        problemKey: problem.key,
      };
      websocket.unsubscribe(event, fun);
    };
  }, [ websocket, contestKey, userSessionId, isJudgeOrAdmin, problem.key ]);
  
  return (
    <Field className="jk-col nowrap">
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
            const result = cleanRequest<ContentResponseType<{
              listCount: number,
              status: SubmissionRunStatus.RECEIVED
            }>>(
              await authorizedRequest(
                JUDGE_API_V1.REJUDGE.CONTEST_PROBLEM(contestKey as string, problem.key),
                { method: HTTPMethod.POST },
              ),
            );
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
            const result = cleanRequest<ContentResponseType<{}>>(
              await authorizedRequest(
                JUDGE_API_V1.CONTEST.PROBLEM_RETRIEVE(contestKey as string, problem.key),
                { method: HTTPMethod.POST },
              ),
            );
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
    </Field>
  );
};

export const ViewProblems = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  const { problems, user, key: contestKey } = contest;
  const { isManager, isAdministrator } = user || {};
  const { addSuccessNotification, addErrorNotification, notifyResponse } = useJukiNotification();
  const { viewPortSize, components: { Link } } = useJukiUI();
  const isJudgeOrAdmin = isManager || isAdministrator;
  const websocket = useWebsocketStore(store => store.websocket);
  const userSessionId = useUserStore(state => state.user.sessionId);
  const [ dataCrawled, setDataCrawled ] = React.useState<{
    [key: string]: { [key: string]: { submitId: string, isNewSubmission: boolean }[] }
  }>({});
  useEffect(() => {
    
    if (!isManager) {
      return;
    }
    
    const fun = (data: WebSocketResponseEventDTO) => {
      if (isSubmissionsCrawlWebSocketResponseEventDTO(data)) {
        setDataCrawled(prevState => ({
          ...prevState,
          [data.content.problemKey]: {
            ...prevState[data.content.problemKey],
            [data.content.userKey]: [
              ...(prevState[data.content.problemKey]?.[data.content.userKey] || []),
              { submitId: data.content.submitId, isNewSubmission: data.content.isNewSubmission },
            ],
          },
        }));
      }
    };
    
    for (const problemKey of Object.keys(problems)) {
      const event: SubscribeSubmissionsCrawlWebSocketEventDTO = {
        event: WebSocketActionEvent.SUBSCRIBE_SUBMISSIONS_CRAWL,
        sessionId: userSessionId as ObjectIdType,
        contestKey,
        problemKey,
      };
      websocket.send(event, fun);
    }
    
    return () => {
      for (const problemKey of Object.keys(problems)) {
        const event: SubscribeSubmissionsCrawlWebSocketEventDTO = {
          event: WebSocketActionEvent.SUBSCRIBE_SUBMISSIONS_CRAWL,
          sessionId: userSessionId as ObjectIdType,
          contestKey,
          problemKey,
        };
        websocket.unsubscribe(event, fun);
      }
    };
  }, [ websocket, contestKey, problems, userSessionId, isManager ]);
  
  const columns = useMemo(() => [
    {
      head: <TextHeadCell text={<T>index</T>} />,
      index: 'index',
      Field: ({ record: { myAttempts, mySuccess, index, color }, isCard }) => (
        <Field className="jk-row">
          <div>
            <div
              className={'fw-br problem-index bc-g6 jk-border-radius-inline pn-re' +
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
      Field: ({ record: { judge: { key: judgeKey, isMain, name, isExternal }, key, externalUrl } }) => (
        <TextField
          text={
            isJudgeOrAdmin || contest.isEndless || contest.isPast
              ? (
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
              )
          }
          label={<T>key</T>}
        />
      ),
      sort: { compareFn: () => (recordA, recordB) => +recordB.key - +recordA.key },
      cardPosition: 'topRight',
      minWidth: 128,
    },
    {
      head: <TextHeadCell text={<T>name</T>} />,
      index: 'name',
      Field: ({ record }) => (
        <ProblemNameField problem={record} contestKey={contestKey} isJudgeOrAdmin={isJudgeOrAdmin} />
      ),
      sort: { compareFn: () => (recordA, recordB) => recordB.name.localeCompare(recordA.name) },
      cardPosition: 'center',
      minWidth: 256,
    },
    {
      head: <TextHeadCell text={<T>points</T>} />,
      index: 'points',
      Field: ({ record: { points } }) => (
        <TextField text={points} label={<T className="tt-se">points</T>} />
      ),
      sort: { compareFn: () => (recordA, recordB) => recordB.points - recordA.points },
      cardPosition: 'bottomLeft',
      minWidth: 128,
    },
    {
      head: <TextHeadCell text={<T>success rate</T>} />,
      index: 'success-rate',
      Field: ({ record: { totalAttempts, totalSuccess } }) => (
        <TextField
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
  ] as DataViewerHeadersType<ContestDataResponseDTO['problems'][string]>[], [ isJudgeOrAdmin, contest.isEndless, contest.isPast, Link, contestKey, dataCrawled, addSuccessNotification, addErrorNotification, notifyResponse ]);
  const data = Object.values(problems);
  
  return (
    <DataViewer<ContestDataResponseDTO['problems'][string]>
      headers={columns}
      data={data}
      rows={{ height: 70 }}
      rowsView={viewPortSize !== 'sm'}
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
