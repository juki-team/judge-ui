import {
  Breadcrumbs,
  ButtonLoader,
  CheckUnsavedChanges,
  CloseIcon,
  CodeEditor,
  Input,
  MdMathEditor,
  SaveIcon,
  T,
  TabsInline,
  TwoContentSection,
} from 'components';
import { LinkContests } from 'components/contest';
import { CONTEST_DEFAULT, JUDGE_API_V1, ROUTES } from 'config/constants';
import { diff } from 'deep-object-diff';
import { authorizedRequest, cleanRequest, notifyResponse } from 'helpers';
import { useJukiBase, useNotification, useRouter } from 'hooks';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import {
  ButtonLoaderOnClickType,
  ContentResponseType,
  ContestsTab,
  ContestTab,
  EditCreateContestType,
  HTTPMethod,
  ProgrammingLanguage,
  Status,
} from 'types';
import { EditCreateContestProps } from '../types';
import { EditMembers } from './EditMembers';
import { EditProblems } from './EditProblems';
import { EditSettings } from './EditSettings';

export const EditCreateContest = ({ contest: initialContest }: EditCreateContestProps) => {
  
  const editing = !!initialContest;
  
  const { addWarningNotification } = useNotification();
  const { addNotification } = useNotification();
  const { viewPortSize } = useJukiBase();
  const [contest, setContest] = useState<EditCreateContestType>(initialContest || CONTEST_DEFAULT());
  const lastContest = useRef(initialContest);
  useEffect(() => {
    if (editing && JSON.stringify(initialContest) !== JSON.stringify(lastContest.current)) {
      const text = JSON.stringify(diff(lastContest.current, initialContest), null, 2);
      const height = text.split('\n').length;
      addWarningNotification(
        <div>
          <T className="tt-se">
            the contest changed, your changes will overwrite another admin's
          </T>:
          <div style={{ height: height * 24 + 'px' }}>
            <CodeEditor
              sourceCode={text}
              language={ProgrammingLanguage.JSON}
              readOnly
            />
          </div>
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
      await push(ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW));
      setLoaderStatus(Status.SUCCESS);
    } else {
      setLoaderStatus(Status.ERROR);
    }
  };
  
  const { push, query } = useRouter();
  
  const tabHeaders = {
    [ContestTab.OVERVIEW]: {
      key: ContestTab.OVERVIEW,
      header: <T className="tt-ce">overview</T>,
      body: (
        <div className="pad-top-bottom pad-left-right">
          <MdMathEditor
            informationButton
            uploadImageButton
            source={contest.description}
            onChange={value => setContest(prevState => ({ ...prevState, description: value }))}
          />
        </div>
      ),
    },
    [ContestTab.SETUP]: {
      key: ContestTab.SETUP,
      header: <T className="tt-ce">settings</T>,
      body: (
        <div className="pad-top-bottom pad-left-right">
          <EditSettings contest={contest} setContest={setContest} />
        </div>
      ),
    },
    [ContestTab.MEMBERS]: {
      key: ContestTab.MEMBERS,
      header: <T className="tt-ce">members</T>,
      body: (
        <div className="pad-top-bottom pad-left-right">
          <EditMembers contest={contest} setContest={setContest} editing={editing} />
        </div>
      ),
    },
    [ContestTab.PROBLEMS]: {
      key: ContestTab.PROBLEMS,
      header: <T className="tt-ce">problems</T>,
      body: (
        <div className="pad-top-bottom pad-left-right">
          <EditProblems contest={contest} setContest={setContest} />
        </div>
      ),
    },
  };
  
  const [contestTab, setContestTab] = useState<ContestTab>(ContestTab.OVERVIEW);
  const extraNodes = [
    <CheckUnsavedChanges
      onSafeClick={() => push(editing ? ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW) : ROUTES.CONTESTS.LIST(ContestsTab.ALL))}
      value={contest}
    >
      <ButtonLoader
        size={viewPortSize !== 'sm' ? 'small' : 'large'}
        icon={<CloseIcon />}
      >
        {viewPortSize !== 'sm' && <T>cancel</T>}
      </ButtonLoader>
    </CheckUnsavedChanges>,
    <ButtonLoader
      type="secondary"
      size={viewPortSize !== 'sm' ? 'small' : 'large'}
      onClick={onSave}
      icon={<SaveIcon />}
    >
      {viewPortSize !== 'sm' && (editing ? <T>update</T> : <T>create</T>)}
    </ButtonLoader>,
  ];
  
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <LinkContests><T className="tt-se">contests</T></LinkContests>,
  ];
  
  if (editing) {
    breadcrumbs.push(
      <Link href={{ pathname: ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW), query }} className="link">
        <div>{contest.name}</div>
      </Link>,
    );
  }
  breadcrumbs.push(tabHeaders[contestTab]?.header);
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="jk-row center pad-left-right">
          <h3 style={{ padding: 'var(--pad-sm) 0' }}><T>name</T></h3>:&nbsp;
          <Input
            value={contest.name}
            onChange={value => setContest(prevState => ({
              ...prevState,
              name: value,
            }))}
            size="auto"
          />
        </div>
        <div className="pad-left-right" style={{ overflow: 'hidden' }}>
          <TabsInline
            tabs={tabHeaders}
            selectedTabKey={contestTab}
            onChange={(tab) => setContestTab(tab)}
            extraNodes={extraNodes}
          />
        </div>
      </div>
      {tabHeaders[contestTab]?.body}
    </TwoContentSection>
  );
};
