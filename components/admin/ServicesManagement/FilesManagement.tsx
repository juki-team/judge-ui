import { Button, CurvedArrowIcon, Input, LoadingIcon, ReloadIcon, T, UpIcon, VisibilityIcon } from 'components/index';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useEffect, useState } from 'react';
import { ContentResponseType, ProgrammingLanguage } from 'types';
import { CodeViewer, Modal } from '../../index';

export function FilesManagement() {
  const [ path, setPath ] = useState('/');
  const [ list, setList ] = useState([]);
  const [ error, setError ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ back, setBack ] = useState([ '/' ]);
  const [ filePath, setFilePath ] = useState('');
  const [ contentFile, setContentFile ] = useState('');
  const loadPath = async () => {
    setLoading(true);
    const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.SYS.LS(path)));
    if (response.success) {
      setList(response.content);
      setError('');
    } else {
      setList([]);
      setError(response.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    (() => loadPath())();
  }, [ path ]);
  useEffect(() => {
    (async () => {
      if (filePath) {
        setContentFile('');
        const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.SYS.CAT(filePath)));
        if (response.success) {
          setContentFile(response.content);
          setError('');
        } else {
          setContentFile('');
          setError(response.message);
        }
      }
    })();
  }, [ filePath ]);
  return (
    <div className="jk-col extend stretch top jk-pad-md bc-we jk-br-ie">
      {filePath && (
        <Modal
          isOpen
          onClose={() => {
            setFilePath('');
            setContentFile('');
          }}
          closeWhenClickOutside
        >
          <div className="jk-pad-md">
            {contentFile === null ? <div className="jk-row"><LoadingIcon size="large" /></div> :
              <CodeViewer
                code={contentFile}
                language={ProgrammingLanguage.TEXT}
                lineNumbers
                withCopyButton
                withLanguageLabel
              />
            }
          </div>
        </Modal>
      )}
      <div className="jk-col top stretch extend nowrap">
        <h3><T>file list</T></h3>
        <div className="jk-row gap nowrap">
          <Input value={path} onChange={setPath} extend />
          <Button icon={<ReloadIcon />} type="text" onClick={loadPath} />
          <CurvedArrowIcon
            onClick={() => {
              if (back.length > 1) {
                setPath(back[back.length - 1]);
                setBack(back.slice(0, -1));
              } else {
                setPath('/');
              }
            }}
            rotate={-90}
          />
        </div>
        {loading ? <LoadingIcon /> : (
          <div
            style={{ overflow: 'auto', border: '1px solid var(--t-color-gray-6)' }}
            className="jk-border-radius-inline"
          >
            {error && <div className="jk-text-stderr">{error}</div>}
            <ul>
              {list.map(item => (
                <li key={item}>
                  <div className="jk-row left gap">
                    <div>{item}</div>
                    <div
                      className="jk-row"
                      onClick={() => {
                        setBack([ ...back, path ]);
                        setPath((path + '/' + item).split('//').join('/'));
                      }}
                    >
                      <UpIcon rotate={180} /><T>list</T>
                    </div>
                    <div className="jk-row" onClick={() => setFilePath(path + '/' + item)}>
                      <VisibilityIcon /> <T>view</T>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
