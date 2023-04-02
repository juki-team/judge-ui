import { CSSProperties } from 'react';

export const ProblemLetter = ({ color, index, style }: { color: string, index: string, style?: CSSProperties }) => {
  return (
    <div className="jk-row jk-tag" style={{ backgroundColor: color, ...style }}>
      <p
        style={{
          textShadow: 'var(--t-color-white) 0px 1px 2px, var(--t-color-white) 0px -1px 2px, ' +
            'var(--t-color-white) 1px 0px 2px, var(--t-color-white) -1px 0px 2px',
          color: 'var(--t-color-gray-1)',
        }}
      >
        {index}
      </p>
    </div>
  );
};
