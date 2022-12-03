import { ContentLayout, Field, PagedDataViewer, T, TextHeadCell, UserNicknameLink } from 'components';
import { JUDGE_API_V1, QueryParam } from 'config/constants';
import React, { useMemo } from 'react';
import { DataViewerHeadersType, GetUrl } from 'types';

type ProblemSummaryListResponseDTO = {
  nickname: string,
  problemPoints: number,
}

function Ranking() {
  
  const columns: DataViewerHeadersType<ProblemSummaryListResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue">position</T>} />,
      index: 'key',
      field: ({ record: {}, isCard, recordIndex }) => (
        <Field className="jk-row fw-bd">
          <div>{recordIndex}</div>
        </Field>
      ),
      sort: true,
      cardPosition: 'top',
      minWidth: 100,
    },
    {
      head: <TextHeadCell text={<T>nickname</T>} />,
      index: 'name',
      field: ({ record: { nickname } }) => (
        <Field className="jk-row link fw-bd">
          <UserNicknameLink nickname={nickname}>
            <div>{nickname}</div>
          </UserNicknameLink>
        </Field>
      ),
      sort: true,
      filter: { type: 'text' },
      cardPosition: 'top',
      minWidth: 300,
    },
    {
      head: <TextHeadCell text={<T>points by problems</T>} />,
      index: 'problem-points',
      field: ({ record: { problemPoints } }) => (
        <Field className="jk-row link fw-bd">
          <div>{problemPoints}</div>
        </Field>
      ),
      sort: true,
      filter: { type: 'text' },
      cardPosition: 'top',
      minWidth: 300,
    },
  ], []);
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => (
    // JUDGE_API_V1.RANKING.LIST(page, pageSize, toFilterUrl(filter), toSortUrl(sort))
    JUDGE_API_V1.RANKING.LIST()
  );
  
  return (
    <ContentLayout>
      <PagedDataViewer<ProblemSummaryListResponseDTO, ProblemSummaryListResponseDTO>
        headers={columns}
        url={url}
        name={QueryParam.PROBLEMS_TABLE}
      />
    </ContentLayout>
  );
}

export default Ranking;