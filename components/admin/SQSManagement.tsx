import { ButtonLoader, FetcherLayer, ReloadIcon, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { useSWR } from 'hooks';
import { ContentResponseType, SqsPropertiesResponseDTO, Status } from 'types';
import Custom404 from '../../pages/404';

export const SQSManagement = () => {
  
  const { mutate } = useSWR();
  
  return (
    <FetcherLayer<ContentResponseType<SqsPropertiesResponseDTO>>
      url={JUDGE_API_V1.SYS.AWS_SQS_LIST()}
      errorView={<Custom404 />}
      options={{ refreshInterval: 10 * 1000 }}
    >
      {({ data }) => {
        return (
          <div className="jk-col gap jk-pad-md">
            <div>
              <ButtonLoader
                icon={<ReloadIcon />}
                onClick={async (setLoaderStatus) => {
                  setLoaderStatus(Status.LOADING);
                  await mutate(JUDGE_API_V1.SYS.AWS_SQS_LIST());
                  setLoaderStatus(Status.SUCCESS);
                }}
              ><T>reload</T></ButtonLoader>
            </div>
            {['sqsJukiHighRunnerFifo', 'sqsJukiLowRunnerFifo'].map(key => (
              <div className="jk-col" key={key}>
                <div className="fw-bd">{data.content[key].QueueArn}</div>
                <div><T>ApproximateNumberOfMessages</T>: {data.content[key].ApproximateNumberOfMessages}</div>
                <div><T>ApproximateNumberOfMessagesDelayed</T>: {data.content[key].ApproximateNumberOfMessagesDelayed}
                </div>
                <div>
                  <T>ApproximateNumberOfMessagesNotVisible</T>: {data.content[key].ApproximateNumberOfMessagesNotVisible}
                </div>
                <div><T>ReceiveMessageWaitTimeSeconds</T>: {data.content[key].ReceiveMessageWaitTimeSeconds}</div>
              </div>
            ))}
          </div>
        );
      }}
    </FetcherLayer>
  );
};
