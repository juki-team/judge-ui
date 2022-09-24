import { EditProblem, FetcherLayer } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { dataToProblemResponseDTO } from 'helpers';
import { useRouter } from 'hooks';
import { ProblemTab } from 'types';
import Custom404 from '../../../404';

function ProblemEdit() {
  
  const { query: { key }, push } = useRouter();
  
  return (
    <FetcherLayer<any>
      url={JUDGE_API_V1.PROBLEM.PROBLEM(key as string)}
      onError={() => push(ROUTES.PROBLEMS.VIEW('' + key, ProblemTab.STATEMENT))}
    >
      {({ data }) => {
        if (data.success/* && !can.updateProblem(user, data.content)*/) {
          return <Custom404 />;
        }
        return <EditProblem problem={dataToProblemResponseDTO(data)} />;
      }}
    </FetcherLayer>
  );
}

export default ProblemEdit;
