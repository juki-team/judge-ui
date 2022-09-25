import { HomeIcon, JukiSurprisedImage, T } from 'components';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="jk-col extend">
      <div className="jk-col gap center">
        <div className="image-404"><JukiSurprisedImage /></div>
        <h1 style={{ textAlign: 'center' }}><T className="tt-ce">page not found</T></h1>
        <Link href="/">
          <a className="link tt-ue">
            <div className="jk-row gap"><HomeIcon /><T>return home</T></div>
          </a>
        </Link>
      </div>
    </div>
  );
}
