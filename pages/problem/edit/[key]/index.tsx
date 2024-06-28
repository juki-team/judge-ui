import { jukiSettings } from '@juki-team/base-ui';
import { EditCreateProblem, FetcherLayer } from 'components';
import { useJukiRouter } from 'hooks';
import { ContentResponseType, ProblemResponseDTO } from 'types';
import Custom404 from '../../../404';

function ProblemEdit() {
  
  const { routeParams: { key } } = useJukiRouter();
  
  return (
    <FetcherLayer<ContentResponseType<ProblemResponseDTO>>
      url={jukiSettings.API.problem.getData({ params: { problemKey: key as string } }).url}
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
