import {
  getSubmissionDateHeader,
  getSubmissionLanguageHeader,
  getSubmissionMemoryHeader,
  getSubmissionProblemHeader,
  getSubmissionTimeHeader,
  getSubmissionVerdictHeader,
  PagedDataViewer,
} from 'components';
import { jukiApiSocketManager } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useFetcher, useMemo, usePreload, useRouterStore } from 'hooks';
import {
  ContentsResponseType,
  DataViewerHeadersType,
  JudgeSummaryListResponseDTO,
  LanguagesByJudge,
  QueryParam,
  SubmissionSummaryListResponseDTO,
} from 'types';

export function ProfileSubmissions() {
  
  const nickname = useRouterStore(state => state.routeParams.nickname);
  const { data: judgePublicList } = useFetcher<ContentsResponseType<JudgeSummaryListResponseDTO>>(jukiApiSocketManager.API_V1.judge.getSummaryList().url);
  const preload = usePreload();
  const languages = useMemo(() => {
    const result: LanguagesByJudge = {};
    const judges = judgePublicList?.success ? judgePublicList.contents : [];
    for (const { name, languages, key } of judges) {
      const languagesResult: LanguagesByJudge[string]['languages'] = {};
      for (const { value, label } of languages.filter(lang => lang.enabled)) {
        languagesResult[value] = { label, value };
      }
      result[key] = { key, languages: languagesResult, name };
    }
    return result;
  }, [ judgePublicList ]);
  
  const columns: DataViewerHeadersType<SubmissionSummaryListResponseDTO>[] = useMemo(() => [
    getSubmissionProblemHeader(),
    getSubmissionDateHeader(),
    getSubmissionVerdictHeader(),
    getSubmissionLanguageHeader(languages),
    getSubmissionTimeHeader(),
    getSubmissionMemoryHeader(),
  ], [ languages ]);
  
  return (
    <PagedDataViewer<SubmissionSummaryListResponseDTO, SubmissionSummaryListResponseDTO>
      rows={{ height: 80 }}
      cards={{ expanded: true }}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiApiSocketManager.API_V1.submission.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({ ...filter, nicknames: nickname as string }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.PROFILE_SUBMISSIONS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
      onRecordRender={({ data, index }) => {
        void preload(jukiApiSocketManager.API_V1.submission.getData({ params: { id: data[index].submitId } }).url);
        if (data[index].contest) {
          void preload(jukiApiSocketManager.API_V1.contest.getData({ params: { key: data[index].contest.key } }).url);
        } else {
          void preload(jukiApiSocketManager.API_V1.problem.getData({ params: { key: data[index].problem.key } }).url);
        }
      }}
    />
  );
}
