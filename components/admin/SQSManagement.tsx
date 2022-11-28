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
    >
      {({ data }) => {
        const queues = Object.keys(data.content); // ['sqsJukiHighRunnerFifo', 'sqsJukiLowRunnerFifo', 'sqsJukiOutRunnerFifo']
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
            {queues.map(key => (
              <div className="jk-col" key={key}>
                <div className="fw-bd">{data.content[key].QueueArn}</div>
                <div><T>approximate number of messages</T>: {data.content[key].ApproximateNumberOfMessages}</div>
                <div><T>approximate number of messages delayed</T>: {data.content[key].ApproximateNumberOfMessagesDelayed}
                </div>
                <div>
                  <T>approximate number of messages not visible</T>: {data.content[key].ApproximateNumberOfMessagesNotVisible}
                </div>
                <div><T>receive message wait time seconds</T>: {data.content[key].ReceiveMessageWaitTimeSeconds}</div>
              </div>
            ))}
          </div>
        );
      }}
    </FetcherLayer>
  );
};
