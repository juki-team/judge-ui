'use client';

import {
  Button,
  ButtonLoader,
  CrawlCodeforcesProblemModal,
  CrawlJvumsaProblemModal,
  FieldText,
  getProblemKeyHeader,
  getProblemModeHeader,
  getProblemNameHeader,
  getProblemTagsHeader,
  getProblemTypeHeader,
  InfoIIcon,
  PagedDataViewer,
  PlusIcon,
  Select,
  T,
  TwoContentLayout,
} from 'components';
import { jukiApiManager, jukiAppRoutes } from 'config';
import { getDocumentAccess, oneTab, toFilterUrl, toSortUrl } from 'helpers';
import {
  useEffect,
  useFetcher,
  useJukiUI,
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
import { CrawlLeetCodeProblemModal } from '../../../components/problem/CrawlLeetCodeProblemModal';

export function ProblemsPage({ judgeKey }: { judgeKey?: Judge }) {
  
  useTrackLastPath(LastPathKey.PROBLEMS);
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);
  
  const userCanCreateProblem = useUserStore(state => state.user.permissions.problems.create);
  const setSearchParams = useRouterStore(state => state.setSearchParams);
  const preload = usePreload();
  const { data } = useFetcher<ContentResponseType<JudgeDataResponseDTO[]>>(jukiApiManager.API_V1.company.getJudgeList().url);
  const tags = useMemo(() => (data?.success ? (data.content.find(j => j.key === judgeKey)?.problemTags || []) : []).map(tag => ({
    value: tag,
    label: <T>{tag}</T>,
  })), [ data, judgeKey ]);
  const isExternal = data?.success ? (data.content.find(j => j.key === judgeKey)?.isExternal ?? true) : true;
  const keyPrefix = data?.success ? (data.content.find(j => j.key === judgeKey)?.keyPrefix ?? '*') : '*';
  
  const judges = (data?.success ? data.content : []).map(judge => ({
    value: judge.key,
    label: judge.name,
  }));
  const { components: { Link } } = useJukiUI();
  const userIsLogged = useUserStore(state => state.user.isLogged);
  
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
        Field: ({ record: { members } }) => (
          <FieldText
            className="jk-row"
            text={<T className="tt-se">{ENTITY_ACCESS[getDocumentAccess({ members })].label}</T>}
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
      <Link href={jukiAppRoutes.JUDGE().problems.new({ judge: judgeKey })}>
        <Button
          size="small"
          icon={<PlusIcon />}
          responsiveMobile
        >
          <T className="tt-se">create</T>
        </Button>
      </Link>,
    );
  }
  const [ modal, setModal ] = useState<ReactNode>(null);
  if (isExternal && userIsLogged) {
    extraNodes.push(
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
          if (judgeKey === Judge.LEETCODE) {
            setModal(
              <CrawlLeetCodeProblemModal
                isOpen
                onClose={() => setModal(null)}
              />,
            );
          }
        }}
      >
        <T className="tt-se">crawl</T>
      </ButtonLoader>,
    );
  }
  
  return (
    <TwoContentLayout
      tabs={oneTab(judgeKey && (
        <PagedDataViewer<ProblemSummaryListResponseDTO, ProblemSummaryListResponseDTO>
          headers={columns}
          getUrl={({ pagination: { page, pageSize }, filter, sort }) => {
            return jukiApiManager.API_V1.problem.getSummaryList({
              params: {
                page,
                pageSize,
                filterUrl: toFilterUrl({ ...filter, judgeKeys: judgeKey }),
                sortUrl: toSortUrl(sort),
              },
            }).url;
          }}
          name={QueryParam.PROBLEMS_TABLE + keyPrefix}
          refreshInterval={60000}
          extraNodes={extraNodes}
          cards={{ height: 192, expanded: true }}
          dependencies={[ judgeKey ]}
          onRecordRender={({ data, index }) => {
            void preload(jukiApiManager.API_V1.problem.getData({ params: { key: data[index].key } }).url);
          }}
        />
      ))}
    >
      <div className="jk-row space-between extend pn-re">
        {modal}
        <div className="jk-row gap">
          <h1><T className="tt-se">problems</T></h1>
          {isExternal && (
            <InfoIIcon
              circle
              data-tooltip-id="jk-tooltip"
              data-tooltip-content="only tracked problems are displayed"
            />
          )}
        </div>
        {judgeKey && (
          <div className="jk-row gap nowrap jk-pg-xsm jk-br-ie">
            <div className="jk-row nowrap"><T className="tt-se fw-br cr-th tx-h">judge</T>:</div>
            <div className="jk-row">
              <Select
                className="jk-br-ie jk-button secondary"
                options={judges}
                selectedOption={{ value: judgeKey }}
                onChange={({ value }) => setSearchParams({ name: QueryParam.JUDGE, value })}
                // expand
              />
            </div>
          </div>
        )}
      </div>
    </TwoContentLayout>
  );
}
