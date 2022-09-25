import { InputToggle, LoadingIcon, T } from '..';
import { SettingsPopoverProps } from './types';

export const SettingsPopover = ({ loader, languageChecked, toggleLanguage, themeChecked, toggleTheme }: SettingsPopoverProps) => {
  return (
    <div className="jk-col gap filled settings-popover">
      <div className="jk-row fw-bd"><T className="tt-se">settings</T></div>
      <div className="">
        <div className="fw-bd tt-se"><T>language</T></div>
        <div className="jk-row gap nowrap">
          English
          {loader ? <LoadingIcon /> : <InputToggle checked={languageChecked} onChange={toggleLanguage} />}
          Español
        </div>
      </div>
      {/*<div className="jk-col filled block">*/}
      {/*  <div className="semi-bold tt-se"><T>theme</T></div>*/}
      {/*  <div className="jk-row gap">*/}
      {/*    Light*/}
      {/*    {loader ? <LoadingIcon /> : <InputToggle checked={themeChecked} onChange={toggleTheme} />}*/}
      {/*    Dark*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};