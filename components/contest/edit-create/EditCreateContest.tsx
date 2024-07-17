import { CodeEditor, Input, LinkLastPath, MdMathEditor, T, TwoContentLayout } from 'components';
import { jukiSettings } from 'config';
import { CONTEST_DEFAULT, LS_INITIAL_CONTEST_KEY } from 'config/constants';
import { diff } from 'deep-object-diff';
import { isStringJson, renderReactNodeOrFunctionP1 } from 'helpers';
import { useEffect, useJukiNotification, useJukiUI, useJukiUser, useRef, useState } from 'hooks';
import {
  ContestTab,
  LastPathKey,
  ProgrammingLanguage,
  TabsType,
  TwoContentLayoutProps,
  UpsertComponentEntityProps,
  UpsertContestDTOUI,
} from 'types';
import { ContestDelete } from './ContestDelete';
import { EditProblems } from './EditProblems';
import { EditSettings } from './EditSettings';
import { EditViewMembers } from './EditViewMembers';

export const EditCreateContest = (props: UpsertComponentEntityProps<UpsertContestDTOUI, ContestTab>) => {
  
  const { entity: initialContest, entityKey: contestKey, tabButtons } = props;
  
  const editing = !!initialContest;
  
  const { addWarningNotification } = useJukiNotification();
  const { components: { Link } } = useJukiUI();
  const localStorageInitialContest = localStorage.getItem(LS_INITIAL_CONTEST_KEY) || '{}';
  const { user: { nickname, imageUrl }, company: { key: companyKey } } = useJukiUser();
  const [ contest, setContest ] = useState<UpsertContestDTOUI>(initialContest || CONTEST_DEFAULT({
    nickname,
    imageUrl,
    companyKey,
  }, isStringJson(localStorageInitialContest) ? JSON.parse(localStorageInitialContest) : {}));
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
  
  const tabHeaders: TabsType<ContestTab> = {
    [ContestTab.OVERVIEW]: {
      key: ContestTab.OVERVIEW,
      header: <T className="tt-ce">overview</T>,
      body: (
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
      ),
    },
    [ContestTab.SETUP]: {
      key: ContestTab.SETUP,
      header: <T className="tt-ce">settings</T>,
      body: (
        <EditSettings contest={contest} setContest={setContest} />
      ),
    },
    [ContestTab.MEMBERS]: {
      key: ContestTab.MEMBERS,
      header: <T className="tt-ce">members</T>,
      body: (
        <EditViewMembers contest={contest} setContest={setContest} editing={editing} />
      ),
    },
    [ContestTab.PROBLEMS]: {
      key: ContestTab.PROBLEMS,
      header: <T className="tt-ce">problems</T>,
      body: (
        <EditProblems contest={contest} setContest={setContest} />
      ),
    },
  };
  
  if (editing) {
    tabHeaders[ContestTab.DELETE] = {
      key: ContestTab.DELETE,
      header: <T className="tt-ce">delete</T>,
      body: (
        <ContestDelete documentOwner={contest.owner} contestKey={contestKey} />
      ),
    };
  }
  
  const breadcrumbs: TwoContentLayoutProps<ContestTab>['breadcrumbs'] = ({ selectedTabKey }) => [
    <LinkLastPath lastPathKey={LastPathKey.CONTESTS} key="contests"><T className="tt-se">contests</T></LinkLastPath>,
    editing
      ? (
        <Link
          href={jukiSettings.ROUTES.contests().view({ key: contestKey })}
          className="link"
        >
          <div>{contest.name}</div>
        </Link>
      ) : <div>{contest.name}</div>,
    renderReactNodeOrFunctionP1(tabHeaders[selectedTabKey]?.header, { selectedTabKey }),
  ];
  
  return (
    <TwoContentLayout
      breadcrumbs={breadcrumbs}
      tabs={tabHeaders}
      tabButtons={tabButtons(contest)}
    >
      <div className="jk-row extend center tx-h">
        <Input
          label={<T className="tt-se">name</T>}
          labelPlacement="left"
          value={contest.name}
          onChange={value => setContest(prevState => ({
            ...prevState,
            name: value,
          }))}
          size="auto"
        />
      </div>
    </TwoContentLayout>
  );
};
