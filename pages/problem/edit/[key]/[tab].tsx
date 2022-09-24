import { EditProblem, FetcherLayer } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useRouter } from 'hooks';
import { ContentResponseType, ProblemResponseDTO, ProblemTab } from 'types';
import Custom404 from '../../../404';

function ProblemEdit() {
  
  const { query: { key }, push } = useRouter();
  
  return (
    <FetcherLayer<ContentResponseType<ProblemResponseDTO>>
      url={JUDGE_API_V1.PROBLEM.DATA(key as string)}
      onError={() => push(ROUTES.PROBLEMS.VIEW('' + key, ProblemTab.STATEMENT))}
    >
      {({ data }) => {
        if (data.success/* && !can.updateProblem(user, data.content)*/) {
          return <Custom404 />;
        }
        return <EditProblem problem={data.content} />;
      }}
    </FetcherLayer>
  );
}

export default ProblemEdit;
