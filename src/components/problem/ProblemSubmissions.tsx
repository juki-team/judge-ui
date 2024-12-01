'use client';

import {
  getSubmissionDateHeader,
  getSubmissionLanguageHeader,
  getSubmissionMemoryHeader,
  getSubmissionNicknameHeader,
  getSubmissionProblemHeader,
  getSubmissionRejudgeHeader,
  getSubmissionTimeHeader,
  getSubmissionVerdictHeader,
  PagedDataViewer,
} from 'components';
import { jukiApiSocketManager } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useFetcher, useMemo } from 'hooks';
import {
  ContentsResponseType,
  DataViewerHeadersType,
  JudgeSummaryListResponseDTO,
  LanguagesByJudge,
  ProblemDataResponseDTO,
  QueryParam,
  SubmissionSummaryListResponseDTO,
} from 'types';

export const ProblemSubmissions = ({ problem }: { problem: ProblemDataResponseDTO }) => {
  
  const { data: judgePublicList } = useFetcher<ContentsResponseType<JudgeSummaryListResponseDTO>>(jukiApiSocketManager.API_V1.judge.getSummaryList().url);
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
  
  const columns: DataViewerHeadersType<SubmissionSummaryListResponseDTO>[] = useMemo(() => {
    return [
      getSubmissionNicknameHeader(),
      getSubmissionProblemHeader(),
      getSubmissionDateHeader(),
      getSubmissionVerdictHeader(),
      ...(problem.user.isManager ? [ getSubmissionRejudgeHeader() ] : []),
      getSubmissionLanguageHeader(languages),
      getSubmissionTimeHeader(),
      getSubmissionMemoryHeader(),
    ];
  }, [ languages, problem.user.isManager ]);
  
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
            filterUrl: toFilterUrl({ ...filter, problemKeys: problem.key }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.STATUS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
};
