import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { useSWRConfig } from 'swr';
import {
  ButtonLoader,
  ContentLayout,
  DataViewer,
  DataViewerHeadersType,
  ReloadIcon,
  T,
  TextField,
  TextHeadCell,
  TitleLayout,
} from '../components';
import { useFetcher } from '../hooks';
import { JUDGE_API_V1 } from '../services/judge';
import { ProblemStatus, Status } from '../types';

type ProblemsTable = {
  id: string,
  name: string,
  tags: string[],
  status: ProblemStatus,
}

function Problems() {
  
  const columns: DataViewerHeadersType<ProblemsTable>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T>id</T>} />,
      index: 'id',
      field: ({ record: { id } }) => (
        <TextField text={id} label={<T>id</T>} />
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.id - rowB.id },
      filter: { type: 'text' },
      cardPosition: 'topLeft',
      minWidth: 100,
    },
    {
      head: <TextHeadCell text={<T>problem name</T>} />,
      index: 'name',
      field: ({ record: { name } }) => (
        <TextField text={name} label={<T>problem name</T>} />
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.name.localeCompare(rowB.name) },
      filter: { type: 'text' },
      cardPosition: 'center',
      minWidth: 300,
    },
    {
      head: <TextHeadCell text={<T>tags</T>} />,
      index: 'tags',
      field: ({ record: { tags } }) => (
        <TextField text={tags} label={<T>tags</T>} />
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.tags.length - rowB.tags.length },
      filter: { type: 'text' },
      cardPosition: 'bottom',
      minWidth: 200,
    },
  ], []);
  
  const { query, push } = useRouter();
  
  const searchParamsObject = useMemo(() => {
    const searchParamsObject = {};
    Object.entries(query).forEach(([key, value]) => {
      if (typeof value === 'string') {
        searchParamsObject[key] = [value];
      } else {
        searchParamsObject[key] = value;
      }
    });
    return searchParamsObject;
  }, [query]);
  
  console.log({ query, searchParamsObject });
  
  const { data: response, error, isLoading } = useFetcher(JUDGE_API_V1.PROBLEM.PROBLEM());
  const { mutate } = useSWRConfig();
  console.log({ response, error, isLoading });
  
  const data: ProblemsTable[] = (response?.list || []).map(user => (
    {
      id: user.id,
      name: user.name,
      tags: user.tags,
      status: user.status,
    } as ProblemsTable
  ));
  
  const request = useCallback(async ({ sort, filter, setLoading }) => {
    console.log('request', { sort, filter });
    setLoading([1, Status.LOADING]);
    await mutate(JUDGE_API_V1.PROBLEM.PROBLEM());
    setLoading([1, Status.SUCCESS]);
  }, []);
  
  return (
    <div>
      <TitleLayout>
        <h3>Problems</h3>
      </TitleLayout>
      <ContentLayout>
        <DataViewer<ProblemsTable>
          headers={columns}
          data={data}
          rows={{ height: 52 }}
          request={request}
          name="users"
          extraButtons={() => (
            <ButtonLoader size="small" type="text" icon={<ReloadIcon />} onClick={() => console.log('CLICK')}>
              <T>download</T>
            </ButtonLoader>
          )}
          searchParamsObject={searchParamsObject}
          setSearchParamsObject={(params) => {
            console.log({ params });
            push({ query: params });
          }}
        />
      </ContentLayout>
    </div>
  );
}

export default Problems;