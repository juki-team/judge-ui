import { JUDGE_API_V1 } from 'config/constants/judge';
import { useFetcher, useRouter } from 'hooks';
import { ContentResponseType, ProblemTab } from 'types';
import { FetcherLayer, NotFound } from '../../../../components';
import { EditProblem } from '../../../../components/problem/EditProblem';
import { ROUTES } from '../../../../config/constants';
import { can } from '../../../../helpers';
import { useUserState } from '../../../../store';
import Custom404 from '../../../404';

function ProblemEdit() {
  
  const { query: { key, ...query }, push } = useRouter();
  const user = useUserState();
  const { isLoading, data } = useFetcher<ContentResponseType<any>>(JUDGE_API_V1.PROBLEM.PROBLEM(key as string));
  
  return (
    <FetcherLayer<any>
      isLoading={isLoading}
      data={data}
      error={!data?.success ? <NotFound redirectAction={() => push(ROUTES.PROBLEMS.VIEW('' + key, ProblemTab.STATEMENT))} /> : null}
    >
      {data => {
        if (data.success && !can.updateProblem(user, data.content)) {
          return <Custom404 />;
        }
        return <EditProblem problem={data.content} />;
      }}
    </FetcherLayer>
  );
}

export default ProblemEdit;
