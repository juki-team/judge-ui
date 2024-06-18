import { UserCodeEditor } from 'components';
import { JUDGE_API_V1, PROGRAMMING_LANGUAGE } from 'config/constants';
import { useFetcher, useJukiUser } from 'hooks';
import { useMemo } from 'react';
import {
  CodeEditorTestCasesType,
  ContentResponseType,
  Judge,
  JudgeResponseDTO,
  ProblemResponseDTO,
  ProgrammingLanguage,
  SubmissionRunStatus,
  UserCodeEditorProps,
} from 'types';

interface ProblemCodeEditorProps<T> {
  problem: ProblemResponseDTO,
  codeEditorCenterButtons?: UserCodeEditorProps<T>['centerButtons'],
  codeEditorRightButtons?: UserCodeEditorProps<T>['rightButtons'],
  codeEditorSourceStoreKey?: string,
}

export const ProblemCodeEditor = <T, >({
                                         problem,
                                         codeEditorCenterButtons,
                                         codeEditorRightButtons,
                                       }: ProblemCodeEditorProps<T>) => {
  
  const initialTestCases: CodeEditorTestCasesType = {};
  problem.statement.sampleCases?.forEach((sample, index) => {
    const key = 'sample-' + index;
    initialTestCases[key] = {
      key,
      log: '',
      sample: true,
      status: SubmissionRunStatus.NONE,
      err: '',
      out: '',
      index,
      in: sample.input,
      withPE: problem.settings.withPE,
      testOut: sample.output,
      hidden: false,
    };
  });
  const { company: { key: companyKey } } = useJukiUser();
  const { data: virtualJudgeData } = useFetcher<ContentResponseType<JudgeResponseDTO>>(
    [ Judge.CODEFORCES, Judge.JV_UMSA, Judge.CODEFORCES_GYM ].includes(problem.judge) ? JUDGE_API_V1.JUDGE.GET(problem.judge, companyKey) : null,
  );
  const languages = useMemo(
    () => {
      let languages = [];
      if ([ Judge.CODEFORCES, Judge.JV_UMSA, Judge.CODEFORCES_GYM ].includes(problem.judge)) {
        languages = ((virtualJudgeData?.success && virtualJudgeData.content.languages) || [])
          .filter(lang => lang.enabled)
          .map(lang => ({
            value: lang.value,
            label: lang.label || lang.value,
          }));
      } else if (problem.judge === Judge.CUSTOMER || problem.judge === Judge.JUKI_JUDGE) {
        languages = Object.values(problem?.settings.byProgrammingLanguage || {})
          .map(({ language }) => ({
            value: language,
            label: PROGRAMMING_LANGUAGE[language]?.label || language,
          }));
      } else {
        languages = Object.values(problem?.settings.byProgrammingLanguage || {}).map(({ language }) => ({
          value: language,
          label: PROGRAMMING_LANGUAGE[language]?.label || language,
        }));
      }
      if (!languages.length) {
        languages = [ {
          value: ProgrammingLanguage.TEXT,
          label: PROGRAMMING_LANGUAGE[ProgrammingLanguage.TEXT]?.label,
        } ];
      }
      return languages as { value: T, label: string }[];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ JSON.stringify(problem?.settings.byProgrammingLanguage), virtualJudgeData, problem.judge ],
  );
  
  return (
    <UserCodeEditor<T>
      languages={languages}
      centerButtons={codeEditorCenterButtons}
      rightButtons={codeEditorRightButtons}
      initialTestCases={(problem.judge === Judge.JUKI_JUDGE || problem.judge === Judge.CUSTOMER)
        ? initialTestCases
        : undefined}
      enableAddCustomSampleCases
    />
  );
};
