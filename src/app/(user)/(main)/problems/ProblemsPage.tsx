'use client';

import {
  Button,
  ButtonLoader,
  getProblemKeyHeader,
  getProblemModeHeader,
  getProblemNameHeader,
  getProblemTagsHeader,
  getProblemTypeHeader,
  PagedDataViewer,
  Select,
  T,
  TwoContentLayout,
  useFetcher,
  useRouterStore,
  useTrackLastPath,
  useUIStore,
  useUserStore,
} from '@juki-team/base-ui';
import { oneTab, toFilterUrl, toSortUrl } from '@juki-team/base-ui/helpers';
import { InfoIIcon, PlusIcon } from '@juki-team/base-ui/server-components';
import { jukiApiManager, jukiAppRoutes } from '@juki-team/base-ui/settings';
import { type DataViewerHeadersType } from '@juki-team/base-ui/types';
import { type JudgeDataResponseDTO, type ProblemSummaryListResponseDTO } from '@juki-team/commons/dto';
import { Judge } from '@juki-team/commons/enums';
import { type ContentResponse } from '@juki-team/commons/types';
import { CrawlCodeforcesProblemModal, CrawlJvumsaProblemModal } from 'components';
import { useEffect, useMemo, useState } from 'hooks';
import { LastPathKey, QueryParam, ReactNode } from 'types';
import { CrawlLeetCodeProblemModal } from '../../../../components/problem/CrawlLeetCodeProblemModal';

export function ProblemsPage({ judgeKey }: { judgeKey?: Judge }) {

  useTrackLastPath(LastPathKey.PROBLEMS);
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);

  const userCanCreateProblem = useUserStore(state => state.user.permissions.problems.create);
  const organizationKey = useUserStore(state => state.organization.key);
  const setSearchParams = useRouterStore(state => state.setSearchParams);
  const { data } = useFetcher<ContentResponse<JudgeDataResponseDTO[]>>(jukiApiManager.apiV2.organization.getJudgeList({ params: { organizationKey } }).url);
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
  const { Link } = useUIStore(store => store.components);
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
            return jukiApiManager.apiV2.problem.getSummaryList({
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
          deps={[ judgeKey as string ]}
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
