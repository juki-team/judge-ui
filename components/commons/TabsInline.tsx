import { useJukiBase } from '@juki-team/base-ui';
import { Button, NavigateBeforeIcon, NavigateNextIcon } from 'components';
import { classNames, renderReactNodeOrFunctionP1 } from 'helpers';
import { useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';

export const TabsInline = ({ tabs, tabSelected, pushTab, extraNodes }: { tabs, tabSelected, pushTab, extraNodes? }) => {
  const { width: widthTabs = 0, ref: refTabs } = useResizeDetector();
  const { viewPortSize } = useJukiBase();
  const tabsLength = Object.keys(tabs).length;
  const [tabsSize, setTabsSize] = useState(tabsLength);
  const [tabStartIndex, setTabStartIndex] = useState(0);
  const flagRef = useRef(0);
  useEffect(() => {
    if (widthTabs && refTabs.current) {
      if (refTabs.current?.scrollWidth > refTabs.current?.offsetWidth) {
        setTabsSize(prevState => Math.max(prevState - 1, 1));
        flagRef.current = refTabs.current?.offsetWidth;
      } else if (refTabs.current?.scrollWidth === refTabs.current?.offsetWidth) {
        if (refTabs.current?.offsetWidth > flagRef.current) {
          setTabsSize(prevState => Math.min(prevState + 1, tabsLength));
        }
      }
    }
    if (tabsSize === tabsLength) {
      setTabStartIndex(0);
    }
  }, [tabsSize, widthTabs, tabsLength, tabStartIndex]);
  
  const withArrows = tabsSize !== tabsLength;
  
  return (
    <div className="jk-row gap space-between nowrap jk-tabs-inline extend">
      <div className="jk-row left gap extend">
        {withArrows && (
          <Button
            icon={<NavigateBeforeIcon />}
            type="secondary"
            size="small"
            onClick={() => setTabStartIndex(prevState => Math.max(prevState - 1, 0))}
            disabled={!(tabStartIndex > 0)}
            style={!(tabStartIndex > 0) ? { cursor: 'initial', opacity: 0 } : {}}
          />
        )}
        <div
          className={classNames('jk-row left stretch jk-tabs-headers-inline nowrap', {
            'block flex-1': withArrows,
            'block extend': viewPortSize === 'sm',
          })}
          ref={refTabs}
        >
          {Object.values(tabs).slice(tabStartIndex, tabStartIndex + tabsSize).map(({ key, header }) => (
            <div
              onClick={tabKey => pushTab(key)}
              className={classNames('jk-row stretch', { selected: key === tabSelected /*contestsTab*/ })}
            >
              {header}
            </div>
          ))}
        </div>
        {withArrows && (
          <Button
            icon={<NavigateNextIcon />}
            type="secondary"
            size="small"
            onClick={() => setTabStartIndex(prevState => prevState + 1)}
            disabled={!(tabStartIndex + tabsSize < tabsLength)}
            style={!(tabStartIndex + tabsSize < tabsLength) ? { cursor: 'initial', opacity: 0 } : {}}
          />
        )}
      </div>
      {viewPortSize === 'sm' ? (
        <div className="jk-col gap nowrap" style={{ position: 'absolute', bottom: 'var(--pad-t)', right: 'var(--pad-t)' }}>
          {extraNodes?.map(action => (
            renderReactNodeOrFunctionP1(action, { selectedTabKey: tabSelected })
          ))}
        </div>
      ) : (
        <div className="jk-row gap nowrap">
          {extraNodes?.map(action => (
            renderReactNodeOrFunctionP1(action, { selectedTabKey: tabSelected })
          ))}
        </div>
      )}
    </div>
  );
};
