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
import { jukiSettings } from 'config';
import { authorizedRequest, downloadBlobAsFile, toFilterUrl, toSortUrl } from 'helpers';
import { useFetcher, useRef } from 'hooks';
import { useMemo } from 'react';
import {
  ContentsResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  JudgeSummaryListResponseDTO,
  LanguagesByJudge,
  QueryParam,
  Status,
  SubmissionSummaryListResponseDTO,
} from 'types';

export const ViewSubmissions = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  const { data: judgePublicList } = useFetcher<ContentsResponseType<JudgeSummaryListResponseDTO>>(jukiSettings.API.judge.getSummaryList().url);
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
    getSubmissionNicknameHeader(Object.keys(contest.members.participants).map(participant => ({
      value: participant,
      label: participant,
    }))),
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
  ], [ contest.members.participants, contest.problems, contest.user.isAdministrator, contest.user.isManager, languages ]);
  
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
        return jukiSettings.API.submission.getSummaryList({
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
            const { url, ...options } = jukiSettings.API.submission.getExportSummaryList({
              params: {
                page: 1,
                pageSize: 1000000,
                filterUrl: toFilterUrl({ ...lastGetUrl.current.filter, contestKeys: contest.key }),
                sortUrl: toSortUrl(lastGetUrl.current.sort),
              },
            });
            const result = await authorizedRequest(url, options);
            downloadBlobAsFile(result, contest.name + ' - submissions.csv');
            setLoaderStatus(Status.SUCCESS);
          }}
        >
          <T>export as csv</T>
        </ButtonLoader>,
      ]}
    />
  );
};
