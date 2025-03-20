'use client';

import { JukiCompleteLaptopImage, JukiCourtImage, T, TwoContentLayout } from 'components';
import { oneTab } from 'helpers';
import { useUserStore } from 'hooks';

export default function Home() {
  
  const companyName = useUserStore(state => state.company.name);
  
  return (
    <TwoContentLayout
      breadcrumbs={[]}
      tabs={oneTab(
        <div className="jk-row nowrap center top extend gap pn-re">
          <div className="jk-pg-md"><JukiCompleteLaptopImage /></div>
          <div className="jk-col gap ta-cr">
            <h3><T className="tt-se">competitive programmers home</T></h3>
            <p>{companyName} judge <T>is designed to make people improve their programming skills</T></p>
          </div>
          {/*{key === JUKI_APP_COMPANY_KEY && (*/}
          {/*  <div>*/}
          {/*  */}
          {/*  </div>*/}
          {/*)}*/}
        </div>,
      )}
    >
      <div className="jk-pg-rl jk-row nowrap extend stretch gap pn-re" style={{ boxSizing: 'border-box' }}>
        <div className="jk-row pn-re">
          <h1 style={{ padding: 'var(--pad-md) 0' }}>
            <T className="tt-se">welcome to</T>&nbsp;<span className="fw-br cr-sy ws-np">{companyName}</span>&nbsp;
            <span className="fw-br cr-py">judge</span></h1>
        </div>
        <div className=""><JukiCourtImage /></div>
      </div>
    </TwoContentLayout>
  );
}
