'use client';

import {
  ButtonLoader,
  CrawlCodeforcesProblemModal,
  CrawlJvumsaProblemModal,
  getProblemKeyHeader,
  getProblemModeHeader,
  getProblemNameHeader,
  getProblemTagsHeader,
  getProblemTypeHeader,
  InfoIcon,
  PagedDataViewer,
  PlusIcon,
  Select,
  T,
  TextField,
  TwoContentLayout,
} from 'components';
import { jukiApiSocketManager, jukiAppRoutes } from 'config';
import { buttonLoaderLink, oneTab, toFilterUrl, toSortUrl } from 'helpers';
import {
  useEffect,
  useFetcher,
  useMemo,
  usePreload,
  useRouterStore,
  useState,
  useTrackLastPath,
  useUserStore,
} from 'hooks';
import { ENTITY_ACCESS } from 'src/constants';
import {
  ContentResponseType,
  DataViewerHeadersType,
  EntityAccess,
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

export function ProblemsPage({ judgeKey }: { judgeKey?: Judge }) {
  
  useTrackLastPath(LastPathKey.PROBLEMS);
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);
  
  const userCanCreateProblem = useUserStore(state => state.user.permissions.problems.create);
  const pushRoute = useRouterStore(state => state.pushRoute);
  const setSearchParams = useRouterStore(state => state.setSearchParams);
  const preload = usePreload();
  const { data } = useFetcher<ContentResponseType<JudgeDataResponseDTO[]>>(jukiApiSocketManager.API_V1.company.getJudgeList().url);
  const tags = useMemo(() => (data?.success ? (data.content.find(j => j.key === judgeKey)?.problemTags || []) : []).map(tag => ({
    value: tag,
    label: <T>{tag}</T>,
  })), [ data, judgeKey ]);
  const isExternal = useMemo(() => data?.success ? (data.content.find(j => j.key === judgeKey)?.isExternal ?? true) : true, [ data, judgeKey ]);
  const judges = (data?.success ? data.content : []).map(judge => ({
    value: judge.key,
    label: judge.name,
  }));
  
  const firstJudgeKey = judges[0]?.value;
  useEffect(() => {
    if (!judgeKey && firstJudgeKey) {
      setSearchParams({ name: QueryParam.JUDGE, value: firstJudgeKey });
    }
  }, [ judgeKey, setSearchParams, firstJudgeKey ]);
  
  const columns: DataViewerHeadersType<ProblemSummaryListResponseDTO>[] = useMemo(() => [
    ...(isExternal ? [ getProblemKeyHeader() ] : []),
    getProblemNameHeader(false, { sticky: true, cardPosition: 'top' }),
    ...(!isExternal ? [
      getProblemModeHeader(),
      getProblemTypeHeader(),
      {
        head: 'access',
        index: 'access',
        Field: ({ record: { members: { access } } }) => (
          <TextField
            className="jk-row"
            text={<T className="tt-se">{ENTITY_ACCESS[access].label}</T>}
            label={<T className="tt-se">type</T>}
          />
        ),
        sort: true,
        filter: {
          type: 'select',
          options: [ EntityAccess.PRIVATE, EntityAccess.RESTRICTED, EntityAccess.PUBLIC, EntityAccess.EXPOSED ].map((problemType) => ({
            value: problemType,
            label: ENTITY_ACCESS[problemType].label,
          })),
        },
        cardPosition: 'upperLeft',
        minWidth: 100,
      } as DataViewerHeadersType<ProblemSummaryListResponseDTO>,
      getProblemTagsHeader(tags),
    ] : []),
    // getProblemOwnerHeader(isExternal),
  ], [ tags, isExternal ]);
  
  const extraNodes = [];
  if (userCanCreateProblem && judgeKey === judges[0]?.value) {
    extraNodes.push(
      <ButtonLoader
        size="small"
        icon={<PlusIcon />}
        responsiveMobile
        onClick={buttonLoaderLink(() => pushRoute(jukiAppRoutes.JUDGE().problems.new()))}
      >
        <T>create</T>
      </ButtonLoader>,
    );
  }
  const [ modal, setModal ] = useState<ReactNode>(null);
  if (isExternal) {
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
      tabs={oneTab(judgeKey && (
        <PagedDataViewer<ProblemSummaryListResponseDTO, ProblemSummaryListResponseDTO>
          headers={columns}
          getUrl={({ pagination: { page, pageSize }, filter, sort }) => {
            return jukiApiSocketManager.API_V1.problem.getSummaryList({
              params: {
                page,
                pageSize,
                filterUrl: toFilterUrl({ ...filter, judgeKeys: judgeKey }),
                sortUrl: toSortUrl(sort),
              },
            }).url;
          }}
          name={QueryParam.PROBLEMS_TABLE + (JUDGE_C[judgeKey] || '')}
          refreshInterval={60000}
          extraNodes={extraNodes}
          cards={{ height: 192, expanded: true }}
          dependencies={[ judgeKey ]}
          onRecordRender={({ data, index }) => {
            void preload(jukiApiSocketManager.API_V1.problem.getData({ params: { key: data[index].key } }).url);
          }}
        />
      ))}
    >
      <div className="jk-row space-between extend pn-re">
        <div className="jk-row gap">
          <h1><T className="tt-se">problems</T></h1>
          {isExternal && (
            <InfoIcon
              data-tooltip-id="jk-tooltip"
              data-tooltip-content="only tracked problems are displayed"
            />
          )}
        </div>
        {judgeKey && (
          <div style={{ width: 200 }}>
            <Select
              className="jk-border-radius-inline jk-button secondary"
              options={judges}
              selectedOption={{ value: judgeKey }}
              onChange={({ value }) => setSearchParams({ name: QueryParam.JUDGE, value })}
              extend
            />
          </div>
        )}
      </div>
    </TwoContentLayout>
  );
}
