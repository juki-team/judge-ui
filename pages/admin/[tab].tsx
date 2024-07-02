import { AllSubmissions, Select, T, TwoContentLayout } from 'components';
import { jukiSettings } from 'config';
import { EMPTY_USER_PERMISSIONS, ROUTES } from 'config/constants';
import { renderReactNodeOrFunctionP1 } from 'helpers';
import { useFetcher, useJukiRouter, useJukiUI, useTrackLastPath } from 'hooks';
import { ReactNode, useEffect, useMemo } from 'react';
import {
  AdminTab,
  CompanyUserPermissionsResponseDTO,
  ContentsResponseType,
  LastPathKey,
  QueryParam,
  TabsType,
} from 'types';
import Custom404 from '../404';

function Admin() {
  
  useTrackLastPath(LastPathKey.SECTION_ADMIN);
  const { searchParams, setSearchParams, pushRoute, routeParams } = useJukiRouter();
  const selectedTabKey = routeParams.tab as AdminTab || AdminTab.SETTINGS_MANAGEMENT;
  const { components: { Link } } = useJukiUI();
  const {
    data,
    mutate: companyListMutate,
    isLoading,
  } = useFetcher<ContentsResponseType<CompanyUserPermissionsResponseDTO>>(jukiSettings.API.company.getPermissionList().url);
  
  const companyKey = searchParams.get(QueryParam.COMPANY) as string;
  const companies = useMemo(() => data?.success ? data.contents : [], [ data ]);
  const company = companies.find((company) => company.key === companyKey);
  const {
    canViewSubmissionsManagement,
    canCreateUser,
    canHandleUsers,
  } = company?.userPermissions || EMPTY_USER_PERMISSIONS;
  
  useEffect(() => {
    if (!companyKey && companies[0]) {
      setSearchParams({ name: QueryParam.COMPANY, value: companies[0]?.key });
    }
  }, [ companyKey, companies, setSearchParams ]);
  
  if (!canViewSubmissionsManagement
    && !canCreateUser
    && !canHandleUsers) {
    return <Custom404 />;
  }
  
  if (!company) {
    return <Custom404 />;
  }
  
  const tabs: TabsType<AdminTab> = {};
  if (canViewSubmissionsManagement) {
    tabs[AdminTab.SUBMISSIONS] = {
      key: AdminTab.SUBMISSIONS,
      header: <T className="tt-ce ws-np">submissions</T>,
      body: company
        ? <AllSubmissions company={company} />
        : <div className="bc-we jk-pg-sm jk-br-ie"><T className="tt-se cr-er">select a company</T></div>,
    };
  }
  
  const breadcrumbs: ReactNode[] = [
    <Link
      href={ROUTES.ADMIN.PAGE(AdminTab.USERS_MANAGEMENT)}
      className="link"
      key="admin"
    >
      <T className="tt-se">admin</T>
    </Link>,
    renderReactNodeOrFunctionP1(tabs[routeParams.tab as AdminTab]?.header, { selectedTabKey: routeParams.tab as AdminTab }),
  ];
  
  return (
    <TwoContentLayout
      breadcrumbs={breadcrumbs}
      tabs={tabs}
      selectedTabKey={selectedTabKey}
      getPathname={tabKey => ROUTES.ADMIN.PAGE(tabKey)}
      loading={isLoading}
    >
      <div className="jk-row-col extend">
        <h3 className="flex-1"><T>administration</T></h3>
        {companies?.length > 1 && (
          <div style={{ width: 200 }}>
            <Select
              options={companies.map(company => ({
                value: company.key,
                label: <span className="ws-np">{company.name}</span>,
              }))}
              selectedOption={{ value: companyKey, label: companyKey ? undefined : <T>select</T> }}
              onChange={({ value }) => setSearchParams({ name: QueryParam.COMPANY, value })}
              className="jk-br-ie jk-button secondary"
              extend
            />
          </div>
        )}
      </div>
    </TwoContentLayout>
  );
}

export default Admin;
