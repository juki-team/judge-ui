import { ContentLayout, DataViewer, DataViewerHeadersType, DateField, Field, T, TextField, TextHeadCell } from 'components';
import { contestStatusCalculation, searchParamsObjectTypeToQuery } from 'helpers';
import { useRequester, useRouter } from 'hooks';
import { useMemo } from 'react';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { ContentsResponseType, ContestTab } from 'types';
import { ROUTES } from '../config/constants';

type SettingsOptions = {
  start: Date,
  languages: [],
  frozen: string,
}

type ContestTable = {
  key: string,
  name: string,
  settings: SettingsOptions,
  totalRegistered: number,
  stateContest: string,
}

function Contests() {
  
  const { data: response, refresh } = useRequester<ContentsResponseType<any>>(JUDGE_API_V1.CONTEST.CONTEST());
  
  const columns: DataViewerHeadersType<ContestTable>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="text-uppercase">state</T>} />,
      index: 'stateContest',
      field: ({ record: { stateContest } }) => (
        <Field className="jk-row pad">
          <div className={`jk-tag ${stateContest === 'past' ? 'success' : (stateContest === 'upcoming' ? 'info' : 'error')}`}>
            {stateContest}
          </div>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.name.localeCompare(rowB.name) },
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
      head: <TextHeadCell text={<T className="text-uppercase">start</T>} />,
      index: 'date',
      field: ({ record: { settings } }) => (
        <DateField date={new Date(settings.start)} label="Date" twoLines />
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.settings.start - +rowB.settings.start },
      filter: { type: 'date-auto' },
      cardPosition: 'center',
      minWidth: 250,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">contest name</T>} />,
      index: 'name',
      field: ({ record: { name, key } }) => (
        <TextField
          text={<div className="jk-link" onClick={() => push(ROUTES.CONTESTS.VIEW(key, ContestTab.OVERVIEW))}>{name}</div>}
          label={<T>contest name</T>} />
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.name.localeCompare(rowB.name) },
      filter: { type: 'text-auto' },
      cardPosition: 'center',
      minWidth: 300,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">contestants</T>} />,
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
    totalRegistered: contest.totalRegistered,
    stateContest: contestStatusCalculation(new Date(contest.settings.start), contest.timing.duration),
  }));
  
  return (
    <div>
      {/* <TitleLayout>
       <h3>Contest</h3>
       </TitleLayout> */}
      <ContentLayout>
        <div className="main-content">
          <DataViewer<ContestTable>
            headers={columns}
            data={data}
            rows={{ height: 68 }}
            request={refresh}
            name="users"
            // extraButtons={() => (
            //   <div className="extra-buttons">
            //     {can.createProblem(user) && (
            //       <ButtonLoader
            //         size="small"
            //         icon={<PlusIcon />}
            //         onClick={buttonLoaderLink(ROUTES.PROBLEMS.CREATE(ProblemTab.STATEMENT))}
            //       >
            //         <T>create</T>
            //       </ButtonLoader>
            //     )}
            //   </div>
            // )}
            searchParamsObject={queryObject}
            setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
          />
        </div>
      </ContentLayout>
    </div>
  );
}

export default Contests;