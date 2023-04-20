import { contestDateColumn, Field, PagedDataViewer, T, TextHeadCell } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useRouter } from 'hooks';
import { useMemo } from 'react';
import { ContestSummaryListResponseDTO, ContestTab, DataViewerHeadersType, GetUrl, QueryParam } from 'types';
import { contestantsColumn, contestNameColumn } from '../commons';

export const contestStateMap = {
  [[ true, false, false, false ].toString()]: { order: 0, label: 'past', color: 'gray-5' },
  [[ false, true, false, false ].toString()]: { order: 1, label: 'live', color: 'error' },
  [[ false, false, true, false ].toString()]: { order: 2, label: 'upcoming', color: 'success' },
  [[ false, false, false, true ].toString()]: { order: 3, label: 'endless', color: 'info' },
};

export const ContestsAllList = () => {
  
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">state</T>} />,
      index: 'state',
      field: ({ record: contest }) => (
        <Field className="jk-row pad">
          <div
            className={`jk-tag ${contestStateMap[[
              contest.isPast,
              contest.isLive,
              contest.isFuture,
              contest.isEndless,
            ].toString()]?.color}`}
          >
            <T className="tt-ue tx-s">{contestStateMap[[
              contest.isPast,
              contest.isLive,
              contest.isFuture,
              contest.isEndless,
            ].toString()]?.label}</T>
          </div>
        </Field>
      ),
      filter: {
        type: 'select', options: [ 'upcoming', 'live', 'past' ].map(option => ({
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
  const { push } = useRouter();
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => (
    JUDGE_API_V1.CONTEST.LIST(page, pageSize, toFilterUrl(filter), toSortUrl(sort))
  );
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      url={url}
      name={QueryParam.ALL_CONTESTS_TABLE}
      refreshInterval={60000}
      cards={{ width: 320, expanded: true }}
      onRecordClick={async ({ isCard, data, index }) => {
        if (isCard) {
          await push({ pathname: ROUTES.CONTESTS.VIEW(data[index].key, ContestTab.OVERVIEW) });
        }
      }}
    />
  );
};
