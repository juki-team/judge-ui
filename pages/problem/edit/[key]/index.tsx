import { EditCreateProblem, FetcherLayer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { useRouter } from 'hooks';
import React from 'react';
import { ContentResponseType, ProblemResponseDTO } from 'types';
import Custom404 from '../../../404';

function ProblemEdit() {
  
  const { query: { key } } = useRouter();
  
  return (
    <FetcherLayer<ContentResponseType<ProblemResponseDTO>>
      url={JUDGE_API_V1.PROBLEM.DATA(key as string)}
      errorView={<Custom404 />}
    >
      {({ data }) => {
        if (data.success && data.content.user.isEditor) {
          return <EditCreateProblem problem={data.content} />;
        }
        return <Custom404 />;
      }}
    </FetcherLayer>
  );
}

export default ProblemEdit;
