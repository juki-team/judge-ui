import { Theme } from '@juki-team/commons';
import { MdMathViewer } from 'components';
import { consoleWarn } from 'helpers';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const MarkdownSharedView = () => {
  const { query: { source, sourceUrl, theme } } = useRouter();
  const [sourceContent, setSourceContent] = useState(source as string || '');
  useEffect(() => {
    if (theme === Theme.DARK) {
      document.querySelector('body')?.classList.add('jk-theme-dark');
    } else {
      document.querySelector('body')?.classList.add('jk-theme-light');
    }
    if (document.querySelector('body')) {
      document.querySelector('body').style.backgroundColor = 'var(--t-color-white)';
    }
    if (sourceUrl) {
      fetch(sourceUrl as string)
        .then(result => result.text())
        .then(data => setSourceContent(data))
        .catch(error => consoleWarn(error));
    }
  }, [sourceUrl]);
  return (
    <div className="jk-pad-md bc-we">
      <MdMathViewer source={sourceContent} />
    </div>
  );
};

export default MarkdownSharedView;
