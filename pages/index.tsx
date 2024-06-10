import { Breadcrumbs, JukiCompleteLaptopImage, JukiCourtImage, T, TwoContentSection } from 'components';
import { useJukiUser } from 'hooks';

export default function Home() {
  
  const { company: { name } } = useJukiUser();
  
  return (
    <TwoContentSection>
      <div className="jk-col extend stretch">
        <Breadcrumbs breadcrumbs={[]} />
        <div className="jk-pg-rl jk-row nowrap extend stretch gap" style={{ boxSizing: 'border-box' }}>
          <div className="jk-row">
            <h1 style={{ padding: 'var(--pad-md) 0' }}>
              <T>welcome to</T>&nbsp;<span className="fw-br cr-sy ws-np">{name}</span>&nbsp;
              <span className="fw-br cr-py">judge</span></h1>
          </div>
          <div className=""><JukiCourtImage /></div>
        </div>
      </div>
      <div className="jk-pg-rl jk-pg-tb">
        <div className="jk-row nowrap center top extend gap">
          <div className="jk-pg-md"><JukiCompleteLaptopImage /></div>
          <div className="jk-col gap ta-cr">
            <h3><T>competitive programmers home</T></h3>
            <p>{name} judge <T>is designed to make people improve their programming skills</T></p>
          </div>
        </div>
      </div>
    </TwoContentSection>
  );
}
