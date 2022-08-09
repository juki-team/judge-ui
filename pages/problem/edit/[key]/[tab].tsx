import { JUDGE_API_V1 } from 'config/constants/judge';
import { useRouter } from 'hooks';
import { ProblemTab } from 'types';
import { FetcherLayer } from '../../../../components';
import { EditProblem } from '../../../../components/problem/EditProblem';
import { ROUTES } from '../../../../config/constants';
import { can } from '../../../../helpers';
import { dataToProblemResponseDTO } from '../../../../helpers/problem';
import { useUserState } from '../../../../store';
import Custom404 from '../../../404';

function ProblemEdit() {
  
  const { query: { key }, push } = useRouter();
  const user = useUserState();
  
  return (
    <FetcherLayer<any>
      url={JUDGE_API_V1.PROBLEM.PROBLEM(key as string)}
      onError={() => push(ROUTES.PROBLEMS.VIEW('' + key, ProblemTab.STATEMENT))}
    >
      {({ data }) => {
        if (data.success && !can.updateProblem(user, data.content)) {
          return <Custom404 />;
        }
        return <EditProblem problem={dataToProblemResponseDTO(data)} />;
      }}
    </FetcherLayer>
  );
}

export default ProblemEdit;
