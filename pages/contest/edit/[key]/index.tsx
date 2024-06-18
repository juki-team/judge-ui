import { oneTab, TwoContentLayout } from '@juki-team/base-ui';
import { EditCreateContest, FetcherLayer, LinkLastPath, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { parseContest } from 'helpers';
import { useContestRouter } from 'hooks';
import { ContentResponseType, ContestResponseDTO, LastPathKey } from 'types';
import Custom404 from '../../../404';

function ContestEdit() {
  
  const { contestKey } = useContestRouter();
  
  const breadcrumbs = [
    <LinkLastPath lastPathKey={LastPathKey.CONTESTS} key="contests"><T className="tt-se">contests</T></LinkLastPath>,
  ];
  
  return (
    <FetcherLayer<ContentResponseType<ContestResponseDTO>>
      url={JUDGE_API_V1.CONTEST.CONTEST_DATA(contestKey)}
      errorView={
        <TwoContentLayout breadcrumbs={breadcrumbs} tabs={oneTab(<Custom404 />)}>
          <h2><T>contest not found</T></h2>
        </TwoContentLayout>
      }
    >
      {({ data, isLoading, error }) => {
        if (data.content.user.isAdmin) {
          const contest = parseContest(data.content);
          return <EditCreateContest contest={contest} />;
        }
        return <Custom404 />;
      }}
    </FetcherLayer>
  );
}

export default ContestEdit;
