import { MdMathEditor, MdMathViewer, Portal } from 'components';
import { consoleWarn } from 'helpers';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const defaultMessage = `# Bienvenido a Juki notas!,

Aca puedes escribir notas en markdown asi como formulas matemáticas,
para más información revisa el boton de información de la barra de herrmanientas.

Si deseas guardar las notas puedes hacerlo con el boton compartir que te generará un enlace único con tu nota.

Las notas no se auto-guardan, cada vez que modifiques una nota para guardarlo debes generar un nuevo enlace con el boton compartir.`;

const MarkdownSharedView = () => {
  const { query: { source, sourceUrl, view } } = useRouter();
  const [sourceContent, setSourceContent] = useState(source as string || defaultMessage);
  useEffect(() => {
    if (sourceUrl) {
      setSourceContent('');
      fetch(sourceUrl as string)
        .then(result => result.text())
        .then(data => setSourceContent(data))
        .catch(error => {
          consoleWarn(error);
        });
    }
  }, [sourceUrl]);
  if (view === 'printable') {
    return (
      <Portal>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: 'var(--100VH)', zIndex: 1000 }}>
          <style>{'.jk-app { display: none;} body { background-color: var(--t-color-white); }'}</style>
          <div className="jk-pad-md bc-we">
            <MdMathViewer source={sourceContent} />
          </div>
        </div>
      </Portal>
    );
  }
  if (view === 'fullscreen') {
    return (
      <div style={{ padding: '48px' }}>
        <MdMathEditor
          source={sourceContent}
          sharedButton
          downloadButton
          informationButton
          uploadImageButton
          onChange={value => setSourceContent(value)}
        />
      </div>
    );
  }
  return (
    <div>
      <h1>
        Notes
      </h1>
      <div>
        <MdMathEditor
          source={sourceContent}
          sharedButton
          downloadButton
          informationButton
          uploadImageButton
          onChange={value => setSourceContent(value)}
        />
      </div>
    </div>
  );
};

export default MarkdownSharedView;