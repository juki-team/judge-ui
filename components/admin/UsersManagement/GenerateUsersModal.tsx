import { Button, ButtonLoader, Input, Modal, Select, T } from 'components';
import { downloadDataTableAsCsvFile, downloadXlsxAsFile, getRandomString } from 'helpers';
import { useJukiUser, useT } from 'hooks';
import { useState } from 'react';

export const GenerateUsersModal = ({ isOpen, onClose }) => {
  
  const { createUser } = useJukiUser();
  const [users, setUsers] = useState([]);
  const [usersGen, setUsersGen] = useState({ prefix: 'team-test-', initialNumber: 0, total: 1, emailDomain: 'juki.contact' });
  const { t } = useT();
  
  const head = ['#', t('nickname'), t('email'), t('password'), t('message')];
  const body = users.map((user, index) => ([
    index,
    user.nickname,
    user.email,
    user.password,
    user.message,
  ]));
  const dataCsv = [head, ...body];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeIcon>
      <div className="jk-pad-lg jk-col gap stretch">
        <h1>
          <T>generate users</T>
        </h1>
        <div className="jk-col gap">
          <div className="jk-form-item jk-row gap block extend">
            <label><T>prefix</T></label>
            <Input value={usersGen.prefix} onChange={(value) => setUsersGen(prevState => ({ ...prevState, prefix: value }))} />
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
            <Input value={usersGen.emailDomain}
                   onChange={(value) => setUsersGen(prevState => ({ ...prevState, emailDomain: value }))} />
          </div>
        </div>
        <div className="jk-row center gap">
          <ButtonLoader
            onClick={async (setLoader, loaderStatus, event) => {
              setUsers([]);
              for (let i = usersGen.initialNumber; i < usersGen.initialNumber + usersGen.total; i++) {
                const nickname = `${usersGen.prefix}${i}`;
                const password = getRandomString(8);
                const email = `${nickname}@${usersGen.emailDomain}`;
                await createUser({
                  body: {
                    nickname,
                    email,
                    password,
                    familyName: '',
                    givenName: '',
                  },
                  setLoader,
                  onFinally: (response) => {
                    setUsers(users => [...users, { nickname, password, email, message: response.message }]);
                  },
                });
              }
            }}
          >
            <T>generate</T>
          </ButtonLoader>
          <Select
            disabled={!users.length}
            options={[{ value: 'csv', label: 'as csv' }, { value: 'xlsx', label: 'as xlsx' }]}
            selectedOption={{ value: 'x', label: 'download' }}
            onChange={async ({ value }) => {
              const filename = `${usersGen.prefix}[${usersGen.initialNumber},${usersGen.initialNumber + usersGen.total - 1}]@${usersGen.emailDomain}`;
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
          {!!users.length && (
            <div className="jk-row block stretch jk-table-inline-header">
              <div className="jk-row">#</div>
              <div className="jk-row">nickname</div>
              <div className="jk-row">email</div>
              <div className="jk-row">password</div>
              <div className="jk-row">message</div>
            </div>
          )}
          {users.map((user, index) => (
            <div className="jk-row block jk-table-inline-row" key={user.nickname}>
              <div className="jk-row">{index + 1}</div>
              <div className="jk-row">{user.nickname}</div>
              <div className="jk-row">{user.email}</div>
              <div className="jk-row">{user.password}</div>
              <div className="jk-r0w">{user.message}</div>
            </div>
          ))}
        </div>
        <div className="jk-row right">
          <Button type="text" onClick={onClose}><T>close</T></Button>
        </div>
      </div>
    </Modal>
  );
};
