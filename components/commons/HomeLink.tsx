import { HomeIcon, T } from 'components';
import Link from 'next/link';

export const HomeLink = () => {
  return (
    <Link href="/" className="link jk-row" key="home">
      <HomeIcon size="small" />&nbsp;<T className="tt-se">home</T>
    </Link>
  );
}
