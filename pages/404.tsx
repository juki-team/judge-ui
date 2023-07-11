import { HomeIcon, JukiSurprisedImage, T } from 'components';
import Link from 'next/link';
import { PropsWithChildren } from 'types';

export default function Custom404({ children }: PropsWithChildren<{}>) {
  return (
    <div className="jk-col extend">
      <div className="jk-col gap center">
        <div className="image-404"><JukiSurprisedImage /></div>
        {children || (
          <>
            <h3><T className="tt-ue">page not found</T></h3>
            <p><T className="tt-se">the page does not exist or you do not have permissions to view it</T></p>
            <Link href="/" className="link tt-ue">
              <div className="jk-row gap"><HomeIcon /><T>go to home page</T></div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
