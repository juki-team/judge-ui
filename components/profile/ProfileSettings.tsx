import { classNames, InputToggle } from '@juki-team/base-ui';
import {
  Button,
  DarkModeIcon,
  FlagEnImage,
  FlagEsImage,
  InputRadio,
  LightModeIcon,
  LineLoader,
  LockIcon,
  T,
  VerticalSplitIcon,
  ViewHeadlineIcon,
  ViewModuleIcon,
} from 'components';
import { useToggleSetting } from 'components/NavigationBar/SettingsSection';
import React from 'react';
import { DataViewMode, Language, MenuViewMode, ProfileSetting, Theme } from 'types';

export function ProfileSettings({ user, setOpenModal }) {
  
  const {
    loading,
    toggleSetting,
    [ProfileSetting.LANGUAGE]: preferredLanguage,
    [ProfileSetting.THEME]: preferredTheme,
    [ProfileSetting.DATA_VIEW_MODE]: preferredDataViewMode,
    [ProfileSetting.MENU_VIEW_MODE]: preferredMenuViewMode,
    [ProfileSetting.NEWSLETTER_SUBSCRIPTION]: newsletterSubscription,
  } = useToggleSetting();
  
  return (
    <div className="jk-row gap top stretch">
      <div className="jk-col top extend">
        <h3><T>settings</T></h3>
        <div
          className="jk-col stretch gap bc-we jk-border-radius-inline jk-pad-md br-g6"
          style={{ width: 300, position: 'relative' }}
        >
          {loading && <LineLoader />}
          <div className="jk-col gap left stretch">
            <div className="jk-col stretch left gap" style={{ width: '100%' }}>
              <div className="jk-row left extend">
                <T className="tt-se tx-l fw-bd ta-ed ws-np">language</T>:&nbsp;
              </div>
              <div className="jk-row stretch gap space-between block extend">
                <div className="jk-row gap left nowrap">
                  <InputRadio
                    disabled={loading}
                    checked={preferredLanguage === Language.EN}
                    onChange={() => toggleSetting(ProfileSetting.LANGUAGE, Language.EN)}
                    label={
                      <div className="jk-row nowrap">
                        <div className="jk-row" style={{ width: 24, height: 24 }}><FlagEnImage /></div>
                        &nbsp;<T className="ws-np tt-se">english</T>
                      </div>
                    }
                  />
                </div>
                <div className="jk-row gap left nowrap">
                  <InputRadio
                    disabled={loading}
                    checked={preferredLanguage === Language.ES}
                    onChange={() => toggleSetting(ProfileSetting.LANGUAGE, Language.ES)}
                    label={
                      <div className="jk-row nowrap">
                        <div className="jk-row" style={{ width: 24, height: 24 }}><FlagEsImage /></div>
                        &nbsp;<T className="ws-np tt-se">español</T>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
            <div className="jk-col left gap nowrap" style={{ width: '100%' }}>
              <div className="jk-row left extend">
                <T className="tt-se tx-l fw-bd ta-ed ws-np">theme</T>:&nbsp;
              </div>
              <div className="jk-row stretch gap space-between block extend">
                <div className="jk-row gap left nowrap">
                  <InputRadio
                    disabled={loading}
                    checked={preferredTheme === Theme.LIGHT}
                    onChange={() => toggleSetting(ProfileSetting.THEME, Theme.LIGHT)}
                    label={
                      <div className="jk-row nowrap">
                        <LightModeIcon />
                        <T className="ws-np tt-se">light</T>
                      </div>
                    }
                  />
                </div>
                <div className="jk-row gap left nowrap">
                  <InputRadio
                    disabled={loading}
                    checked={preferredTheme === Theme.DARK}
                    onChange={() => toggleSetting(ProfileSetting.THEME, Theme.DARK)}
                    label={
                      <div className="jk-row nowrap">
                        <DarkModeIcon />
                        <T className="ws-np tt-se">dark</T>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
            <div className="jk-col left gap nowrap" style={{ width: '100%' }}>
              <div className="jk-row left extend">
                <T className="tt-se tx-l fw-bd ta-ed ws-np">data view</T>:&nbsp;
              </div>
              <div className="jk-row stretch gap space-between block extend">
                <div className="jk-row gap left nowrap">
                  <InputRadio
                    disabled={loading}
                    checked={preferredDataViewMode === DataViewMode.ROWS}
                    onChange={() => toggleSetting(ProfileSetting.DATA_VIEW_MODE, DataViewMode.ROWS)}
                    label={
                      <div className="jk-row nowrap">
                        <ViewHeadlineIcon />
                        <T className="ws-np tt-se">rows</T>
                      </div>
                    }
                  />
                </div>
                <div className="jk-row gap left nowrap">
                  <InputRadio
                    disabled={loading}
                    checked={preferredDataViewMode === DataViewMode.CARDS}
                    onChange={() => toggleSetting(ProfileSetting.DATA_VIEW_MODE, DataViewMode.CARDS)}
                    label={
                      <div className="jk-row nowrap">
                        <ViewModuleIcon />
                        <T className="ws-np tt-se">cards</T>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
            <div className="jk-col left gap nowrap" style={{ width: '100%' }}>
              <div className="jk-row left extend">
                <T className="tt-se tx-l fw-bd ta-ed ws-np">menu view</T>:&nbsp;
              </div>
              <div className="jk-row stretch gap space-between block extend">
                <div className="jk-row gap left nowrap">
                  <InputRadio
                    disabled={loading}
                    checked={preferredMenuViewMode === MenuViewMode.VERTICAL}
                    onChange={() => toggleSetting(ProfileSetting.MENU_VIEW_MODE, MenuViewMode.VERTICAL)}
                    label={
                      <div className="jk-row nowrap">
                        <VerticalSplitIcon rotate={180} />
                        <T className="ws-np tt-se">vertical</T>
                      </div>
                    }
                  />
                </div>
                <div className="jk-row gap left nowrap">
                  <InputRadio
                    disabled={loading}
                    checked={preferredMenuViewMode === MenuViewMode.HORIZONTAL}
                    onChange={() => toggleSetting(ProfileSetting.MENU_VIEW_MODE, MenuViewMode.HORIZONTAL)}
                    label={
                      <div className="jk-row nowrap">
                        <VerticalSplitIcon rotate={-90} />
                        <T className="ws-np tt-se">horizontal</T>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
            <div className="jk-col left gap nowrap" style={{ width: '100%' }}>
              <div className="jk-row left extend">
                <T className="tt-se tx-l fw-bd ta-ed ws-np">newsletter subscription</T>:&nbsp;
              </div>
              <div className="jk-row stretch gap space-between block extend">
                <div className="jk-row gap left nowrap">
                  <InputToggle
                    disabled={loading}
                    checked={newsletterSubscription}
                    onChange={() => toggleSetting(ProfileSetting.NEWSLETTER_SUBSCRIPTION, !newsletterSubscription)}
                    leftLabel={
                      <div className={classNames('jk-row nowrap', { 'fw-bd': !newsletterSubscription })}>
                        <T className="ws-np tt-se">no subscribed</T>
                      </div>
                    }
                    rightLabel={
                      <div className={classNames('jk-row nowrap', { 'fw-bd': newsletterSubscription })}>
                        <T className="ws-np tt-se">subscribed</T>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="jk-col top extend">
        <h3><T>actions</T></h3>
        <div className="jk-col stretch gap bc-we jk-border-radius-inline jk-pad-md br-g6" style={{ width: 300 }}>
          {user?.canUpdatePassword && (
            <Button size="small" icon={<LockIcon />} onClick={() => setOpenModal('UPDATE_PASSWORD')} extend>
              <T className="ws-np">update password</T>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
