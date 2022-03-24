import { HomeIcon, JukiSurprisedImage, T } from 'components';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="jk-row filled">
      <div className="jk-col center">
        <div className="image-404"><JukiSurprisedImage /></div>
        <h1><T className="text-capitalize">page not found</T></h1>
        <Link href="/">
          <a className="link text-uppercase">
            <div className="jk-row gap"><HomeIcon /><T>return home</T></div>
          </a>
        </Link>
      </div>
    </div>
  );
}
