'use client';

import { getSubmissionContestProblemHeader, getSubmissionDateHeader, getSubmissionLanguageHeader, getSubmissionMemoryHeader, getSubmissionNicknameHeader, getSubmissionRejudgeHeader, getSubmissionTimeHeader, getSubmissionVerdictHeader, PagedDataViewer, useFetcher } from '@juki-team/base-ui';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { toFilterUrl, toSortUrl } from '@juki-team/base-ui/helpers';
import { useMemo } from 'hooks';
import { QueryParam } from 'types';
import { type DataViewerHeadersType } from '@juki-team/base-ui/types';
import { type JudgeSummaryListResponseDTO, type ProblemDataResponseDTO, type SubmissionSummaryListResponseDTO } from '@juki-team/commons/dto';
import { EntityRole, type Judge } from '@juki-team/commons/enums';

type LanguagesByJudge = {
  [key: string]: {
    key: string | Judge;
    name: string;
    languages: { [key: string]: { label: string; value: string } };
  };
};
import { type ContentsResponse } from '@juki-team/commons/types';

export const ProblemSubmissions = ({ problem }: { problem: ProblemDataResponseDTO }) => {

  const { data: judgePublicList } = useFetcher<ContentsResponse<JudgeSummaryListResponseDTO>>(jukiApiManager.apiV2.judge.getSummaryList().url);
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

  const canRejudge = problem.user.role === EntityRole.MANAGER || problem.user.role === EntityRole.ADMINISTRATOR;
  const columns: DataViewerHeadersType<SubmissionSummaryListResponseDTO>[] = useMemo(() => {
    return [
      getSubmissionNicknameHeader(),
      getSubmissionContestProblemHeader(),
      getSubmissionDateHeader(),
      getSubmissionVerdictHeader(),
      ...(canRejudge ? [ getSubmissionRejudgeHeader() ] : []),
      getSubmissionLanguageHeader(languages),
      getSubmissionTimeHeader(),
      getSubmissionMemoryHeader(),
    ];
  }, [ languages, canRejudge ]);

  return (
    <PagedDataViewer<SubmissionSummaryListResponseDTO, SubmissionSummaryListResponseDTO>
      rows={{ height: 80 }}
      cards={{ expanded: true }}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiApiManager.apiV2.submission.getSummaryList({
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
      getRecordKey={({ data, index }) => data[index]?.submitId}
      refreshInterval={60000}
    />
  );
};
