import { ButtonLoader, CheckIcon, CloseIcon, DataViewer, Field, OpenInNewIcon, T, TextField, TextHeadCell } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1, QueryParam, ROUTES } from 'config/constants';
import { authorizedRequest, cleanRequest, getProblemJudgeKey, lettersToIndex } from 'helpers';
import { useNotification } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import {
  ContentResponseType,
  ContestProblemType,
  ContestResponseDTO,
  ContestTab,
  DataViewerHeadersType,
  HTTPMethod,
  Judge,
  ProblemTab,
  Status,
  SubmissionRunStatus,
} from 'types';

export const ViewProblems = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { problems = {}, user, key } = contest;
  const { isJudge, isAdmin } = user || {};
  const { push, query: { key: contestKey, index, tab, ...query } } = useRouter();
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const isJudgeOrAdmin = isJudge || isAdmin;
  
  const columns = useMemo(() => {
    return [
      {
        head: <TextHeadCell text={<T>index</T>} />,
        index: 'index',
        field: ({ record: { myAttempts, mySuccess, index, color }, isCard }) => (
          <Field className="jk-row">
            <div>
              <div
                className={'fw-br problem-index bc-g6 jk-border-radius-inline' + (myAttempts ? (mySuccess ? ' accepted' : ' wrong') : '')}
                style={{ position: 'relative' }}
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
      } as DataViewerHeadersType<ContestProblemType>,
      ...(isJudgeOrAdmin ? [
        {
          head: <TextHeadCell text={<T>id</T>} />,
          index: 'id',
          field: ({ record: { judge, key }, isCard }) => (
            <TextField
              text={judge === Judge.JUKI_JUDGE ? (
                (isJudgeOrAdmin ? (
                  <Link href={{ pathname: ROUTES.PROBLEMS.VIEW(key, ProblemTab.STATEMENT), query }} target="_blank">
                    <div className="problem-id fw-bd cr-g3 jk-row">{key}&nbsp;<OpenInNewIcon size="tiny" />
                    </div>
                  </Link>
                ) : (<div className="problem-id fw-bd cr-g3">{key}</div>))
              ) : (
                <div className="problem-id fw-bd cr-g3">
                  {getProblemJudgeKey(judge, key)}
                </div>
              )}
              label={<T>ID</T>}
            />
          ),
          sort: { compareFn: () => (recordA, recordB) => +recordB.key - +recordA.key },
          cardPosition: 'topRight',
          minWidth: 48,
        } as DataViewerHeadersType<ContestProblemType>,
      ] : []),
      {
        head: <TextHeadCell text={<T>name</T>} />,
        index: 'name',
        field: ({ record: { name, index, judge, key }, isCard }) => (
          <Field className="jk-col">
            <Link href={{ pathname: ROUTES.CONTESTS.VIEW(contestKey as string, ContestTab.PROBLEM, index), query }}>
              <div className="link fw-bd">{name}</div>
            </Link>
            {isJudgeOrAdmin && (
              <ButtonLoader
                onClick={async (setLoaderStatus, loaderStatus, event) => {
                  setLoaderStatus(Status.LOADING);
                  const result = cleanRequest<ContentResponseType<{ listCount: number, status: SubmissionRunStatus.RECEIVED }>>(
                    await authorizedRequest(JUDGE_API_V1.REJUDGE.CONTEST_PROBLEM(contestKey as string, getProblemJudgeKey(judge, key)), {
                      method: HTTPMethod.POST,
                    }));
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
              >
                <T>rejudge problem</T>
              </ButtonLoader>
            )}
          </Field>
        ),
        sort: { compareFn: () => (recordA, recordB) => recordB.name.localeCompare(recordA.name) },
        cardPosition: 'center',
        minWidth: 128,
      } as DataViewerHeadersType<ContestProblemType>,
      {
        head: <TextHeadCell text={<T>points</T>} />,
        index: 'points',
        field: ({ record: { points }, isCard }) => (
          <TextField text={points} label={<T>points</T>} />
        ),
        sort: { compareFn: () => (recordA, recordB) => recordB.points - recordA.points },
        cardPosition: 'bottomLeft',
        minWidth: 64,
      } as DataViewerHeadersType<ContestProblemType>,
      {
        head: <TextHeadCell text={<T>success rate</T>} />,
        index: 'success-rate',
        field: ({ record: { totalAttempts, totalSuccess }, isCard }) => (
          <TextField
            text={totalAttempts ? (totalSuccess / totalAttempts * 100).toFixed(1) + ' %' : '-'}
            label={<T>success rate</T>}
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
      } as DataViewerHeadersType<ContestProblemType>,
    ];
  }, [isJudgeOrAdmin, contestKey, query]);
  const data = Object.values(problems);
  
  return (
    <div className="pad-left-right pad-top-bottom">
      <DataViewer<ContestProblemType>
        headers={columns}
        data={data}
        rows={{ height: 70 }}
        name={QueryParam.ALL_USERS_TABLE}
        onRecordClick={async ({ isCard, data, index }) => {
          if (isCard) {
            await push({
              pathname: ROUTES.CONTESTS.VIEW(key, ContestTab.PROBLEM, data[index].index),
              query,
            }, undefined, { shallow: true });
          }
        }}
        getRecordStyle={({ data, index, isCard }) => {
          if (isCard) {
            return { borderTop: '6px solid ' + data[index]?.color };
          }
        }}
        {...DEFAULT_DATA_VIEWER_PROPS}
      />
    </div>
  );
};
