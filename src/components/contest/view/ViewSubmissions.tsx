'use client';

import {
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
import { jukiApiSocketManager } from 'config';
import { getParamsOfUserKey, toFilterUrl, toSortUrl } from 'helpers';
import { useFetcher, useMemo, usePreload, useRef, useUserStore } from 'hooks';
import {
  ContentsResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  DataViewerRequestPropsType,
  DataViewerToolbarProps,
  JudgeSummaryListResponseDTO,
  LanguagesByJudge,
  QueryParam,
  SubmissionSummaryListResponseDTO,
} from 'types';

export const ViewSubmissions = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  const userNickname = useUserStore(state => state.user.nickname);
  const companyKey = useUserStore(state => state.company.key);
  const { data: judgePublicList } = useFetcher<ContentsResponseType<JudgeSummaryListResponseDTO>>(jukiApiSocketManager.API_V1.judge.getSummaryList().url);
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
      onlyProblem: true,
    }),
    getSubmissionDateHeader(),
    getSubmissionVerdictHeader(),
    ...(contest.user.isManager || contest.user.isAdministrator ? [ getSubmissionRejudgeHeader() ] : []),
    getSubmissionLanguageHeader(languages),
    getSubmissionTimeHeader(),
    getSubmissionMemoryHeader(),
  ], [ contest.members.participants, contest.problems, contest.user.isAdministrator, contest.user.isManager, contest.user.isParticipant, languages, userNickname, companyKey ]);
  const preload = usePreload();
  const lastGetUrl = useRef({ filter: {}, sort: {} });
  
  const downloads = useMemo(() => {
    const downloads: DataViewerToolbarProps<SubmissionSummaryListResponseDTO>['downloads'] = [
      {
        label: <T className="tt-se">download as csv</T>,
        value: 'csv',
        getUrl: ({ filter, sort }: DataViewerRequestPropsType) => (
          jukiApiSocketManager.API_V1.submission.getExportSummaryList({
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
          jukiApiSocketManager.API_V1.submission.getExportSummaryList({
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
  
  return (
    <PagedDataViewer<SubmissionSummaryListResponseDTO, SubmissionSummaryListResponseDTO>
      rows={{ height: 80 }}
      cards={{ width: 272, expanded: true }}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => {
        lastGetUrl.current = {
          filter,
          sort,
        };
        return jukiApiSocketManager.API_V1.submission.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({ ...filter, contestKeys: contest.key }),
            sortUrl: toSortUrl(sort),
          },
        }).url;
      }}
      name={QueryParam.STATUS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
      getRowKey={({ data, index }) => data[index].submitId}
      downloads={downloads}
      onRecordRender={({ data, index }) => {
        void preload(jukiApiSocketManager.API_V1.submission.getData({ params: { id: data[index].submitId } }).url);
      }}
    />
  );
};
