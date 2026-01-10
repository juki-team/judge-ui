import { BalloonIcon, Field, FitnessCenterIcon, InformationPopover, T, UserChip } from 'components';
import { jukiAppRoutes } from 'config';
import { classNames } from 'helpers';
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
    <Field className={classNames('jk-row', { highlight: !!focus?.length })}>{position < 0 ? '' : position}</Field>
  ),
  minWidth: 64,
  sticky: true,
});

const NicknameField = ({
                         record: {
                           user: { nickname, imageUrl, company: { key: companyKey } },
                           focus,
                           official,
                         },
                       }: TableHeadFieldProps<ScoreboardResponseDTOFocus>) => {
  
  return (
    <Field
      className={classNames('jk-row center gap', {
        highlight: !!focus?.length,
      })}
    >
      <UserChip imageUrl={imageUrl} nickname={nickname} companyKey={companyKey} className="tx-s" />
      {!official && (
        <InformationPopover
          icon={
            <FitnessCenterIcon size="small" className="cr-ss" />
          }
        >
          <T className="tt-se">upsolving period</T>
        </InformationPopover>
      )}
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
      {!isEndless && (
        <div className="tx-s" style={{ fontFamily: 'monospace', paddingLeft: '3ch' }}>
          {Math.floor(+totalPenalty)}
          <span className="tx-t cr-g5 to-active-on-hover">.{Math.floor((+totalPenalty - Math.floor(+totalPenalty)) * 100).padEnd(2, '0')}</span>
        </div>
      )}
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
        className={classNames('jk-row center nowrap active-on-hover', {})}
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
            <BalloonIcon percent={(problemData.points / problem.points) * 100} className="pn-re">
              {typeof problemData?.indexAccepted === 'number' && (
                <div
                  className="tx-vt pn-ae cr-we fw-bd to-active-on-hover"
                  style={{
                    top: '35%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    lineHeight: 1,
                    mixBlendMode: 'difference',
                    // filter: 'invert(1)',
                  }}
                >
                  {problemData?.indexAccepted + 1}
                </div>
              )}
            </BalloonIcon>
          </div>
        )}
        <div
          className={classNames('jk-row nowrap jk-br-ie', { 'cell-score-highlight': !!problemFocus })}
          style={{
            padding: '0 3px',
            opacity: !!problem.maxAcceptedUsers && problemData && problemData?.indexAccepted >= problem.maxAcceptedUsers ? 0.2 : undefined,
            ...(problemFocus ? { '--color': problemFocus?.success ? 'var(--cr-ss)' : !!problemFocus?.points ? 'var(--cr-ss-lt)' : 'var(--cr-er-lt)' } : {}),
          } as CSSProperties}
        >
          <div className="tx-s">{problemData?.attempts || '-'}</div>
          {!isEndless && (
            <>
              <span className="tx-s">/</span>
              <div className="tx-s">
                {problemData?.penalty
                  ? <>
                    {Math.floor(problemData.penalty)}
                    <span className="tx-t cr-g5 to-active-on-hover">.{Math.floor((problemData.penalty - Math.floor(problemData.penalty)) * 1000).padEnd(3, '0')}</span>
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
