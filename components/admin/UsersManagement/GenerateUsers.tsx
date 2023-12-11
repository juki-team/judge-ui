import { Button, ButtonLoader, Input, Select, T } from 'components';
import { downloadDataTableAsCsvFile, downloadXlsxAsFile, getRandomString } from 'helpers';
import { useJukiUser, useT } from 'hooks';
import { ReactNode, useEffect, useState } from 'react';
import { CompanyResponseDTO } from 'types';

type UserType = {
  nickname: string,
  password: string,
  email: string,
  message: ReactNode,
}

export const GenerateUsers = ({ company }: { company: CompanyResponseDTO }) => {
  
  const { createUser } = useJukiUser();
  const [ users, setUsers ] = useState<{ [key: string]: UserType }>({});
  const [ usersGen, setUsersGen ] = useState({
    prefix: 'team-test-',
    initialNumber: 0,
    total: 1,
    emailDomain: 'juki.contact',
  });
  useEffect(() => {
    const users: { [key: string]: UserType } = {};
    for (let i = usersGen.initialNumber; i < usersGen.initialNumber + usersGen.total; i++) {
      const nickname = `${usersGen.prefix}${i}`;
      const password = getRandomString(8);
      const email = `${nickname}@${usersGen.emailDomain}`;
      users[nickname] = { nickname, password, email, message: <T className="cr-er tt-se fw-bd">to create</T> };
    }
    setUsers(users);
  }, [ usersGen ]);
  const { t } = useT();
  
  const head = [ '#', t('nickname'), t('email'), t('password'), t('message') ];
  const body = Object.values(users).map((user, index) => ([
    index,
    user.nickname,
    user.email,
    user.password,
    user.message,
  ] as string[]));
  const dataCsv = [ head, ...body ];
  
  return (
    <div className="jk-pad-md jk-col gap stretch bc-we jk-br-ie">
      <h1>
        <T>generate users</T>
      </h1>
      <div className="jk-col gap">
        <div className="jk-form-item jk-row gap block extend">
          <label><T>prefix</T></label>
          <Input
            value={usersGen.prefix}
            onChange={(value) => setUsersGen(prevState => ({ ...prevState, prefix: value }))}
          />
        </div>
        <div className="jk-form-item jk-row gap block extend">
          <label><T>initial number</T></label>
          <Input
            type="number"
            value={usersGen.initialNumber}
            onChange={(value) => setUsersGen(prevState => ({ ...prevState, initialNumber: value }))}
          />
        </div>
        <div className="jk-form-item jk-row gap block extend">
          <label><T>total</T></label>
          <Input
            type="number"
            value={usersGen.total}
            onChange={(value) => setUsersGen(prevState => ({ ...prevState, total: value }))}
          />
        </div>
        <div className="jk-form-item jk-row gap block extend">
          <label><T>email domain</T></label>
          <Input
            value={usersGen.emailDomain}
            onChange={(value) => setUsersGen(prevState => ({ ...prevState, emailDomain: value }))}
          />
        </div>
      </div>
      <div className="jk-row center gap">
        <ButtonLoader
          onClick={async (setLoader, loaderStatus, event) => {
            for (const { nickname, password, email } of Object.values(users)) {
              await createUser({
                body: {
                  nickname,
                  email,
                  password,
                  familyName: '',
                  givenName: '',
                  companyKey: company.key,
                },
                setLoader,
                onFinally: (response) => {
                  setUsers(users => ({
                    ...users,
                    [nickname]: {
                      ...users[nickname],
                      message: (
                        response.message === 'welcome'
                          ? <T className="cr-ss tt-se fw-bd">created</T>
                          : <T className="cr-er tt-se fw-bd">{response.message}</T>
                      ),
                    },
                  }));
                },
              });
            }
          }}
        >
          <T>generate</T>
        </ButtonLoader>
        <Select
          disabled={!Object.keys(users).length}
          options={[ { value: 'csv', label: 'as csv' }, { value: 'xlsx', label: 'as xlsx' } ]}
          selectedOption={{ value: 'x', label: 'download' }}
          onChange={async ({ value }) => {
            const filename = `${usersGen.prefix}[${usersGen.initialNumber},${usersGen.initialNumber
            + usersGen.total
            - 1}]@${usersGen.emailDomain}`;
            switch (value) {
              case 'csv':
                downloadDataTableAsCsvFile(dataCsv, `${filename}.csv`);
                break;
              case 'xlsx':
                await downloadXlsxAsFile(dataCsv, `${filename}.xlsx`, t('users'));
                break;
              case 'pdf':
                break;
              default:
            }
          }}
        >
          {({ expandIcon }) => {
            return (
              <Button>
                <div className="jk-row nowrap"><T>download</T>{expandIcon}</div>
              </Button>
            );
          }}
        </Select>
      </div>
      <div className="jk-col extend stretch">
        {!!Object.keys(users).length && (
          <div className="jk-row block stretch jk-table-inline-header">
            <div className="jk-row" style={{ maxWidth: 30 }}>#</div>
            <div className="jk-row"><T>nickname</T></div>
            <div className="jk-row"><T>email</T></div>
            <div className="jk-row"><T>password</T></div>
            <div className="jk-row"><T>message</T></div>
          </div>
        )}
        {Object.values(users).map((user, index) => (
          <div className="jk-row block jk-table-inline-row" key={user.nickname}>
            <div className="jk-row" style={{ maxWidth: 30 }}>{index + 1}</div>
            <div className="jk-row">{user.nickname}</div>
            <div className="jk-row">{user.email}</div>
            <div className="jk-row">{user.password}</div>
            <div className="jk-row">{user.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
