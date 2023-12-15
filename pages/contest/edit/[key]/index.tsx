import { Breadcrumbs, EditCreateContest, FetcherLayer, HomeLink, LastLink, T, TwoContentSection } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { parseContest } from 'helpers';
import { useContestRouter } from 'hooks';
import { ContentResponseType, ContestResponseDTO, LastLinkKey } from 'types';
import Custom404 from '../../../404';

function ContestEdit() {
  
  const { contestKey } = useContestRouter();
  
  const breadcrumbs = [
    <HomeLink key="home" />,
    <LastLink lastLinkKey={LastLinkKey.CONTESTS} key="contests"><T className="tt-se">contests</T></LastLink>,
  ];
  
  return (
    <FetcherLayer<ContentResponseType<ContestResponseDTO>>
      url={JUDGE_API_V1.CONTEST.CONTEST_DATA(contestKey)}
      errorView={
        <TwoContentSection>
          <div className="jk-col stretch extend nowrap">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
          <Custom404 />
        </TwoContentSection>
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
