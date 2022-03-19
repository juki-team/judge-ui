import { useResizeDetector } from 'react-resize-detector';

export function ContentLayout({ children }) {
  return (
    <section className="content-layout jk-row">
      <div>
        {children}
      </div>
    </section>
  );
}

export function TwoContentLayout({ children }) {
  
  const { height, ref } = useResizeDetector();
  // TODO: Fix the + 12 solo si hay tabs
  return (
    <section className="two-content-layout jk-col nowrap start">
      <div ref={ref}>
        {children[0]}
      </div>
      <div style={{ height: 'calc(100% - ' + (height + 12) + 'px - 0px)' }}>
        {children[1]}
      </div>
    </section>
  );
}

