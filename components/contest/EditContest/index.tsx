import { ArrowIcon, Button, CheckUnsavedChanges, Input, MdMathEditor, T, Tabs, TwoContentLayout } from 'components/index';
import { ROUTES } from 'config/constants';
import { useRouter } from 'hooks';
import React from 'react';
import { ContestTab } from 'types';
import { EditMembers } from './EditMembers';
import { EditProblems } from './EditProblems';
import { EditSettings } from './EditSettings';
import { EditContestProps } from '../types';

export const EditContest = ({ contest, setContest, editing, onSave }: EditContestProps & { onSave: () => void }) => {
  
  const { push } = useRouter();
  
  const tabHeaders = [
    {
      key: ContestTab.OVERVIEW,
      header: <T className="text-capitalize">overview</T>,
      body: (
        <MdMathEditor
          informationButton
          uploadImageButton
          source={contest.description}
          onChange={value => setContest(prevState => ({ ...prevState, description: value }))}
        />
      ),
    },
    {
      key: ContestTab.SETUP,
      header: <T className="text-capitalize">settings</T>,
      body: <EditSettings contest={contest} setContest={setContest} editing={editing} />,
    },
    {
      key: 'members',
      header: <T className="text-capitalize">members</T>,
      body: <EditMembers contest={contest} setContest={setContest} editing={editing} />,
    },
    {
      key: ContestTab.PROBLEMS,
      header: <T className="text-capitalize">problems</T>,
      body: <EditProblems contest={contest} setContest={setContest} editing={editing} />,
    },
  ];
 
  return (
    <TwoContentLayout>
      <div className="content-title jk-col relative">
        <div className="jk-row nowrap gap extend">
          <div className="jk-row color-primary back-link">
            <CheckUnsavedChanges
              onSafeClick={() => push(editing ? ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW) : ROUTES.CONTESTS.LIST())}
              value={contest}
            >
              <div className="jk-row nowrap text-semi-bold link">
                <ArrowIcon rotate={-90} />
                <div className="screen lg hg"><T className="text-sentence-case">cancel</T></div>
              </div>
            </CheckUnsavedChanges>
          </div>
          <div className="jk-col center gap flex-1">
            <div className="jk-row gap text-h">
              <h6><T>name</T></h6>:
              <Input
                value={contest.name}
                onChange={value => setContest(prevState => ({
                  ...prevState,
                  name: value,
                }))}
              />
            </div>
            <div>
              <T className="tx-wd-bold">key</T>: /contest/view/{editing ? contest.key : <Input
              value={contest.key}
              onChange={value => {
                setContest(prevState => ({
                  ...prevState,
                  key: value.split(' ').join('-').replace(/[^0-9a-z_-]/gi, ''),
                }));
              }}
            />}/overview
            </div>
          </div>
          <div>
            <Button type="secondary" onClick={onSave}>
              {editing ? <T>update</T> : <T>create</T>}
            </Button>
          </div>
        </div>
      </div>
      <Tabs tabs={tabHeaders} />
    </TwoContentLayout>
  );
};