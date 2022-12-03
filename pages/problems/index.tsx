import { ButtonLoader, CheckIcon, CloseIcon, ContentLayout, Field, PagedDataViewer, PlusIcon, Popover, T, TextField, TextHeadCell } from 'components';
import { PROBLEM_STATUS, QueryParam, ROUTES } from 'config/constants';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { buttonLoaderLink, toFilterUrl, toSortUrl } from 'helpers';
import { useFetcher, useRouter } from 'hooks';
import Link from 'next/link';
import { useMemo } from 'react';
import { useUserState } from 'store';
import { ContentsResponseType, DataViewerHeadersType, FilterSelectOnlineType, GetUrl, ProblemStatus, ProblemSummaryListResponseDTO, ProblemTab } from 'types';

function Problems() {
  
  const { canCreateProblem } = useUserState();
  const { data: tags } = useFetcher<ContentsResponseType<string>>(JUDGE_API_V1.PROBLEM.TAG_LIST());
  const columns: DataViewerHeadersType<ProblemSummaryListResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue">id</T>} />,
      index: 'key',
      field: ({ record: { key }, isCard }) => (
        <Field className="jk-row link fw-bd">
          <Link href={ROUTES.PROBLEMS.VIEW(key, ProblemTab.STATEMENT)}>
            {key}
          </Link>
        </Field>
      ),
      sort: true,
      filter: { type: 'text' },
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
      sort: true,
      filter: { type: 'text' },
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
      filter: {
        type: 'select',
        options: (tags?.success ? tags.contents : []).map(tag => ({ value: tag, label: tag })),
      } as FilterSelectOnlineType,
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
        sort: true,
        filter: {
          type: 'select',
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
  ], [canCreateProblem, tags]);
  
  const { push } = useRouter();
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => (
    JUDGE_API_V1.PROBLEM.LIST(page, pageSize, toFilterUrl(filter), toSortUrl(sort))
  );
  
  return (
    <ContentLayout>
      <PagedDataViewer<ProblemSummaryListResponseDTO, ProblemSummaryListResponseDTO>
        headers={columns}
        url={url}
        name={QueryParam.PROBLEMS_TABLE}
        refreshInterval={60000}
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
      />
    </ContentLayout>
  );
}

export default Problems;