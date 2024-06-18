import { SubmitView, T, TwoContentLayout } from 'components';
import { oneTab } from 'helpers';
import { useJukiRouter } from 'hooks';

function Submit() {
  
  const { routeParams: { submitId } } = useJukiRouter();
  
  const breadcrumbs = [
    <T className="tt-se" key="submission">submission</T>,
    <div key="submitId">{submitId}</div>,
  ];
  
  return (
    <TwoContentLayout
      breadcrumbs={breadcrumbs}
      tabs={oneTab(<SubmitView submitId={submitId as string} />)}
    >
      <h3><T>submission</T>&nbsp;{submitId}</h3>
    </TwoContentLayout>
  );
  
}

export default Submit;
