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
} from 'components';
import { PROBLEM_STATUS, ROUTES } from 'config/constants';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { buttonLoaderLink, can, searchParamsObjectTypeToQuery } from 'helpers';
import { useRequester, useRouter } from 'hooks';
import { useMemo } from 'react';
import { useUserState } from 'store';
import { ProblemStatus, ProblemTab } from 'types';
import { ContentsResponseType } from '../types';

type ProblemsTable = {
  id: number,
  name: string,
  tags: string[],
  status: ProblemStatus,
}

function Problems() {
  
  const user = useUserState();
  const { data: response, refresh } = useRequester<ContentsResponseType<any>>(JUDGE_API_V1.PROBLEM.PROBLEM());
  
  const tags = new Set<string>();
  (response?.success ? response.contents : []).forEach(problem => {
    problem.tags.forEach(tag => tags.add(tag));
  });
  
  const allTags: string[] = Array.from(tags);
  
  const columns: DataViewerHeadersType<ProblemsTable>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="text-uppercase">id</T>} />,
      index: 'id',
      field: ({ record: { id }, isCard }) => (
        <Field className="jk-row jk-link text-semi-bold" onClick={() => push(ROUTES.PROBLEMS.VIEW('' + id, ProblemTab.STATEMENT))}>
          {id}
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.id - +rowB.id },
      filter: {
        type: 'text-auto',
        getValue: ({ record: { id } }) => '' + id,
      },
      cardPosition: 'top',
      minWidth: 100,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">problem name</T>} />,
      index: 'name',
      field: ({ record: { id, name } }) => (
        <Field className="jk-row jk-link text-semi-bold" onClick={() => push(ROUTES.PROBLEMS.VIEW('' + id, ProblemTab.STATEMENT))}>
          {name}
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.name.localeCompare(rowB.name) },
      filter: { type: 'text-auto' },
      cardPosition: 'top',
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
      cardPosition: 'center',
      minWidth: 400,
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
        cardPosition: 'bottom',
        minWidth: 200,
      } as DataViewerHeadersType<ProblemsTable>,
    ] : []),
  ], [user, allTags]);
  
  const { queryObject, push } = useRouter();
  
  const data: ProblemsTable[] = (response?.success ? response.contents : []).map(user => (
    {
      id: user.id,
      name: user.name,
      tags: user.tags,
      status: user.status,
    } as ProblemsTable
  ));
  
  return (
    <ContentLayout>
      {/* <TitleLayout>
       <h3>Problems</h3>
       </TitleLayout> */}
      <DataViewer<ProblemsTable>
        headers={columns}
        data={data}
        rows={{ height: 64 }}
        request={refresh}
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
    </ContentLayout>
  );
}

export default Problems;