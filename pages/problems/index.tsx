import {
  Breadcrumbs,
  ButtonLoader,
  CheckIcon,
  CloseIcon,
  Field,
  PagedDataViewer,
  PlusIcon,
  Popover,
  Select,
  T,
  TextField,
  TextHeadCell,
  TwoContentSection,
  UserNicknameLink,
} from 'components';
import { JUDGE, JUDGE_API_V1, PROBLEM_MODE, PROBLEM_MODES, PROBLEM_STATUS, ROUTES } from 'config/constants';
import { buttonLoaderLink, classNames, getProblemJudgeKey, toFilterUrl, toSortUrl } from 'helpers';
import { useFetcher, useJukiUser, useRouter, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ContentsResponseType,
  DataViewerHeadersType,
  FilterSelectOnlineType,
  Judge,
  LastLinkKey,
  ProblemStatus,
  ProblemSummaryListResponseDTO,
  ProblemTab,
  QueryParam,
  RefreshType,
} from 'types';

function Problems() {
  
  useTrackLastPath(LastLinkKey.PROBLEMS);
  useTrackLastPath(LastLinkKey.SECTION_PROBLEM);
  const { user: { canCreateProblem, canHandleJudges } } = useJukiUser();
  const { data: tags } = useFetcher<ContentsResponseType<string>>(JUDGE_API_V1.PROBLEM.TAG_LIST());
  const [ judge, setJudge ] = useState(Judge.JUKI_JUDGE);
  const refreshRef = useRef<RefreshType>();
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
      field: ({ record: { key, judge, name, user }, isCard }) => (
        <Field className={classNames('jk-row fw-bd jk-pad-sm', { left: !isCard, center: isCard })}>
          <Link
            href={judge === Judge.JUKI_JUDGE ? ROUTES.PROBLEMS.VIEW(key, ProblemTab.STATEMENT) : ROUTES.PROBLEMS.VIEW(
              getProblemJudgeKey(judge, key),
              ProblemTab.STATEMENT,
            )}
            className="link"
          >
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
    ...(judge === Judge.JUKI_JUDGE ? [
      {
        head: <TextHeadCell text={<T className="tt-ue tx-s">mode</T>} />,
        index: 'mode',
        field: ({ record: { key, settings: { mode } }, isCard }) => (
          <Field className="jk-row">
            <T className="tt-se">{PROBLEM_MODE[mode].label}</T>
          </Field>
        ),
        sort: true,
        filter: {
          type: 'select',
          options: PROBLEM_MODES.map((problemMode) => ({ value: problemMode, label: PROBLEM_MODE[problemMode].label })),
        },
        cardPosition: 'top',
        minWidth: 140,
      },
    ] as DataViewerHeadersType<ProblemSummaryListResponseDTO>[] : []),
    ...(judge === Judge.JUKI_JUDGE ? [
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
    ] as DataViewerHeadersType<ProblemSummaryListResponseDTO>[] : []),
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
  ], [ canCreateProblem, tags, judge ]);
  
  const { push } = useRouter();
  useEffect(() => {
    refreshRef.current?.();
  }, [ judge ]);
  
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <T className="tt-se">problems</T>,
  ];
  const refresh = useCallback((reload) => refreshRef.current = reload, []);
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="jk-row space-between pad-left-right pad-top-bottom">
          <h2><T>problems</T></h2>
          {canHandleJudges && (
            <div>
              <Select
                className="jk-border-radius-inline jk-button-secondary"
                options={Object.values(JUDGE).map(judge => ({ value: judge.value, label: judge.label }))}
                selectedOption={{ value: judge }}
                onChange={({ value }) => setJudge(value)}
              />
            </div>
          )}
        </div>
      </div>
      <div className="pad-top-bottom pad-left-right">
        <PagedDataViewer<ProblemSummaryListResponseDTO, ProblemSummaryListResponseDTO>
          headers={columns}
          getUrl={({ pagination: { page, pageSize }, filter, sort }) => {
            return JUDGE_API_V1.PROBLEM.LIST(judge, page, pageSize, toFilterUrl(filter), toSortUrl(sort));
          }}
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
          onRecordClick={async ({ isCard, data, index }) => {
            if (isCard) {
              await push({ pathname: ROUTES.PROBLEMS.VIEW(data[index].key, ProblemTab.STATEMENT) });
            }
          }}
          refreshRef={refresh}
        />
      </div>
    </TwoContentSection>
  );
}

export default Problems;
