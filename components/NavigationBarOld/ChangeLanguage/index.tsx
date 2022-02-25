import React from 'react';
// import { useProfileDispatch, useAccountDispatch, useAccountState } from '~/hooks';
// import { Language, LoaderState, ProfileSettingOptions, Status } from 'types';
// import { DownArrowIcon } from '~/graphics';
// import './styles.scss';

export const ChangeLanguage = () => {
  
  // const account = useAccountState();
  // const { replaceAccount } = useAccountDispatch();
  // const { updateUserSettings } = useProfileDispatch();
  // const [loader, setLoader] = useState<LoaderState>([0, Status.NONE]);
  // const handleMenu = ({ key }: any) => {
  //   if (key !== account?.mySettings[ProfileSettingOptions.LANGUAGE]) {
  //     if (account.isLogged) {
  //       updateUserSettings({
  //         ...account,
  //         settings: [
  //           ...account.settings.filter(setting => setting.key !== ProfileSettingOptions.LANGUAGE),
  //           { key: ProfileSettingOptions.LANGUAGE, value: key },
  //         ],
  //       }, setLoader)();
  //     } else {
  //       localStorage.setItem(ProfileSettingOptions.LANGUAGE, key);
  //       replaceAccount({
  //         ...account,
  //         mySettings: {
  //           ...account.mySettings,
  //           [ProfileSettingOptions.LANGUAGE]: key,
  //         },
  //       })();
  //     }
  //   }
  // };
  // return (
  //   <Dropdown
  //     trigger={['click']}
  //     overlay={
  //       <Menu className="layout-dropdown-body" onClick={handleMenu}>
  //         <Menu.Item key={Language.EN}>
  //           <img src="/images/en-flag.png" alt="english" /> English
  //         </Menu.Item>
  //         <Menu.Item key={Language.ES}>
  //           <img src="/images/es-flag.png" alt="english" /> Español
  //         </Menu.Item>
  //       </Menu>
  //     }
  //     placement="bottomCenter"
  //     arrow
  //     overlayClassName="language-selector-dropdown"
  //   >
  //     <div className="language-selector">
  //       {account?.mySettings[ProfileSettingOptions.LANGUAGE] === Language.EN ?
  //         <img src="/images/en-flag.png" alt="english" /> :
  //         <img src="/images/es-flag.png" alt="english" />
  //       }
  //       {loader[1] === LOADING ? <LoaderIcon /> : <DownArrowIcon />}
  //     </div>
  //   </Dropdown>
  // );
};
