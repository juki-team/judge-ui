import { Button, NavigateBeforeIcon, NavigateNextIcon } from 'components';
import { classNames, renderReactNodeOrFunctionP1 } from 'helpers';
import { useJukiBase, useResizeDetector } from 'hooks';
import { Children, useCallback, useEffect, useRef, useState } from 'react';

export const WidthResizer = ({ Component, onOverflow, unOverflow, trigger }) => {
  const { width = 0, ref } = useResizeDetector();
  const widthRef = useRef(0);
  useEffect(() => {
    if (width && ref.current) {
      if (ref.current?.scrollWidth > ref.current?.offsetWidth) {
        widthRef.current = ref.current?.offsetWidth;
        onOverflow();
      } else if (ref.current?.scrollWidth === ref.current?.offsetWidth) {
        if (ref.current?.offsetWidth > widthRef.current) {
          unOverflow();
        }
      }
    }
  }, [width, onOverflow, unOverflow, trigger]);
  
  return (
    <Component reference={ref} />
  );
};

export const TabsInline = ({ tabs, tabSelected, pushTab, extraNodes }: { tabs, tabSelected, pushTab, extraNodes? }) => {
  
  const { viewPortSize } = useJukiBase();
  const tabsLength = Object.keys(tabs).length;
  const [tabsSize, setTabsSize] = useState(tabsLength);
  const [tabStartIndex, setTabStartIndex] = useState(0);
  useEffect(() => {
    if (tabsSize >= tabsLength) {
      setTabStartIndex(0);
    }
  }, [tabsSize, tabsLength, tabStartIndex]);
  
  const withArrows = tabsSize !== tabsLength;
  
  const Component = ({ reference }) => (
    <div className="jk-row gap space-between nowrap jk-tabs-inline extend">
      <div className="jk-row left gap flex-1">
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
          ref={reference}
        >
          {Children.toArray(Object.values(tabs).slice(tabStartIndex, tabStartIndex + tabsSize).map(({ key, header }) => (
            <div
              onClick={tabKey => pushTab(key)}
              className={classNames('jk-row stretch', { selected: key === tabSelected /*contestsTab*/ })}
            >
              {header}
            </div>
          )))}
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
          {Children.toArray(extraNodes?.map(action => (
            renderReactNodeOrFunctionP1(action, { selectedTabKey: tabSelected })
          )))}
        </div>
      ) : (
        <div className="jk-row gap nowrap">
          {Children.toArray(extraNodes?.map(action => (
            renderReactNodeOrFunctionP1(action, { selectedTabKey: tabSelected })
          )))}
        </div>
      )}
    </div>
  );
  
  const onOverflow = useCallback(() => setTabsSize(prevState => Math.max(prevState - 1, 1)), []);
  const unOverflow = useCallback(() => setTabsSize(prevState => Math.min(prevState + 1, tabsLength)), [tabsLength]);
  
  return (
    <WidthResizer
      onOverflow={onOverflow}
      unOverflow={unOverflow}
      Component={Component}
      trigger={tabsLength}
    />
  );
};
