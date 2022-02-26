import { useMemo } from 'react';
import {
  ButtonLoader,
  ContentLayout,
  DataViewer,
  DataViewerHeadersType,
  Field,
  FilterSelectOfflineType,
  PlusIcon,
  T,
  TextField,
  TextHeadCell,
  TitleLayout,
} from '../components';
import { PROBLEM_STATUS, ROUTES } from '../config/constants';
import { buttonLoaderLink, can, searchParamsObjectTypeToQuery } from '../helpers';
import { useFetcher, useRequestLoader, useRouter } from '../hooks';
import { JUDGE_API_V1 } from '../services/judge';
import { useUserState } from '../store';
import { ProblemStatus, ProblemTab } from '../types';

type ProblemsTable = {
  id: number,
  name: string,
  tags: string[],
  status: ProblemStatus,
}

function Problems() {
  
  const { data: response } = useFetcher(JUDGE_API_V1.PROBLEM.PROBLEM());
  const user = useUserState();
  
  const tags = new Set<string>();
  (response?.list || []).forEach(problem => {
    problem.tags.forEach(tag => tags.add(tag));
  });
  
  const allTags: string[] = Array.from(tags);
  
  const columns: DataViewerHeadersType<ProblemsTable>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="text-uppercase">id</T>} />,
      index: 'id',
      field: ({ record: { id } }) => (
        <TextField text={id} label={<T className="text-uppercase">id</T>} />
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.id - +rowB.id },
      filter: {
        type: 'text-auto',
        getValue: ({ record: { id } }) => '' + id,
      },
      cardPosition: 'topLeft',
      minWidth: 100,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">problem name</T>} />,
      index: 'name',
      field: ({ record: { name } }) => (
        <TextField text={name} label={<T className="text-uppercase">problem name</T>} />
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.name.localeCompare(rowB.name) },
      filter: { type: 'text-auto' },
      cardPosition: 'center',
      minWidth: 300,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">tags</T>} />,
      index: 'tags',
      field: ({ record: { tags } }) => (
        <Field className="jk-row pad">
          {tags.map(tag => <div className="jk-tag">{tag}</div>)}
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.tags.length - rowB.tags.length },
      filter: {
        type: 'select',
        options: allTags.map(tag => ({ value: tag, label: tag })),
        callbackFn: ({ selectedOptions }) => ({ tags }) => tags.some(tag => selectedOptions.some(({ value }) => value === tag)),
      } as FilterSelectOfflineType<ProblemsTable>,
      cardPosition: 'bottom',
      minWidth: 200,
    },
    ...(can.viewStatusProblem(user) ? [
      {
        head: <TextHeadCell text={<T className="text-uppercase">visibility</T>} />,
        index: 'status',
        field: ({ record: { status } }) => (
          <TextField
            text={<T className="text-capitalize">{PROBLEM_STATUS[status].print}</T>}
            label={<T className="text-uppercase">visibility</T>}
          />
        ),
        sort: { compareFn: () => (rowA, rowB) => rowB.status.localeCompare(rowA.status) },
        filter: {
          type: 'select-auto',
          options: ([
            ProblemStatus.ARCHIVED,
            ProblemStatus.RESERVED,
            ProblemStatus.PRIVATE,
            ProblemStatus.PUBLIC,
          ] as ProblemStatus[]).map(status => ({
            value: status,
            label: <T className="text-capitalize">{PROBLEM_STATUS[status].print}</T>,
          })),
        },
        cardPosition: 'topRight',
        minWidth: 200,
      } as DataViewerHeadersType<ProblemsTable>,
    ] : []),
  ], [user, allTags]);
  
  const { queryObject, push } = useRouter();
  
  const request = useRequestLoader(JUDGE_API_V1.PROBLEM.PROBLEM());
  
  const data: ProblemsTable[] = (response?.list || []).map(user => (
    {
      id: user.id,
      name: user.name,
      tags: user.tags,
      status: user.status,
    } as ProblemsTable
  ));
  
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
            rows={{ height: 64 }}
            request={request}
            name="users"
            extraButtons={() => (
              <div className="extra-buttons">
                {can.createProblem(user) && (
                  <ButtonLoader
                    size="small"
                    icon={<PlusIcon />}
                    onClick={buttonLoaderLink(() => push(ROUTES.PROBLEMS.CREATE(ProblemTab.STATEMENT)))}
                  >
                    <T>create</T>
                  </ButtonLoader>
                )}
              </div>
            )}
            searchParamsObject={queryObject}
            setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
          />
        </div>
      </ContentLayout>
    </div>
  );
}

export default Problems;