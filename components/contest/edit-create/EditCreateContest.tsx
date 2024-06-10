import {
  Breadcrumbs,
  ButtonLoader,
  CheckUnsavedChanges,
  CloseIcon,
  CodeEditor,
  HomeLink,
  Input,
  LinkLastPath,
  MdMathEditor,
  SaveIcon,
  T,
  TabsInline,
  TwoContentSection,
} from 'components';
import { CONTEST_DEFAULT, JUDGE_API_V1, LS_INITIAL_CONTEST_KEY, ROUTES } from 'config/constants';
import { diff } from 'deep-object-diff';
import { authorizedRequest, cleanRequest, isStringJson, renderReactNodeOrFunctionP1 } from 'helpers';
import { useEffect, useJukiRouter, useJukiUI, useNotification, useRef, useState } from 'hooks';
import {
  ButtonLoaderOnClickType,
  ContentResponseType,
  ContestsTab,
  ContestTab,
  EditCreateContestType,
  HTTPMethod,
  LastPathKey,
  ProgrammingLanguage,
  ReactNode,
  Status,
  TabsType,
} from 'types';
import { EditCreateContestProps } from '../types';
import { EditProblems } from './EditProblems';
import { EditSettings } from './EditSettings';
import { EditViewMembers } from './EditViewMembers';

export const EditCreateContest = ({ contest: initialContest }: EditCreateContestProps) => {
  
  const editing = !!initialContest;
  
  const { addWarningNotification } = useNotification();
  const { notifyResponse } = useNotification();
  const { viewPortSize, components: { Link } } = useJukiUI();
  const localStorageInitialContest = localStorage.getItem(LS_INITIAL_CONTEST_KEY) || '{}';
  const [ contest, setContest ] = useState<EditCreateContestType>(initialContest || CONTEST_DEFAULT(isStringJson(localStorageInitialContest) ? JSON.parse(localStorageInitialContest) : {}));
  useEffect(() => {
    localStorage.removeItem(LS_INITIAL_CONTEST_KEY);
  }, []);
  const lastContest = useRef(initialContest);
  useEffect(() => {
    if (editing && JSON.stringify(initialContest) !== JSON.stringify(lastContest.current)) {
      const text = JSON.stringify(diff(lastContest.current as object, initialContest), null, 2);
      const height = text.split('\n').length;
      addWarningNotification(
        <div>
          <>
            <T className="tt-se">the contest changed</T>,
            <T>your changes can override other admins</T>
          </>
          :
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ JSON.stringify(initialContest) ]);
  
  const { searchParams, pushRoute, routeParams } = useJukiRouter();
  
  const onSave: ButtonLoaderOnClickType = async (setLoaderStatus) => {
    setLoaderStatus(Status.LOADING);
    const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
      editing ? JUDGE_API_V1.CONTEST.CONTEST(initialContest.key) : JUDGE_API_V1.CONTEST.CREATE(),
      {
        method: editing ? HTTPMethod.PUT : HTTPMethod.POST,
        body: JSON.stringify(contest),
      },
    ));
    if (notifyResponse(response, setLoaderStatus)) {
      setLoaderStatus(Status.LOADING);
      await pushRoute(ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW));
      setLoaderStatus(Status.SUCCESS);
    }
  };
  
  const tabHeaders: TabsType<ContestTab> = {
    [ContestTab.OVERVIEW]: {
      key: ContestTab.OVERVIEW,
      header: <T className="tt-ce">overview</T>,
      body: (
        <div className="jk-pg-tb jk-pg-rl">
          <div className="bc-we">
            <MdMathEditor
              informationButton
              uploadImageButton
              source={contest.description}
              onChange={value => setContest(prevState => (
                { ...prevState, description: value }
              ))}
            />
          </div>
        </div>
      ),
    },
    [ContestTab.SETUP]: {
      key: ContestTab.SETUP,
      header: <T className="tt-ce">settings</T>,
      body: (
        <div className="jk-pg-tb jk-pg-rl">
          <EditSettings contest={contest} setContest={setContest} />
        </div>
      ),
    },
    [ContestTab.MEMBERS]: {
      key: ContestTab.MEMBERS,
      header: <T className="tt-ce">members</T>,
      body: (
        <div className="jk-pg-tb jk-pg-rl">
          <EditViewMembers contest={contest} setContest={setContest} editing={editing} />
        </div>
      ),
    },
    [ContestTab.PROBLEMS]: {
      key: ContestTab.PROBLEMS,
      header: <T className="tt-ce">problems</T>,
      body: (
        <div className="jk-pg-tb jk-pg-rl">
          <EditProblems contest={contest} setContest={setContest} />
        </div>
      ),
    },
  };
  
  const [ contestTab, setContestTab ] = useState<ContestTab>(ContestTab.OVERVIEW);
  const extraNodes = [
    <CheckUnsavedChanges
      onClickContinue={() => pushRoute(editing
        ? ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW)
        : ROUTES.CONTESTS.LIST(ContestsTab.ALL))}
      value={contest}
      key="key"
    >
      <ButtonLoader
        size="small"
        icon={<CloseIcon />}
        responsiveMobile
      >
        <T>cancel</T>
      </ButtonLoader>
    </CheckUnsavedChanges>,
    <ButtonLoader
      type="secondary"
      size="small"
      onClick={onSave}
      icon={<SaveIcon />}
      responsiveMobile
      key="update/create"
    >
      {editing ? <T>update</T> : <T>create</T>}
    </ButtonLoader>,
  ];
  
  const breadcrumbs: ReactNode[] = [
    <HomeLink key="home" />,
    <LinkLastPath lastPathKey={LastPathKey.CONTESTS} key="contests"><T className="tt-se">contests</T></LinkLastPath>,
    editing
      ? (
        <Link
          href={{ pathname: ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW), query: searchParams.toString() }}
          className="link"
        >
          <div>{contest.name}</div>
        </Link>
      ) : <div>{contest.name}</div>,
    renderReactNodeOrFunctionP1(tabHeaders[contestTab]?.header, { selectedTabKey: contestTab }),
  ];
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="jk-row extend center tx-h">
          <div style={{ padding: 'var(--pad-sm) 0' }}><T className="tt-se fw-bd">name</T></div>
          :&nbsp;
          <Input
            value={contest.name}
            onChange={value => setContest(prevState => (
              {
                ...prevState,
                name: value,
              }
            ))}
            size="auto"
          />
        </div>
        <div className="jk-pg-rl" style={{ overflow: 'hidden' }}>
          <TabsInline
            tabs={tabHeaders}
            selectedTabKey={contestTab}
            onChange={(tab) => setContestTab(tab)}
            extraNodes={extraNodes}
            extraNodesPlacement={viewPortSize === 'sm' ? 'bottomRight' : undefined}
          />
        </div>
      </div>
      {renderReactNodeOrFunctionP1(tabHeaders[contestTab]?.body, { selectedTabKey: contestTab })}
    </TwoContentSection>
  );
};
