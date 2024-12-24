'use client';

import {
  AdminInformation,
  ButtonLoader,
  ContestantInformation,
  FrozenInformation,
  GuestInformation,
  JudgeInformation,
  MdMathViewer,
  QuietInformation,
  SpectatorInformation,
  T,
} from 'components';
import { JUDGE_API_V1, PROGRAMMING_LANGUAGE } from 'config/constants';
import { authorizedRequest, classNames, cleanRequest } from 'helpers';
import { useDateFormat, useJukiNotification, useJukiRouter, useJukiUI, useJukiUser } from 'hooks';
import { KeyedMutator } from 'swr';
import {
  ContentResponseType,
  ContestDataResponseDTO,
  HTTPMethod,
  QueryParamKey,
  SetLoaderStatusOnClickType,
  Status,
} from 'types';

interface ViewOverviewProps {
  contest: ContestDataResponseDTO,
  reloadContest: KeyedMutator<any>,
}

export const ViewOverview = ({ contest, reloadContest }: ViewOverviewProps) => {
  
  const { isManager, isAdministrator, isParticipant, isGuest, isSpectator } = contest.user;
  const { user: { isLogged } } = useJukiUser();
  const { appendSearchParams } = useJukiRouter();
  const { dtf, rlt } = useDateFormat();
  const { notifyResponse } = useJukiNotification();
  const { viewPortSize } = useJukiUI();
  
  const registerContest = async (setLoader: SetLoaderStatusOnClickType) => {
    setLoader(Status.LOADING);
    const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(JUDGE_API_V1.CONTEST.REGISTER(contest.key), {
      method: HTTPMethod.POST,
    }));
    if (notifyResponse(response, setLoader)) {
      setLoader(Status.LOADING);
      await reloadContest();
      setLoader(Status.SUCCESS);
    }
  };
  
  return (
    <div
      className={classNames('contest-overview gap nowrap left stretch', {
        'jk-row': viewPortSize !== 'sm',
        'jk-col': viewPortSize === 'sm',
      })}
      style={{ height: 'auto' }}
    >
      <div className="flex-5">
        <MdMathViewer
          source={contest?.description}
          className="jk-pg-md bc-we jk-br-ie"
        />
      </div>
      <div className="jk-col stretch gap flex-3 contest-overview-information">
        <div className="content-side-right-bar-top">
          <div className="jk-row center bc-we jk-br-ie jk-pg-sm">
            <div className="jk-row center cr-py &nbsp;">
              {isAdministrator
                ? <><T className="tt-se ta-cr">you are admin</T>&nbsp;<AdminInformation filledCircle /></>
                : isManager
                  ? <><T className="tt-se ta-cr">you are judge</T>&nbsp;<JudgeInformation filledCircle /></>
                  : isParticipant
                    ? <><T className="tt-se ta-cr">you are contestant</T>&nbsp;<ContestantInformation filledCircle /></>
                    : isGuest
                      ? <><T className="tt-se ta-cr ">you are guest</T>&nbsp;<GuestInformation filledCircle /></>
                      : isSpectator
                        ? <><T className="tt-se ta-cr">you are spectator</T>&nbsp;
                          <SpectatorInformation filledCircle /></>
                        : null
              }
            </div>
            {(isAdministrator || isManager) && isParticipant && (
              <T className="tt-se">you are enrolled and appear on the scoreboard</T>
            )}
          </div>
        </div>
        {((isAdministrator || isManager || isGuest) && !isParticipant && new Date().getTime() <= contest.settings.endTimestamp) && (
          <div className="content-side-right-bar-top">
            <div className="jk-row center gap bc-we jk-br-ie jk-pg-sm">
              <div className="jk-row center">
                &nbsp;
                {isLogged
                  ? (isAdministrator || isManager)
                    ? <T className="tt-se">enroll to appear on the scoreboard</T>
                    : <T className="tt-se">enroll to participate</T>
                  : <T className="tt-se">sign in to register</T>}
              </div>
              <ButtonLoader
                onClick={(setLoader) => isLogged
                  ? registerContest(setLoader)
                  : appendSearchParams({ name: QueryParamKey.SIGN_IN, value: '1' })}
                type="secondary"
                expand
              >
                <T>{isLogged ? 'enroll' : 'sign in'}</T>
              </ButtonLoader>
            </div>
          </div>
        )}
        <div className="flex-1 contest-content-side-right-bar-bottom jk-col top stretch gap">
          <div className="jk-col bc-we jk-br-ie jk-pg-sm">
            <T className="tt-se fw-bd ta-cr">start date</T>
            <div className="ta-cr">{dtf(contest.settings.startTimestamp)}</div>
          </div>
          <div className="jk-col bc-we jk-br-ie jk-pg-sm">
            <T className="tt-se fw-bd ta-cr">end date</T>
            <div className="ta-cr">{dtf(contest.settings.endTimestamp)}</div>
          </div>
          {contest.settings.endTimestamp !== contest.settings.frozenTimestamp && (
            <div className="jk-col bc-we jk-br-ie jk-pg-sm">
              <div className="jk-row gap nowrap">
                <T className="tt-se fw-bd ta-cr">frozen date</T>
                <FrozenInformation />
              </div>
              <div className="ta-cr">{dtf(contest.settings.frozenTimestamp)}</div>
              <div className="jk-row center">
                <div className="ta-cr">{rlt(Math.floor((contest.settings.frozenTimestamp - contest.settings.startTimestamp) / (60 * 1000)), 'minutes')}&nbsp;</div>
                <T className="ta-cr">from the start of the contest</T>
              </div>
            
            </div>
          )}
          {contest.settings.endTimestamp !== contest.settings.quietTimestamp && (
            <div className="jk-col bc-we jk-br-ie jk-pg-sm">
              <div className="jk-row gap nowrap">
                <T className="tt-se fw-bd ta-cr">quiet date</T>
                <QuietInformation />
              </div>
              <div className="ta-cr">{dtf(contest.settings.quietTimestamp)}</div>
              <div className="jk-row center">
                <div className="ta-cr">{rlt(Math.floor((contest.settings.quietTimestamp - contest.settings.startTimestamp) / (60 * 1000)), 'minutes')}&nbsp;</div>
                <T className="ta-cr">from the start of the contest</T>
              </div>
            </div>
          )}
          {/*{(contest.settings.endTimestamp - contest.settings.startTimestamp) !== contest.settings.timeToSolve && (*/}
          {/*  <div className="jk-col bc-we jk-br-ie jk-pg-sm">*/}
          {/*    <T className="tt-se fw-bd ta-cr">time for solve</T>*/}
          {/*    <div>{Math.ceil(contest.settings.timeToSolve / 1000 / 60)} min</div>*/}
          {/*  </div>*/}
          {/*)}*/}
          {!!contest.settings.penalty && (
            <div className="jk-col bc-we jk-br-ie jk-pg-sm">
              <T className="tt-se fw-bd ta-cr">penalty by incorrect answer</T>
              <div>{contest.settings.penalty} min</div>
            </div>
          )}
          <div className="jk-col bc-we jk-br-ie jk-pg-sm">
            <T className="tt-se fw-bd ta-cr">clarifications</T>
            <div>
              <T className="tt-se">{contest.settings.clarifications ? 'clarifications available' : 'clarifications not available'}</T>
            </div>
          </div>
          <div className="jk-col bc-we jk-br-ie jk-pg-sm">
            <T className="tt-se fw-bd ta-cr">languages</T>
            <div className="jk-row gap">
              {contest.settings.languages.map(language => (
                <div
                  className="jk-tag gray-5"
                  key={language}
                >{PROGRAMMING_LANGUAGE[language]?.label || language}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
