import { FetcherLayer, T, TabsInline } from 'components';
import { renderReactNodeOrFunctionP1 } from 'helpers';
import { useJukiUI } from 'hooks';
import React from 'react';
import { ContentResponseType, Judge, JudgeResponseDTO, JudgesManagementTab, TabsType } from 'types';
import { JUDGE_API_V1 } from '../../../config/constants';
import Custom404 from '../../../pages/404';
import { JudgeManagementBody } from './JudgeManagement';
import { VirtualSubmissionsQueueManagement } from './VirtualSubmissionsQueueManagement';
import { VirtualUsersTable } from './VirtualUsersTable';

export const JudgesManagement = () => {
  const tabs: TabsType<JudgesManagementTab> = {
    [JudgesManagementTab.VIRTUAL_SUBMISSIONS_QUEUE]: {
      key: JudgesManagementTab.VIRTUAL_SUBMISSIONS_QUEUE,
      header: <T className="tt-ce ws-np">virtual submissions queue</T>,
      body: <VirtualSubmissionsQueueManagement />,
    },
    [JudgesManagementTab.VIRTUAL_USERS]: {
      key: JudgesManagementTab.VIRTUAL_USERS,
      header: <T className="tt-ce ws-np">virtual users</T>,
      body: <VirtualUsersTable />,
    },
    [JudgesManagementTab.CODEFORCES_JUDGE]: {
      key: JudgesManagementTab.CODEFORCES_JUDGE,
      header: <T className="tt-ce ws-np">codeforces</T>,
      body: (
        <FetcherLayer<ContentResponseType<JudgeResponseDTO>>
          url={JUDGE_API_V1.JUDGE.GET(Judge.CODEFORCES)}
          errorView={<Custom404 />}
        >
          {({ data, mutate }) => {
            return (
              <JudgeManagementBody judge={data.content} mutate={mutate} />
            );
          }}
        </FetcherLayer>
      ),
    },
    [JudgesManagementTab.JV_UMSA_JUDGE]: {
      key: JudgesManagementTab.JV_UMSA_JUDGE,
      header: <T className="tt-ce ws-np">JV UMSA</T>,
      body: (
        <FetcherLayer<ContentResponseType<JudgeResponseDTO>>
          url={JUDGE_API_V1.JUDGE.GET(Judge.JV_UMSA)}
          errorView={<Custom404 />}
        >
          {({ data, mutate }) => {
            return (
              <JudgeManagementBody judge={data.content} mutate={mutate} />
            );
          }}
        </FetcherLayer>
      ),
    },
  };
  
  const { router: { searchParams, setSearchParams } } = useJukiUI();
  const selectedTabKey = searchParams.get('judgeTab') as JudgesManagementTab || JudgesManagementTab.VIRTUAL_SUBMISSIONS_QUEUE;
  const pushTab = (tabKey: JudgesManagementTab) => setSearchParams({ name: 'judgeTab', value: tabKey });
  
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
