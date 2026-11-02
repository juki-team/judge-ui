'use client';

import {
  getSubmissionContestProblemHeader,
  getSubmissionDateHeader,
  getSubmissionLanguageHeader,
  getSubmissionMemoryHeader,
  getSubmissionRejudgeHeader,
  getSubmissionTimeHeader,
  getSubmissionVerdictHeader,
  PagedDataViewer,
} from 'components';
import { jukiApiManager } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useFetcher, useMemo, useSubmissionsJudging, useUserStore } from 'hooks';
import {
  ContentsResponseType,
  DataViewerHeadersType,
  JudgeSummaryListResponseDto,
  LanguagesByJudge,
  ProblemDataResponseDto,
  QueryParam,
  SubmissionSummaryListResponseDto,
} from 'types';

export const ProblemMySubmissions = ({ problem }: { problem: ProblemDataResponseDto }) => {
  
  useSubmissionsJudging({ problemKey: problem.key });
  
  const userNickname = useUserStore(state => state.user.nickname);
  const { data: judgePublicList } = useFetcher<ContentsResponseType<JudgeSummaryListResponseDto>>(jukiApiManager.API_V2.judge.getSummaryList().url);
  const languages = useMemo(() => {
    const result: LanguagesByJudge = {};
    const judges = judgePublicList?.success ? judgePublicList.contents : [];
    for (const { name, languages, key } of judges) {
      if (problem.judge.key === key) {
        const languagesResult: LanguagesByJudge[string]['languages'] = {};
        for (const { value, label } of languages.filter(lang => lang.enabled)) {
          languagesResult[value] = { label, value };
        }
        result[key] = { key, languages: languagesResult, name };
      }
    }
    return result;
  }, [ judgePublicList, problem.judge.key ]);
  
  const columns: DataViewerHeadersType<SubmissionSummaryListResponseDto>[] = useMemo(() => {
    return [
      getSubmissionContestProblemHeader(),
      getSubmissionDateHeader(),
      getSubmissionVerdictHeader(),
      ...(problem.user.isManager ? [ getSubmissionRejudgeHeader() ] : []),
      getSubmissionLanguageHeader(languages),
      getSubmissionTimeHeader(),
      getSubmissionMemoryHeader(),
    ];
  }, [ languages, problem.user.isManager ]);
  
  return (
    <PagedDataViewer<SubmissionSummaryListResponseDto, SubmissionSummaryListResponseDto>
      rows={{ height: 80 }}
      cards={{ expanded: true }}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiApiManager.API_V2.submission.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({ ...filter, problemKeys: problem.key, nicknames: userNickname }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.MY_STATUS_TABLE}
      toRow={submission => submission}
      getRecordKey={({ data, index }) => data[index]?.submitId}
      refreshInterval={60000}
    />
  );
};
