'use client';

import { ContentResponseType, getParamsOfUserKey } from '@juki-team/commons';
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
  SpinIcon,
  T,
} from 'components';
import { jukiApiSocketManager } from 'config';
import { authorizedRequest, cleanRequest, downloadUrlAsFile, toFilterUrl, toSortUrl } from 'helpers';
import { useFetcher, useJukiNotification, useMemo, usePreload, useRef, useState, useUserStore } from 'hooks';
import { RefObject } from 'react';
import {
  ContentsResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  JudgeSummaryListResponseDTO,
  LanguagesByJudge,
  QueryParam,
  SubmissionSummaryListResponseDTO,
} from 'types';
import { Select } from '../../index';

interface DownloadButtonProps {
  disabled: boolean,
  lastGetUrl: RefObject<{ filter: {}, sort: {} }>,
  contest: ContestDataResponseDTO,
}

const DownloadButton = ({ contest, disabled, lastGetUrl }: DownloadButtonProps) => {
  
  const [ loading, setLoading ] = useState(false);
  const { notifyResponse } = useJukiNotification();
  return (
    <Select
      disabled={disabled || loading}
      options={[
        { value: 'csv', label: <T className="tt-se">as csv</T> },
        { value: 'complete', label: <T className="tt-se">as zip with source codes</T> },
      ]}
      selectedOption={{ value: 'x', label: loading ? <SpinIcon /> : <T className="tt-se">download</T> }}
      onChange={async ({ value }) => {
        switch (value) {
          case 'csv': {
            setLoading(true);
            const { url, ...options } = jukiApiSocketManager.API_V1.submission.getExportSummaryList({
              params: {
                page: 1,
                pageSize: 1000000,
                filterUrl: toFilterUrl({ ...lastGetUrl.current.filter, contestKeys: contest.key }),
                sortUrl: toSortUrl(lastGetUrl.current.sort),
              },
            });
            const result = cleanRequest<ContentResponseType<{ urlExportedFile: string }>>(
              await authorizedRequest(url, options),
            );
            if (notifyResponse(result)) {
              setLoading(true);
              await downloadUrlAsFile(result.content.urlExportedFile, contest.name + ' - submissions.csv');
              setLoading(false);
            }
            setLoading(false);
            break;
          }
          case 'complete':
            setLoading(true);
            const { url, ...options } = jukiApiSocketManager.API_V1.submission.getExportSummaryList({
              params: {
                page: 1,
                pageSize: 1000000,
                filterUrl: toFilterUrl({ ...lastGetUrl.current.filter, contestKeys: contest.key }),
                sortUrl: toSortUrl(lastGetUrl.current.sort),
                withSourceCodes: true,
              },
            });
            const result = cleanRequest<ContentResponseType<{ urlExportedFile: string }>>(
              await authorizedRequest(url, options),
            );
            if (notifyResponse(result)) {
              setLoading(true);
              await downloadUrlAsFile(result.content.urlExportedFile, contest.name + ' - submissions.zip');
              setLoading(false);
            }
            setLoading(false);
            break;
          default:
        }
      }}
      className="jk-border-radius-inline jk-button light tiny"
    />
  );
};

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
  ], [ contest.members.participants, contest.problems, contest.user.isAdministrator, contest.user.isManager, contest.user.isParticipant, languages, userNickname ]);
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
        <DownloadButton
          key="export"
          contest={contest}
          lastGetUrl={lastGetUrl}
          disabled={false}
        />,
      ]}
      onRecordRender={({ data, index }) => {
        void preload(jukiApiSocketManager.API_V1.submission.getData({ params: { id: data[index].submitId } }).url);
      }}
    />
  );
};
