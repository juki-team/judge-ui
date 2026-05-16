'use client';

import { DateLiteral } from '@juki-team/base-ui/server-components';
import { Button, CodeViewer, Modal, T, UserChip } from '@juki-team/base-ui';
import { useState } from 'hooks';
import { CodeLanguage } from '@juki-team/commons/enums';
import { ContestDataUI } from '../types';

export const ViewEvents = ({ contest }: { contest: ContestDataUI }) => {

  const [ selectedDetails, setSelectedDetails ] = useState<Record<string, any> | null>(null);

  return (
    <div className="jk-col gap stretch left jk-pg-md nowrap jk-pg bc-we jk-br-ie">
      {/*<div className="jk-row">*/}
      {/*  <ButtonLoader*/}
      {/*    type="secondary"*/}
      {/*    onClick={async (setLoader) => {*/}
      {/*      setLoader(Status.LOADING);*/}
      {/*      await mutate();*/}
      {/*      setLoader(Status.SUCCESS);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <T className="tt-se">reload</T>*/}
      {/*  </ButtonLoader>*/}
      {/*</div>*/}
      <div className="jk-col gap left stretch">
        {contest.events
          ?.sort((a, b) => b.timestamp - a.timestamp)
          .map(({ action, details, user, timestamp }, index) => (
            <div key={index} className="jk-col gap left stretch">
              <div className="jk-row gap">
                <div className="jk-tag">
                  <T className="tt-se">{action?.toLowerCase().split('_').join(' ')}</T>
                </div>
                <div>
                  <UserChip imageUrl={user.imageUrl} nickname={user.nickname} organizationKey={user.organization.key} />
                </div>
                <div>
                  <DateLiteral date={new Date(timestamp)} />
                </div>
                {contest.user.isAdministrator && Object.keys(details).length > 0 && (
                  <Button onClick={() => setSelectedDetails(details)} size="small" type="secondary">
                    <T>View details</T>
                  </Button>
                )}
              </div>
            </div>
          ))}
      </div>
      {selectedDetails && (
        <Modal onClose={() => setSelectedDetails(null)} isOpen>
          <div className="jk-row jk-pg">
            <CodeViewer code={JSON.stringify(selectedDetails, null, 2)} language={CodeLanguage.JSON} />
          </div>
        </Modal>
      )}
    </div>
  );
};
