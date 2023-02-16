import { Breadcrumbs, JukiCompleteLaptopImage, JukiCourtImage, T, TwoContentSection } from 'components';

export default function Home() {
  const breadcrumbs = [
    <T className="tt-se">home</T>,
  ];
  
  return (
    <TwoContentSection>
      <div className="jk-col extend stretch">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right jk-row nowrap extend stretch gap" style={{ boxSizing: 'border-box' }}>
          <div className="jk-row"><h1 style={{ padding: 'var(--pad-md) 0' }}><T>welcome to Juki Judge</T></h1></div>
          <div className=""><JukiCourtImage /></div>
        </div>
      </div>
      <div className="pad-left-right pad-top-bottom">
        <div className="jk-row nowrap center top extend gap">
          <div className="jk-pad-md"><JukiCompleteLaptopImage /></div>
          <div className="jk-col gap ta-cr">
            <h3><T>competitive programmers home</T></h3>
            <p>Juki Judge <T>is designed to make people improve their programming skills</T></p>
          </div>
        </div>
      </div>
    </TwoContentSection>
  );
}
