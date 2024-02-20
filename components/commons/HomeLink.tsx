import { HomeIcon, T } from 'components';
import { useJukiUI } from 'hooks';

export const HomeLink = () => {
  const { components: { Link } } = useJukiUI();
  return (
    <Link href="/" className="link jk-row" key="home">
      <HomeIcon size="small" />&nbsp;<T className="tt-se">home</T>
    </Link>
  );
}
