'use client';

import { SubmitView, T, TwoContentLayout, useRouterStore } from '@juki-team/base-ui';
import { oneTab } from '@juki-team/base-ui/helpers';

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
      <h3>
        <T className="tt-se">submission</T>&nbsp;
        <span className="tx-m" style={{ fontFamily: 'monospace' }}>[{submitId}]</span>
      </h3>
    </TwoContentLayout>
  );
  
}

export default Submit;
