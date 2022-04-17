import { AlertModal, ArrowIcon, ButtonLoader, ProblemStatement, T, Tabs, TwoContentLayout } from 'components';
import { ROUTES } from 'config/constants';
import { diff, updatedDiff } from 'deep-object-diff';
import { useRouter } from 'hooks';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { ProblemTab, Status } from 'types';
import { ProblemSettings } from './ProblemSettings';
import { TitleEditable } from './TitleEditable';

const ReactJson = dynamic(import('react-json-view'), { ssr: false });

export const EditProblem = ({ problem }) => {
  
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
  
  const tabs = [ProblemTab.STATEMENT, ProblemTab.SETUP, ProblemTab.TESTS];
  console.log(updatedDiff(originalProblemRef.current, newProblem));
  return (
    <TwoContentLayout>
      <div className="jk-col filled">
        {modal}
        <div className="jk-row left gap nowrap">
          <div className="jk-row" onClick={() => {
            const accept = () => push(ROUTES.PROBLEMS.VIEW('' + newProblem.id, ProblemTab.STATEMENT));
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
        selectedTabIndex={index[query.tab as ProblemTab]}
        tabHeaders={[
          { children: <T className="text-capitalize">statement</T> },
          { children: <T className="text-capitalize">settings</T> },
          { children: <T className="text-capitalize">test cases</T> },
        ]}
        onChange={index => push({ pathname: ROUTES.PROBLEMS.EDIT('' + key, tabs[index]), query })}
        actionsSection={
          <ButtonLoader
            type="secondary"
            onClick={async setLoaderStatus => {
              setLoaderStatus(Status.LOADING);
              await push(ROUTES.PROBLEMS.EDIT('' + key, ProblemTab.STATEMENT));
              setLoaderStatus(Status.SUCCESS);
            }}
          >
            <T>save</T>
          </ButtonLoader>
        }
      >
        <ProblemStatement problem={newProblem} setProblem={setNewProblem} originalProblemRef={originalProblemRef} />
        <ProblemSettings problem={newProblem} setProblem={setNewProblem} originalProblemRef={originalProblemRef} />
        <div>sub</div>
      </Tabs>
    </TwoContentLayout>
  );
};