import { useJukiUser } from 'hooks';
import Head from 'next/head';

export const CustomHead = ({ title }: { title?: string }) => {
  const { company } = useJukiUser();
  return (
    <Head>
      <title>{`${company.name}  judge${title ? ' - ' + title : ''}`}</title>
    </Head>
  );
};
