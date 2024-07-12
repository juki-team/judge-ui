import {
  ButtonLoader,
  CrawlCodeforcesProblemModal,
  CrawlJvumsaProblemModal,
  getProblemKeyHeader,
  getProblemModeHeader,
  getProblemNameHeader,
  getProblemOwnerHeader,
  getProblemTagsHeader,
  getProblemTypeHeader,
  InfoIcon,
  PagedDataViewer,
  PlusIcon,
  Popover,
  Select,
  T,
  TwoContentLayout,
} from 'components';
import { jukiSettings } from 'config';
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
  JudgeDataResponseDTO,
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
  const { data } = useFetcher<ContentResponseType<JudgeDataResponseDTO[]>>(jukiSettings.API.company.getJudgeList().url);
  const judgeKey: Judge = searchParams.get(QueryParam.JUDGE) as Judge;
  const tags = useMemo(() => data?.success ? (data.content.find(j => j.key === judgeKey)?.problemTags || []) : [], [ data, judgeKey ]);
  const judges = (data?.success ? data.content : []).map(judge => ({
    value: judge.key,
    label: judge.key,
  }));
  const firstJudgeKey = judges[0]?.value;
  useEffect(() => {
    if (!judgeKey && firstJudgeKey) {
      setSearchParams({ name: QueryParam.JUDGE, value: firstJudgeKey });
    }
  }, [ judgeKey, setSearchParams, firstJudgeKey ]);
  const columns: DataViewerHeadersType<ProblemSummaryListResponseDTO>[] = useMemo(() => [
    getProblemKeyHeader(),
    getProblemNameHeader(false),
    ...((judgeKey === Judge.JUKI_JUDGE || judgeKey === Judge.CUSTOMER) ? [
      getProblemModeHeader(),
      getProblemTypeHeader(),
      getProblemTagsHeader(tags),
    ] : []),
    getProblemOwnerHeader(judgeKey !== Judge.JUKI_JUDGE && judgeKey !== Judge.CUSTOMER),
  ], [ tags, judgeKey ]);
  
  const breadcrumbs = [
    <T className="tt-se" key="problems">problems</T>,
  ];
  
  const extraNodes = [];
  if (canCreateProblem && judgeKey === Judge.CUSTOMER) {
    extraNodes.push(
      <ButtonLoader
        size="small"
        icon={<PlusIcon />}
        responsiveMobile
        onClick={buttonLoaderLink(() => pushRoute(jukiSettings.ROUTES.problems().new()))}
      >
        <T>create</T>
      </ButtonLoader>,
    );
  }
  const [ modal, setModal ] = useState<ReactNode>(null);
  if ([ Judge.CODEFORCES, Judge.JV_UMSA, Judge.CODEFORCES_GYM ].includes(judgeKey)) {
    extraNodes.push(
      <div className="jk-row gap">
        {modal}
        <ButtonLoader
          size="small"
          icon={<PlusIcon />}
          responsiveMobile
          onClick={() => {
            if (judgeKey === Judge.CODEFORCES) {
              setModal(<CrawlCodeforcesProblemModal isOpen judge={Judge.CODEFORCES} onClose={() => setModal(null)} />);
            }
            if (judgeKey === Judge.JV_UMSA) {
              setModal(<CrawlJvumsaProblemModal isOpen onClose={() => setModal(null)} />);
            }
            if (judgeKey === Judge.CODEFORCES_GYM) {
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
      tabs={oneTab(judgeKey && (
        <PagedDataViewer<ProblemSummaryListResponseDTO, ProblemSummaryListResponseDTO>
          headers={columns}
          getUrl={({ pagination: { page, pageSize }, filter, sort }) => {
            return jukiSettings.API.problem.getSummaryList({
              params: {
                page,
                size: pageSize,
                filterUrl: toFilterUrl({ ...filter, judgeKeys: judgeKey }),
                sortUrl: toSortUrl(sort),
              },
            }).url;
          }}
          name={QueryParam.PROBLEMS_TABLE + (JUDGE_C[judgeKey] || '')}
          refreshInterval={60000}
          extraNodes={extraNodes}
          cards={{ height: 256, expanded: true }}
          dependencies={[ judgeKey ]}
        />
      ))}
    >
      <div className="jk-row space-between extend pn-re">
        <div className="jk-row gap">
          <h2><T>problems</T></h2>
          {[ Judge.CODEFORCES, Judge.JV_UMSA ].includes(judgeKey) && (
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
            options={judges}
            selectedOption={{ value: judgeKey }}
            onChange={({ value }) => setSearchParams({ name: QueryParam.JUDGE, value })}
            extend
          />
        </div>
      </div>
    </TwoContentLayout>
  );
}

export default Problems;
