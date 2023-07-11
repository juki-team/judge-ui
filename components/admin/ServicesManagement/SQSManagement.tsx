import { AlertModal, Button, ButtonLoader, FetcherLayer, ReloadIcon, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useNotification } from 'hooks';
import Custom404 from 'pages/404';
import { ReactNode, useState } from 'react';
import { ContentResponseType, HTTPMethod, SqsPropertiesResponseDTO, Status } from 'types';

export const SQSManagement = () => {
  
  const [ modal, setModal ] = useState<ReactNode>(null);
  const { notifyResponse } = useNotification();
  
  return (
    <>
      {modal}
      <FetcherLayer<ContentResponseType<SqsPropertiesResponseDTO>>
        url={JUDGE_API_V1.SYS.AWS_SQS_LIST()}
        errorView={<Custom404 />}
      >
        {({ data, mutate }) => {
          return (
            <div className="jk-col top gap jk-pad-md bc-we jk-br-ie stretch">
              <div className="jk-row">
                <ButtonLoader
                  icon={<ReloadIcon />}
                  onClick={async (setLoaderStatus) => {
                    setLoaderStatus(Status.LOADING);
                    await mutate();
                    setLoaderStatus(Status.SUCCESS);
                  }}
                >
                  <T>reload</T>
                </ButtonLoader>
              </div>
              <div className="jk-col stretch">
                {Object.entries(data.content).map(([ key, queue ]) => (
                  <>
                    <div className="jk-divider" />
                    <div className="jk-row gap">
                      <div className="jk-col">
                        <div className="fw-bd">{key}</div>
                        <div className="tx-t fw-lr">{queue.QueueArn}</div>
                      </div>
                      <div className="jk-col stretch">
                        <div><T>approximate number of messages</T>: {queue.ApproximateNumberOfMessages}</div>
                        <div><T>approximate number of messages delayed</T>: {queue.ApproximateNumberOfMessagesDelayed}
                        </div>
                        <div>
                          <T>approximate number of messages not
                            visible</T>: {queue.ApproximateNumberOfMessagesNotVisible}
                        </div>
                        <div><T>receive message wait time seconds</T>: {queue.ReceiveMessageWaitTimeSeconds}</div>
                      </div>
                      <div>
                        <Button
                          className="bc-er"
                          onClick={() => {
                            setModal(
                              <AlertModal
                                onClose={() => setModal(null)}
                                decline={{
                                  onClick: () => {
                                    setModal(null);
                                  },
                                  label: <T>cancel</T>,
                                }}
                                accept={{
                                  onClick: async (setLoaderStatus) => {
                                    setLoaderStatus(Status.LOADING);
                                    const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                                      JUDGE_API_V1.SYS.AWS_SQS_QUEUE(
                                        key.replace('sqsJuki', '').replace('RunnerFifo', '').toLowerCase() as 'out',
                                      ),
                                      { method: HTTPMethod.POST },
                                    ));
                                    await mutate();
                                    if (notifyResponse(response, setLoaderStatus)) {
                                      setModal(null);
                                    }
                                  },
                                  label: <T>purge</T>,
                                }}
                                title={<T>purge queue</T>}
                                content={
                                  <div className="jk-col gap">
                                    <T>are you sure you want to purge the following queue permanently? This action
                                      cannot be
                                      undone.</T>
                                    <div className="fw-bd">- {key}</div>
                                  </div>
                                }
                              />,
                            );
                          }}
                        >
                          <T>purge</T>
                        </Button>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          );
        }}
      </FetcherLayer>
    </>
  );
};
