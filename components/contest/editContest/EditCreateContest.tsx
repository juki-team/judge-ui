import { ArrowIcon, ButtonLoader, CheckUnsavedChanges, Input, MdMathEditor, Select, T, Tabs, TwoContentLayout } from 'components';
import { CONTEST_DEFAULT, CONTEST_TEMPLATE, JUDGE_API_V1, MAX_DATE, MIN_DATE, ROUTES } from 'config/constants';
import { diff } from 'deep-object-diff';
import { useRouter } from 'hooks';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { ButtonLoaderOnClickType, ContestsTab, ContestTab, ContestTemplate, EditCreateContestType, Status } from 'types';
import { adjustContest, authorizedRequest, cleanRequest, getContestTemplate, notifyResponse } from '../../../helpers';
import { useNotification } from '../../../hooks';
import { ContentResponseType, HTTPMethod } from '../../../types';
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
      editing ? JUDGE_API_V1.CONTEST.CONTEST(contest.key) : JUDGE_API_V1.CONTEST.CREATE(),
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
  
  const contestTemplate = getContestTemplate(contest);
  
  return (
    <TwoContentLayout>
      <div className="content-title jk-col relative">
        <div className="jk-row nowrap gap extend">
          <div className="jk-row cr-py back-link">
            <CheckUnsavedChanges
              onSafeClick={() => push(editing ? ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW) : ROUTES.CONTESTS.LIST(ContestsTab.CONTESTS))}
              value={contest}
            >
              <div className="jk-row nowrap fw-bd link">
                <ArrowIcon rotate={-90} />
                <div className="screen lg hg"><T className="tt-se">cancel</T></div>
              </div>
            </CheckUnsavedChanges>
          </div>
          <div className="jk-col center flex-1">
            <div className="jk-row tx-h">
              <h6><T>name</T></h6>:&nbsp;
              <Input
                value={contest.name}
                onChange={value => setContest(prevState => ({
                  ...prevState,
                  name: value,
                }))}
              />
            </div>
            <div>
              <T className="fw-bd tt-se">key</T>:&nbsp;
              {editing ? contest.key : (
                <Input
                  value={contest.key}
                  onChange={value => {
                    setContest(prevState => ({
                      ...prevState,
                      key: value.trim().split(' ').join('-').replace(/[^0-9a-z_-]/gi, ''),
                    }));
                  }}
                />
              )}
            </div>
            <div className="jk-row">
              <T className="fw-bd tt-se">template</T>:&nbsp;
              <Select
                options={Object.values(CONTEST_TEMPLATE).map(template => ({ value: template.value, label: <T>{template.label}</T> }))}
                selectedOption={{ value: contestTemplate }}
                onChange={({ value }) => {
                  if (contestTemplate === value) {
                    return;
                  }
                  if (value === ContestTemplate.ENDLESS) {
                    setContest(prevState => adjustContest({
                      ...prevState,
                      settings: {
                        ...prevState.settings,
                        startTimestamp: MIN_DATE.getTime(),
                        frozenTimestamp: MAX_DATE.getTime(),
                        quietTimestamp: MAX_DATE.getTime(),
                        endTimestamp: MAX_DATE.getTime(),
                        penalty: 0,
                      },
                      members: { ...prevState.members, spectators: ['*'], guests: ['*'] },
                    }));
                  } else if (value === ContestTemplate.CLASSIC || value === ContestTemplate.CUSTOM) {
                    const contestDefault = CONTEST_DEFAULT();
                    setContest(prevState => adjustContest({
                      ...prevState,
                      settings: {
                        ...prevState.settings,
                        startTimestamp: contestDefault.settings.startTimestamp,
                        frozenTimestamp: contestDefault.settings.frozenTimestamp,
                        quietTimestamp: contestDefault.settings.quietTimestamp,
                        endTimestamp: contestDefault.settings.endTimestamp,
                        penalty: contestDefault.settings.penalty,
                      },
                    }));
                  }
                }}
              />
            </div>
          </div>
          <div>
            <ButtonLoader type="secondary" onClick={onSave}>
              {editing ? <T>update</T> : <T>create</T>}
            </ButtonLoader>
          </div>
        </div>
      </div>
      <Tabs tabs={tabHeaders} />
    </TwoContentLayout>
  );
};
