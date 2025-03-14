'use client';

import {
  ButtonLoader,
  getSubmissionDateHeader,
  getSubmissionLanguageHeader,
  getSubmissionMemoryHeader,
  getSubmissionNicknameHeader,
  getSubmissionProblemHeader,
  getSubmissionRejudgeHeader,
  getSubmissionTimeHeader,
  getSubmissionVerdictHeader,
  PagedDataViewer,
  T,
} from 'components';
import { jukiApiSocketManager } from 'config';
import { authorizedRequest, downloadBlobAsFile, toFilterUrl, toSortUrl } from 'helpers';
import { useFetcher, useJukiUser, usePreload, useRef } from 'hooks';
import { useMemo } from 'react';
import {
  ContentsResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  HTTPMethod,
  JudgeSummaryListResponseDTO,
  LanguagesByJudge,
  QueryParam,
  Status,
  SubmissionSummaryListResponseDTO,
} from 'types';

export const ViewSubmissions = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  const { user } = useJukiUser();
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
        ? [ { value: user.nickname, label: <T className="tt-se cr-ss fw-bd">my submissions</T> } ]
        : []),
      ...Object.keys(contest.members.participants).map(participant => ({
        value: participant,
        label: participant,
      })) ]),
    getSubmissionProblemHeader({
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
  ], [ contest.members.participants, contest.problems, contest.user.isAdministrator, contest.user.isManager, contest.user.isParticipant, languages, user.nickname ]);
  const preload = usePreload();
  const lastGetUrl = useRef({ filter: {}, sort: {} });
  
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
      extraNodes={[
        <ButtonLoader
          key="export"
          type="light"
          size="tiny"
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            const { url, ...options } = jukiApiSocketManager.API_V1.submission.getExportSummaryList({
              params: {
                page: 1,
                pageSize: 1000000,
                filterUrl: toFilterUrl({ ...lastGetUrl.current.filter, contestKeys: contest.key }),
                sortUrl: toSortUrl(lastGetUrl.current.sort),
              },
            });
            const result = await authorizedRequest<HTTPMethod.GET, Blob>(url, options);
            downloadBlobAsFile(result, contest.name + ' - submissions.csv');
            setLoaderStatus(Status.SUCCESS);
          }}
        >
          <T>export as csv</T>
        </ButtonLoader>,
      ]}
      onRecordRender={({ data, index }) => {
        const { nickname, company: { key: companyKey } } = data[index].user;
        void preload(jukiApiSocketManager.API_V1.submission.getData({ params: { id: data[index].submitId } }).url);
      }}
    />
  );
};
