'use client';

import { MdMathEditor, MdMathViewer, PlusIcon, T } from 'components';
import { useUserStore } from 'hooks';
import { type Dispatch, type  SetStateAction, useState } from 'react';
import { Language, MdMathEditorProps, ProblemScoringMode, ProfileSetting, UpsertProblemUIDTO } from 'types';
import { SampleTest } from '../SampleTest';

interface ProblemStatementMdProps {
  problem: UpsertProblemUIDTO,
  setProblem: Dispatch<SetStateAction<UpsertProblemUIDTO>>,
  language: Language,
  recordHistory: () => void,
}

const EditorOnClick = (props: MdMathEditorProps) => {
  const [ editor, setEditor ] = useState(false);
  
  if (editor) {
    return (
      <MdMathEditor
        {...props}
        onBlur={() => setEditor(false)}
        className="bc-we"
      />
    );
  }
  
  return (
    <div
      className="jk-pg-xsm jk-br-ie bc-we br-hl"
      onClick={() => setEditor(true)}
    >
      <MdMathViewer source={props.value} />
    </div>
  );
};

export const ProblemStatementMd = ({ problem, setProblem, language, recordHistory }: ProblemStatementMdProps) => {
  
  const userPreferredLanguage = useUserStore(state => state.user.settings?.[ProfileSetting.LANGUAGE]);
  
  return (
    <div className="jk-col stretch" key={language}>
      <div>
        <h3><T className="tt-se">description</T></h3>
        <div className="text-editor">
          <EditorOnClick
            key={language}
            informationButton
            enableTextPlain
            enableImageUpload
            value={problem.statement.description?.[language]}
            onChange={value => {
              recordHistory();
              setProblem(prevState => ({
                ...prevState,
                statement: {
                  ...prevState.statement,
                  description: { ...prevState.statement.description, [language]: value },
                },
              }));
            }}
          />
        </div>
      </div>
      <div>
        <h3><T className="tt-se">input</T></h3>
        <div className="text-editor">
          <EditorOnClick
            key={language}
            informationButton
            enableTextPlain
            enableImageUpload
            value={problem.statement.input?.[language]}
            onChange={value => {
              recordHistory();
              setProblem(prevState => ({
                ...prevState,
                statement: {
                  ...prevState.statement,
                  input: { ...prevState.statement.input, [language]: value },
                },
              }));
            }}
          />
        </div>
      </div>
      <div>
        <h3><T className="tt-se">output</T></h3>
        <div className="text-editor">
          <EditorOnClick
            key={language}
            informationButton
            enableTextPlain
            enableImageUpload
            value={problem.statement.output?.[language]}
            onChange={value => {
              recordHistory();
              setProblem(prevState => ({
                ...prevState,
                statement: {
                  ...prevState.statement,
                  output: { ...prevState.statement.output, [language]: value },
                },
              }));
            }}
          />
        </div>
      </div>
      {problem.settings.scoringMode === ProblemScoringMode.SUBTASK && (
        <div>
          <h3><T className="tt-se">subtasks description</T></h3>
          <div className="jk-col left stretch gap">
            {Object.values(problem.settings.pointsByGroups).map(pointsByGroup => (
              <div className="jk-row extend gap" key={pointsByGroup.group}>
                {pointsByGroup.group !== 0 ? (
                  <>
                    <div className="jk-col fw-bd cr-pd" style={{ width: 100 }}>
                      <div className="tx-l"><T className="tt-se">subtask</T> {pointsByGroup.group}</div>
                      <div>
                        {pointsByGroup.points}&nbsp;
                        {pointsByGroup.points === 1 ? <T className="tt-se">point</T> :
                          <T className="tt-se">points</T>}
                      </div>
                    </div>
                    :
                    <div className="flex-1 text-editor bc-we">
                      <EditorOnClick
                        informationButton
                        enableTextPlain
                        enableImageUpload
                        enableIA
                        value={pointsByGroup.description?.[language]}
                        onChange={value => setProblem(prevState => ({
                          ...prevState,
                          settings: {
                            ...prevState.settings,
                            pointsByGroups: {
                              ...prevState.settings.pointsByGroups,
                              [pointsByGroup.group]: {
                                ...prevState.settings.pointsByGroups[pointsByGroup.group],
                                description: {
                                  ...prevState.settings.pointsByGroups[pointsByGroup.group]?.description,
                                  [language]: value,
                                },
                              },
                            },
                          },
                        }))}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 bc-we jk-pg-sm jk-br-ie">
                    <div className="fw-bd cr-pd">
                      <T className="tt-se">subtask</T> {pointsByGroup.group}
                      &nbsp;({pointsByGroup.points}&nbsp;
                      {pointsByGroup.points === 1
                        ? <T className="tt-se">point</T>
                        : <T className="tt-se">points</T>})
                    </div>
                    <MdMathViewer
                      source={pointsByGroup.description?.[userPreferredLanguage] || pointsByGroup.description?.[Language.ES] || pointsByGroup.description?.[Language.EN]}
                    />
                  </div>
                )}
              </div>
            ))}
            <div></div>
          </div>
        </div>
      )}
      <div className="jk-row stretch gap">
        <div className="jk-row stretch gap nowrap flex-1 jk-pg-sm-tb">
          <div className="jk-row"><T className="tt-se tx-h cr-th fw-bd tt-se">input sample</T></div>
          <div className="jk-row"><T className="tt-se tx-h cr-th fw-bd tt-se">output sample</T></div>
        </div>
        <div className="jk-row">
          <PlusIcon
            className="cr-py"
            filledCircle
            onClick={() => {
              recordHistory();
              setProblem(prevState => ({
                ...prevState,
                statement: {
                  ...prevState.statement,
                  sampleCases: [ ...prevState.statement.sampleCases, { input: '', output: '' } ],
                },
              }));
            }}
          />
        </div>
      </div>
      <div className="jk-col stretch gap">
        {(problem.statement.sampleCases || [ { input: '', output: '' } ]).map((_, index) => (
          <SampleTest
            index={index}
            sampleCases={problem.statement.sampleCases}
            key={index}
            setSampleCases={(sampleCases) => {
              recordHistory();
              setProblem(prevState => ({
                ...prevState,
                statement: { ...prevState.statement, sampleCases },
              }));
            }}
          />
        ))}
      </div>
      <div>
        <h3><T className="tt-se">note</T></h3>
        <div className="text-editor">
          <EditorOnClick
            key={language}
            informationButton
            enableTextPlain
            enableImageUpload
            value={problem.statement.note?.[language]}
            onChange={value => {
              recordHistory();
              setProblem(prevState => ({
                ...prevState,
                statement: {
                  ...prevState.statement,
                  note: { ...prevState.statement.note, [language]: value },
                },
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
};
