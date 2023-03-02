import {
  Breadcrumbs,
  ButtonLoader,
  CheckIcon,
  CloseIcon,
  Field,
  PagedDataViewer,
  PlusIcon,
  Popover,
  T,
  TextField,
  TextHeadCell,
  TwoContentSection,
  UserNicknameLink,
} from 'components';
import { PROBLEM_STATUS, ROUTES } from 'config/constants';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { buttonLoaderLink, classNames, toFilterUrl, toSortUrl } from 'helpers';
import { useFetcher, useJukiUser, useRouter, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import React, { useMemo } from 'react';
import {
  ContentsResponseType,
  DataViewerHeadersType,
  FilterSelectOnlineType,
  GetUrl,
  LastLinkKey,
  ProblemStatus,
  ProblemSummaryListResponseDTO,
  ProblemTab,
  QueryParam,
} from 'types';

function Problems() {
  
  useTrackLastPath(LastLinkKey.PROBLEMS);
  useTrackLastPath(LastLinkKey.SECTION_PROBLEM);
  const { user: { canCreateProblem } } = useJukiUser();
  const { data: tags } = useFetcher<ContentsResponseType<string>>(JUDGE_API_V1.PROBLEM.TAG_LIST());
  const columns: DataViewerHeadersType<ProblemSummaryListResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">id</T>} />,
      index: 'key',
      field: ({ record: { key }, isCard }) => (
        <Field className="jk-row fw-bd">
          <Link href={ROUTES.PROBLEMS.VIEW(key, ProblemTab.STATEMENT)} className="link">
            {key}
          </Link>
        </Field>
      ),
      sort: true,
      filter: { type: 'text' },
      cardPosition: 'top',
      minWidth: 120,
    },
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">problem name</T>} className="left" />,
      index: 'name',
      field: ({ record: { key, name, user }, isCard }) => (
        <Field className={classNames('jk-row fw-bd jk-pad-sm', { left: !isCard, center: isCard })}>
          <Link href={ROUTES.PROBLEMS.VIEW(key, ProblemTab.STATEMENT)} className="link">
            <div className="jk-row gap nowrap">
              <div className="jk-row">{name}</div>
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
      cardPosition: 'center',
      minWidth: 300,
    },
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">tags</T>} className="left" />,
      index: 'tags',
      field: ({ record: { tags }, isCard }) => (
        <Field className={classNames('jk-row gap', { center: isCard, left: !isCard })}>
          {tags.filter(tag => !!tag).map(tag => <div className="jk-tag gray-6 tx-s" key={tag}>{tag}</div>)}
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
        head: <TextHeadCell text={<T className="tt-ue tx-s">visibility</T>} />,
        index: 'status',
        field: ({ record: { status } }) => (
          <TextField
            text={<T className="tt-se">{PROBLEM_STATUS[status].label}</T>}
            label={<T className="tt-se">visibility</T>}
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
            label: <T className="tt-se">{PROBLEM_STATUS[status].label}</T>,
          })),
        },
        cardPosition: 'bottomLeft',
        minWidth: 180,
      } as DataViewerHeadersType<ProblemSummaryListResponseDTO>,
      {
        head: <TextHeadCell text={<T className="tt-ue tx-s">owner</T>} />,
        index: 'ownerUserNickname',
        field: ({ record: { ownerUserNickname } }) => (
          <TextField
            className="jk-row"
            text={
              <UserNicknameLink nickname={ownerUserNickname}>
                <div className="link">{ownerUserNickname}</div>
              </UserNicknameLink>
            }
            label={<T className="tt-se">nickname</T>}
          />
        ),
        sort: true,
        filter: { type: 'text-auto' },
        cardPosition: 'bottomRight',
        minWidth: 200,
      } as DataViewerHeadersType<ProblemSummaryListResponseDTO>,
    ] : []),
  ], [canCreateProblem, tags]);
  
  const { push } = useRouter();
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => (
    JUDGE_API_V1.PROBLEM.LIST(page, pageSize, toFilterUrl(filter), toSortUrl(sort))
  );
  
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <T className="tt-se">problems</T>,
  ];
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right pad-top-bottom">
          <h1><T>problems</T></h1>
        </div>
      </div>
      <div className="pad-top-bottom pad-left-right">
        <PagedDataViewer<ProblemSummaryListResponseDTO, ProblemSummaryListResponseDTO>
          headers={columns}
          url={url}
          name={QueryParam.PROBLEMS_TABLE}
          refreshInterval={60000}
          extraNodes={[
            ...(canCreateProblem ? [
              <ButtonLoader
                size="small"
                icon={<PlusIcon />}
                responsiveMobile
                onClick={buttonLoaderLink(() => push(ROUTES.PROBLEMS.CREATE()))}
              >
                <T>create</T>
              </ButtonLoader>,
            ] : []),
          ]}
          cards={{ height: 256, expanded: true }}
        />
      </div>
    </TwoContentSection>
  );
}

export default Problems;
