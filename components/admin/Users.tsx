import { POST, USER_STATUS } from 'config/constants';
import { searchParamsObjectTypeToQuery } from 'helpers';
import { authorizedRequest, clean } from 'helpers/services';
import { useRequester, useRouter } from 'hooks';
import { useMemo, useRef, useState } from 'react';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { ContentResponseType, ContentsResponseType, FilterTextOfflineType, SetLoaderStatusType, Status, UserStatus } from 'types';
import {
  Button,
  ButtonLoader,
  DataViewer,
  DataViewerHeadersType,
  EditIcon,
  Field,
  Select,
  T,
  TextHeadCell,
  useNotification,
  UserPermissions,
} from '../../components';
import { ChangePassword } from './ChangePassword';

type ValuePermission = {
  key: string,
  value: string,
}
type UsersTable = {
  aboutMe: string,
  city: string,
  country: string,
  email: string,
  familyName: string,
  givenName: string,
  imageUrl: string,
  institution: string,
  nickname: string,
  status: string,
  permissions: ValuePermission []
}
const sumEachDigitOfNumber = (number: string) => {
  const arrayOfNumbers = number.split('');
  const initialValue = 0;
  return arrayOfNumbers.reduce((prevNumber, currentNumber) => +prevNumber + +currentNumber, initialValue);
};

const options = [UserStatus.ACTIVE, UserStatus.REPORTED, UserStatus.ARCHIVED];

export function Users() {
  
  const [nickname, setNickname] = useState('');
  const optionsFilterStatus = options.map(option => ({
    value: option,
    label: <T className="text-capitalize">{USER_STATUS[option].print}</T>,
  }));
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const { data: response, refresh } = useRequester<ContentsResponseType<any>>(JUDGE_API_V1.ADMIN.ADMIN('1', '32'));
  const setLoaderStatusRef = useRef<SetLoaderStatusType | null>(null);
  
  const changeUserStatus = async (nickname, status, setLoader) => {
    setLoader?.(Status.LOADING);
    const response = clean<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.CHANGE_STATUS(nickname, status), POST));
    if (response.success) {
      addSuccessNotification(<T>success</T>);
      setLoader?.(Status.SUCCESS);
    } else {
      addErrorNotification(<T>error</T>);
      setLoader?.(Status.ERROR);
    }
    refresh({ setLoaderStatus: setLoaderStatusRef.current });
  };
  
  const columns: DataViewerHeadersType<UsersTable>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="text-uppercase">Name</T>} />,
      index: 'name',
      field: ({ record: { givenName, familyName, nickname, imageUrl, email } }) => (
        <Field className="jk-row center gap">
          <img src={imageUrl} className="jk-user-profile-img huge" alt={nickname} />
          <div className="jk-col">
            <div>{givenName} {familyName}</div>
            <div className="jk-link">{nickname}</div>
            <div>{email}</div>
          </div>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.nickname.localeCompare(rowB.nickname) },
      filter: {
        type: 'text', callbackFn: ({ text }) => ({ givenName, familyName, nickname, email }) => {
          const regExp = new RegExp(text, 'gi');
          return !!(nickname?.match?.(regExp)) || !!(givenName?.match?.(regExp)) || !!(familyName?.match?.(regExp)) || !!(email?.match?.(regExp));
        },
      } as FilterTextOfflineType<UsersTable>,
      cardPosition: 'top',
      minWidth: 400,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">permissions</T>} />,
      index: 'permissions',
      field: ({ record: { permissions, nickname } }) => (
        <Field className="jk-col">
          <UserPermissions
            permissions={permissions}
            nickname={nickname}
            refresh={() => {
              refresh({ setLoaderStatus: setLoaderStatusRef.current });
            }}
          />
        </Field>
      ),
      sort: {
        compareFn: () => (rowA, rowB) => {
          // Each digit has a representation = add, archieve, updated, view
          const rowAAllPermissions = sumEachDigitOfNumber(rowA.permissions[0].value) + sumEachDigitOfNumber(rowA.permissions[1].value) + sumEachDigitOfNumber(rowA.permissions[2].value);
          const rowBAllPermissions = sumEachDigitOfNumber(rowB.permissions[0].value) + sumEachDigitOfNumber(rowB.permissions[1].value) + sumEachDigitOfNumber(rowB.permissions[2].value);
          
          return rowAAllPermissions - rowBAllPermissions;
        },
      },
      cardPosition: 'center',
      minWidth: 220,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">status</T>} />,
      index: 'status',
      field: ({ record: { status, nickname } }) => {
        let setLoaderRef = null;
        return (
          <Field className="jk-row center">
            <Select
              className=""
              options={options.map(option => ({
                label: <T className="text-sentence-case">{USER_STATUS[option].print}</T>,
                value: option,
                disabled: status === option,
              }))}
              optionSelected={{ value: status }}
              onChange={({ value }) => changeUserStatus(nickname, value, setLoaderRef)}
            />
            <ButtonLoader type="text" setLoaderStatusRef={(setLoader) => setLoaderRef = setLoader}>
            </ButtonLoader>
          </Field>
        );
      },
      sort: { compareFn: () => (rowA, rowB) => rowA.status.localeCompare(rowB.status) },
      filter: {
        type: 'select-auto', options: optionsFilterStatus,
      },
      cardPosition: 'center',
      minWidth: 190,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">operations</T>} />,
      index: 'operations',
      field: ({ record: { nickname } }) => (
        <Field className="jk-row">
          <Button
            className=""
            icon={<EditIcon />}
            onClick={() => setNickname(nickname)}
            size="small"
          >
            <T>change password</T>
          </Button>
        </Field>
      ),
      cardPosition: 'bottom',
      minWidth: 250,
    },
  ], []);
  
  const { queryObject, push } = useRouter();
  
  const data: UsersTable[] = (response?.success ? response?.contents : []).map(admin => ({
    aboutMe: admin.aboutMe,
    city: admin.city,
    country: admin.country,
    email: admin.email,
    familyName: admin.familyName,
    givenName: admin.givenName,
    imageUrl: admin.imageUrl,
    institution: admin.institution,
    nickname: admin.nickname,
    status: admin.status,
    permissions: admin.permissions,
  }));
  
  return (
    <>
      <ChangePassword onClose={() => setNickname('')} nickname={nickname} />
      <DataViewer<UsersTable>
        headers={columns}
        data={data}
        rows={{ height: 110 }}
        request={refresh}
        name="admin"
        searchParamsObject={queryObject}
        setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
        setLoaderStatusRef={(setLoader) => {
          setLoaderStatusRef.current = setLoader;
        }}
      />
    </>
  );
}
