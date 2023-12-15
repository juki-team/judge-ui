import { Breadcrumbs, HomeLink, SubmitView, T, TwoContentSection } from 'components';
import { useJukiRouter } from 'hooks';

function Submit() {
  
  const { routeParams: { submitId } } = useJukiRouter();
  
  const breadcrumbs = [
    <HomeLink key="home" />,
    <T className="tt-se" key="submission">submission</T>,
    <div key="submitId">{submitId}</div>,
  ];
  
  return (
    <TwoContentSection>
      <div className="jk-col stretch extend nowrap">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right">
          <h3>
            <T>submission</T>&nbsp;{submitId}
          </h3>
        </div>
      </div>
      <div className="pad-left-right pad-top-bottom">
        <div className="bc-we jk-pad-md jk-br-ie">
          <SubmitView submitId={submitId as string} />
        </div>
      </div>
    </TwoContentSection>
  );
  
}

export default Submit;
