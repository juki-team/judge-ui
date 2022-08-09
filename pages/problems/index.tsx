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
import { useDataViewerRequester, useRouter } from 'hooks';
import Link from 'next/link';
import { useMemo } from 'react';
import { useUserState } from 'store';
import { ContentsResponseType, ProblemStatus, ProblemTab } from 'types';

type ProblemsTable = {
  id: number,
  name: string,
  tags: string[],
  status: ProblemStatus,
}

function Problems() {
  
  const user = useUserState();
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<any>>(JUDGE_API_V1.PROBLEM.PROBLEM());
  
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
        <Field className="jk-row link text-semi-bold">
          <Link href={ROUTES.PROBLEMS.VIEW('' + id, ProblemTab.STATEMENT)}>
            <a>{id}</a>
          </Link>
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
      head: <TextHeadCell text={<T>problem name</T>} />,
      index: 'name',
      field: ({ record: { id, name } }) => (
        <Field className="jk-row link text-semi-bold">
          <Link href={ROUTES.PROBLEMS.VIEW('' + id, ProblemTab.STATEMENT)}>
            <a>{name}</a>
          </Link>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.name.localeCompare(rowB.name) },
      filter: { type: 'text-auto' },
      cardPosition: 'top',
      minWidth: 300,
    },
    {
      head: <TextHeadCell text={<T>tags</T>} />,
      index: 'tags',
      field: ({ record: { tags } }) => (
        <Field className="jk-row left gap">
          {tags.map(tag => !!tag && <div className="jk-tag gray-6 text-s">{tag}</div>)}
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
        head: <TextHeadCell text={<T>visibility</T>} />,
        index: 'status',
        field: ({ record: { status } }) => (
          <TextField
            text={<T className="text-capitalize">{PROBLEM_STATUS[status].label}</T>}
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
            label: <T className="text-capitalize">{PROBLEM_STATUS[status].label}</T>,
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
      <DataViewer<ProblemsTable>
        headers={columns}
        data={data}
        rows={{ height: 64 }}
        request={request}
        setLoaderStatusRef={setLoaderStatusRef}
        name="users"
        // extraButtons={() => (
        //   <div className="extra-buttons">
        //     {can.createProblem(user) && (
        //       <ButtonLoader
        //         size="small"
        //         icon={<PlusIcon />}
        //         onClick={buttonLoaderLink(() => push(ROUTES.PROBLEMS.CREATE(ProblemTab.STATEMENT)))}
        //       >
        //         <T>create</T>
        //       </ButtonLoader>
        //     )}
        //   </div>
        // )}
        searchParamsObject={queryObject}
        setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
      />
    </ContentLayout>
  );
}

export default Problems;