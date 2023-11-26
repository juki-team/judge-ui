import { Breadcrumbs, EditCreateContest, FetcherLayer, LastLink, T, TwoContentSection } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { getProblemJudgeKey } from 'helpers';
import { useContestRouter } from 'hooks';
import Link from 'next/link';
import {
  ContentResponseType,
  ContestResponseDTO,
  EditContestProblemBasicType,
  EditCreateContestType,
  LastLinkKey,
} from 'types';
import Custom404 from '../../../404';

const parseContest = (data: ContentResponseType<ContestResponseDTO>): EditCreateContestType => {
  const problems: { [key: string]: EditContestProblemBasicType } = {};
  Object.values(data.content.problems).forEach(problem => {
    problems[getProblemJudgeKey(problem.judge, problem.key)] = {
      key: problem.key,
      index: problem.index,
      judge: problem.judge,
      name: problem.name,
      points: problem.points,
      color: problem.color,
      startTimestamp: problem.startTimestamp,
      endTimestamp: problem.endTimestamp,
    };
  });
  
  const members = {
    administrators: Object.keys(data.content.members.administrators),
    judges: Object.keys(data.content.members.judges),
    contestants: Object.keys(data.content.members.contestants),
    guests: Object.keys(data.content.members.guests),
    spectators: Object.keys(data.content.members.spectators),
  };
  
  return {
    description: data.content.description,
    key: data.content.key,
    members,
    name: data.content.name,
    problems,
    settings: data.content.settings,
    tags: data.content.tags,
    status: data.content.status,
  };
};

function ContestEdit() {
  
  const { contestKey } = useContestRouter();
  
  const breadcrumbs = [
    <Link href="/" className="link" key="home"><T className="tt-se">home</T></Link>,
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
          const contest = parseContest(data);
          return <EditCreateContest contest={contest} />;
        }
        return <Custom404 />;
      }}
    </FetcherLayer>
  );
}

export default ContestEdit;
