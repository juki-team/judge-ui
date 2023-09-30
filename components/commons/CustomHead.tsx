import { useJukiUser } from 'hooks';
import Head from 'next/head';

export const CustomHead = ({ title, description }: { title?: string, description?: string }) => {
  
  const { company } = useJukiUser();
  const customTitle = `${company.name}  judge${title ? ' - ' + title : ''}`;
  const customDescription = `${description ? description : 'Juki Judge is designed to make people improve their programming skills'}`;
  
  return (
    <Head>
      <title>{`${company.name}  judge${title ? ' - ' + title : ''}`}</title>
      
      <meta name="application-name" content={customTitle} />
      <meta name="apple-mobile-web-app-title" content={customTitle} />
      <meta name="description" content={customDescription} />
      
      <meta name="twitter:title" content={customTitle} />
      <meta
        name="twitter:description"
        content={customDescription}
      />
      
      <meta property="og:title" content={customTitle} />
      <meta
        property="og:description"
        content={customDescription}
      />
      <meta property="og:site_name" content={customTitle} />
    </Head>
  );
};
