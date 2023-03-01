import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="keywords" content="Juki Judge" />
        <meta name="application-name" content="Juki Judge App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Juki Judge App" />
        <meta name="description" content="Juki Judge is designed to make people improve their programming skills" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileImage" content="/icons/ios/144.png" />
        <meta name="msapplication-TileColor" content="#164066" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#FFFFFF" />
  
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png" />
        {/*<link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />*/}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png" />
  
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#164066" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        {/*<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />*/}
  
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://judge.juki.app" />
        <meta name="twitter:title" content="Juki Judge App" />
        <meta name="twitter:description" content="Juki Judge is designed to make people improve their programming skills" />
        <meta name="twitter:image" content="https://judge.juki.app/icons/ios/192.png" />
        <meta name="twitter:creator" content="@oscar_gauss" />
  
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Juki Judge App" />
        <meta property="og:description" content="Juki Judge is designed to make people improve their programming skills" />
        <meta property="og:site_name" content="Juki Judge App" />
        <meta property="og:url" content="https://judge.juki.app" />
        <meta property="og:image" content="https://judge.juki.app/icons/apple-touch-icon.png" />
      </Head>
      <body>
        <iframe
          style={{ display: 'none' }} src="https://utils.juki.app/jk-cross.html"
          className="juki-iframe-cross-domain"
        />
        {/*<iframe*/}
        {/*  style={{ display: 'none' }} src="https://couch.juki.app/jk-cross.html"*/}
        {/*  className="juki-iframe-cross-domain"*/}
        {/*/>*/}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

/*
 https://github.com/shadowwalker/next-pwa
 <!-- apple splash screen images -->
 <!--
 <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
 <link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
 <link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
 <link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
 <link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
 <link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
 <link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' />
 -->
 */
