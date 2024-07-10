import {
  getProblemKeyIdHeader,
  getProblemModeHeader,
  getProblemNameHeader,
  getProblemOwnerHeader,
  getProblemTagsHeader,
  getProblemTypeHeader,
  ProblemDataViewerType,
  toProblemDataViewer,
} from '@juki-team/base-ui';
import {
  ButtonLoader,
  CrawlCodeforcesProblemModal,
  CrawlJvumsaProblemModal,
  InfoIcon,
  PagedDataViewer,
  PlusIcon,
  Popover,
  Select,
  T,
  TwoContentLayout,
} from 'components';
import { jukiSettings } from 'config';
import { JUDGE, JUKI_APP_COMPANY_KEY } from 'config/constants';
import { buttonLoaderLink, oneTab, toFilterUrl, toSortUrl } from 'helpers';
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
  Judge,
  LastPathKey,
  ProblemSummaryListResponseDTO,
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
  const { data } = useFetcher<ContentResponseType<string[]>>(jukiSettings.API.company.getJudgeProblemTags({ params: { companyKey } }).url);
  const tags = useMemo(() => data?.success ? data.content : [], [ data ]);
  const judge: Judge = searchParams.get(QueryParam.JUDGE) as Judge;
  useEffect(() => {
    if (!judge) {
      setSearchParams({ name: QueryParam.JUDGE, value: Judge.CUSTOMER });
    }
  }, [ judge, setSearchParams ]);
  const columns: DataViewerHeadersType<ProblemDataViewerType>[] = useMemo(() => [
    getProblemKeyIdHeader(false),
    getProblemNameHeader(),
    ...((judge === Judge.JUKI_JUDGE || judge === Judge.CUSTOMER) ? [
      getProblemModeHeader(),
      getProblemTypeHeader(),
      getProblemTagsHeader(tags),
    ] : []),
    getProblemOwnerHeader(judge !== Judge.JUKI_JUDGE && judge !== Judge.CUSTOMER),
  ], [ tags, judge ]);
  
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
        onClick={buttonLoaderLink(() => pushRoute(jukiSettings.ROUTES.judge().problems.new()))}
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
        <PagedDataViewer<ProblemDataViewerType, ProblemSummaryListResponseDTO>
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
          toRow={toProblemDataViewer}
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
