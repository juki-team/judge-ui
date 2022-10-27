import { ButtonLoader, ContentLayout, DataViewer, Field, PlusIcon, T, TextField, TextHeadCell } from 'components';
import { PROBLEM_STATUS, ROUTES } from 'config/constants';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { buttonLoaderLink, searchParamsObjectTypeToQuery } from 'helpers';
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
import { CheckIcon, CloseIcon, Popover } from '../../components';

function Problems() {
  
  const { canCreateProblem } = useUserState();
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
      head: <TextHeadCell text={<T className="tt-ue">id</T>} />,
      index: 'id',
      field: ({ record: { key }, isCard }) => (
        <Field className="jk-row link fw-bd">
          <Link href={ROUTES.PROBLEMS.VIEW(key, ProblemTab.STATEMENT)}>
            {key}
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
      field: ({ record: { key, name, user } }) => (
        <Field className="jk-row link fw-bd">
          <Link href={ROUTES.PROBLEMS.VIEW(key, ProblemTab.STATEMENT)}>
            <div className="jk-row gap">
              {name}
              {user.solved ? (
                <Popover
                  content={<T className="tt-se ws-np">solved</T>}
                  placement="top"
                  showPopperArrow
                >
                  <div className="jk-row"><CheckIcon size="small" filledCircle className="cr-ss" /></div>
                </Popover>
              ) : user.tried && (
                <Popover
                  content={<T className="tt-se ws-np">tried</T>}
                  placement="top"
                  showPopperArrow
                >
                  <div className="jk-row"><CloseIcon size="small" filledCircle className="cr-wg" /></div>
                </Popover>
              )}
              {user.isEditor && (
                <Popover
                  content={<T className="tt-se ws-np">you are editor</T>}
                  placement="top"
                  showPopperArrow
                >
                  <div className="jk-tag tx-s fw-bd letter-tag">E</div>
                </Popover>
              )}
            </div>
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
          {tags.map(tag => !!tag && <div className="jk-tag gray-6 tx-s">{tag}</div>)}
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.tags.length - rowB.tags.length },
      filter: {
        type: 'select',
        options: allTags.filter(tag => !!tag).sort((a, b) => a.localeCompare(b)).map(tag => ({ value: tag, label: tag })),
        callbackFn: ({ selectedOptions }) => ({ tags }) => tags.some(tag => selectedOptions.some(({ value }) => value === tag)),
      } as FilterSelectOfflineType<ProblemSummaryListResponseDTO>,
      cardPosition: 'center',
      minWidth: 250,
    },
    ...(canCreateProblem ? [
      {
        head: <TextHeadCell text={<T>visibility</T>} />,
        index: 'status',
        field: ({ record: { status } }) => (
          <TextField
            text={<T className="tt-ce">{PROBLEM_STATUS[status].label}</T>}
            label={<T className="tt-ue">visibility</T>}
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
            label: <T className="tt-ce">{PROBLEM_STATUS[status].label}</T>,
          })),
        },
        cardPosition: 'bottom',
        minWidth: 200,
      } as DataViewerHeadersType<ProblemSummaryListResponseDTO>,
    ] : []),
  ], [canCreateProblem, allTags]);
  
  const { queryObject, push } = useRouter();
  
  const data: ProblemSummaryListResponseDTO[] = (response?.success ? response.contents : []);
  
  return (
    <ContentLayout>
      <DataViewer<ProblemSummaryListResponseDTO>
        headers={columns}
        data={data}
        rows={{ height: 64 }}
        request={request}
        setLoaderStatusRef={setLoaderStatusRef}
        name="users"
        extraButtons={[
          ...(canCreateProblem ? [
            <ButtonLoader
              size="small"
              icon={<PlusIcon />}
              onClick={buttonLoaderLink(() => push(ROUTES.PROBLEMS.CREATE()))}
            >
              <T>create</T>
            </ButtonLoader>,
          ] : []),
        ]}
        searchParamsObject={queryObject}
        setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
      />
    </ContentLayout>
  );
}

export default Problems;