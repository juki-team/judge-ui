import { DateLiteral, Field, PagedDataViewer, T, TextHeadCell } from 'components';
import { JUDGE_API_V1, QueryParam } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useMemo } from 'react';
import { useUserState } from 'store';
import { ContestSummaryListResponseDTO, DataViewerHeadersType, GetUrl } from 'types';
import { contestantsColumn, contestNameColumn, CreateContestButton } from '../commons';

const stateMap = {
  [[true, false, false].toString()]: { order: 0, label: 'past', color: 'success' },
  [[false, true, false].toString()]: { order: 1, label: 'live', color: 'error' },
  [[false, false, true].toString()]: { order: 2, label: 'upcoming', color: 'info' },
};

export const ContestList = ({ endless }: { endless?: boolean }) => {
  const { canCreateContest } = useUserState();
  
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T>state</T>} />,
      index: 'state',
      field: ({ record: { isPast, isLive, isFuture } }) => (
        <Field className="jk-row pad">
          <div className={`jk-tag ${stateMap[[isPast, isLive, isFuture].toString()].color}`}>
            <T className="tt-ue tx-s">{stateMap[[isPast, isLive, isFuture].toString()].label}</T>
          </div>
        </Field>
      ),
      filter: {
        type: 'select', options: ['upcoming', 'live', 'past'].map(option => ({
          value: option,
          label: <T className="tt-ce">{option}</T>,
        })),
      },
      cardPosition: 'center',
      minWidth: 130,
      
    },
    contestNameColumn(false),
    {
      head: <TextHeadCell text={<div className="jk-col"><T>start</T><T>end</T></div>} />,
      index: 'date',
      field: ({ record: { settings } }) => (
        <Field className="jk-col">
          <DateLiteral date={new Date(settings.startTimestamp)} show="year-month-day-hours-minutes" />
          <DateLiteral date={new Date(settings.endTimestamp)} show="year-month-day-hours-minutes" />
        </Field>
      ),
      sort: true,
      filter: { type: 'date-range', pickerType: 'year-month-day-hours-minutes' },
      cardPosition: 'center',
      minWidth: 340,
    },
    contestantsColumn(),
  ], []);
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => (
    JUDGE_API_V1.CONTEST.LIST(page, pageSize, toFilterUrl(filter), toSortUrl(sort))
  );
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      url={url}
      name={endless ? QueryParam.ENDLESS_CONTESTS_TABLE : QueryParam.CONTESTS_TABLE}
      refreshInterval={60000}
      extraButtons={canCreateContest ? <CreateContestButton /> : null}
    />
  );
};
