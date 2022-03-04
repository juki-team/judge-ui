import { MdMathViewer, T } from '../../components';
import { ProblemInfo } from './ProblemInfo';
import { SampleTest } from './SampleTest';

export const ProblemStatement = ({ problem }) => {
  
  return (
    <div>
      <div className="problem-head-box text-xh bold child-center">
        {/*{subTab && <div className="index shadow">{subTab}</div>}*/}
        {/*{subTab && <h6 className="title">{problem.name}</h6>}*/}
      </div>
      <div className="jk-row nowrap filled start problem-content">
        <div className="jk-pad">
          <div>
            {/*<h6><T>description</T></h6>*/}
            <MdMathViewer source={problem?.description?.general} />
          </div>
          <div>
            <h6><T>input</T></h6>
            <MdMathViewer source={problem?.description?.input} />
          </div>
          <div>
            <h6><T>output</T></h6>
            <MdMathViewer source={problem?.description?.output} />
          </div>
          <div className="problem-samples-box">
            <div className="jk-row">
              <h6><T>input sample</T></h6>
              <h6><T>output sample</T></h6>
            </div>
            <div className="jk-col filled gap">
              {(problem.samples || [{ input: '', output: '' }]).map((sample, index) => (
                <SampleTest index={index} problem={problem} key={index} />
              ))}
            </div>
          </div>
        </div>
        <div className="screen lg hg"><ProblemInfo problem={problem} /></div>
      </div>
    </div>
  );
};
