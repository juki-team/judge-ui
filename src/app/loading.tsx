'use client';

import { T } from 'components';
import { CSSProperties } from 'react';

export default function Loading() {
  return (
    <div className="expand-absolute pe-ne jk-col bc-pd">
      <h1 className="jk-row cr-pt" style={{ alignItems: 'baseline' }}>
        <T className="tt-se">loading application</T>&nbsp;
        <div
          className="dot-flashing"
          style={{
            '--dot-flashing-color': 'var(--t-color-primary-text)',
            '--dot-flashing-color-light': 'var(--t-color-primary-light)',
            '--dot-flashing-size': '10px',
          } as CSSProperties}
        />
      </h1>
    </div>
  );
}
