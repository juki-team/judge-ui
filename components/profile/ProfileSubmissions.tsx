import {
  getSubmissionDateHeader,
  getSubmissionLanguageHeader,
  getSubmissionMemoryHeader,
  getSubmissionProblemHeader,
  getSubmissionTimeHeader,
  getSubmissionVerdictHeader,
  PagedDataViewer,
} from 'components';
import { jukiSettings } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useFetcher, useJukiRouter, useMemo } from 'hooks';
import {
  ContentsResponseType,
  DataViewerHeadersType,
  JudgeSummaryListResponseDTO,
  LanguagesByJudge,
  QueryParam,
  SubmissionSummaryListResponseDTO,
} from 'types';

export function ProfileSubmissions() {
  
  const { routeParams: { nickname } } = useJukiRouter();
  const { data: judgePublicList } = useFetcher<ContentsResponseType<JudgeSummaryListResponseDTO>>(jukiSettings.API.judge.getSummaryList().url);
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
        jukiSettings.API.submission.getSummaryList({
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
    />
  );
}
