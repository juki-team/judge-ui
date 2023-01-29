import { contestDateColumn, Field, PagedDataViewer, T, TextHeadCell } from 'components';
import { JUDGE_API_V1, QueryParam } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useMemo } from 'react';
import { ContestSummaryListResponseDTO, DataViewerHeadersType, GetUrl } from 'types';
import { contestantsColumn, contestNameColumn } from '../commons';

const stateMap = {
  [[true, false, false, false].toString()]: { order: 0, label: 'past', color: 'gray-6' },
  [[false, true, false, false].toString()]: { order: 1, label: 'live', color: 'error-light' },
  [[false, false, true, false].toString()]: { order: 2, label: 'upcoming', color: 'success-light' },
  [[false, false, false, true].toString()]: { order: 3, label: 'endless', color: 'info-light' },
};

export const ContestsAllList = () => {
  
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">state</T>} />,
      index: 'state',
      field: ({ record: contest }) => (
        <Field className="jk-row pad">
          <div className={`jk-tag ${stateMap[[
            contest.isPast,
            contest.isLive,
            contest.isFuture,
            contest.isEndless,
          ].toString()]?.color}`}>
            <T className="tt-ue tx-s">{stateMap[[
              contest.isPast,
              contest.isLive,
              contest.isFuture,
              contest.isEndless,
            ].toString()]?.label}</T>
          </div>
        </Field>
      ),
      filter: {
        type: 'select', options: ['upcoming', 'live', 'past'].map(option => ({
          value: option,
          label: <T className="tt-ce">{option}</T>,
        })),
      },
      cardPosition: 'top',
      minWidth: 130,
    },
    contestNameColumn(false),
    contestDateColumn(),
    contestantsColumn(),
  ], []);
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => (
    JUDGE_API_V1.CONTEST.LIST(page, pageSize, toFilterUrl(filter), toSortUrl(sort))
  );
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      url={url}
      name={QueryParam.ALL_CONTESTS_TABLE}
      refreshInterval={60000}
      cards={{ width: 320 }}
    />
  );
};
