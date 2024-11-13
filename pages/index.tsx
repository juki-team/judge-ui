import { oneTab, TwoContentLayout } from '@juki-team/base-ui';
import { JukiCompleteLaptopImage, JukiCourtImage, T } from 'components';
import { useJukiUser } from 'hooks';

export default function Home() {
  
  const { company: { name } } = useJukiUser();
  
  return (
    <TwoContentLayout
      breadcrumbs={[]}
      tabs={oneTab(
        <div className="jk-row nowrap center top extend gap pn-re">
          <div className="jk-pg-md"><JukiCompleteLaptopImage /></div>
          <div className="jk-col gap ta-cr">
            <h3><T>competitive programmers home</T></h3>
            <p>{name} judge <T>is designed to make people improve their programming skills</T></p>
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
            <T>welcome to</T>&nbsp;<span className="fw-br cr-sy ws-np">{name}</span>&nbsp;
            <span className="fw-br cr-py">judge</span></h1>
        </div>
        <div className=""><JukiCourtImage /></div>
      </div>
    </TwoContentLayout>
  );
}
