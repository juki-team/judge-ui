import { SetLoaderStatusOnClickType } from '@bit/juki-team.juki.base-ui';
import { ButtonLoader, MdMathViewer, T } from 'components';
import { useUserState } from '../../store';
import { ContestSettingsParams } from '../../types';

export const ContestOverview = ({ contest }: { contest: any }) => {
  
  const { canUpdate = false, canRejudge = false, canRegister = false, registered = false } = contest;
  const { isLogged } = useUserState();
  
  const registerContest = (key: string, setLoader: SetLoaderStatusOnClickType) => {
  
  };
  const updateFlags = (props: any) => {
  
  };
  return (
    <div className="jk-row gap nowrap start filled">
      <div className="jk-pad">
        <MdMathViewer source={contest?.description} />
      </div>
      <div>
        {canUpdate ? <div className="content-side-right-bar-top">
            <div className="judge-admin"><T>you are admin</T></div>
          </div> :
          canRejudge ? <div className="content-side-right-bar-top">
            <div className="judge-admin"><T>you are judge</T></div>
          </div> : (canRegister && (registered ? (
            <div className="content-side-right-bar-top">
              <div className="registered bold"><T>registered</T></div>
            </div>
          ) : new Date().getTime() <= contest?.settings.start + contest?.timing.duration && (
            <div className="content-side-right-bar-top">
              <ButtonLoader
                onClick={(setLoader) => isLogged
                  ? registerContest(contest?.key, setLoader)
                  : updateFlags({ openLoginModal: true })}
                type="primary"
                className="color-secondary"
                block
              >
                <T>{isLogged ? 'register' : 'to register, first login'}</T>
              </ButtonLoader>
            </div>
          )))}
        <div className="content-side-right-bar-bottom juki-card">
          {contest?.timing.duration !== contest?.timing.toSolve && (
            <div>
              <p className="text-xs semi-bold"><T>time for solve</T>:</p>
              <p className="text-s semi-bold">{Math.ceil(contest?.timing.toSolve / 1000 / 60)} min</p>
            </div>
          )}
          <div>
            <p className="text-xs semi-bold"><T>penalty by incorrect answer</T>:</p>
            <p className="text-s semi-bold">{Math.ceil(contest?.timing.penalty / 1000 / 60)} min</p>
          </div>
          <div>
            <p className="text-xs semi-bold"><T>scoreboard frozen after of</T>:</p>
            <p className="text-s semi-bold">{Math.ceil(contest?.timing.frozen / 1000 / 60)} min</p>
          </div>
          <div>
            <p className="text-xs semi-bold"><T>submissions will not be responded to after of</T></p>
            <p className="text-s semi-bold">{Math.ceil(contest?.timing.unJudged / 1000 / 60)} min</p>
          </div>
          <div>
            <p />
            <p className="text-s semi-bold">
              <T>{contest?.settings.clarifications ? 'clarifications available' : 'clarifications not available'}</T>
            </p>
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
