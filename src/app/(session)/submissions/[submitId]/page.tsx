'use client';

import { SubmitView, T, TwoContentLayout } from 'components';
import { oneTab } from 'helpers';
import { useRouterStore } from 'hooks';

function Submit() {
  
  const submitId = useRouterStore(state => state.routeParams.submitId);
  
  const breadcrumbs = [
    <T className="tt-se" key="submission">submission</T>,
    <div key="submitId">{submitId}</div>,
  ];
  
  return (
    <TwoContentLayout
      breadcrumbs={breadcrumbs}
      tabs={oneTab(<div className="jk-pg bc-we jk-br-ie"><SubmitView submitId={submitId as string} /></div>)}
    >
      <h3><T>submission</T>&nbsp;{submitId}</h3>
    </TwoContentLayout>
  );
  
}

export default Submit;
