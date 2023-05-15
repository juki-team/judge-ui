import { ContentResponseType } from '@juki-team/commons';
import {
  AllSubmissions,
  Breadcrumbs,
  JudgesManagement,
  MailManagement,
  Select,
  ServicesManagement,
  SettingsManagement,
  T,
  TabsInline,
  TwoContentSection,
  UsersManagement,
} from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useFetcher, useJukiUser, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import { AdminTab, CompanyResponseDTO, ContentsResponseType, LastLinkKey } from 'types';
import Custom404 from '../404';

function Admin() {
  
  useTrackLastPath(LastLinkKey.SECTION_ADMIN);
  const { query, push } = useRouter();
  const {
    user: {
      canViewSubmissionsManagement,
      canSendEmail,
      canHandleJudges,
      canCreateUser,
      canHandleUsers,
      canHandleServices,
      canHandleSettings,
    },
  } = useJukiUser();
  const {
    data,
    mutate,
  } = useFetcher<ContentsResponseType<CompanyResponseDTO>>(canHandleSettings && JUDGE_API_V1.COMPANY.LIST());
  const { data: myCompany } = useFetcher<ContentResponseType<CompanyResponseDTO>>(JUDGE_API_V1.COMPANY.CURRENT());
  const [ companyKey, setCompanyKey ] = useState('');
  const companies = data?.success ? data.contents : [];
  const company: CompanyResponseDTO | undefined = canHandleSettings
    ? companies.find((company) => company.key === companyKey)
    : (myCompany?.success ? myCompany.content : undefined);
  
  if (!canViewSubmissionsManagement
    && !canSendEmail
    && !canHandleJudges
    && !canCreateUser
    && !canHandleUsers
    && !canHandleServices
    && !canHandleSettings) {
    return <Custom404 />;
  }
  const tabs: { [key: string]: { key: string, header: ReactNode, body: ReactNode } } = {};
  if (canCreateUser || canHandleUsers) {
    tabs[AdminTab.USERS_MANAGEMENT] = {
      key: AdminTab.USERS_MANAGEMENT,
      header: <T className="tt-ce ws-np">users</T>,
      body: company
        ? <div className="pad-left-right pad-bottom"><UsersManagement company={company} /></div>
        : <div className="pad-left-right pad-top-bottom">
          <div className="bc-we jk-pad-sm jk-br-ie"><T className="tt-se cr-er">select a company</T></div>
        </div>,
    };
  }
  if (canViewSubmissionsManagement) {
    tabs[AdminTab.SUBMISSIONS] = {
      key: AdminTab.SUBMISSIONS,
      header: <T className="tt-ce ws-np">submissions</T>,
      body: company
        ? <div className="pad-left-right pad-top-bottom"><AllSubmissions company={company} /></div>
        : <div className="pad-left-right pad-top-bottom">
          <div className="bc-we jk-pad-sm jk-br-ie"><T className="tt-se cr-er">select a company</T></div>
        </div>,
    };
  }
  if (canHandleServices) {
    tabs[AdminTab.SERVICES_MANAGEMENT] = {
      key: AdminTab.SERVICES_MANAGEMENT,
      header: <T className="tt-ce ws-np">services</T>,
      body: company
        ? <div className="pad-left-right pad-bottom"><ServicesManagement company={company} /></div>
        : <div className="pad-left-right pad-top-bottom">
          <div className="bc-we jk-pad-sm jk-br-ie"><T className="tt-se cr-er">select a company</T></div>
        </div>,
    };
  }
  if (canSendEmail) {
    tabs[AdminTab.EMAIL_SENDER] = {
      key: AdminTab.EMAIL_SENDER,
      header: <T className="tt-ce ws-np">email sender</T>,
      body: <div className="pad-left-right pad-top-bottom pad-bottom"><MailManagement /></div>,
    };
  }
  if (canHandleJudges) {
    tabs[AdminTab.JUDGES_MANAGEMENT] = {
      key: AdminTab.JUDGES_MANAGEMENT,
      header: <T className="tt-ce ws-np">judges</T>,
      body: <div className="pad-left-right pad-bottom"><JudgesManagement /></div>,
    };
  }
  if (canHandleSettings) {
    tabs[AdminTab.SETTINGS_MANAGEMENT] = {
      key: AdminTab.SETTINGS_MANAGEMENT,
      header: <T className="tt-ce ws-np">settings</T>,
      body: company
        ? <div className="pad-left-right pad-top-bottom"><SettingsManagement company={company} mutate={mutate} /></div>
        : <div className="pad-left-right pad-top-bottom">
          <div className="bc-we jk-pad-sm jk-br-ie"><T className="tt-se cr-er">select a company</T></div>
        </div>,
    };
  }
  
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <Link href={ROUTES.ADMIN.PAGE(AdminTab.USERS_MANAGEMENT)} className="link"><T className="tt-se">admin</T></Link>,
    tabs[query.tab as string]?.header,
  ];
  const pushTab = tabKey => push({ pathname: ROUTES.ADMIN.PAGE(tabKey as AdminTab), query });
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="jk-row-col extend pad-left-right">
          <h3 className="flex-1" style={{ padding: 'var(--pad-sm) 0' }}><T>administration</T></h3>
          {canHandleSettings && (
            <div style={{ width: 200 }}>
              <Select
                options={companies.map(company => ({
                  value: company.key,
                  label: <span className="ws-np">{company.name}</span>,
                }))}
                selectedOption={{ value: companyKey, label: companyKey ? undefined : <T>select</T> }}
                onChange={({ value }) => setCompanyKey(value)}
                className="jk-br-ie jk-button-secondary"
                extend
              />
            </div>
          )}
        </div>
        <div className="pad-left-right">
          <TabsInline tabs={tabs} onChange={pushTab} selectedTabKey={query.tab} />
        </div>
      </div>
      {tabs[query.tab as string]?.body}
    </TwoContentSection>
  );
}

export default Admin;
