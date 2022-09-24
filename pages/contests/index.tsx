import {
  ButtonLoader,
  CheckIcon,
  ContentLayout,
  DataViewer,
  DateField,
  Field,
  PlusIcon,
  Popover,
  T,
  TextField,
  TextHeadCell,
} from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { buttonLoaderLink, getContestStatus, searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester, useRouter } from 'hooks';
import Link from 'next/link';
import { useMemo } from 'react';
import { useUserState } from 'store';
import { ContentsResponseType, ContestSummaryListResponseDTO, ContestTab, DataViewerHeadersType } from 'types';

type SettingsOptions = {
  startTimestamp: number;
  endTimestamp: number;
}

type ContestTable = {
  key: string,
  name: string,
  settings: SettingsOptions,
  totalRegistered: number,
  stateContest: string,
  user: {
    isAdmin: boolean,
    isContestant: boolean,
    isGuest: boolean,
    isJudge: boolean,
    isSpectator: boolean,
  }
}

function Contests() {
  
  const { canCreateContest } = useUserState();
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<ContestSummaryListResponseDTO>>(JUDGE_API_V1.CONTEST.LIST());
  
  const columns: DataViewerHeadersType<ContestTable>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T>state</T>} />,
      index: 'stateContest',
      field: ({ record: { stateContest } }) => (
        <Field className="jk-row pad">
          <div className={`jk-tag ${stateContest === 'past' ? 'success' : (stateContest === 'upcoming' ? 'info' : 'error')}`}>
            <T>{stateContest}</T>
          </div>
        </Field>
      ),
      sort: {
        compareFn: () => (rowA, rowB) => {
          const order = { past: 0, live: 1, upcoming: 2 };
          return order[rowA.stateContest] - order[rowB.stateContest];
        },
      },
      filter: {
        type: 'select-auto', options: ['upcoming', 'live', 'past'].map(option => ({
          value: option,
          label: <T className="text-capitalize">{option}</T>,
        })),
      },
      cardPosition: 'center',
      minWidth: 140,
    },
    {
      head: <TextHeadCell text={<T>start</T>} />,
      index: 'date',
      field: ({ record: { settings } }) => (
        <DateField date={new Date(settings.startTimestamp)} label="Date" twoLines />
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.settings.startTimestamp - +rowB.settings.startTimestamp },
      filter: { type: 'date-auto' },
      cardPosition: 'center',
      minWidth: 250,
    },
    {
      head: <TextHeadCell text={<T>contest name</T>} />,
      index: 'name',
      field: ({ record: { name, key, user } }) => (
        <Field className="jk-row">
          {user.isGuest || user.isAdmin || user.isContestant || user.isJudge || user.isSpectator ? (
            <Link href={ROUTES.CONTESTS.VIEW(key, ContestTab.OVERVIEW)}>
              <a>
                <div className="jk-row gap link text-semi-bold">
                  {name}
                  {user.isAdmin ? (
                    <Popover
                      content={<T className="text-sentence-case text-nowrap">you are admin</T>}
                      placement="top"
                      showPopperArrow
                    >
                      <div className="jk-tag tx-t tx-wd-bold letter-tag">A</div>
                    </Popover>
                  ) : user.isJudge ? (
                    <Popover
                      content={<T className="text-sentence-case text-nowrap">you are judge</T>}
                      placement="top"
                      showPopperArrow
                    >
                      <div className="jk-tag tx-t tx-wd-bold letter-tag">J</div>
                    </Popover>
                  ) : user.isContestant ? (
                    <Popover
                      content={<T className="text-sentence-case text-nowrap">registered</T>}
                      placement="top"
                      showPopperArrow
                    >
                      <div><CheckIcon filledCircle className="color-success" /></div>
                    </Popover>
                  ) : user.isGuest ? (
                    <Popover
                      content={<T className="text-sentence-case text-nowrap">you are guest</T>}
                      placement="top"
                      showPopperArrow
                    >
                      <div className="jk-tag tx-t tx-wd-bold letter-tag">G</div>
                    </Popover>
                  ) : user.isSpectator && (
                    <Popover
                      content={<T className="text-sentence-case text-nowrap">you are spectator</T>}
                      placement="top"
                      showPopperArrow
                    >
                      <div className="jk-tag tx-t tx-wd-bold letter-tag">S</div>
                    </Popover>
                  )}
                </div>
              </a>
            </Link>
          ) : (
            <div className="jk-row gap text-semi-bold">
              {name}
            </div>
          )}
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.name.localeCompare(rowB.name) },
      filter: { type: 'text-auto' },
      cardPosition: 'center',
      minWidth: 300,
    },
    {
      head: <TextHeadCell text={<T>contestants</T>} />,
      index: 'registered',
      field: ({ record: { totalRegistered } }) => (
        <TextField text={totalRegistered} label={<T>registered</T>} />
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.totalRegistered - +rowB.totalRegistered },
      filter: { type: 'text-auto', getValue: ({ record: { totalRegistered } }) => '' + totalRegistered },
      cardPosition: 'center',
      minWidth: 180,
    },
  ], []);
  
  const { queryObject, push } = useRouter();
  
  const data: ContestTable[] = (response?.success ? response?.contents : []).map(contest => ({
    key: contest.key,
    name: contest.name,
    settings: contest.settings,
    totalRegistered: contest.totalContestants,
    stateContest: getContestStatus(contest.settings.startTimestamp, contest.settings.endTimestamp),
    user: contest.user,
  }));
  
  return (
    
    <ContentLayout>
      <DataViewer<ContestTable>
        headers={columns}
        data={data}
        rows={{ height: 68 }}
        request={request}
        setLoaderStatusRef={setLoaderStatusRef}
        name="users"
        extraButtons={() => (
          <div className="extra-buttons">
            {canCreateContest && (
              <ButtonLoader
                size="small"
                icon={<PlusIcon />}
                onClick={buttonLoaderLink(() => push(ROUTES.CONTESTS.CREATE()))}
              >
                <T>create</T>
              </ButtonLoader>
            )}
          </div>
        )}
        searchParamsObject={queryObject}
        setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
      />
    </ContentLayout>
  );
}

export default Contests;