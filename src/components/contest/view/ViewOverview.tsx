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
import { jukiApiSocketManager } from 'config';
import { authorizedRequest, classNames, cleanRequest, downloadUrlAsFile } from 'helpers';
import { useDateFormat, useI18nStore, useJukiNotification, useJukiUI, useRouterStore, useUserStore } from 'hooks';
import React from 'react';
import { JUDGE_API_V1, PROGRAMMING_LANGUAGE } from 'src/constants';
import { KeyedMutator } from 'swr';
import {
  ContentResponseType,
  ContestDataResponseDTO,
  HTTPMethod,
  ProfileSetting,
  QueryParamKey,
  SetLoaderStatusOnClickType,
  Status,
} from 'types';

interface ViewOverviewProps {
  contest: ContestDataResponseDTO,
  reloadContest?: KeyedMutator<any>,
  forPrinting?: boolean,
}

export const ViewOverview = ({ contest, reloadContest, forPrinting }: ViewOverviewProps) => {
  
  const { isManager, isAdministrator, isParticipant, isGuest, isSpectator } = contest.user;
  const userIsLogged = useUserStore(state => state.user.isLogged);
  const appendSearchParams = useRouterStore(state => state.appendSearchParams);
  const { dtf, rlt } = useDateFormat();
  const { notifyResponse, addWarningNotification } = useJukiNotification();
  const { viewPortSize } = useJukiUI();
  const t = useI18nStore(state => state.i18n.t);
  const userPreferredLanguage = useUserStore(state => state.user.settings?.[ProfileSetting.LANGUAGE]);
  
  const registerContest = async (setLoader: SetLoaderStatusOnClickType) => {
    setLoader(Status.LOADING);
    const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(JUDGE_API_V1.CONTEST.REGISTER(contest.key), {
      method: HTTPMethod.POST,
    }));
    if (notifyResponse(response, setLoader)) {
      setLoader(Status.LOADING);
      await reloadContest?.();
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
      <div
        className="jk-col stretch gap flex-3 contest-overview-information"
        style={forPrinting ? { display: 'none' } : {}}
      >
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
                {userIsLogged
                  ? (isAdministrator || isManager)
                    ? <T className="tt-se">enroll to appear on the scoreboard</T>
                    : <T className="tt-se">enroll to participate</T>
                  : <T className="tt-se">sign in to register</T>}
              </div>
              <ButtonLoader
                onClick={(setLoader) => userIsLogged
                  ? registerContest(setLoader)
                  : appendSearchParams({ name: QueryParamKey.SIGN_IN, value: '1' })}
                type="secondary"
                expand
              >
                <T>{userIsLogged ? 'enroll' : 'sign in'}</T>
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
          <div className="jk-col bc-we jk-br-ie jk-pg-sm">
            <ButtonLoader
              key="download-contest-problemset"
              onClick={async (setLoaderStatus) => {
                setLoaderStatus(Status.LOADING);
                const { url, ...options } = jukiApiSocketManager.API_V2.export.contest.problems.statementsToPdf({
                  params: {
                    key: contest.key,
                    token: jukiApiSocketManager.getToken(),
                    language: userPreferredLanguage,
                  },
                });
                const response = cleanRequest<ContentResponseType<{ urlExportedPDF: string }>>(
                  await authorizedRequest(url, options),
                );
                
                if (response.success) {
                  if (!response.content.urlExportedPDF) {
                    setLoaderStatus(Status.SUCCESS);
                    return addWarningNotification(
                      <div className="jk-col stretch" style={{ width: '100%' }}>
                    <span className="tt-se">
                      <T>{response.message}</T>
                    </span>
                      </div>,
                    );
                  }
                  await downloadUrlAsFile('https://' + response.content.urlExportedPDF, `${contest.name} - ${t('problemset')}`);
                  setLoaderStatus(Status.SUCCESS);
                } else {
                  setLoaderStatus(Status.ERROR);
                }
              }}
              size="tiny"
              type="light"
            >
              <T className="tt-se">download problemset</T>
            </ButtonLoader>
          </div>
        </div>
      </div>
    </div>
  );
};
