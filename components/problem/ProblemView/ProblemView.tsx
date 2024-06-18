import { Button, FullscreenExitIcon, FullscreenIcon, SplitPane, T } from 'components';
import { useJukiUI, useState } from 'hooks';
import React from 'react';
import { Tooltip } from 'components';
import { ProgrammingLanguage, UserCodeEditorProps } from 'types';
import { classNames } from 'helpers';
import { ProblemCodeEditor } from './ProblemCodeEditor';
import { ProblemStatementView, ProblemStatementViewProps } from './ProblemStatementView';

export interface ProblemViewProps<T> extends ProblemStatementViewProps {
  codeEditorCenterButtons?: UserCodeEditorProps<T>['centerButtons'],
  codeEditorSourceStoreKey?: string,
}

export const ProblemView = <T = ProgrammingLanguage, >({
                                                         problem,
                                                         codeEditorCenterButtons,
                                                         codeEditorSourceStoreKey,
                                                         infoPlacement,
                                                         withoutName,
                                                       }: ProblemViewProps<T>) => {
  
  const { viewPortSize } = useJukiUI();
  const isMobileViewPort = viewPortSize === 'sm' || viewPortSize === 'md' || viewPortSize === 'lg';
  const [ expanded, setExpanded ] = useState(false);
  
  return (
    <SplitPane
      minSize={400}
      className={classNames('contest-problem-split-pane', { 'jk-full-screen-overlay': expanded })}
      closableSecondPane={isMobileViewPort ? {
        expandLabel: <T className="label tx-t">code editor</T>,
        align: 'center',
      } : undefined}
      closableFirstPane={isMobileViewPort ? {
        expandLabel: <T className="label tx-t">problem statement</T>,
        align: 'center',
      } : undefined}
      onePanelAtATime={viewPortSize === 'sm'}
    >
      <ProblemStatementView
        problem={problem}
        withoutName={expanded ? false : withoutName}
        infoPlacement={infoPlacement}
        // contest={{ index: routeParams?.index as string, color: problem.color }}
      />
      <ProblemCodeEditor
        problem={problem}
        codeEditorCenterButtons={codeEditorCenterButtons}
        codeEditorRightButtons={({ withLabels, twoRows }) => {
          const withText = twoRows || withLabels;
          
          if (withText) {
            return (
              <Button
                size="tiny"
                type="light"
                onClick={() => setExpanded(prevState => !prevState)}
                icon={expanded ? <FullscreenExitIcon /> : <FullscreenIcon />}
                extend={twoRows}
              >
                <T>{expanded ? 'back' : 'expand'}</T>
              </Button>
            );
          }
          
          return (
            <Tooltip content={<T>{expanded ? 'back' : 'expand'}</T>} placement="bottom-end">
              <Button
                size="tiny"
                type="light"
                onClick={() => setExpanded(prevState => !prevState)}
                icon={expanded ? <FullscreenExitIcon /> : <FullscreenIcon />}
                extend={twoRows}
              />
            </Tooltip>
          );
        }}
        codeEditorSourceStoreKey={codeEditorSourceStoreKey}
      />
    </SplitPane>
  );
};
