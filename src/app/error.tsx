'use client';

import { Button, T, TwoContentLayout } from 'components';
import { oneTab } from 'helpers';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  
  return (
    <TwoContentLayout
      tabs={oneTab(
        <div className="jk-col gap">
          <T className="tt-se tx-l">{error.message}</T>
          <Button onClick={() => reset()}>
            <T>reload</T>
          </Button>
        </div>,
      )}
    >
      <h1>Error</h1>
    </TwoContentLayout>
  );
}
