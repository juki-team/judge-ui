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
} from 'components';
import { classNames } from 'helpers';
import { useJukiBase, useUserDispatch } from 'hooks';
import React, { Dispatch, useState } from 'react';
import { Language, ProfileSettingOptions, Status, Theme } from 'types';
import { HelpSection } from './HelpSection';

export const SettingsSection = ({
  isMobile,
  isOpen,
  helpOpen,
  setHelpOpen,
}: { isMobile: boolean, isOpen: boolean, helpOpen: boolean, setHelpOpen: Dispatch<boolean> }) => {
  
  const { user: { isLogged, settings, nickname } } = useJukiBase();
  const { updateUserSettings, setUser } = useUserDispatch();
  const [loader, setLoader] = useState<Status>(Status.NONE);
  
  const toggleSetting = (key: ProfileSettingOptions, value: string) => {
    const newSettings = { ...settings };
    if (key === ProfileSettingOptions.LANGUAGE) {
      newSettings.preferredLanguage = value as Language;
    }
    if (key === ProfileSettingOptions.THEME) {
      newSettings.preferredTheme = value as Theme;
    }
    if (isLogged) {
      updateUserSettings(nickname, newSettings, (status: Status) => setLoader(status));
    } else {
      localStorage.setItem(key, value);
      setUser(prevState => ({ ...prevState, settings: newSettings }));
    }
  };
  
  const loading = loader === Status.LOADING;
  
  return (
    <>
      <div className="jk-row center extend">
        {isOpen && (
          loading
            ? <LoadingIcon style={{ margin: '0 var(--pad-xt)' }} />
            : <LanguageIcon style={{ margin: '0 var(--pad-xt)' }} />
        )}
        <div className="flex-1" style={{ marginRight: isOpen ? 'var(--pad-xt)' : undefined }}>
          <Select
            options={[
              { value: Language.EN, label: 'English' }, { value: Language.ES, label: 'Español' },
            ]}
            selectedOption={{ value: settings?.[ProfileSettingOptions.LANGUAGE] }}
            onChange={({ value }) => toggleSetting(ProfileSettingOptions.LANGUAGE, value)}
            disabled={loading}
            optionsPlacement={isMobile ? 'top' : 'right'}
            className={classNames('language-select', { 'tx-t': !isOpen })}
            extend
          />
        </div>
      </div>
      <div
        className="jk-row center extend"
        onClick={loading ? undefined : () => toggleSetting(ProfileSettingOptions.THEME, settings?.[ProfileSettingOptions.THEME] === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)}
        style={{ cursor: loading ? 'initial' : 'pointer' }}
      >
        {loading
          ? <LoadingIcon style={{ margin: '0 var(--pad-xt)' }} />
          : (
            settings?.[ProfileSettingOptions.THEME] === Theme.DARK
              ? <LightModeIcon style={{ margin: '0 var(--pad-xt)' }} />
              : <DarkModeIcon style={{ margin: '0 var(--pad-xt)' }} />
          )}
        {isOpen && (
          <div style={{ marginRight: 'var(--pad-xt)' }} className="flex-1 ta-cr">
            {settings?.[ProfileSettingOptions.THEME] === Theme.DARK
              ? <T className="tt-se">light mode</T>
              : <T className="tt-se">dark mode</T>}
          </div>
        )}
      </div>
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
        <HelpIcon style={{ margin: '0 var(--pad-xt)' }} />
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
            <div className="jk-col gap cr-py">
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
        placement={isMobile ? 'top' : 'right'}
      >
        <div className="jk-row center extend">
          <AppsIcon style={{ margin: '0 var(--pad-xt)' }} />
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
