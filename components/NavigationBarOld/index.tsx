import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/constants';
// import { useAccountDispatch, useAccountState, useFlagsDispatch, useFlagsState, useRouter } from '../../hooks';
import { ContestTimeStatus, LoaderState, Status } from '../../types';
import {
  ConstructionIcon,
  HeadlineIcon,
  HorizontalMenu,
  JukiCouchLogoHorImage,
  JukiJudgeLogoHorImage,
  JukiUtilsLogoHorImage,
  MdMathEditor,
  T,
} from '../commons';
import { SAMPLE_MD_CONTENT } from '../commons/MdMath/MdMathEditor/InformationButton/contants';
import { ChangeLanguage } from './ChangeLanguage';

export function NavigationBar() {
  const { query } = useRouter();
  console.log({ query });
  
  // const account = useAccountState();
  // const { logout } = useAccountDispatch();
  // const { pathnameParams, push } = useRouter();
  // const { openSignUpModal, openLoginModal, openWelcomeModal } = useFlagsState();
  // const { updateFlags } = useFlagsDispatch();
  const [loader, setLoader] = useState<LoaderState>([new Date().getTime(), Status.NONE]);
  const { t } = useTranslation();
  // useEffect(() => {
  //   if (account.isLogged) {
  //     updateFlags({ openSignUpModal: false, openLoginModal: false })();
  //   }
  // }, [account, updateFlags]);
  
  const handleMenu = ({ key }: any) => {
    if (key === 'logout') {
      // logout(setLoader)();
    }
  };
  // const keyTab = (pathnameParams[1] === ROUTES.PARAMS.CONTESTS || pathnameParams[1] === ROUTES.PARAMS.CONTEST) ? ROUTES.PARAMS.CONTESTS :
  //   (pathnameParams[1] === ROUTES.PARAMS.PROBLEM || pathnameParams[1] === ROUTES.PARAMS.PROBLEM) ? ROUTES.PARAMS.PROBLEMS :
  //     pathnameParams[1];
  // const { givenName, nickname } = account;
  
  const menuHorizontal = [
    { label: 'contests', selected: false, onClick: () => console.log('/contests') },
    { label: 'problems', selected: true, onClick: () => console.log('/problems') },
    { label: 'admin', selected: true, onClick: () => console.log('/admin') },
  ];
  
  const rightSection = ({}) => {
    return <div>Hi!</div>;
  };
  return (
    <>
      <HorizontalMenu
        menu={menuHorizontal}
        leftSection={<div className="jk-row color-white" style={{ width: '240px' }}><JukiJudgeLogoHorImage /></div>}
        rightSection={<div className="color-white">{rightSection({})}</div>}
        rightMobileMenu={{
          icon: <HeadlineIcon />,
          content: (open) => (
            <div className="jk-col gap more-apps-popover">
              <div className="semi-bold sentence-case"><T>more apps coming soon</T></div>
              <div className="jk-col gap color-primary">
                <div className="jk-row">
                  <JukiCouchLogoHorImage /> <ConstructionIcon /> <T className="sentence-case">developing</T>...
                </div>
                <div className="jk-row">
                  <JukiUtilsLogoHorImage /> <ConstructionIcon /> <T className="sentence-case">developing</T>...
                </div>
              </div>
            </div>
          ),
        }}
      >
        <div style={{ background: 'bisque' }}>
          <MdMathEditor source={SAMPLE_MD_CONTENT} uploadImageButton informationButton />
        </div>
      </HorizontalMenu>
      {/*{openSignUpModal && <SignUp />}*/}
      {/*{openLoginModal && <Login />}*/}
      {/*{openWelcomeModal && (*/}
      {/*  <Modal*/}
      {/*    visible={openWelcomeModal}*/}
      {/*    footer={null}*/}
      {/*    onCancel={updateFlags({ openWelcomeModal: false })}*/}
      {/*    className="modal-welcome"*/}
      {/*    centered*/}
      {/*  >*/}
      {/*    <div>*/}
      {/*      <h5>{t('hi')} <span className="given-name">{givenName}</span>!</h5>*/}
      {/*      <h3>{t('Welcome to the Online Juki Judge')}</h3>*/}
      {/*      <p>*/}
      {/*        {t('participe in coding contests ranging from beginner level to week-long coding marathons')}*/}
      {/*      </p>*/}
      {/*      <div>*/}
      {/*        <Button type="ghost" onClick={() => {*/}
      {/*          push(ROUTES.PROFILE.PAGE(nickname, ProfileTab.PROFILE));*/}
      {/*          updateFlags({ openWelcomeModal: false })();*/}
      {/*        }}>{t('see my profile')}</Button>*/}
      {/*        <Button onClick={updateFlags({ openWelcomeModal: false })}>{t('continue')}</Button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <img src="/images/juki-sitting-laptop.svg" alt="judge welcome" />*/}
      {/*    </div>*/}
      {/*  </Modal>*/}
      {/*)}*/}
      <div className="juki-layout-app-header">
        <div className="logo">
          <Link href="/">
            <JukiJudgeLogoHorImage />
          </Link>
        </div>
        <div className="juki-header-menu">
          <div key={ROUTES.PARAMS.CONTESTS}>
            <Link href={ROUTES.CONTESTS.LIST_PAGE(ContestTimeStatus.LIVE)}>{t('contests')}</Link>
          </div>
          <div key={ROUTES.PARAMS.PROBLEMS}>
            <Link href={ROUTES.PROBLEMS.LIST_PAGE()}>{t('problems')}</Link>
          </div>
          {/*{(can.createUser(account) || can.updateStatusUser(account) || can.updatePermissionsUser(account) ||*/}
          {/*  can.viewAllUsers(account) || can.viewActiveUsers(account)) && (*/}
          {/*  <div key={ROUTES.PARAMS.ADMIN}>*/}
          {/*    <Link href={ROUTES.ADMIN.PAGE(AdminTab.USERS)}>{t('admin')}</Link>*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
        {/*<ChangeLanguage />*/}
        {/*<div className={classNames('content-user', { logged: account.isLogged })}>*/}
        {/*  {account.isLogged ? (loader[1] === LOADING ? (<LoaderIcon />) : (*/}
        {/*    <>*/}
        {/*      <div className="profile-image">*/}
        {/*        <img alt={account.nickname} src={account.imageUrl || DEFAULT_JUKI_PROFILE_IMAGE} />*/}
        {/*      </div>*/}
        {/*      <Dropdown*/}
        {/*        trigger={['click']}*/}
        {/*        overlay={*/}
        {/*          <Menu className="layout-dropdown-body" onClick={handleMenu}>*/}
        {/*            /!*<div key="rating" className="rating-label" style={{ color: 'green' }}>*!/*/}
        {/*            /!*  Rating (100)*!/*/}
        {/*            /!*</Menu.Item>*!/*/}
        {/*            <Menu.Item key="settings">*/}
        {/*              <Link to={ROUTES.PROFILE.PAGE(account.nickname, ProfileTab.PROFILE)}>{t('my profile')}</Link>*/}
        {/*            </Menu.Item>*/}
        {/*            <Menu.Item key="logout">{t('logout')}</Menu.Item>*/}
        {/*          </Menu>*/}
        {/*        }*/}
        {/*        placement="bottomRight"*/}
        {/*        arrow*/}
        {/*        overlayClassName="dropdown-user-profile"*/}
        {/*      >*/}
        {/*        <div*/}
        {/*          className={classNames('text-m semi-bold', { 'on-my-profile': pathnameParams[2] === account.nickname })}>*/}
        {/*          {account.nickname} <DownArrowIcon />*/}
        {/*        </div>*/}
        {/*      </Dropdown>*/}
        {/*    </>*/}
        {/*  )) : (*/}
        {/*    <>*/}
        {/*      <Button*/}
        {/*        type="text"*/}
        {/*        className="sign-up-button"*/}
        {/*        onClick={updateFlags({ openSignUpModal: true })}*/}
        {/*      >*/}
        {/*        {t('sign up')}*/}
        {/*      </Button>*/}
        {/*      <Button type="primary" onClick={updateFlags({ openLoginModal: true })}>*/}
        {/*        {t('login')}*/}
        {/*      </Button>*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>
    </>
  );
}
