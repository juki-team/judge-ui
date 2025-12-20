import { BalloonIcon, Field, UserNicknameLink } from 'components';
import { jukiAppRoutes } from 'config';
import { classNames } from 'helpers';
import { useUIStore, useUserStore } from 'hooks';
import { CSSProperties, FC, PropsWithChildren } from 'react';
import {
  ContestProblemDataResponseDTO,
  ContestTab,
  DataViewerHeadersType,
  LinkCmpProps,
  TableHeadFieldProps,
  TFunction,
} from 'types';
import { ScoreboardResponseDTOFocus } from '../types';

export const getPositionColumn = (): DataViewerHeadersType<ScoreboardResponseDTOFocus> => ({
  head: '#',
  index: 'position',
  Field: ({ record: { position, focus } }) => (
    <Field className={classNames('jk-row', { highlight: !!focus?.length })}>{position}</Field>
  ),
  minWidth: 64,
  sticky: true,
});

const NicknameField = ({
                         record: {
                           user: { nickname, imageUrl, company: { key: companyKey } },
                           focus,
                         },
                       }: TableHeadFieldProps<ScoreboardResponseDTOFocus>) => {
  
  const userNickname = useUserStore(state => state.user.nickname);
  const userCompanyKey = useUserStore(state => state.company.key);
  const { Image } = useUIStore(store => store.components);
  const me = nickname === userNickname && companyKey === userCompanyKey;
  
  return (
    <Field
      className={classNames('jk-row center gap', {
        highlight: !!focus?.length,
      })}
    >
      <Image src={imageUrl} className="jk-user-profile-img large" alt={nickname} height={38} width={38} />
      <UserNicknameLink nickname={nickname} companyKey={companyKey}>
        <div
          className={classNames('jk-br jk-col', {
            'bc-py cr-we fw-br jk-pg-xsm': me,
            'link': !me,
          })}
        >
          {nickname}
          {userCompanyKey !== companyKey && (
            <div className="jk-tag bc-hl tx-t" style={{ padding: '1px 2px' }}>{companyKey}</div>
          )}
        </div>
      </UserNicknameLink>
    </Field>
  );
};

export const getNicknameColumn = (viewPortSize: string): DataViewerHeadersType<ScoreboardResponseDTOFocus> => ({
  head: 'nickname',
  index: 'nickname',
  Field: NicknameField,
  minWidth: 250,
  sticky: viewPortSize !== 'sm',
});

export const getPointsColumn = (viewPortSize: string, isEndless: boolean): DataViewerHeadersType<ScoreboardResponseDTOFocus> => ({
  head: 'points',
  index: 'points',
  Field: ({ record: { focus, totalPenalty, totalPoints } }) => (
    <Field className={classNames('jk-col center', { highlight: !!focus?.length })}>
      <div className="fw-br cr-py">{+totalPoints.toFixed(2)}</div>
      {!isEndless && <div className="cr-g4">{+totalPenalty.toFixed(2)}</div>}
    </Field>
  ),
  minWidth: 128,
  sticky: viewPortSize !== 'sm',
});

export const getProblemScoreboardColumn = (Link: FC<PropsWithChildren<LinkCmpProps>>, contestKey: string, isEndless: boolean, problem: ContestProblemDataResponseDTO, t: TFunction): DataViewerHeadersType<ScoreboardResponseDTOFocus> => ({
  head: (
    <div
      data-tooltip-id="jk-tooltip"
      data-tooltip-content={`${problem.index}. ${problem.name}`}
      className="jk-col extend fw-bd"
    >
      <Link
        href={jukiAppRoutes.JUDGE().contests.view({
          key: contestKey,
          tab: ContestTab.PROBLEMS,
          subTab: problem.index,
        })}
        className="jk-row gap"
      >
        {problem.index}
        <div className="jk-row" style={{ color: problem.color }}>
          <BalloonIcon color="red" size="small" />
        </div>
      </Link>
    </div>
  ),
  index: problem.index,
  Field: ({ record: { problems, focus, diff } }) => {
    const problemData = problems[problem.key];
    const problemFocus = focus?.find(({ problemKey }) => problemKey === problem.key);
    const problemDiff = diff?.find(({ problemKey }) => problemKey === problem.key);
    
    return (
      <Field
        className={classNames('jk-row center nowrap active-on-hover', {
          'cell-score-highlight': !!problemFocus,
        })}
        style={{ '--color': problemFocus?.success ? 'var(--cr-ss)' : !!problemFocus?.points ? 'var(--t-color-success-light)' : 'var(--t-color-error-light)' } as CSSProperties}
      >
        {(problemData?.success || !!problemData?.points) && (
          <div
            data-tooltip-id="jk-tooltip"
            data-tooltip-html={`
              <div class="jk-col">
                <div class="ws-np">
                  ${problemData?.success ? problemData.points : `${+problemData.points.toFixed(2)} / ${problem.points}`}
                  ${problem?.points === 1 ? t('point') : t('points')}
                </div>
                ${problemData?.isFirstAccepted ? `<div class="fw-bd cr-ss tx-s"><span class="tt-se">${t('first accepted')}</span></div>` : ''}
              </div>
            `}
            style={{
              color: problem.color,
              '--balloon-color': problem.color,
              opacity: !!problem.maxAcceptedUsers && problemData && problemData?.indexAccepted >= problem.maxAcceptedUsers ? 0.2 : undefined,
            } as CSSProperties}
            className={classNames('pn-re', { 'is-first-accepted': problemData.isFirstAccepted })}
          >
            <BalloonIcon percent={(problemData.points / problem.points) * 100} />
            {typeof problemData?.indexAccepted === 'number' && (
              <div
                className="tx-t pn-ae fw-lr cr-g3 to-active-on-hover"
                style={{
                  right: 2,
                  bottom: 0,
                  lineHeight: 1,
                }}
              >
                {problemData?.indexAccepted + 1}
              </div>
            )}
          </div>
        )}
        <div
          className={classNames('jk-row nowrap')}
          style={{ opacity: !!problem.maxAcceptedUsers && problemData && problemData?.indexAccepted >= problem.maxAcceptedUsers ? 0.2 : undefined }}
        >
          <div className="tx-s">{problemData?.attempts || '-'}</div>
          {!isEndless && (
            <>
              <span className="tx-s">/</span>
              <div className="tx-s">
                {problemData?.penalty
                  ? <>
                    {Math.floor(problemData.penalty)}
                    <span className="tx-t cr-g3 to-active-on-hover">.{Math.floor((problemData.penalty - Math.floor(problemData.penalty)) * 1000).padEnd(3, '0')}</span>
                  </>
                  : '-'}
              </div>
            </>
          )}
          {!!problemDiff && (
            <>
              &nbsp;
              <div className={classNames('cell-score-highlight-diff jk-tag bc-hl tx-s', { 'focus cr-we': problemDiff?.focus })}>
                ?&nbsp;
                {problemDiff?.pendingAttempts}
              </div>
            </>
          )}
        </div>
      </Field>
    );
  },
  minWidth: 120,
});
