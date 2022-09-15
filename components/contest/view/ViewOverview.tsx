import { ButtonLoader, MdMathViewer, T } from 'components/index';
import { JUDGE_API_V1, OpenDialog, QueryParam } from 'config/constants';
import { addParamQuery, authorizedRequest, cleanRequest, notifyResponse, useDateFormat } from 'helpers';
import { useNotification } from 'hooks';
import { useRouter } from 'next/router';
import { useUserState } from 'store';
import { useSWRConfig } from 'swr';
import { ContentResponseType, ContestResponseDTO, HTTPMethod, SetLoaderStatusOnClickType, Status } from 'types';
import { AdminInformation, FrozenInformation, JudgeInformation, QuietInformation, SpectatorInformation } from '../Information';

export const ViewOverview = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { isJudge, isAdmin, isContestant, isGuest, isSpectator } = contest.user;
  const { isLogged, session } = useUserState();
  const { push, query } = useRouter();
  const { dtf, rlt } = useDateFormat();
  const { addNotification } = useNotification();
  const { mutate } = useSWRConfig();
  
  const registerContest = async (setLoader: SetLoaderStatusOnClickType, key: string) => {
    setLoader(Status.LOADING);
    const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(JUDGE_API_V1.CONTEST.REGISTER_V1(query.key + '', session), {
      method: HTTPMethod.POST,
    }));
    if (notifyResponse(response, addNotification)) {
      await mutate(JUDGE_API_V1.CONTEST.CONTEST_DATA(query.key as string, session));
      setLoader(Status.SUCCESS);
    } else {
      setLoader(Status.ERROR);
    }
  };
  
  return (
    <div className="jk-row gap nowrap left stretch">
      <div className="jk-pad flex-3">
        <MdMathViewer source={contest?.description} />
      </div>
      <div className="jk-pad flex-1 contest-overview-information">
        <div className="content-side-right-bar-top">
          {isAdmin
            ? <div className="judge-admin jk-row bg-color-primary color-white jk-border-radius">
              <T className="text-sentence-case">you are admin</T> <AdminInformation placement="bottom" />
            </div>
            : isJudge
              ? <div className="judge-admin jk-row bg-color-primary color-white jk-border-radius">
                <T className="text-sentence-case">you are judge</T> <JudgeInformation placement="bottom" />
              </div>
              : (isContestant
                ? <div className="registered jk-row bg-color-success color-white jk-border-radius tx-wd-bolder"><T
                  className="text-sentence-case">registered</T>
                </div>
                : (isGuest && new Date().getTime() <= contest.settings.endTimestamp)
                  ? (
                    <ButtonLoader
                      onClick={(setLoader) => isLogged
                        ? registerContest(setLoader, contest?.key)
                        : push({ query: addParamQuery(query, QueryParam.DIALOG, OpenDialog.SIGN_IN) })}
                      type="secondary"
                      block
                    >
                      <T>{isLogged ? 'register' : 'to register, first login'}</T>
                    </ButtonLoader>
                  ) : isSpectator && (
                  <div className="judge-admin jk-row bg-color-primary color-white jk-border-radius">
                    <T className="text-sentence-case">you are spectator</T> <SpectatorInformation placement="bottom" />
                  </div>
                ))}
        </div>
        <div className="contest-content-side-right-bar-bottom jk-col stretch gap">
          <div className="jk-col jk-border-radius-inline jk-pad-sm">
            <p className="text-xs color-gray-3 text-semi-bold"><T>start date</T></p>
            <p className="text-s text-semi-bold">{dtf(contest.settings.startTimestamp)}</p>
          </div>
          {contest.settings.endTimestamp !== contest.settings.frozenTimestamp && (
            <div className="jk-col jk-border-radius-inline jk-pad-sm">
              <div className="jk-row gap nowrap text-xs color-gray-3 text-semi-bold">
                <T>frozen date</T>
                <FrozenInformation />
              </div>
              <p className="text-s text-semi-bold">{dtf(contest.settings.frozenTimestamp)}</p>
              <p className="text-xs text-semi-bold">
                {rlt(Math.floor((contest.settings.frozenTimestamp - contest.settings.startTimestamp) / (60 * 1000)), 'minutes')}&nbsp;
                <T>from the start of the contest</T>
              </p>
            </div>
          )}
          {contest.settings.endTimestamp !== contest.settings.quietTimestamp && (
            <div className="jk-col jk-border-radius-inline jk-pad-sm">
              <div className="jk-row gap text-xs color-gray-3 text-semi-bold">
                <T>quiet date</T>
                <QuietInformation />
              </div>
              <p className="text-s text-semi-bold">{dtf(contest.settings.quietTimestamp)}</p>
              <p className="text-xs text-semi-bold">
                {rlt(Math.floor((contest.settings.quietTimestamp - contest.settings.startTimestamp) / (60 * 1000)), 'minutes')}&nbsp;
                <T>from the start of the contest</T>
              </p>
            </div>
          )}
          {(contest.settings.endTimestamp - contest.settings.startTimestamp) !== contest.settings.timeToSolve && (
            <div className="jk-col jk-border-radius-inline jk-pad-sm">
              <p className="text-s semi-bold">{Math.ceil(contest.settings.timeToSolve / 1000 / 60)} min</p>
              <p className="text-xs semi-bold"><T>time for solve</T></p>
            </div>
          )}
          {contest.settings.penalty && (
            <div className="jk-col jk-border-radius-inline jk-pad-sm">
              <p className="text-xs color-gray-3 text-semi-bold"><T>penalty by incorrect answer</T></p>
              <p className="text-s text-semi-bold">{Math.ceil(contest.settings.penalty / 1000 / 60)} min</p>
            </div>
          )}
          <div className="jk-col jk-border-radius-inline jk-pad-sm">
            <p className="text-xs color-gray-3 text-semi-bold"><T>clarifications</T></p>
            <p className="text-s text-semi-bold">
              <T>{contest.settings.clarifications ? 'clarifications available' : 'clarifications not available'}</T>
            </p>
          </div>
          {/*<div>*/}
          {/*{contest?.settings[ContestSettingsParams.FROZEN] && canUpdate && (*/}
          {/*  <div className="content-clarifications">*/}
          {/*<Button onClick={() => setShowModal(true)} block>*/}
          {/*  {t('open scoreboard')}*/}
          {/*</Button>*/}
          {/*</div>*/}
          {/*)}*/}
          {/*{new Date().getTime() > contest?.settings.start && (*/}
          {/*  <div className="content-side-right-bar-bottom-bottom">*/}
          {/* <a*/}
          {/*   href={[*/}
          {/*     BASE_URL,*/}
          {/*     ROUTES.PARAMS.CONTEST,*/}
          {/*    ROUTES.PARAMS.VIEW,*/}
          {/*    key,*/}
          {/*    ROUTES.PARAMS.PRINT_SCORE,*/}
          {/*  ].join('/')}*/}
          {/*  target="_blank" rel="noopener noreferrer"*/}
          {/*>*/}
          {/*  <Button block><T>print scoreboard</T></Button>*/}
          {/*</a>*/}
          {/*</div>*/}
          {/*)}*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};
