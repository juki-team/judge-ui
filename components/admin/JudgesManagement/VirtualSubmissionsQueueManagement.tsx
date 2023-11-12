import { Button, ButtonLoader, FetcherLayer, ReloadIcon, T, TwoActionModal } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useNotification } from 'hooks';
import Custom404 from 'pages/404';
import { ReactNode, useState } from 'react';
import { ContentResponseType, HTTPMethod, SqsPropertiesType, Status } from 'types';

export const VirtualSubmissionsQueueManagement = () => {
  
  const [ modal, setModal ] = useState<ReactNode>(null);
  const { notifyResponse } = useNotification();
  
  return (
    <>
      {modal}
      <FetcherLayer<ContentResponseType<SqsPropertiesType>>
        url={JUDGE_API_V1.JUDGE.SQS_STATUS()}
        errorView={<Custom404 />}
      >
        {({ data, mutate }) => {
          const queue = data.content;
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
                <div className="jk-divider" />
                <div className="jk-row gap">
                  <div className="jk-col">
                    <div className="fw-bd">sqsQueueVirtualSubmissions</div>
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
                          <TwoActionModal
                            isOpen
                            onClose={() => setModal(null)}
                            secondary={{
                              onClick: () => {
                                setModal(null);
                              },
                              label: <T>cancel</T>,
                            }}
                            primary={{
                              onClick: async (setLoaderStatus) => {
                                setLoaderStatus(Status.LOADING);
                                const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                                  JUDGE_API_V1.JUDGE.SQS_DELETE(),
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
                          >
                            <div className="jk-col gap">
                              <T>are you sure you want to purge queue permanently? This action cannot be undone.</T>
                            </div>
                          </TwoActionModal>,
                        );
                      }}
                    >
                      <T>purge</T>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </FetcherLayer>
    </>
  );
};
