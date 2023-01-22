import { MailIcon, PhoneIcon, T, TelegramIcon } from 'components';
import { useJukiBase } from 'hooks';
import Link from 'next/link';
import React from 'react';

export const HelpSection = () => {
  
  const { isLoading, company: { emailContact } } = useJukiBase();
  
  return (
    <div className="jk-col gap left stretch extend">
      <h3><T className="tt-se ws-np">need help?</T></h3>
      <div className="jk-row left"><T className="tt-se ws-np">contact the webmaster</T>:</div>
      <div />
      <div className="jk-row gap left">
        <TelegramIcon />
        <div className="jk-row link fw-bd">
          <Link href="https://t.me/OscarGauss" target="_blank">t.me/OscarGauss</Link>
        </div>
      </div>
      <div />
      <div className="jk-row gap left">
        <PhoneIcon />
        <div className="jk-row fw-bd">+591 79153358</div>
      </div>
      <div />
      {!isLoading && !!emailContact && (
        <div className="jk-row gap left">
          <MailIcon />
          <div className="jk-row fw-bd">{emailContact}</div>
        </div>
      )}
    </div>
  );
};
