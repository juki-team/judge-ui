import { InputToggle, LoadingIcon, T } from '..';
import { SettingsPopoverProps } from './types';

export const SettingsPopover = ({ loader, languageChecked, toggleLanguage, themeChecked, toggleTheme }: SettingsPopoverProps) => {
  return (
    <div className="jk-col gap filled settings-popover">
      <div className="jk-row semi-bold"><T className="sentence-case">settings</T></div>
      <div className="">
        <div className="semi-bold sentence-case"><T>language</T></div>
        <div className="jk-row gap">
          English
          {loader ? <LoadingIcon /> : <InputToggle checked={languageChecked} onChange={toggleLanguage} />}
          Español
        </div>
      </div>
      <div className="jk-col filled block">
        <div className="semi-bold sentence-case"><T>theme</T></div>
        <div className="jk-row gap">
          Light
          {loader ? <LoadingIcon /> : <InputToggle checked={themeChecked} onChange={toggleTheme} />}
          Dark
        </div>
      </div>
    </div>
  );
};