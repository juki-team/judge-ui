import { ContentCopyIcon, CopyToClipboard } from '@juki-team/base-ui';
import { ButtonLoader, DateLiteral, FetcherLayer, ReloadIcon, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import Custom404 from 'pages/404';
import { ContentResponseType, Status } from 'types';

interface Response {
  Reservations: {
    Instances: {
      InstanceId: string,
      InstanceType: string,
      KeyName: string,
      LaunchTime: string,
      PlatformDetails: string,
      PublicDnsName: string,
      State: { Code: number, Name: string },
      Tags: { Key: string, Value: string }[],
    }[]
  }[];
}

export const EC2Management = () => {
  
  return (
    <>
      <FetcherLayer<ContentResponseType<Response>>
        url={JUDGE_API_V1.SYS.AWS_EC2_LIST()}
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
              <div className="jk-col">
                <div className="jk-row block extend jk-table-inline-header">
                  <div className="jk-row"><T>name</T></div>
                  <div className="jk-row"><T>instance ID</T></div>
                  <div className="jk-row"><T>instance state</T></div>
                  <div className="jk-row"><T>instance type</T></div>
                  {/*<div className="jk-row"><T>status check</T></div>*/}
                  <div className="jk-row"><T>public dns name</T></div>
                  <div className="jk-row"><T>key name</T></div>
                  <div className="jk-row"><T>launch time</T></div>
                </div>
                {data.content.Reservations?.map((reservation) => reservation.Instances).flat().map((instance) => (
                  <div className="jk-row block extend jk-table-inline-row">
                    <div className="jk-row fw-bd">
                      {instance.Tags.find((tag) => tag.Key === 'Name')?.Value}
                    </div>
                    <div className="jk-row">
                      {instance.InstanceId}
                    </div>
                    <div className="jk-row">
                      {instance.State.Name}
                    </div>
                    <div className="jk-row">
                      {instance.InstanceType}
                    </div>
                    <div className="jk-row">
                      {instance.PublicDnsName}
                    </div>
                    <div className="jk-row">
                      {instance.KeyName}
                      <CopyToClipboard text={`ssh -i "${instance.KeyName}.cer" ec2-user@${instance.PublicDnsName}`}>
                        <div className="jk-row"><ContentCopyIcon /> <T>connect</T></div>
                      </CopyToClipboard>
                    </div>
                    <div className="jk-row">
                      <DateLiteral date={new Date(instance.LaunchTime)} twoLines />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </FetcherLayer>
    </>
  );
};
