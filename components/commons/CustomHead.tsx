import { useJukiUser } from 'hooks';
import Head from 'next/head';

export const CustomHead = ({ title, description }: { title?: string, description?: string }) => {
  
  const { company } = useJukiUser();
  const customTitle = `${company.name ? company.name : 'Juki'}  judge${title ? ' - ' + title : ''}`;
  const customDescription = `${description ? description : 'Juki Judge is designed to make people improve their programming skills'}`;
  
  return (
    <Head>
      <title>{customTitle}</title>
      
      <meta name="keywords" content="Juki Judge" />
      <meta name="application-name" content={customTitle} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={customTitle} />
      <meta name="description" content={customDescription} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="msapplication-TileImage" content="/icons/ios/144.png" />
      <meta name="msapplication-TileColor" content="#164066" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#FFFFFF" />
      
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content="https://judge.juki.app" />
      <meta name="twitter:title" content={customTitle} />
      <meta name="twitter:description" content={customDescription} />
      <meta name="twitter:image" content="https://judge.juki.app/icons/ios/192.png" />
      <meta name="twitter:creator" content="@oscar_gauss" />
      
      <meta property="og:type" content="website" />
      <meta property="og:title" content={customTitle} />
      <meta property="og:description" content={customDescription} />
      <meta property="og:site_name" content={customTitle} />
      <meta property="og:url" content="https://judge.juki.app" />
      <meta property="og:image" content="https://judge.juki.app/icons/apple-touch-icon.png" />
    </Head>
  );
};
