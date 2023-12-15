import {
  AllSubmissions,
  Breadcrumbs,
  HomeLink,
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
import { renderReactNodeOrFunctionP1 } from 'helpers';
import { useFetcher, useJukiRouter, useJukiUser, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import { ReactNode, useEffect, useMemo } from 'react';
import {
  AdminTab,
  CompanyUserPermissionsResponseDTO,
  ContentsResponseType,
  LastLinkKey,
  QueryParam,
  TabsType,
} from 'types';
import Custom404 from '../404';

function Admin() {
  
  useTrackLastPath(LastLinkKey.SECTION_ADMIN);
  const {
    user: {},
  } = useJukiUser();
  const { searchParams, setSearchParams, pushRoute, routeParams } = useJukiRouter();
  const selectedTabKey = routeParams.tab as AdminTab || AdminTab.SETTINGS_MANAGEMENT;
  
  const {
    data,
    mutate: companyListMutate,
  } = useFetcher<ContentsResponseType<CompanyUserPermissionsResponseDTO>>(JUDGE_API_V1.COMPANY.PERMISSION_LIST());
  
  const companyKey = searchParams.get(QueryParam.COMPANY) as string;
  const companies = useMemo(() => data?.success ? data.contents : [], [ data ]);
  const company = companies.find((company) => company.key === companyKey);
  const {
    canViewSubmissionsManagement,
    canHandleEmail,
    canHandleJudges,
    canCreateUser,
    canHandleUsers,
    canHandleServices,
    canHandleSettings,
  } = company?.userPermissions || {
    canViewSubmissionsManagement: false,
    canHandleEmail: false,
    canHandleJudges: false,
    canCreateUser: false,
    canHandleUsers: false,
    canHandleServices: false,
    canHandleSettings: false,
  }
  
  const mutate = async () => {
    await companyListMutate();
  }
  
  useEffect(() => {
    if (!companyKey && companies[0]) {
      setSearchParams({ name: QueryParam.COMPANY, value: companies[0]?.key });
    }
  }, [ companyKey, companies, setSearchParams ]);
  
  if (!canViewSubmissionsManagement
    && !canHandleEmail
    && !canHandleJudges
    && !canCreateUser
    && !canHandleUsers
    && !canHandleServices
    && !canHandleSettings) {
    return <Custom404 />;
  }
  
  if (!company) {
    return <Custom404 />;
  }
  
  const tabs: TabsType<AdminTab> = {};
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
  if (canHandleEmail) {
    tabs[AdminTab.EMAIL_SENDER] = {
      key: AdminTab.EMAIL_SENDER,
      header: <T className="tt-ce ws-np">email sender</T>,
      body: <div className="pad-left-right pad-top-bottom pad-bottom"><MailManagement company={company} /></div>,
    };
  }
  if (canHandleJudges) {
    tabs[AdminTab.JUDGES_MANAGEMENT] = {
      key: AdminTab.JUDGES_MANAGEMENT,
      header: <T className="tt-ce ws-np">judges</T>,
      body: <div className="pad-left-right pad-bottom"><JudgesManagement company={company} /></div>,
    };
  }
  
  const breadcrumbs: ReactNode[] = [
    <HomeLink key="home" />,
    <Link
      href={ROUTES.ADMIN.PAGE(AdminTab.USERS_MANAGEMENT)}
      className="link"
      key="admin"
    >
      <T className="tt-se">admin</T>
    </Link>,
    renderReactNodeOrFunctionP1(tabs[routeParams.tab as AdminTab]?.header, { selectedTabKey: routeParams.tab as AdminTab }),
  ];
  
  const pushTab = (tabKey: AdminTab) => pushRoute({ pathname: ROUTES.ADMIN.PAGE(tabKey), searchParams });
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="jk-row-col extend pad-left-right">
          <h3 className="flex-1" style={{ padding: 'var(--pad-sm) 0' }}><T>administration</T></h3>
          {companies?.length > 1 && (
            <div style={{ width: 200 }}>
              <Select
                options={companies.map(company => ({
                  value: company.key,
                  label: <span className="ws-np">{company.name}</span>,
                }))}
                selectedOption={{ value: companyKey, label: companyKey ? undefined : <T>select</T> }}
                onChange={({ value }) => setSearchParams({ name: QueryParam.COMPANY, value })}
                className="jk-br-ie jk-button-secondary"
                extend
              />
            </div>
          )}
        </div>
        <div className="pad-left-right">
          <TabsInline tabs={tabs} onChange={pushTab} selectedTabKey={selectedTabKey} />
        </div>
      </div>
      {renderReactNodeOrFunctionP1(tabs[routeParams.tab as AdminTab]?.body, { selectedTabKey })}
    </TwoContentSection>
  );
}

export default Admin;
