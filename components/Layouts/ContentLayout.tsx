import { CSSProperties, PropsWithChildren } from 'react';
import { useResizeDetector } from 'react-resize-detector';

export function ContentLayout({ children, style }: PropsWithChildren<{ style?: CSSProperties }>) {
  return (
    <section className="content-layout jk-row" style={style}>
      <div>
        {/*<div style={{ height: 'calc(var(--100VH) - var(--pad-md) - var(--pad-md) - var(--top-horizontal-menu-height))' }}>*/}
        {children}
      </div>
    </section>
  );
}

export function TwoContentLayout({ children }) {
  
  const { height, ref } = useResizeDetector();
  // TODO: Fix the + 12 solo si hay tabs
  return (
    <section className="two-content-layout jk-col nowrap top">
      <div ref={ref}>
        {children[0]}
      </div>
      <div
        style={{
          '--second-content-layout-min-height': 'calc(100VH - ' + (height/* + 12*/) + 'px - var(--top-horizontal-menu-height) - var(--pad-md) - var(--pad-md) - var(--mobile-bottom-horizontal-menu-height))',
          minHeight: 'var(--second-content-layout-min-height)',
        } as CSSProperties}
      >
        {children[1]}
      </div>
    </section>
  );
}
