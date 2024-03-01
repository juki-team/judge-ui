import { MdMathEditor } from 'components';
import { consoleWarn } from 'helpers';
import { useEffect, useJukiRouter, useState } from 'hooks';

const defaultMessage = `# Bienvenido a Juki notas!,

Aca puedes escribir notas en markdown asi como formulas matemáticas,
para más información revisa el botón de información de la barra de herramientas.

Si deseas guardar las notas puedes hacerlo con el botón compartir que te generará un enlace único con tu nota.

Las notas no se auto-guardan, cada vez que modifiques una nota para guardarlo debes generar un nuevo enlace con el botón compartir.`;

const MarkdownSharedView = () => {
  
  const { routeParams: { source, sourceUrl, view } } = useJukiRouter();
  const [ sourceContent, setSourceContent ] = useState(source as string || defaultMessage);
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
  }, [ sourceUrl ]);
  
  if (view === 'fullscreen') {
    return (
      <div style={{ padding: '48px' }}>
        <MdMathEditor
          source={sourceContent}
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
