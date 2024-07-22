import {
  getSubmissionDateHeader,
  getSubmissionLanguageHeader,
  getSubmissionMemoryHeader,
  getSubmissionProblemHeader,
  getSubmissionRejudgeHeader,
  getSubmissionTimeHeader,
  getSubmissionVerdictHeader,
  PagedDataViewer,
} from 'components';
import { jukiSettings } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useFetcher, useJukiUser } from 'hooks';
import { useMemo } from 'react';
import {
  ContentsResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  JudgeSummaryListResponseDTO,
  LanguagesByJudge,
  QueryParam,
  SubmissionSummaryListResponseDTO,
} from 'types';

export const ViewMySubmissions = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  const { user: { nickname } } = useJukiUser();
  const { data: judgePublicList } = useFetcher<ContentsResponseType<JudgeSummaryListResponseDTO>>(jukiSettings.API.judge.getSummaryList().url);
  const languages = useMemo(() => {
    const result: LanguagesByJudge = {};
    const judges = judgePublicList?.success ? judgePublicList.contents : [];
    const judgeKeys = Object.values(contest.problems).map(({ judgeKey }) => judgeKey);
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
  ], [ contest.problems, contest.user.isAdministrator, contest.user.isManager, languages ]);
  
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
            filterUrl: toFilterUrl({ ...filter, contestKeys: contest?.key, nicknames: nickname }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.MY_STATUS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
      getRowKey={({ data, index }) => data[index].submitId}
    />
  );
};
