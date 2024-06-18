import { oneTab, TwoContentLayout } from '@juki-team/base-ui';
import {
  ButtonLoader,
  CheckIcon,
  CloseIcon,
  CrawlCodeforcesProblemModal,
  CrawlJvumsaProblemModal,
  Field,
  InfoIcon,
  PagedDataViewer,
  PlusIcon,
  Popover,
  Select,
  T,
  TextField,
  Tooltip,
  UserNicknameLink,
} from 'components';
import {
  JUDGE,
  JUDGE_API_V1,
  JUKI_APP_COMPANY_KEY,
  PROBLEM_MODE,
  PROBLEM_MODES,
  PROBLEM_STATUS,
  PROBLEM_TYPE,
  ROUTES,
} from 'config/constants';
import { buttonLoaderLink, classNames, getSimpleProblemJudgeKey, toFilterUrl, toSortUrl } from 'helpers';
import {
  useEffect,
  useFetcher,
  useJukiRouter,
  useJukiUI,
  useJukiUser,
  useMemo,
  useState,
  useTrackLastPath,
} from 'hooks';
import {
  ContentsResponseType,
  DataViewerHeadersType,
  FilterSelectOnlineType,
  Judge,
  LastPathKey,
  ProblemStatus,
  ProblemSummaryListResponseDTO,
  ProblemTab,
  ProblemType,
  QueryParam,
  ReactNode,
} from 'types';

const JUDGE_C: { [key in Judge]: string } = {
  [Judge.CUSTOMER]: 'c',
  [Judge.JUKI_JUDGE]: 'j',
  [Judge.CODEFORCES]: 'f',
  [Judge.CODEFORCES_GYM]: 'g',
  [Judge.UVA_ONLINE_JUDGE]: 'u',
  [Judge.AT_CODER]: 'a',
  [Judge.CODECHEF]: 'h',
  [Judge.TOPCODER]: 't',
  [Judge.JV_UMSA]: 'm',
};

function Problems() {
  
  useTrackLastPath(LastPathKey.PROBLEMS);
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);
  const { user: { canCreateProblem }, company: { name, key } } = useJukiUser();
  const { searchParams, setSearchParams } = useJukiRouter();
  const { components: { Link } } = useJukiUI();
  const { pushRoute } = useJukiRouter();
  const { data: tags } = useFetcher<ContentsResponseType<string>>(JUDGE_API_V1.PROBLEM.TAG_LIST());
  const judge: Judge = searchParams.get(QueryParam.JUDGE) as Judge;
  useEffect(() => {
    if (!judge) {
      setSearchParams({ name: QueryParam.JUDGE, value: Judge.CUSTOMER });
    }
  }, [ judge, setSearchParams ]);
  const columns: DataViewerHeadersType<ProblemSummaryListResponseDTO>[] = useMemo(() => [
    {
      head: 'id',
      index: 'key',
      field: ({ record: { key }, isCard }) => (
        <Field className="jk-row fw-bd cr-py">
          <Link href={{ pathname: ROUTES.PROBLEMS.VIEW(getSimpleProblemJudgeKey(judge, key), ProblemTab.STATEMENT) }}>
            <div className="jk-row link">{key}</div>
          </Link>
        </Field>
      ),
      sort: true,
      filter: { type: 'text' },
      cardPosition: 'top',
      sticky: true,
    },
    {
      head: 'problem name',
      headClassName: 'left',
      index: 'name',
      field: ({ record: { key, judge, name, user }, isCard }) => (
        <Field className={classNames('jk-row fw-bd jk-pg-sm cr-py', { left: !isCard, center: isCard })}>
          <div className="jk-row gap nowrap">
            <Link href={{ pathname: ROUTES.PROBLEMS.VIEW(getSimpleProblemJudgeKey(judge, key), ProblemTab.STATEMENT) }}>
              <div className="jk-row link">{name}</div>
            </Link>
            {user.solved ? (
              <Tooltip
                content={<T className="tt-se ws-np">solved</T>}
                placement="top"
              >
                <div className="jk-row"><CheckIcon size="small" filledCircle className="cr-ss" /></div>
              </Tooltip>
            ) : user.tried && (
              <Tooltip
                content={<T className="tt-se ws-np">tried</T>}
                placement="top"
              >
                <div className="jk-row"><CloseIcon size="small" filledCircle className="cr-wg" /></div>
              </Tooltip>
            )}
            {user.isEditor && (
              <Tooltip
                content={<T className="tt-se ws-np">you are editor</T>}
                placement="top"
              >
                <div className="jk-tag tx-s fw-bd letter-tag">E</div>
              </Tooltip>
            )}
          </div>
        </Field>
      ),
      sort: true,
      filter: { type: 'text' },
      cardPosition: 'center',
      minWidth: 300,
    },
    ...((judge === Judge.JUKI_JUDGE || judge === Judge.CUSTOMER) ? [
      {
        head: 'mode',
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
      },
      {
        head: 'type',
        index: 'type',
        field: ({ record: { key, settings: { type } }, isCard }) => (
          <Field className="jk-row">
            <T className="tt-se">{PROBLEM_TYPE[type].label}</T>
          </Field>
        ),
        sort: true,
        filter: {
          type: 'select',
          options: [ ProblemType.STANDARD, ProblemType.DYNAMIC ].map((problemType) => ({
            value: problemType,
            label: PROBLEM_TYPE[problemType].label,
          })),
        },
        cardPosition: 'top',
        minWidth: 100,
      },
      {
        head: 'tags',
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
    {
      head: judge === Judge.JUKI_JUDGE || judge === Judge.CUSTOMER ? 'owner' : 'crawler',
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
    ...(canCreateProblem ? [
      {
        head: 'visibility',
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
    ] : []),
  ], [ canCreateProblem, tags, judge, Link ]);
  
  const breadcrumbs = [
    <T className="tt-se" key="problems">problems</T>,
  ];
  
  const extraNodes = [];
  if (canCreateProblem && judge === Judge.CUSTOMER) {
    extraNodes.push(
      <ButtonLoader
        size="small"
        icon={<PlusIcon />}
        responsiveMobile
        onClick={buttonLoaderLink(() => pushRoute(ROUTES.PROBLEMS.CREATE()))}
      >
        <T>create</T>
      </ButtonLoader>,
    );
  }
  const [ modal, setModal ] = useState<ReactNode>(null);
  if ([ Judge.CODEFORCES, Judge.JV_UMSA, Judge.CODEFORCES_GYM ].includes(judge)) {
    extraNodes.push(
      <div className="jk-row gap">
        {modal}
        <ButtonLoader
          size="small"
          icon={<PlusIcon />}
          responsiveMobile
          onClick={() => {
            if (judge === Judge.CODEFORCES) {
              setModal(<CrawlCodeforcesProblemModal isOpen judge={Judge.CODEFORCES} onClose={() => setModal(null)} />);
            }
            if (judge === Judge.JV_UMSA) {
              setModal(<CrawlJvumsaProblemModal isOpen onClose={() => setModal(null)} />);
            }
            if (judge === Judge.CODEFORCES_GYM) {
              setModal(
                <CrawlCodeforcesProblemModal
                  isOpen
                  judge={Judge.CODEFORCES_GYM}
                  onClose={() => setModal(null)}
                />,
              );
            }
          }}
        >
          <T>crawl</T>
        </ButtonLoader>
      </div>,
    );
  }
  
  return (
    <TwoContentLayout
      breadcrumbs={breadcrumbs}
      tabs={oneTab(judge && (
        <PagedDataViewer<ProblemSummaryListResponseDTO, ProblemSummaryListResponseDTO>
          getRecordStyle={() => ({ cursor: 'pointer' })}
          headers={columns}
          getUrl={({ pagination: { page, pageSize }, filter, sort }) => {
            return JUDGE_API_V1.PROBLEM.LIST(judge, page, pageSize, toFilterUrl(filter), toSortUrl(sort));
          }}
          name={QueryParam.PROBLEMS_TABLE + (JUDGE_C[judge] || '')}
          refreshInterval={60000}
          extraNodes={extraNodes}
          cards={{ height: 256, expanded: true }}
          // onRecordClick={async ({ data, index }) => {
          //   if (window?.getSelection()?.type !== 'Range') {
          //     await pushRoute({ pathname: ROUTES.PROBLEMS.VIEW(getSimpleProblemJudgeKey(judge, data[index].key), ProblemTab.STATEMENT) });
          //   }
          // }}
          dependencies={[ judge ]}
        />
      ))}
    >
      <div className="jk-row space-between extend pn-re">
        <div className="jk-row gap">
          <h2><T>problems</T></h2>
          {[ Judge.CODEFORCES, Judge.JV_UMSA ].includes(judge) && (
            <Popover
              content={<div><T className="tt-se">only tracked problems are displayed</T></div>}
              placement="bottom"
            >
              <div><InfoIcon /></div>
            </Popover>
          )}
        </div>
        <div style={{ width: 200 }}>
          <Select
            className="jk-border-radius-inline jk-button secondary"
            options={[
              { value: Judge.CUSTOMER, label: <span className="ws-np">{name + ' judge'}</span> },
              ...(key === JUKI_APP_COMPANY_KEY ? [] : [
                {
                  value: Judge.JUKI_JUDGE,
                  label: <span className="ws-np">{JUDGE[Judge.JUKI_JUDGE].label}</span>,
                },
              ]),
              { value: Judge.CODEFORCES, label: <>{JUDGE[Judge.CODEFORCES].label}</> },
              { value: Judge.CODEFORCES_GYM, label: <>{JUDGE[Judge.CODEFORCES_GYM].label}</> },
              { value: Judge.JV_UMSA, label: <>{JUDGE[Judge.JV_UMSA].label}</> },
            ]}
            selectedOption={{ value: judge }}
            onChange={({ value }) => setSearchParams({ name: QueryParam.JUDGE, value })}
            extend
          />
        </div>
      </div>
    </TwoContentLayout>
  );
}

export default Problems;
