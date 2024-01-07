import { T, TabsInline } from 'components';
import { renderReactNodeOrFunctionP1 } from 'helpers';
import { useJukiRouter } from 'hooks';
import React from 'react';
import { CompanyResponseDTO, ServicesManagementTab, TabsType } from 'types';
import { ECSTaskDefinitionsManagement } from './ECSTaskDefinitionsManagement';
import { ECSTasksManagement } from './ECSTasksManagement';
import { RunnersSettings } from './RunnersSettings';

export const ServicesManagement = ({ company }: { company: CompanyResponseDTO }) => {
  const tabs: TabsType<ServicesManagementTab> = {
    [ServicesManagementTab.ECS_TASKS_MANAGEMENT]: {
      key: ServicesManagementTab.ECS_TASKS_MANAGEMENT,
      header: <T className="tt-ce ws-np">ecs tasks</T>,
      body: <ECSTasksManagement company={company} />,
    },
    [ServicesManagementTab.ECS_DEFINITIONS_TASK_MANAGEMENT]: {
      key: ServicesManagementTab.ECS_DEFINITIONS_TASK_MANAGEMENT,
      header: <T className="tt-ce ws-np">ecs definitions task</T>,
      body: <ECSTaskDefinitionsManagement company={company} />,
    },
    [ServicesManagementTab.RUNNERS_SETTINGS]: {
      key: ServicesManagementTab.RUNNERS_SETTINGS,
      header: <T className="tt-ce ws-np">settings</T>,
      body: <RunnersSettings company={company} />,
    },
  };
  
  const { searchParams, setSearchParams } = useJukiRouter();
  const selectedTabKey = searchParams.get('servicesTab') as ServicesManagementTab || ServicesManagementTab.ECS_TASKS_MANAGEMENT;
  const pushTab = (tabKey: ServicesManagementTab) => setSearchParams({ name: 'servicesTab', value: tabKey });
  
  return (
    <div style={{ height: '100%' }}>
      <TabsInline
        tabs={tabs}
        selectedTabKey={selectedTabKey}
        onChange={pushTab}
      />
      <div style={{ height: 'calc(100% - 40px)' }}>
        {renderReactNodeOrFunctionP1(tabs[selectedTabKey]?.body, { selectedTabKey })}
      </div>
    </div>
  );
};
