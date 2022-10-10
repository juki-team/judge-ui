import {
  Button,
  DataViewer,
  EditIcon,
  Field,
  ResetPassword,
  Select,
  T,
  TextHeadCell,
  useNotification,
  UserChip,
  UserPermissions,
} from 'components';
import { CONTEST_ROLE, COURSE_ROLE, JUDGE_API_V1, PROBLEM_ROLE, TEAM_ROLE, USER_ROLE, USER_STATUS } from 'config/constants';
import { authorizedRequest, cleanRequest, searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester, useRouter } from 'hooks';
import { useMemo, useState } from 'react';
import {
  ContentResponseType,
  ContentsResponseType,
  DataViewerHeadersType,
  FilterTextOfflineType,
  HTTPMethod,
  Status,
  UserManagementResponseDTO,
} from 'types';

export function Users() {
  
  const [nickname, setNickname] = useState('');
  const optionsFilterStatus = Object.values(USER_STATUS).map(status => ({
    value: status.value,
    label: <T className="tt-ce">{status.label}</T>,
  }));
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<UserManagementResponseDTO>>(JUDGE_API_V1.USER.MANAGEMENT_LIST());
  
  const changeUserStatus = async (nickname, status, setLoader) => {
    setLoader?.(Status.LOADING);
    const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.USER.STATUS(nickname), {
      method: HTTPMethod.PUT,
      body: JSON.stringify({ status }),
    }));
    if (response.success) {
      addSuccessNotification(<T>success</T>);
      setLoader?.(Status.SUCCESS);
    } else {
      addErrorNotification(<T>error</T>);
      setLoader?.(Status.ERROR);
    }
    request();
  };
  
  const columns: DataViewerHeadersType<UserManagementResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue">name</T>} />,
      index: 'name',
      field: ({ record: { givenName, familyName, nickname, imageUrl, email } }) => (
        <Field className="jk-row center gap">
          <UserChip imageUrl={imageUrl} nickname={nickname} givenName={givenName} familyName={familyName} email={email} />
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.nickname.localeCompare(rowB.nickname) },
      filter: {
        type: 'text', callbackFn: ({ text }) => ({ givenName, familyName, nickname, email }) => {
          const regExp = new RegExp(text, 'gi');
          return !!(nickname?.match?.(regExp)) || !!(givenName?.match?.(regExp)) || !!(familyName?.match?.(regExp)) || !!(email?.match?.(regExp));
        },
      } as FilterTextOfflineType<UserManagementResponseDTO>,
      cardPosition: 'top',
      minWidth: 400,
    },
    {
      head: <TextHeadCell text={<T className="tt-ue">country/city</T>} />,
      index: 'country-city',
      field: ({ record: { country, city } }) => (
        <Field className="jk-col center">
          {city}
          <div className="fw-bd">{country}</div>
        </Field>
      ),
      cardPosition: 'bottom',
      minWidth: 250,
    },
    {
      head: <TextHeadCell text={<T className="tt-ue">permissions</T>} />,
      index: 'permissions',
      field: ({ record }) => (
        <Field className="jk-col">
          <UserPermissions
            user={record}
            refresh={request}
            key={record.nickname}
          />
        </Field>
      ),
      sort: {
        compareFn: () => (rowA, rowB) => {
          const rowAAllPermissions = (USER_ROLE[rowA.userRole]?.level ?? 100) + (PROBLEM_ROLE[rowA.problemRole]?.level ?? 100) + (CONTEST_ROLE[rowA.contestRole]?.level ?? 100) + (TEAM_ROLE[rowA.teamRole]?.level ?? 100) + (COURSE_ROLE[rowA.courseRole]?.level ?? 100);
          const rowBAllPermissions = (USER_ROLE[rowB.userRole]?.level ?? 100) + (PROBLEM_ROLE[rowB.problemRole]?.level ?? 100) + (CONTEST_ROLE[rowB.contestRole]?.level ?? 100) + (TEAM_ROLE[rowB.teamRole]?.level ?? 100) + (COURSE_ROLE[rowB.courseRole]?.level ?? 100);
          return rowAAllPermissions - rowBAllPermissions;
        },
      },
      cardPosition: 'center',
      minWidth: 360,
    },
    {
      head: <TextHeadCell text={<T className="tt-ue">operations</T>} />,
      index: 'operations',
      field: ({ record: { status: userStatus, nickname } }) => {
        let setLoaderRef = null;
        return (
          <Field className="jk-col center gap">
            <Select
              className=""
              options={Object.values(USER_STATUS).map(status => ({
                label: <T className="tt-se">{status.label}</T>,
                value: status.value,
                disabled: status.value === userStatus,
              }))}
              selectedOption={{ value: userStatus }}
              onChange={({ value }) => changeUserStatus(nickname, value, setLoaderRef)}
            />
            <Button
              icon={<EditIcon />}
              onClick={() => setNickname(nickname)}
              size="tiny"
            >
              <T>change password</T>
            </Button>
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
  ], []);
  
  const { queryObject, push } = useRouter();
  
  const data: UserManagementResponseDTO[] = (response?.success ? response?.contents : []);
  
  return (
    <>
      <ResetPassword onClose={() => setNickname('')} nickname={nickname} />
      <DataViewer<UserManagementResponseDTO>
        headers={columns}
        data={data}
        rows={{ height: 150 }}
        request={request}
        name="admin"
        searchParamsObject={queryObject}
        setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
        setLoaderStatusRef={setLoaderStatusRef}
      />
    </>
  );
}
