import {
  AdminInformation,
  ButtonLoader,
  FrozenInformation,
  JudgeInformation,
  MdMathViewer,
  QuietInformation,
  SpectatorInformation,
  T,
} from 'components';
import { JUDGE_API_V1, PROGRAMMING_LANGUAGE } from 'config/constants';
import { authorizedRequest, classNames, cleanRequest } from 'helpers';
import { useDateFormat, useJukiUI, useJukiUser, useNotification, useRouter, useSWR } from 'hooks';
import {
  ContentResponseType,
  ContestResponseDTO,
  HTTPMethod,
  QueryParamKey,
  SetLoaderStatusOnClickType,
  Status,
} from 'types';

export const ViewOverview = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { isJudge, isAdmin, isContestant, isGuest, isSpectator } = contest.user;
  const { user: { isLogged } } = useJukiUser();
  const { query } = useRouter();
  const { router: { appendSearchParams } } = useJukiUI();
  const { dtf, rlt } = useDateFormat();
  const { notifyResponse } = useNotification();
  const { mutate } = useSWR();
  const { viewPortSize } = useJukiUI();
  
  const registerContest = async (setLoader: SetLoaderStatusOnClickType, key: string) => {
    setLoader(Status.LOADING);
    const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(JUDGE_API_V1.CONTEST.REGISTER(query.key as string), {
      method: HTTPMethod.POST,
    }));
    if (notifyResponse(response)) {
      setLoader(Status.LOADING);
      await mutate(JUDGE_API_V1.CONTEST.CONTEST_DATA(query.key as string));
      setLoader(Status.SUCCESS);
    }
  };
  
  return (
    <div
      className={classNames('contest-overview gap nowrap left stretch pad-left-right pad-top-bottom', {
        'jk-row': viewPortSize !== 'sm',
        'jk-col': viewPortSize === 'sm',
      })}
      style={{ height: 'auto' }}
    >
      <div className="flex-5">
        <MdMathViewer
          source={contest?.description}
          className="jk-pad-md bc-we br-g6 jk-border-radius-inline"
        />
      </div>
      <div className="flex-3 contest-overview-information">
        <div className="content-side-right-bar-top">
          {isAdmin
            ? <div className="judge-admin jk-row center gap bc-we br-g6 jk-border-radius-inline fw-bd cr-py">
              <T className="tt-se">you are admin</T> <AdminInformation filledCircle />
            </div>
            : isJudge
              ? <div className="judge-admin jk-row center gap bc-we br-g6 jk-border-radius-inline fw-bd cr-py">
                <T className="tt-se">you are judge</T> <JudgeInformation filledCircle />
              </div>
              : (isContestant
                ? <div className="registered jk-row center gap bc-we br-g6 jk-border-radius-inline fw-br cr-py"><T
                  className="tt-se"
                >registered</T>
                </div>
                : (isGuest && new Date().getTime() <= contest.settings.endTimestamp)
                  ? (
                    <>
                      <div className="jk-row center">
                        <T className="tt-se">you are guest</T>,&nbsp;
                        {isLogged ? <T>enroll to participate</T> : <T>sign in to register</T>}
                      </div>
                      <ButtonLoader
                        onClick={(setLoader) => isLogged
                          ? registerContest(setLoader, contest?.key)
                          : appendSearchParams({ name: QueryParamKey.SIGN_IN, value: '1' })}
                        type="secondary"
                        extend
                      >
                        <T>{isLogged ? 'enroll' : 'sign in'}</T>
                      </ButtonLoader>
                    </>
                  ) : isSpectator && (
                  <div className="judge-admin jk-row center gap bc-we br-g6 jk-border-radius-inline fw-bd cr-py">
                    <T className="tt-se">you are spectator</T> <SpectatorInformation filledCircle />
                  </div>
                ))
          }
        </div>
        <div className="contest-content-side-right-bar-bottom jk-col stretch gap">
          <div className="jk-col bc-we br-g6 jk-border-radius-inline jk-pad-sm">
            <p className="tx-xs cr-g3 text-semi-bold"><T>start date</T></p>
            <p className="tx-s fw-bd">{dtf(contest.settings.startTimestamp)}</p>
          </div>
          {contest.settings.endTimestamp !== contest.settings.frozenTimestamp && (
            <div className="jk-col bc-we br-g6 jk-border-radius-inline jk-pad-sm">
              <div className="jk-row gap nowrap tx-xs cr-g3 fw-bd">
                <T>frozen date</T>
                <FrozenInformation />
              </div>
              <p className="tx-s fw-bd">{dtf(contest.settings.frozenTimestamp)}</p>
              <p className="tx-xs fw-bd">
                {rlt(Math.floor((contest.settings.frozenTimestamp - contest.settings.startTimestamp) / (60 * 1000)), 'minutes')}&nbsp;
                <T>from the start of the contest</T>
              </p>
            </div>
          )}
          {contest.settings.endTimestamp !== contest.settings.quietTimestamp && (
            <div className="jk-col bc-we br-g6 jk-border-radius-inline jk-pad-sm">
              <div className="jk-row gap tx-xs cr-g3 fw-bd">
                <T>quiet date</T>
                <QuietInformation />
              </div>
              <p className="tx-s fw-bd">{dtf(contest.settings.quietTimestamp)}</p>
              <p className="tx-xs fw-bd">
                {rlt(Math.floor((contest.settings.quietTimestamp - contest.settings.startTimestamp) / (60 * 1000)), 'minutes')}&nbsp;
                <T>from the start of the contest</T>
              </p>
            </div>
          )}
          {(contest.settings.endTimestamp - contest.settings.startTimestamp) !== contest.settings.timeToSolve && (
            <div className="jk-col bc-we br-g6 jk-border-radius-inline jk-pad-sm">
              <p className="tx-s semi-bold">{Math.ceil(contest.settings.timeToSolve / 1000 / 60)} min</p>
              <p className="tx-xs semi-bold"><T>time for solve</T></p>
            </div>
          )}
          {!!contest.settings.penalty && (
            <div className="jk-col bc-we br-g6 jk-border-radius-inline jk-pad-sm">
              <p className="tx-xs cr-g3 fw-bd"><T>penalty by incorrect answer</T></p>
              <p className="tx-s fw-bd">{contest.settings.penalty} min</p>
            </div>
          )}
          <div className="jk-col bc-we br-g6 jk-border-radius-inline jk-pad-sm">
            <p className="tx-xs cr-g3 fw-bd"><T>clarifications</T></p>
            <p className="tx-s fw-bd">
              <T>{contest.settings.clarifications ? 'clarifications available' : 'clarifications not available'}</T>
            </p>
          </div>
          <div className="jk-col bc-we br-g6 jk-border-radius-inline jk-pad-sm">
            <p className="tx-xs cr-g3 fw-bd"><T>languages</T></p>
            <div className="jk-row gap">
              {contest.settings.languages.map(language => (
                <div className="jk-tag" key={language}>{PROGRAMMING_LANGUAGE[language]?.label || language}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
