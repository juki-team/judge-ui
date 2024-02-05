import { MdMathViewer } from 'components';
import { consoleWarn } from 'helpers';
import { useJukiRouter } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Theme } from 'types';

function MarkdownSharedView() {
  console.log('MarkdownSharedView');
  
  const { routeParams: { source, sourceUrl, theme } } = useJukiRouter();
  const [ sourceContent, setSourceContent ] = useState(source as string || '');
  useEffect(() => {
    if (theme === Theme.DARK) {
      document.querySelector('body')?.classList.add('jk-theme-dark');
    } else {
      document.querySelector('body')?.classList.add('jk-theme-light');
    }
    const body = document.querySelector('body');
    if (body) {
      body.style.backgroundColor = 'var(--t-color-white)';
    }
    console.log({ body, theme, sourceUrl });
    if (sourceUrl) {
      fetch(sourceUrl as string)
        .then(result => result.text())
        .then(data => setSourceContent(data))
        .catch(error => consoleWarn(error));
    }
  }, [ sourceUrl, theme ]);
  
  return (
    <div className="jk-pad-md bc-we">
      <MdMathViewer source={sourceContent} />
    </div>
  );
}

export default MarkdownSharedView;
