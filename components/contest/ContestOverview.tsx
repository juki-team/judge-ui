import { ButtonLoader, MdMathViewer, T } from 'components';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';
import { JUDGE_API_V1, OpenDialog, POST, QueryParam } from '../../config/constants';
import { addParamQuery, authorizedRequest, cleanRequest } from '../../helpers';
import { useNotification } from '../../hooks';
import { useUserState } from '../../store';
import { ContentResponseType, ContestSettingsParams, SetLoaderStatusOnClickType, Status } from '../../types';

export const ContestOverview = ({ contest }: { contest: any }) => {
  
  const { canUpdate = false, canRejudge = false, canRegister = false, registered = false } = contest;
  const { isLogged } = useUserState();
  const { push, query } = useRouter();
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const { mutate } = useSWRConfig();
  
  const registerContest = async (setLoader: SetLoaderStatusOnClickType, key: string) => {
    //https://prod-v1-judge-back.juki.app/api/contest/prueba-2/register
    setLoader(Status.LOADING);
    const result = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.CONTEST.REGISTER(query.key + ''), {
      method: POST,
    }));
    console.log({ result });
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
  
  return (
    <div className="jk-row gap nowrap start filled">
      <div className="jk-pad flex-3">
        <MdMathViewer source={contest?.description} />
      </div>
      <div className="jk-pad flex-1">
        <div className="content-side-right-bar-top">
          {canUpdate
            ? <div className="judge-admin jk-row bg-color-primary color-white jk-border-radius">
              <T className="text-sentence-case">you are admin</T>
            </div>
            : canRejudge ?
              <div className="judge-admin jk-row bg-color-primary color-white jk-border-radius">
                <T className="text-sentence-case">you are judge</T>
              </div>
              : (canRegister && (registered ? (
                <div className="registered jk-row bg-color-primary color-white jk-border-radius text-bold"><T className="text-sentence-case">registered</T></div>
              ) : new Date().getTime() <= contest?.settings?.start + contest?.timing?.duration && (
                <ButtonLoader
                  onClick={(setLoader) => isLogged
                    ? registerContest(setLoader, contest?.key)
                    : push({ query: addParamQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.SIGN_IN) })}
                  type="secondary"
                  block
                >
                  <T>{isLogged ? 'register' : 'to register, first login'}</T>
                </ButtonLoader>
              )))}
        </div>
        <div className="content-side-right-bar-bottom juki-card">
          {contest?.timing?.duration !== contest?.timing?.toSolve && (
            <div className="jk-col">
              <p className="text-s semi-bold">{Math.ceil(contest?.timing?.toSolve / 1000 / 60)} min</p>
              <p className="text-xs semi-bold"><T>time for solve</T></p>
            </div>
          )}
          <div className="jk-col">
            <p className="text-s semi-bold">{Math.ceil(contest?.timing?.penalty / 1000 / 60)} min</p>
            <p className="text-xs color-gray-3 semi-bold"><T>penalty by incorrect answer</T></p>
          </div>
          <div className="jk-col">
            <p className="text-s semi-bold">{Math.ceil(contest?.timing?.frozen / 1000 / 60)} min</p>
            <p className="text-xs color-gray-3 semi-bold"><T>scoreboard frozen</T></p>
          </div>
          <div className="jk-col">
            <p className="text-s semi-bold">{Math.ceil(contest?.timing.unJudged / 1000 / 60)} min</p>
            <p className="text-xs color-gray-3 semi-bold"><T>submissions will not be responded</T></p>
          </div>
          <div className="jk-col">
            <p className="text-s semi-bold">
              <T>{contest?.settings.clarifications ? 'clarifications available' : 'clarifications not available'}</T>
            </p>
            <p />
          </div>
          <div>
            {contest?.settings[ContestSettingsParams.FROZEN] && canUpdate && (
              <div className="content-clarifications">
                {/*<Button onClick={() => setShowModal(true)} block>*/}
                {/*  {t('open scoreboard')}*/}
                {/*</Button>*/}
              </div>
            )}
            {new Date().getTime() > contest?.settings.start && (
              <div className="content-side-right-bar-bottom-bottom">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
