import { WelcomeModalComponent } from 'components';
import { ROUTES } from 'config/constants';
import { removeParamQuery } from 'helpers';
import { useJukiUser } from 'hooks';
import { useRouter } from 'next/router';
import { OpenDialog, ProfileTab, QueryParam, Status } from 'types';

export const WelcomeModal = () => {
  
  const { user: { nickname } } = useJukiUser();
  const { push, query } = useRouter();
  const onClose = async (setLoaderStatus) => {
    setLoaderStatus(Status.LOADING);
    await push({ query: removeParamQuery(query, QueryParam.DIALOG, OpenDialog.WELCOME) });
    setLoaderStatus(Status.SUCCESS);
  };
  
  return (
    <WelcomeModalComponent
      nickname={nickname}
      onClose={onClose}
      onSeeMyProfile={async (setLoaderStatus) => {
        setLoaderStatus(Status.LOADING);
        await push(ROUTES.PROFILE.PAGE(nickname, ProfileTab.PROFILE));
        await onClose(setLoaderStatus);
        setLoaderStatus(Status.SUCCESS);
      }}
    />
  );
};
