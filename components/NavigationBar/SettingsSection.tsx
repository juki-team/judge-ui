import { UserSettingsType } from '@juki-team/commons';
import {
  AppsIcon,
  DarkModeIcon,
  HelpIcon,
  Image,
  JukiCouchLogoHorImage,
  JukiUtilsLogoHorImage,
  LanguageIcon,
  LightModeIcon,
  LoadingIcon,
  Modal,
  Popover,
  Select,
  T,
  VerticalSplitIcon,
  ViewHeadlineIcon,
  ViewModuleIcon,
} from 'components';
import { classNames } from 'helpers';
import { useJukiBase, useUserDispatch } from 'hooks';
import React, { Dispatch, useState } from 'react';
import { DataViewMode, Language, MenuViewMode, ProfileSetting, Status, Theme } from 'types';
import { HelpSection } from './HelpSection';

export const useToggleSetting = () => {
  const { user: { isLogged, settings, nickname } } = useJukiBase();
  const { updateUserSettings, setUser } = useUserDispatch();
  const [loader, setLoader] = useState<Status>(Status.NONE);
  const toggleSetting = async (key: ProfileSetting, value: string | boolean) => {
    const newSettings: UserSettingsType = { ...settings };
    if (key === ProfileSetting.LANGUAGE) {
      newSettings[ProfileSetting.LANGUAGE] = value as Language;
    }
    if (key === ProfileSetting.THEME) {
      newSettings[ProfileSetting.THEME] = value as Theme;
    }
    if (key === ProfileSetting.DATA_VIEW_MODE) {
      newSettings[ProfileSetting.DATA_VIEW_MODE] = value as DataViewMode;
    }
    if (key === ProfileSetting.MENU_VIEW_MODE) {
      newSettings[ProfileSetting.MENU_VIEW_MODE] = value as MenuViewMode;
    }
    if (key === ProfileSetting.NEWSLETTER_SUBSCRIPTION) {
      newSettings[ProfileSetting.NEWSLETTER_SUBSCRIPTION] = value as boolean;
    }
    if (isLogged) {
      await updateUserSettings(nickname, newSettings, (status: Status) => setLoader(status));
    } else {
      localStorage.setItem(key, value + '');
      setUser(prevState => ({ ...prevState, settings: newSettings }));
    }
  };
  const loading = loader === Status.LOADING;
  return {
    ...settings,
    loading,
    toggleSetting,
  };
};

export const LanguageSetting = ({ isOpen, popoverPlacement, small }) => {
  
  const { loading, toggleSetting, [ProfileSetting.LANGUAGE]: preferredLanguage } = useToggleSetting();
  
  return (
    <div className="jk-row center extend">
      {isOpen && (
        loading
          ? <LoadingIcon style={{ margin: '0 var(--pad-xt)' }} />
          : <LanguageIcon style={{ margin: '0 var(--pad-xt)' }} />
      )}
      <div className="jk-row flex-1" style={{ marginRight: isOpen ? 'var(--pad-xt)' : undefined }}>
        <Select
          options={[
            { value: Language.EN, label: 'English' }, { value: Language.ES, label: 'Español' },
          ]}
          selectedOption={{ value: preferredLanguage }}
          onChange={({ value }) => toggleSetting(ProfileSetting.LANGUAGE, value)}
          disabled={loading}
          optionsPlacement={popoverPlacement}
          className={classNames('language-select', { 'tx-t small': !!small })}
          extend={small}
        />
      </div>
    </div>
  );
};

export const ThemeSetting = ({ isOpen, small }) => {
  
  const { loading, toggleSetting, [ProfileSetting.THEME]: preferredTheme } = useToggleSetting();
  
  const isDark = preferredTheme === Theme.DARK;
  
  return (
    <div
      className="jk-row center extend"
      onClick={loading ? undefined : () => toggleSetting(ProfileSetting.THEME, preferredTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)}
      style={{ cursor: loading ? 'initial' : 'pointer' }}
    >
      {loading
        ? <LoadingIcon style={{ margin: '0 var(--pad-xt)' }} />
        : (
          isDark
            ? <LightModeIcon style={small ? { margin: '0 var(--pad-xt)' } : undefined} />
            : <DarkModeIcon style={small ? { margin: '0 var(--pad-xt)' } : undefined} />
        )}
      {isOpen && (
        <div style={{ marginRight: 'var(--pad-xt)' }} className="flex-1 ta-cr">
          {isDark
            ? <T className="tt-se">light mode</T>
            : <T className="tt-se">dark mode</T>}
        </div>
      )}
    </div>
  );
};

export const DataViewModeSetting = () => {
  
  const { loading, toggleSetting, [ProfileSetting.DATA_VIEW_MODE]: preferredDataViewMode } = useToggleSetting();
  
  const isCards = preferredDataViewMode === DataViewMode.CARDS;
  
  return (
    <div
      className="jk-row nowrap center extend"
      onClick={loading ? undefined : () => toggleSetting(ProfileSetting.DATA_VIEW_MODE, preferredDataViewMode === DataViewMode.ROWS ? DataViewMode.CARDS : DataViewMode.ROWS)}
      style={{ cursor: loading ? 'initial' : 'pointer' }}
    >
      {loading
        ? <LoadingIcon style={{ margin: '0 var(--pad-xt)' }} />
        : (
          isCards
            ? <ViewHeadlineIcon style={{ margin: '0 var(--pad-xt)' }} />
            : <ViewModuleIcon style={{ margin: '0 var(--pad-xt)' }} />
        )}
      <div style={{ marginRight: 'var(--pad-xt)' }} className="flex-1 ta-cr">
        {isCards
          ? <T className="ws-np tt-se">rows</T>
          : <T className="ws-np tt-se">cards</T>}
      </div>
    </div>
  );
};

export const MenuViewModeSetting = () => {
  
  const { loading, toggleSetting, [ProfileSetting.MENU_VIEW_MODE]: preferredMenuViewMode } = useToggleSetting();
  
  const isHorizontal = preferredMenuViewMode === MenuViewMode.HORIZONTAL;
  
  return (
    <div
      className="jk-row nowrap center extend"
      onClick={loading ? undefined : () => toggleSetting(ProfileSetting.MENU_VIEW_MODE, preferredMenuViewMode === MenuViewMode.VERTICAL ? MenuViewMode.HORIZONTAL : MenuViewMode.VERTICAL)}
      style={{ cursor: loading ? 'initial' : 'pointer' }}
    >
      {loading
        ? <LoadingIcon style={{ margin: '0 var(--pad-xt)' }} />
        : (
          isHorizontal
            ? <VerticalSplitIcon rotate={180} style={{ margin: '0 var(--pad-xt)' }} />
            : <VerticalSplitIcon rotate={-90} style={{ margin: '0 var(--pad-xt)' }} />
        )}
      <div style={{ marginRight: 'var(--pad-xt)' }} className="flex-1 ta-cr">
        {isHorizontal
          ? <T className="ws-np tt-se">vertical</T>
          : <T className="ws-np tt-se">horizontal</T>}
      </div>
    </div>
  );
};

export const SettingsSection = ({
  isMobile,
  isOpen,
  helpOpen,
  setHelpOpen,
  popoverPlacement,
}: { isMobile: boolean, isOpen: boolean, helpOpen: boolean, setHelpOpen: Dispatch<boolean>, popoverPlacement: 'top' | 'bottom' | 'right' }) => {
  
  const { viewPortSize, user: { settings: { [ProfileSetting.THEME]: preferredTheme } } } = useJukiBase();
  
  const isDark = preferredTheme === Theme.DARK;
  
  const margin = (popoverPlacement === 'right' && isOpen) || !(viewPortSize === 'md' && popoverPlacement === 'bottom');
  return (
    <>
      <LanguageSetting
        isOpen={isOpen}
        popoverPlacement={popoverPlacement}
        small={(popoverPlacement === 'right' && !isOpen) || (popoverPlacement === 'bottom' && viewPortSize === 'md')}
      />
      <ThemeSetting
        isOpen={isOpen}
        small={margin}
      />
      <Modal
        isOpen={helpOpen && !isMobile}
        onClose={() => setHelpOpen(false)}
        closeIcon
        closeWhenClickOutside
        className="width-auto"
      >
        <div className="jk-col nowrap extend stretch jk-pad-md">
          <div className="jk-row">
            <HelpSection />
            <div className="jk-row ">
              <Image
                src="https://images.juki.pub/c/juki-help-2-image.svg"
                alt="help"
                height={220}
                width={220}
              />
            </div>
          </div>
        </div>
      </Modal>
      <div className="jk-row center extend" onClick={() => setHelpOpen(true)}>
        <HelpIcon style={margin ? { margin: '0 var(--pad-xt)' } : undefined} />
        {isOpen && (
          <div style={{ marginRight: 'var(--pad-xt)' }} className="flex-1 ta-cr">
            <T className="tt-se">help</T>
          </div>
        )}
      </div>
      <Popover
        content={
          <div className="jk-col gap more-apps-popover">
            <div className="semi-bold tt-se"><T>more apps coming soon</T></div>
            <div className={classNames('jk-col gap ', { 'cr-py': !isDark, 'cr-b2': isDark })}>
              <div className="jk-row">
                <JukiCouchLogoHorImage /> <LoadingIcon size="small" /> <T className="tt-se">developing</T>...
              </div>
              <div className="jk-row">
                <JukiUtilsLogoHorImage /> <LoadingIcon size="small" /> <T className="tt-se">developing</T>...
              </div>
            </div>
          </div>
        }
        triggerOn="click"
        placement={popoverPlacement}
      >
        <div className="jk-row center extend">
          <AppsIcon style={margin ? { margin: '0 var(--pad-xt)' } : undefined} />
          {isOpen && (
            <div style={{ marginRight: 'var(--pad-xt)' }} className="flex-1 ta-cr">
              <T className="tt-se">more apps</T>
            </div>
          )}
        </div>
      </Popover>
    </>
  );
};
