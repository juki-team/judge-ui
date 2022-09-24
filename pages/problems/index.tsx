import { ContentLayout, DataViewer, Field, T, TextField, TextHeadCell } from 'components';
import { PROBLEM_STATUS, ROUTES } from 'config/constants';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester, useRouter } from 'hooks';
import Link from 'next/link';
import { useMemo } from 'react';
import { useUserState } from 'store';
import {
  ContentsResponseType,
  DataViewerHeadersType,
  FilterSelectOfflineType,
  ProblemStatus,
  ProblemSummaryListResponseDTO,
  ProblemTab,
} from 'types';

function Problems() {
  
  const user = useUserState();
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<ProblemSummaryListResponseDTO>>(JUDGE_API_V1.PROBLEM.LIST());
  
  const tags = new Set<string>();
  (response?.success ? response.contents : []).forEach(problem => {
    problem.tags.forEach(tag => tags.add(tag));
  });
  
  const allTags: string[] = Array.from(tags);
  
  const columns: DataViewerHeadersType<ProblemSummaryListResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="text-uppercase">id</T>} />,
      index: 'id',
      field: ({ record: { key }, isCard }) => (
        <Field className="jk-row link text-semi-bold">
          <Link href={ROUTES.PROBLEMS.VIEW(key, ProblemTab.STATEMENT)}>
            <a>{key}</a>
          </Link>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.key - +rowB.key },
      filter: { type: 'text-auto' },
      cardPosition: 'top',
      minWidth: 100,
    },
    {
      head: <TextHeadCell text={<T>problem name</T>} />,
      index: 'name',
      field: ({ record: { key, name } }) => (
        <Field className="jk-row link text-semi-bold">
          <Link href={ROUTES.PROBLEMS.VIEW( key, ProblemTab.STATEMENT)}>
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
      } as FilterSelectOfflineType<ProblemSummaryListResponseDTO>,
      cardPosition: 'center',
      minWidth: 400,
    },
    ...(user.canCreateProblem ? [ /* TODO: create a special permissions for this */
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
      } as DataViewerHeadersType<ProblemSummaryListResponseDTO>,
    ] : []),
  ], [user, allTags]);
  
  const { queryObject, push } = useRouter();
  
  const data: ProblemSummaryListResponseDTO[] = (response?.success ? response.contents : [])
  
  return (
    <ContentLayout>
      <DataViewer<ProblemSummaryListResponseDTO>
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