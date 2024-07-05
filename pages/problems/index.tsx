import {
  ButtonLoader,
  CopyToClipboard,
  CrawlCodeforcesProblemModal,
  CrawlJvumsaProblemModal,
  Field,
  InfoIcon,
  PagedDataViewer,
  PlusIcon,
  Popover,
  ProblemStatus,
  Select,
  T,
  TextField,
  Tooltip,
  TwoContentLayout,
  UserChip,
  VoidIcon,
} from 'components';
import { jukiSettings } from 'config';
import { JUDGE, JUKI_APP_COMPANY_KEY, PROBLEM_MODE, PROBLEM_MODES, PROBLEM_TYPE, ROUTES } from 'config/constants';
import { buttonLoaderLink, classNames, getSimpleProblemJudgeKey, oneTab, toFilterUrl, toSortUrl } from 'helpers';
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
  ContentResponseType,
  DataViewerHeadersType,
  FilterSelectOnlineType,
  Judge,
  LastPathKey,
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
  const { user: { permissions: { problem: { create: canCreateProblem } } }, company: { name, key } } = useJukiUser();
  const { searchParams, setSearchParams } = useJukiRouter();
  const { components: { Link } } = useJukiUI();
  const { pushRoute } = useJukiRouter();
  const { company: { key: companyKey } } = useJukiUser();
  const { data: tags } = useFetcher<ContentResponseType<string[]>>(jukiSettings.API.company.getJudgeProblemTags({ params: { companyKey } }).url);
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
        <Field className="jk-row">
          <CopyToClipboard text={window.location.host + ROUTES.PROBLEMS.VIEW(getSimpleProblemJudgeKey(judge, key), ProblemTab.STATEMENT)}>
            <div>
              <Tooltip content={<T>copy link</T>} placement="top" withPortal>
                <div className="jk-row link tx-s">{key}</div>
              </Tooltip>
            </div>
          </CopyToClipboard>
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
        <Field className={classNames('jk-row jk-pg-sm', { left: !isCard, center: isCard })}>
          <div className="jk-row nowrap">
            <Link href={{ pathname: ROUTES.PROBLEMS.VIEW(getSimpleProblemJudgeKey(judge, key), ProblemTab.STATEMENT) }}>
              <div className="jk-row link fw-bd">{name}</div>
            </Link>
            {(user.tried || user.solved) && <>&nbsp;</>}
            <ProblemStatus {...user} size="small" />
            {user.isManager && (
              <Tooltip
                content={<T className="tt-se ws-np">you are editor</T>}
                placement="top"
                withPortal
              >
                <div className="jk-row tx-s cr-py">
                  &nbsp;<VoidIcon size="small" filledSquare letter="E" />
                </div>
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
            {tags.filter(tag => !!tag).map(tag => <div className="jk-tag gray-6 tx-s" key={tag}><T>{tag}</T></div>)}
          </Field>
        ),
        filter: {
          type: 'select',
          options: (tags?.success ? tags.content : []).map(tag => ({ value: tag, label: <T>{tag}</T> })),
        } as FilterSelectOnlineType,
        cardPosition: 'center',
        minWidth: 250,
      },
    ] as DataViewerHeadersType<ProblemSummaryListResponseDTO>[] : []),
    {
      head: judge === Judge.JUKI_JUDGE || judge === Judge.CUSTOMER ? 'owner' : 'crawler',
      index: 'owner',
      field: ({ record: { owner: { nickname, imageUrl } } }) => (
        <TextField
          className="jk-row"
          text={<UserChip nickname={nickname} imageUrl={imageUrl} companyKey={companyKey} />}
          label={
            <T className="tt-se">{judge === Judge.JUKI_JUDGE || judge === Judge.CUSTOMER ? 'owner' : 'crawler'}</T>}
        />
      ),
      sort: true,
      // filter: { type: 'text' },
      cardPosition: 'bottomRight',
      minWidth: 200,
    } as DataViewerHeadersType<ProblemSummaryListResponseDTO>,
  ], [ tags, judge, Link, companyKey ]);
  
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
          headers={columns}
          getUrl={({ pagination: { page, pageSize }, filter, sort }) => {
            return jukiSettings.API.problem.getSummaryList({
              params: {
                page,
                size: pageSize,
                filterUrl: toFilterUrl({ ...filter, judge }),
                sortUrl: toSortUrl(sort),
              },
            }).url;
          }}
          name={QueryParam.PROBLEMS_TABLE + (JUDGE_C[judge] || '')}
          refreshInterval={60000}
          extraNodes={extraNodes}
          cards={{ height: 256, expanded: true }}
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
