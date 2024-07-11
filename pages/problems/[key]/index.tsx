import { AssignmentIcon, Button, FetcherLayer, LinkLastPath, ProblemViewLayout, T, TwoContentLayout } from 'components';
import { jukiSettings } from 'config';
import { oneTab } from 'helpers';
import { useJukiRouter, useJukiUI, useTrackLastPath } from 'hooks';
import { ContentResponseType, LastPathKey, ProblemDataResponseDTO } from 'types';
import Custom404 from '../../404';

export default function ProblemViewPage() {
  
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);
  const { searchParams, routeParams: { key: problemKey } } = useJukiRouter();
  const { components: { Link } } = useJukiUI();
  
  const breadcrumbs = [
    <LinkLastPath lastPathKey={LastPathKey.PROBLEMS} key="problems"><T className="tt-se">problems</T></LinkLastPath>,
    <Link
      href={{
        pathname: jukiSettings.ROUTES.problems().view({ key: problemKey as string }),
        search: searchParams.toString(),
      }}
      className="link"
      key="key"
    >
      <div className="ws-np">{problemKey}</div>
    </Link>,
  ];
  
  return (
    <FetcherLayer<ContentResponseType<ProblemDataResponseDTO>>
      url={jukiSettings.API.problem.getData({ params: { key: problemKey as string } }).url}
      loadingView={
        <TwoContentLayout breadcrumbs={breadcrumbs} loading>
          <h2
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 'calc(100vw - var(--pad-md) - var(--pad-md) - 64px - var(--left-vertical-menu-width))',
            }}
          >
            {problemKey}
          </h2>
        </TwoContentLayout>
      }
      errorView={
        <TwoContentLayout
          breadcrumbs={breadcrumbs}
          tabs={oneTab(
            <Custom404>
              <p>
                <T className="tt-se">the problem does not exist or you do not have permissions to view it</T>
              </p>
              <LinkLastPath lastPathKey={LastPathKey.PROBLEMS}>
                <Button icon={<AssignmentIcon />} type="light">
                  <T className="tt-se">go to problem list</T>
                </Button>
              </LinkLastPath>
            </Custom404>,
          )}
        >
          <h2><T>problem not found</T></h2>
        </TwoContentLayout>
      }
    >
      {({ data, mutate }) => (
        <ProblemViewLayout problem={data.content} reloadProblem={mutate} />
      )}
    </FetcherLayer>
  );
};
