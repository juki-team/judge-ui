'use client';

import {
  ButtonLoader,
  getSubmissionContestProblemHeader,
  getSubmissionDateHeader,
  getSubmissionLanguageHeader,
  getSubmissionMemoryHeader,
  getSubmissionNicknameHeader,
  getSubmissionRejudgeHeader,
  getSubmissionTimeHeader,
  getSubmissionVerdictHeader,
  PagedDataViewer,
  T,
} from 'components';
import { jukiApiManager } from 'config';
import { SEPARATOR_TOKEN } from 'config/constants';
import {
  authorizedRequest,
  cleanRequest,
  getParamsOfUserKey,
  isSubmissionsCrawlWebSocketResponseEventDTO,
  toFilterUrl,
  toSortUrl,
} from 'helpers';
import { useFetcher, useJukiNotification, useMemo, useState, useSubscribe, useUserStore } from 'hooks';
import {
  ContentResponseType,
  ContentsResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  DataViewerRequestPropsType,
  DataViewerToolbarProps,
  JudgeSummaryListResponseDTO,
  LanguagesByJudge,
  QueryParam,
  Status,
  SubmissionSummaryListResponseDTO,
  SubscribeSubmissionsCrawlWebSocketEventDTO,
  WebSocketSubscriptionEvent,
} from 'types';
import { ContestDataUI } from '../types';

const RetrieveButton = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  const [ dataCrawled, setDataCrawled ] = useState<{
    [key: string]: { submitId: string, isNewSubmission: boolean }[]
  }>({});
  const [ submissionsCount, setSubmissionsCount ] = useState(0);
  const { notifyResponse } = useJukiNotification();
  
  const problemKeys = Object.values(contest.problems).map(problem => problem.key).join(SEPARATOR_TOKEN);
  const contestKey = contest.key;
  
  const event: Omit<SubscribeSubmissionsCrawlWebSocketEventDTO, 'clientId'> = {
    event: WebSocketSubscriptionEvent.SUBSCRIBE_SUBMISSIONS_CRAWL,
    contestKey,
    problemKeys,
  };
  useSubscribe(
    event,
    (data) => {
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
    },
  );
  
  const newSubmissions = Object.values(dataCrawled)
    .flat()
    .reduce((sum, { isNewSubmission }) => sum + +isNewSubmission, 0);
  const oldSubmissions = Object.values(dataCrawled)
    .flat()
    .reduce((sum, { isNewSubmission }) => sum + +!isNewSubmission, 0);
  
  return (
    <ButtonLoader
      key="retrieve"
      onClick={async (setLoaderStatus) => {
        setLoaderStatus(Status.LOADING);
        setDataCrawled({});
        setSubmissionsCount(0);
        const { url, ...options } = jukiApiManager.API_V2.contest.retrieve({
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
      <T className="tt-se">retrieve submissions</T>
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
  );
};

export const ViewSubmissions = ({ contest }: { contest: ContestDataUI }) => {
  
  const userNickname = useUserStore(state => state.user.nickname);
  const companyKey = useUserStore(state => state.company.key);
  const { data: judgePublicList } = useFetcher<ContentsResponseType<JudgeSummaryListResponseDTO>>(jukiApiManager.API_V2.judge.getSummaryList().url);
  const languages = useMemo(() => {
    const result: LanguagesByJudge = {};
    const judges = judgePublicList?.success ? judgePublicList.contents : [];
    const judgeKeys = Object.values(contest.problems).map(({ judge: { key: judgeKey } }) => judgeKey);
    for (const { name, languages, key } of judges) {
      if (judgeKeys.includes(key)) {
        const languagesResult: LanguagesByJudge[string]['languages'] = {};
        for (const { value, label } of languages.filter(lang => lang.enabled)) {
          languagesResult[value] = { label, value };
        }
        result[key] = { key, languages: languagesResult, name };
      }
    }
    return result;
  }, [ contest.problems, judgePublicList ]);
  
  const columns: DataViewerHeadersType<SubmissionSummaryListResponseDTO>[] = useMemo(() => [
    getSubmissionNicknameHeader([
      ...(contest.user.isAdministrator || contest.user.isManager || contest.user.isParticipant
        ? [ { value: userNickname, label: <T className="tt-se cr-ss fw-bd">my submissions</T> } ]
        : []),
      ...Object.keys(contest.members.participants).map(participant => {
        const { userNickname, userCompanyKey } = getParamsOfUserKey(participant);
        return {
          value: participant,
          label: (
            <div className="jk-row gap">
              {userNickname}
              {userCompanyKey && companyKey !== userCompanyKey
                ? <div className="tx-t jk-tag">{userCompanyKey}</div>
                : null}
            </div>
          ),
        };
      }) ]),
    getSubmissionContestProblemHeader({
      header: {
        filter: {
          type: 'select',
          options: Object.values(contest.problems)
            .map(({ index, name, key }) => ({
              label: <div>{index ? `(${index})` : ''} {name}</div>,
              value: key,
            })),
        },
      },
      contest: { key: contest.key },
    }),
    getSubmissionDateHeader(),
    getSubmissionVerdictHeader(),
    ...(contest.user.isManager || contest.user.isAdministrator ? [ getSubmissionRejudgeHeader() ] : []),
    getSubmissionLanguageHeader(languages),
    getSubmissionTimeHeader(),
    getSubmissionMemoryHeader(),
  ], [ contest.user.isAdministrator, contest.user.isManager, contest.user.isParticipant, contest.members.participants, contest.problems, contest.key, userNickname, languages, companyKey ]);
  
  const downloads = useMemo(() => {
    const downloads: DataViewerToolbarProps<SubmissionSummaryListResponseDTO>['downloads'] = [
      {
        label: <T className="tt-se">download as csv</T>,
        value: 'csv',
        getUrl: ({ filter, sort }: DataViewerRequestPropsType) => (
          jukiApiManager.API_V2.submission.getExportSummaryList({
            params: {
              page: 1,
              pageSize: 1000000,
              filterUrl: toFilterUrl({ ...filter, contestKeys: contest.key }),
              sortUrl: toSortUrl(sort),
            },
          }).url
        ),
        getFilename: () => contest.name + ' - submissions.csv',
      },
    ];
    if (contest.user.isManager || contest.user.isAdministrator) {
      downloads.push({
        label: <T className="tt-se">download as zip with source codes</T>,
        value: 'complete',
        getUrl: ({ filter, sort }: DataViewerRequestPropsType) => (
          jukiApiManager.API_V2.submission.getExportSummaryList({
            params: {
              page: 1,
              pageSize: 1000000,
              filterUrl: toFilterUrl({ ...filter, contestKeys: contest.key }),
              sortUrl: toSortUrl(sort),
              withSourceCodes: true,
            },
          }).url
        ),
        getFilename: () => contest.name + ' - submissions.csv',
      });
    }
    return downloads;
  }, [ contest.key, contest.name, contest.user.isAdministrator, contest.user.isManager ]);
  
  const hasNotSubmitSupported = Object.values(contest.problems).some(problem => !problem.judge.isSubmitSupported);
  
  return (
    <PagedDataViewer<SubmissionSummaryListResponseDTO, SubmissionSummaryListResponseDTO>
      extraNodes={hasNotSubmitSupported ? [ <RetrieveButton key="retrieve-button" contest={contest} /> ] : []}
      rows={{ height: 80 }}
      cards={{ width: 272, expanded: true }}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => {
        return jukiApiManager.API_V2.submission.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({ ...filter, contestKeys: contest.key }),
            sortUrl: toSortUrl(sort),
          },
        }).url;
      }}
      name={QueryParam.STATUS_TABLE}
      getRecordKey={({ data, index }) => data[index].submitId}
      downloads={downloads}
    />
  );
};
