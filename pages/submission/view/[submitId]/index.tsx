import { Breadcrumbs, SubmitView, T, TwoContentSection } from 'components';
import { useRouter } from 'hooks';
import Link from 'next/link';

function Submit() {
  
  const { query: { submitId }, isReady } = useRouter();
  
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <T className="tt-se">submission</T>,
    <div>{submitId}</div>,
  ];
  
  return (
    <TwoContentSection>
      <div className="jk-col stretch extend nowrap">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right">
          <h3>
            <T>submission</T>&nbsp;{submitId}
          </h3>
        </div>
      </div>
      <div className="pad-left-right pad-top-bottom">
        <div className="bc-we jk-pad-md jk-br-ie">
          <SubmitView submitId={submitId as string} />
        </div>
      </div>
    </TwoContentSection>
  );
  
}

export default Submit;
