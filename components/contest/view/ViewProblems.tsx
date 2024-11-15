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
import { jukiSettings } from 'config';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest, lettersToIndex } from 'helpers';
import { useJukiNotification, useJukiRouter, useJukiUI, useJukiUser } from 'hooks';
import React, { useMemo } from 'react';
import {
  ContentResponseType,
  ContestDataResponseDTO,
  ContestTab,
  DataViewerHeadersType,
  HTTPMethod,
  QueryParam,
  Status,
  SubmissionRunStatus,
} from 'types';

export const ViewProblems = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  const { problems = {}, user } = contest;
  const { isManager, isAdministrator } = user || {};
  const { routeParams: { key: contestKey, index, tab } } = useJukiRouter();
  const { addSuccessNotification, addErrorNotification } = useJukiNotification();
  const { viewPortSize, components: { Link } } = useJukiUI();
  const { company: { key } } = useJukiUser();
  const isJudgeOrAdmin = isManager || isAdministrator;
  
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
      minWidth: 48,
    },
    {
      head: <TextHeadCell text={<T>key</T>} />,
      index: 'id',
      Field: ({ record: { judge: { key: judgeKey, isMain, name, isExternal }, key, url }, isCard }) => (
        <TextField
          text={
            isJudgeOrAdmin || contest.isEndless || contest.isPast
              ? (
                <Link
                  href={isExternal
                    ? url
                    : isMain
                      ? jukiSettings.ROUTES.problems().view({ key })
                      : jukiSettings.ROUTES.problems(`https://${judgeKey}.jukijudge.com`).view({ key })
                  }
                  target="_blank"
                >
                  <div className="jk-row gap link tx-s">
                    <div className="fw-bd cr-g3 jk-col">
                      {!isMain ? name : ''}
                      <div>{key}</div>
                    </div>
                    <OpenInNewIcon size="tiny" />
                  </div>
                </Link>
              ) : (
                <div className="jk-row gap link tx-s">
                  <div className="fw-bd cr-g3 jk-col">
                    {!isMain ? name : ''}
                    <div>{key}</div>
                  </div>
                </div>
              )
          }
          label={<T>id</T>}
        />
      ),
      sort: { compareFn: () => (recordA, recordB) => +recordB.key - +recordA.key },
      cardPosition: 'topRight',
      minWidth: 48,
    },
    {
      head: <TextHeadCell text={<T>name</T>} />,
      index: 'name',
      Field: ({ record: { name, index, key }, isCard }) => (
        <Field className="jk-col">
          <Link
            href={jukiSettings.ROUTES.contests().view({
              key: contestKey as string,
              tab: ContestTab.PROBLEMS,
              subTab: index,
            })}
          >
            <div className="link fw-bd">{name}</div>
          </Link>
          {isJudgeOrAdmin && (
            <ButtonLoader
              onClick={async (setLoaderStatus, loaderStatus, event) => {
                setLoaderStatus(Status.LOADING);
                const result = cleanRequest<ContentResponseType<{
                  listCount: number,
                  status: SubmissionRunStatus.RECEIVED
                }>>(
                  await authorizedRequest(
                    JUDGE_API_V1.REJUDGE.CONTEST_PROBLEM(contestKey as string, key),
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
              <T>rejudge problem</T>
            </ButtonLoader>
          )}
        </Field>
      ),
      sort: { compareFn: () => (recordA, recordB) => recordB.name.localeCompare(recordA.name) },
      cardPosition: 'center',
      minWidth: 128,
    },
    {
      head: <TextHeadCell text={<T>points</T>} />,
      index: 'points',
      Field: ({ record: { points }, isCard }) => (
        <TextField text={points} label={<T className="tt-se">points</T>} />
      ),
      sort: { compareFn: () => (recordA, recordB) => recordB.points - recordA.points },
      cardPosition: 'bottomLeft',
      minWidth: 64,
    },
    {
      head: <TextHeadCell text={<T>success rate</T>} />,
      index: 'success-rate',
      Field: ({ record: { totalAttempts, totalSuccess }, isCard }) => (
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
      minWidth: 64,
    },
  ] as DataViewerHeadersType<ContestDataResponseDTO['problems'][string]>[], [ isJudgeOrAdmin, contest.isEndless, contest.isPast, Link, contestKey, addSuccessNotification, addErrorNotification ]);
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
