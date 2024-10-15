import { BalloonIcon, Field, Image, Popover, T, UserNicknameLink } from 'components';
import { jukiSettings } from 'config';
import { classNames } from 'helpers';
import { CSSProperties, FC, PropsWithChildren } from 'react';
import { ContestProblemDataResponseDTO, ContestTab, DataViewerHeadersType, LinkCmpProps } from 'types';
import { ScoreboardResponseDTOFocus } from './types';

export const getPositionColumn = (): DataViewerHeadersType<ScoreboardResponseDTOFocus> => ({
  head: '#',
  index: 'position',
  Field: ({ record: { position, focus } }) => (
    <Field className={classNames('jk-row', { highlight: !!focus?.length })}>{position}</Field>
  ),
  minWidth: 64,
  sticky: true,
});

export const getNicknameColumn = (viewPortSize: string, userNickname: string): DataViewerHeadersType<ScoreboardResponseDTOFocus> => ({
  head: 'nickname',
  index: 'nickname',
  Field: ({ record: { user: { nickname, imageUrl, company: { key: companyKey } }, focus } }) => (
    <Field
      className={classNames('jk-row center gap', {
        'own': nickname === userNickname,
        highlight: !!focus?.length,
      })}
    >
      <Image src={imageUrl} className="jk-user-profile-img large" alt={nickname} height={38} width={38} />
      <UserNicknameLink nickname={nickname} companyKey={companyKey}>
        <div
          className={classNames('jk-border-radius ', {
            'bc-py cr-we fw-br': nickname === userNickname,
            'link': nickname !== userNickname,
          })}
        >
          {nickname}
        </div>
      </UserNicknameLink>
    </Field>
  ),
  minWidth: 250,
  sticky: viewPortSize !== 'sm',
});

export const getPointsColumn = (viewPortSize: string, isEndless: boolean): DataViewerHeadersType<ScoreboardResponseDTOFocus> => ({
  head: 'points',
  index: 'points',
  Field: ({ record: { focus, totalPenalty, totalPoints }, isCard }) => (
    <Field className={classNames('jk-col center', { highlight: !!focus?.length })}>
      <div className="fw-br cr-py">{+totalPoints.toFixed(2)}</div>
      {!isEndless && <div className="cr-g4">{Math.round(totalPenalty)}</div>}
    </Field>
  ),
  minWidth: 128,
  sticky: viewPortSize !== 'sm',
});

export const getProblemScoreboardColumn = (Link: FC<PropsWithChildren<LinkCmpProps>>, contestKey: string, isEndless: boolean, problem: ContestProblemDataResponseDTO): DataViewerHeadersType<ScoreboardResponseDTOFocus> => ({
  head: (
    <Popover
      content={
        <div className="jk-row nowrap gap">
          <div className="fw-bd">{problem.index}</div>
          <div className="ws-np">{problem.name}</div>
        </div>
      }
    >
      <div
        className="jk-col extend fw-bd is-first-accepted"
        style={{ '--balloon-color': problem.color } as CSSProperties}
      >
        <Link
          href={jukiSettings.ROUTES.contests().view({
            key: contestKey,
            tab: ContestTab.PROBLEMS,
            subTab: problem.index,
          })}
        >
          {problem.index}
        </Link>
      </div>
    </Popover>
  ),
  index: problem.index,
  Field: ({ record: { problems, focus }, isCard }) => {
    const problemData = problems[problem.key];
    return (
      <Field className={classNames('jk-row center nowrap', { highlight: !!focus?.includes(problem.key) })}>
        {(problemData?.success || !!problemData?.points) && (
          <Popover
            content={
              <div className="jk-col">
                <div className="ws-np">
                  {problemData?.success ? problemData.points : <>{problemData.points}/{problem.points}</>}
                  &nbsp;
                  <T>{problem?.points === 1 ? 'point' : 'points'}</T>
                </div>
                {problemData.isFirstAccepted && (
                  <div className="fw-bd cr-ss tx-s"><T className="tt-se">first accepted</T></div>
                )}
              </div>
            }
          >
            <div
              style={{ color: problem.color, '--balloon-color': problem.color } as CSSProperties}
              className={classNames({ 'is-first-accepted': problemData.isFirstAccepted })}
            >
              <BalloonIcon percent={(problemData.points / problem.points) * 100} />
            </div>
          </Popover>
        )}
        <div className="jk-row nowrap">
          <div className="tx-xs">{problemData?.attempts || '-'}</div>
          {!isEndless && (
            <>
              <span className="cr-g3">/</span>
              <div className="tx-xs">{problemData?.penalty ? Math.round(problemData?.penalty) : '-'}</div>
            </>
          )}
        </div>
      </Field>
    );
  },
  minWidth: 120,
});
