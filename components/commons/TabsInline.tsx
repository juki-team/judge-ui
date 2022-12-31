import { renderReactNodeOrFunctionP1 } from '@juki-team/base-ui';
import { classNames } from 'helpers';

export const TabsInline = ({ tabs, tabSelected, pushTab, extraNodes }: { tabs, tabSelected, pushTab, extraNodes? }) => {
  return (
    <div className="jk-row space-between nowrap jk-tabs-inline">
      <div className="jk-row left stretch jk-tabs-headers-inline nowrap">
        {Object.values(tabs).map(({ key, header }) => (
          <div onClick={tabKey => pushTab(key)} className={classNames({ selected: key === tabSelected /*contestsTab*/ })}>
            {header}
          </div>
        ))}
      </div>
      <div className="jk-row gap nowrap">
        {extraNodes?.map(action => (
          renderReactNodeOrFunctionP1(action, { selectedTabKey: tabSelected })
        ))}
      </div>
    </div>
  );
};
