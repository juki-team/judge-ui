import { Input, Select, T, TextArea } from 'components';

export const ProblemSettings = ({ problem, setProblem }) => {
  return (
    <div className="jk-pad jk-row start">
      <div className="jk-col filled gap">
        <div>
          <T>programming languages</T>
        </div>
        <div>
          <T>problem mode</T>
        </div>
        <div>
          <T>time limit per test</T> <Input<number> value={problem.settings.timeLimit} onChange={() => null} /> {1 ? <T>seconds</T> :
          <T>second</T>}
        </div>
        <div>
          <T>memory limit per test</T><Input<number> value={problem.settings.memoryLimit} onChange={() => null} /> <T>kb</T>
        </div>
        <div className="jk-row start gap">
          <T>visibility</T> <Select options={[]} optionSelected={{ value: '' }} />
        </div>
        <div>
          <T>autor</T> <Input onChange={() => null} value={problem.author} />
        </div>
        <div>
          <T>tags</T>
          <T>write the tags separated by commas</T>
          <TextArea value={'asf'} />
        </div>
      </div>
    </div>
  );
};