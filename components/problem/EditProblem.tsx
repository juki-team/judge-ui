import { AlertModal, ArrowIcon, ButtonLoader, ProblemStatement, T, Tabs, TwoContentLayout } from 'components';
import { ROUTES } from 'config/constants';
import { diff } from 'deep-object-diff';
import { useRouter } from 'hooks';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { ProblemResponseDTO, ProblemTab, Status } from 'types';
import { ProblemSettings } from './ProblemSettings';
import { TitleEditable } from './TitleEditable';

const ReactJson = dynamic(import('react-json-view'), { ssr: false });

export const EditProblem = ({ problem }: { problem: ProblemResponseDTO }) => {
  
  const { query: { key, ...query }, push } = useRouter();
  const originalProblemRef = useRef(problem);
  const [newProblem, setNewProblem] = useState(problem);
  const [noChange, setNoChanges] = useState(false);
  const [modal, setModal] = useState(null);
  
  useEffect(() => {
    setNoChanges(JSON.stringify(originalProblemRef.current) === JSON.stringify(newProblem));
  }, [newProblem]);
  const index = {
    [ProblemTab.STATEMENT]: 0,
    [ProblemTab.SETUP]: 1,
    [ProblemTab.TESTS]: 2,
  };
  
  const tabs = [];
  return (
    <TwoContentLayout>
      <div className="jk-col filled">
        {modal}
        <div className="jk-row left gap nowrap">
          <div className="jk-row" onClick={() => {
            const accept = () => push(ROUTES.PROBLEMS.VIEW('' + newProblem.key, ProblemTab.STATEMENT));
            if (noChange) {
              accept();
            } else {
              setModal(
                <AlertModal
                  title={<h4><T>attention</T></h4>}
                  accept={{ onClick: () => setModal(null), label: <T>close</T> }}
                  content={
                    <div>
                      <T className="text-sentence-case">there are unsaved changes</T>:
                      <div className="alert-modal-json-viewer jk-border-radius-inline">
                        <ReactJson
                          src={diff(originalProblemRef.current, newProblem)}
                          enableClipboard={false}
                          collapsed={true}
                          name={false}
                        />
                      </div>
                    </div>
                  }
                  decline={{ onClick: accept, label: <T>continue without saving</T> }}
                  onCancel={() => setModal(null)}
                />,
              );
            }
          }}>
            <ArrowIcon rotate={-90} filledCircle className="color-primary" size="large" />
          </div>
          <TitleEditable value={newProblem.name} onChange={value => setNewProblem({ ...problem, name: value })} />
        </div>
      </div>
      <Tabs
        selectedTabKey={query.tab as ProblemTab}
        tabs={[
          {
            key: ProblemTab.STATEMENT,
            header: <T className="text-capitalize">statement</T>,
            body: <ProblemStatement problem={newProblem} setProblem={setNewProblem} originalProblemRef={originalProblemRef} />,
          },
          {
            key: ProblemTab.SETUP,
            header: <T className="text-capitalize">settings</T>,
            body: <ProblemSettings problem={newProblem} setProblem={setNewProblem} originalProblemRef={originalProblemRef} />,
          },
          { key: ProblemTab.TESTS, header: <T className="text-capitalize">test cases</T>, body: <div>test cases</div> },
        ]}
        onChange={tabKey => push({ pathname: ROUTES.PROBLEMS.EDIT('' + key, tabKey), query })}
        actionsSection={[
          <ButtonLoader
            type="secondary"
            onClick={async setLoaderStatus => {
              setLoaderStatus(Status.LOADING);
              await push(ROUTES.PROBLEMS.EDIT('' + key, ProblemTab.STATEMENT));
              setLoaderStatus(Status.SUCCESS);
            }}
          >
            <T>save</T>
          </ButtonLoader>,
        ]}
      />
    </TwoContentLayout>
  );
};