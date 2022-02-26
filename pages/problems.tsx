import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { useSWRConfig } from 'swr';
import {
  ButtonLoader,
  ContentLayout,
  DataViewer,
  DataViewerHeadersType,
  Field,
  PlusIcon,
  T,
  TextField,
  TextHeadCell,
  TitleLayout,
} from '../components';
import { ROUTES } from '../config/constants';
import { can } from '../helpers';
import { useFetcher } from '../hooks';
import { JUDGE_API_V1 } from '../services/judge';
import { useUserState } from '../store';
import { ProblemStatus, ProblemTab, Status } from '../types';

type ProblemsTable = {
  id: string,
  name: string,
  tags: string[],
  status: ProblemStatus,
}

function Problems() {
  
  const { data: response } = useFetcher(JUDGE_API_V1.PROBLEM.PROBLEM());
  
  const tags = new Set<string>();
  (response?.list || []).forEach(problem => {
    problem.tags.forEach(tag => tags.add(tag));
  });
  
  const allTags: string[] = Array.from(tags);
  
  const columns: DataViewerHeadersType<ProblemsTable>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T>id</T>} />,
      index: 'id',
      field: ({ record: { id } }) => (
        <TextField text={id} label={<T>id</T>} />
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.id - +rowB.id },
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
        <Field className="jk-row pad">
          {tags.map(tag => <div className="jk-tag">{tag}</div>)}
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.tags.length - rowB.tags.length },
      filter: { type: 'select-auto', getValue: () => 'test', options: allTags.map(tag => ({ value: tag, label: tag })) },
      cardPosition: 'bottom',
      minWidth: 200,
    },
  ], [allTags]);
  
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
  
  const { mutate } = useSWRConfig();
  const user = useUserState();
  
  const data: ProblemsTable[] = (response?.list || []).map(user => (
    {
      id: user.id,
      name: user.name,
      tags: user.tags,
      status: user.status,
    } as ProblemsTable
  ));
  
  const request = useCallback(async ({ sort, filter, setLoading }) => {
    setLoading([1, Status.LOADING]);
    await mutate(JUDGE_API_V1.PROBLEM.PROBLEM());
    setLoading([1, Status.SUCCESS]);
  }, []);
  
  const buttonLoaderLink = (route) => async setLoader => {
    const now = new Date().getTime();
    setLoader([now, Status.LOADING]);
    await push(route);
    setLoader([now, Status.SUCCESS]);
  };
  
  return (
    <div>
      <TitleLayout>
        <h3>Problems</h3>
      </TitleLayout>
      <ContentLayout>
        <div className="main-content">
          <DataViewer<ProblemsTable>
            headers={columns}
            data={data}
            rows={{ height: 52 }}
            request={request}
            name="users"
            extraButtons={() => (
              <div className="extra-buttons">
                {can.createProblem(user) && (
                  <ButtonLoader
                    size="small"
                    icon={<PlusIcon />}
                    onClick={buttonLoaderLink(ROUTES.PROBLEMS.CREATE(ProblemTab.STATEMENT))}
                  >
                    <T>create</T>
                  </ButtonLoader>
                )}
              </div>
            )}
            searchParamsObject={searchParamsObject}
            setSearchParamsObject={(params) => push({ query: params })}
          />
        </div>
      </ContentLayout>
    </div>
  );
}

export default Problems;