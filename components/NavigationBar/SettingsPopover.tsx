import { classNames } from '@juki-team/base-ui';
import { InputToggle, LoadingIcon, T } from '..';
import { SettingsPopoverProps } from './types';

export const SettingsPopover = ({ loader, languageChecked, toggleLanguage, themeChecked, toggleTheme }: SettingsPopoverProps) => {
  return (
    <div className="jk-col filled settings-popover">
      <div className="jk-row fw-bd"><T className="tt-se">settings</T></div>
      <div className="jk-row extend">
        <div className="jk-row left extend fw-bd"><T className="tt-se">language</T></div>
        <div className="jk-row gap nowrap extend space-between">
          <span className={classNames({ 'fw-bd': !languageChecked })}>English</span>
          {loader ? <LoadingIcon /> : <InputToggle checked={languageChecked} onChange={toggleLanguage} />}
          <span className={classNames({ 'fw-bd': languageChecked })}>Español</span>
        </div>
      </div>
      <div className="jk-row extend">
        <div className="jk-row left extend fw-bd"><T className="tt-se">theme</T></div>
        <div className="jk-row gap nowrap extend space-between">
          <span className={classNames({ 'fw-bd': !themeChecked })}><T className="tt-se">light</T></span>
          {loader ? <LoadingIcon /> : <InputToggle checked={themeChecked} onChange={toggleTheme} />}
          <span className={classNames({ 'fw-bd': themeChecked })}><T className="tt-se">dark</T></span>
        </div>
      </div>
    </div>
  );
};
