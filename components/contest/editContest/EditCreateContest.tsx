import { ButtonLoader, CheckUnsavedChanges, Input, MdMathEditor, T, Tabs, TwoContentLayout } from 'components';
import { CONTEST_DEFAULT, JUDGE_API_V1, ROUTES } from 'config/constants';
import { diff } from 'deep-object-diff';
import { authorizedRequest, cleanRequest, notifyResponse } from 'helpers';
import { useNotification, useRouter } from 'hooks';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { ButtonLoaderOnClickType, ContentResponseType, ContestsTab, ContestTab, EditCreateContestType, HTTPMethod, Status } from 'types';
import { EditCreateContestProps } from '../types';
import { EditMembers } from './EditMembers';
import { EditProblems } from './EditProblems';
import { EditSettings } from './EditSettings';

const ReactJson = dynamic(import('react-json-view'), { ssr: false });

export const EditCreateContest = ({ contest: initialContest }: EditCreateContestProps) => {
  
  const editing = !!initialContest;
  
  const { addWarningNotification } = useNotification();
  const { addNotification } = useNotification();
  const [contest, setContest] = useState<EditCreateContestType>(initialContest || CONTEST_DEFAULT());
  const lastContest = useRef(initialContest);
  useEffect(() => {
    if (editing && JSON.stringify(initialContest) !== JSON.stringify(lastContest.current)) {
      addWarningNotification(
        <div>
          <h6>
            <T className="tt-se">
              the contest changed, your changes will overwrite another admin's
            </T>
          </h6>
          <ReactJson
            src={diff(lastContest.current, initialContest)}
            enableClipboard={false}
            collapsed={true}
            name={false}
          />
        </div>,
      );
      lastContest.current = initialContest;
    }
  }, [JSON.stringify(initialContest)]);
  const onSave: ButtonLoaderOnClickType = async (setLoaderStatus) => {
    setLoaderStatus(Status.LOADING);
    const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
      editing ? JUDGE_API_V1.CONTEST.CONTEST(initialContest.key) : JUDGE_API_V1.CONTEST.CREATE(),
      {
        method: editing ? HTTPMethod.PUT : HTTPMethod.POST,
        body: JSON.stringify(contest),
      }));
    notifyResponse(response, addNotification);
    if (response.success) {
      push(ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW));
      setLoaderStatus(Status.SUCCESS);
    } else {
      setLoaderStatus(Status.ERROR);
    }
  };
  
  const { push } = useRouter();
  
  const tabHeaders = [
    {
      key: ContestTab.OVERVIEW,
      header: <T className="tt-ce">overview</T>,
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
      header: <T className="tt-ce">settings</T>,
      body: <EditSettings contest={contest} setContest={setContest} />,
    },
    {
      key: 'members',
      header: <T className="tt-ce">members</T>,
      body: <EditMembers contest={contest} setContest={setContest} editing={editing} />,
    },
    {
      key: ContestTab.PROBLEMS,
      header: <T className="tt-ce">problems</T>,
      body: <EditProblems contest={contest} setContest={setContest} />,
    },
  ];
  
  return (
    <TwoContentLayout>
      <div className="jk-row center extend tx-h">
        <h6><T>name</T></h6>:&nbsp;
        <Input
          value={contest.name}
          onChange={value => setContest(prevState => ({
            ...prevState,
            name: value,
          }))}
        />
      </div>
      <Tabs
        tabs={tabHeaders}
        actionsSection={[
          <CheckUnsavedChanges
            onSafeClick={() => push(editing ? ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW) : ROUTES.CONTESTS.LIST(ContestsTab.CONTESTS))}
            value={contest}
          >
            <div><ButtonLoader size="small"><T>cancel</T></ButtonLoader></div>
          </CheckUnsavedChanges>,
          <ButtonLoader type="secondary" size="small" onClick={onSave}>
            {editing ? <T>update</T> : <T>create</T>}
          </ButtonLoader>,
        ]}
      />
    </TwoContentLayout>
  );
};
