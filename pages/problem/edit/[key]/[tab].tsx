import { useRouter } from 'hooks';
import { useFetcher } from 'hooks';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { ContentResponseType } from 'types';

function ProblemEdit() {
  
  const { query } = useRouter();
  const { data } = useFetcher<ContentResponseType<any>>(JUDGE_API_V1.PROBLEM.PROBLEM(query.key as string));
  
  console.log(query, data);
  
  return (
    <div>
      <div>
        {query.tab}
      </div>
      <div>
      
      </div>
    </div>
  );
}

export default ProblemEdit;
