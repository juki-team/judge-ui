import { ButtonLoader, ExclamationIcon, MdMathViewer, Popover, T } from 'components';
import { JUDGE_API_V1, OpenDialog, QueryParam } from 'config/constants';
import { addParamQuery, authorizedRequest, cleanRequest } from 'helpers';
import { useNotification } from 'hooks';
import { useRouter } from 'next/router';
import { useUserState } from 'store';
import { useSWRConfig } from 'swr';
import { ContentResponseType, ContestResponseDTO, HTTPMethod, SetLoaderStatusOnClickType, Status } from 'types';

export const ContestOverview = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { isJudge, isAdmin, isContestant, isGuest } = contest;
  const { isLogged } = useUserState();
  const { push, query, locale } = useRouter();
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const { mutate } = useSWRConfig();
  
  const registerContest = async (setLoader: SetLoaderStatusOnClickType, key: string) => {
    setLoader(Status.LOADING);
    const result = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.CONTEST.REGISTER(query.key + ''), {
      method: HTTPMethod.POST,
    }));
    if (result.success) {
      if (result?.content?.registered) {
        addSuccessNotification(<T className="text-sentence-case">successfully registered</T>);
      }
      await mutate(JUDGE_API_V1.CONTEST.CONTEST(query.key as string));
      setLoader(Status.SUCCESS);
    } else {
      addErrorNotification(<T className="text-sentence-case">something went wrong, please try again later</T>);
      setLoader(Status.ERROR);
    }
  };
  
  const dtf = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeStyle: 'medium' });
  const ltf = new Intl.RelativeTimeFormat(locale);
  
  return (
    <div className="jk-row gap nowrap left stretch">
      <div className="jk-pad flex-3">
        <MdMathViewer source={contest?.description} />
      </div>
      <div className="jk-pad flex-1 contest-overview-information">
        <div className="content-side-right-bar-top">
          {isAdmin
            ? <div className="judge-admin jk-row bg-color-primary color-white jk-border-radius">
              <T className="text-sentence-case">you are admin</T>
            </div>
            : isJudge
              ? <div className="judge-admin jk-row bg-color-primary color-white jk-border-radius">
                <T className="text-sentence-case">you are judge</T>
              </div>
              : (isContestant
                ? <div className="registered jk-row bg-color-success color-white jk-border-radius text-bold"><T
                  className="text-sentence-case">registered</T>
                </div>
                : (isGuest && new Date().getTime() <= contest.endTimestamp) && (
                <ButtonLoader
                  onClick={(setLoader) => isLogged
                    ? registerContest(setLoader, contest?.key)
                    : push({ query: addParamQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.SIGN_IN) })}
                  type="secondary"
                  block
                >
                  <T>{isLogged ? 'register' : 'to register, first login'}</T>
                </ButtonLoader>
              ))}
        </div>
        <div className="content-side-right-bar-bottom jk-col stretch gap">
          <div className="jk-col">
            <p className="text-xs color-gray-3 text-semi-bold"><T>start date</T></p>
            <p className="text-s text-semi-bold">{dtf.format(contest.startTimestamp)}</p>
          </div>
          {contest.endTimestamp !== contest.frozenTimestamp && (
            <div className="jk-col">
              <div className="jk-row gap nowrap text-xs color-gray-3 text-semi-bold">
                <T>frozen date</T>
                <Popover
                  content={
                    <div style={{ width: '200px' }}>
                      <T className="text-sentence-case">in this period the scoreboard is not updated but the contestant will still be able to know the verdict of his
                        submissions</T>
                    </div>
                  }
                  triggerOn="hover"
                  placement="top"
                >
                  <div className="jk-row"><ExclamationIcon rotate={180} circle size="small" /></div>
                </Popover>
              </div>
              <p className="text-s text-semi-bold">{dtf.format(contest.frozenTimestamp)}</p>
              <p className="text-xs text-semi-bold">
                {ltf.format(Math.floor((contest.frozenTimestamp - contest.startTimestamp) / (60 * 1000)), 'minutes')}&nbsp;
                <T>from the start of the contest</T>
              </p>
            </div>
          )}
          {contest.endTimestamp !== contest.quietTimestamp && (
            <div className="jk-col">
              <div className="jk-row gap text-xs color-gray-3 text-semi-bold">
                <T>quiet date</T>
                <Popover
                  content={
                    <div style={{ width: '200px' }}>
                      <T className="text-sentence-case">in this period the scoreboard is not updated and the contestant will not be able to know the verdict of his
                        submissions</T>
                    </div>
                  }
                  triggerOn="hover"
                  placement="top"
                >
                  <div className="jk-row"><ExclamationIcon rotate={180} circle size="small" /></div>
                </Popover>
              </div>
              <p className="text-s text-semi-bold">{dtf.format(contest.quietTimestamp)}</p>
              <p className="text-xs text-semi-bold">
                {ltf.format(Math.floor((contest.quietTimestamp - contest.startTimestamp) / (60 * 1000)), 'minutes')}&nbsp;
                <T>from the start of the contest</T>
              </p>
            </div>
          )}
          {(contest.endTimestamp - contest.startTimestamp) !== contest.timeToSolve && (
            <div className="jk-col">
              <p className="text-s semi-bold">{Math.ceil(contest.timeToSolve / 1000 / 60)} min</p>
              <p className="text-xs semi-bold"><T>time for solve</T></p>
            </div>
          )}
          {contest.penalty && (
            <div className="jk-col">
              <p className="text-xs color-gray-3 text-semi-bold"><T>penalty by incorrect answer</T></p>
              <p className="text-s text-semi-bold">{Math.ceil(contest.penalty / 1000 / 60)} min</p>
            </div>
          )}
          <div className="jk-col">
            <p className="text-xs color-gray-3 text-semi-bold"><T>clarifications</T></p>
            <p className="text-s text-semi-bold">
              <T>{contest.clarifications ? 'clarifications available' : 'clarifications not available'}</T>
            </p>
          </div>
          <div>
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
          </div>
        </div>
      </div>
    </div>
  );
};
