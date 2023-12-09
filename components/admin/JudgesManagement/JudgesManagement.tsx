import { FetcherLayer, T, TabsInline } from 'components';
import { renderReactNodeOrFunctionP1 } from 'helpers';
import { useJukiRouter } from 'hooks';
import React from 'react';
import { CompanyResponseDTO, ContentResponseType, Judge, JudgeResponseDTO, JudgesManagementTab, TabsType } from 'types';
import { JUDGE_API_V1 } from '../../../config/constants';
import { JudgeManagementBody } from './JudgeManagement';

export const JudgesManagement = ({ company }: { company: CompanyResponseDTO }) => {
  const tabs: TabsType<JudgesManagementTab> = {
    [JudgesManagementTab.CODEFORCES_JUDGE]: {
      key: JudgesManagementTab.CODEFORCES_JUDGE,
      header: <T className="tt-ce ws-np">codeforces</T>,
      body: (
        <FetcherLayer<ContentResponseType<JudgeResponseDTO>>
          url={JUDGE_API_V1.JUDGE.GET(Judge.CODEFORCES, company.key)}
          errorView={
            <JudgeManagementBody
              company={company}
              judge={{ key: Judge.CODEFORCES, languages: [] }}
              mutate={async () => undefined}
              withError
            />
          }
        >
          {({ data, mutate }) => {
            return (
              <JudgeManagementBody company={company} judge={data.content} mutate={mutate} />
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
          url={JUDGE_API_V1.JUDGE.GET(Judge.JV_UMSA, company.key)}
          errorView={
            <JudgeManagementBody
              company={company}
              judge={{ key: Judge.JV_UMSA, languages: [] }}
              mutate={async () => undefined}
              withError
            />
          }
        >
          {({ data, mutate }) => {
            return (
              <JudgeManagementBody company={company} judge={data.content} mutate={mutate} />
            );
          }}
        </FetcherLayer>
      ),
    },
  };
  
  const { searchParams, setSearchParams } = useJukiRouter();
  const selectedTabKey = searchParams.get('judgeTab') as JudgesManagementTab || JudgesManagementTab.CODEFORCES_JUDGE;
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
