import { useMemo } from 'react';
import {
  ContentLayout,
  DataViewer,
  DataViewerHeadersType,
  Field,
  T,
  TextField,
  TextHeadCell,
  TitleLayout,
  DateField,
} from '../components';
import { contestStatusCalculation } from '../helpers';
import { useFetcher, useRequestLoader, useRouter } from '../hooks';
import { JUDGE_API_V1 } from '../services/judge';
import { ContestStatus } from '../types';

type SettingsOptions = {
  start: Date,
  languages: [],
  frozen: string,
}
type TimingOptions = {
  duration: Date,
}
type ContestTable = {
  id: string,
  name: string,
  tags: string[],
  status: ContestStatus,
  settings: SettingsOptions,
  timing: TimingOptions,
  totalRegistered: number,
  stateContest: string,
}
function Contests() {

  const { data: response } = useFetcher(JUDGE_API_V1.CONTEST.CONTEST());
  
  const tags = new Set<string>();
  (response?.list || []).forEach(problem => {
    problem.tags.forEach(tag => tags.add(tag));
  });
  
  const allTags: string[] = Array.from(tags);
  
  const columns: DataViewerHeadersType<ContestTable>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="text-uppercase">state contest</T>} />,
      index: 'stateContest',
      field: ({ record: { stateContest } }) => (
        <Field className="jk-row pad">
          <div className={`jk-tag ${stateContest === 'past' ? 'success' : (stateContest === 'upcoming' ? 'info' : 'error')}`}>
            {stateContest} 
          </div>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.name.localeCompare(rowB.name) },
      filter: { type: 'select-auto', options: [
        {
          value: 'upcoming',
          label: <T className="text-capitalize">upcoming</T>
        },
        {
          value: 'live',
          label: <T className="text-capitalize">live</T>
        },
        {
          value: 'past',
          label: <T className="text-capitalize">past</T>
        },
      ] },
      cardPosition: 'center',
      minWidth: 140,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">start</T>} />,
      index: 'date',
      field: ({ record: { settings } }) => (
        <DateField date={new Date(settings.start)} label="Date" />
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.settings.start - +rowB.settings.start },
      filter: { type: 'date-auto' },
      cardPosition: 'center',
      minWidth: 250,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">contest name</T>} />,
      index: 'name',
      field: ({ record: { name } }) => (
        <TextField text={name} label={<T>Contest Name</T>} />
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.name.localeCompare(rowB.name) },
      filter: { type: 'text-auto' },
      cardPosition: 'center',
      minWidth: 300,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">registered</T>} />,
      index: 'registered',
      field: ({ record: { totalRegistered } }) => (
        <TextField text={totalRegistered} label={<T>registered</T>}/>
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.totalRegistered - +rowB.totalRegistered },
      filter: { type: 'text-auto', getValue: ({ record: { totalRegistered } }) => '' + totalRegistered },
      cardPosition: 'center',
      minWidth: 100,
    },
  ], [allTags]);
  
  const { queryObject, push } = useRouter();
  
  const data: ContestTable[] = (response?.list || []).map(contest => (
    {
      id: contest.key,
      name: contest.name,
      tags: contest.tags,
      status: contest.status,
      settings: contest.settings,
      timing: contest.timing,
      totalRegistered: contest.totalRegistered,
      stateContest: contestStatusCalculation(contest),
    } as ContestTable
  ));
  
  const request = useRequestLoader(JUDGE_API_V1.CONTEST.CONTEST())
  
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
            rows={{ height: 52 }}
            request={request}
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
            setSearchParamsObject={(params) => push({ query: params })}
          />
        </div>
      </ContentLayout>
    </div>
  );
}

export default Contests;