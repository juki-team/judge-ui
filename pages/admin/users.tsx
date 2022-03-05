import { EditIcon, ErlenmeyerFlaskIcon } from '@bit/juki-team.juki.base-ui';
import { USER_STATUS } from '@bit/juki-team.juki.commons';
import { authorizedRequest, clean, POST } from 'helpers/services';
import { useMemo } from 'react';
import { ContentLayout, DataViewer, DataViewerHeadersType, Field, T, TextHeadCell, Select, useNotification, Button } from '../../components';
import { searchParamsObjectTypeToQuery } from '../../helpers';
import { useFetcher, useRequestLoader, useRouter } from '../../hooks';
import { JUDGE_API_V1 } from '../../services/judge';
import { ContentsResponseType, UserStatus, ContentResponseType } from '../../types';

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
  return arrayOfNumbers.reduce( (prevNumber, currentNumber) => +prevNumber + +currentNumber, initialValue)
}

function users() {
  
  const { data: response } = useFetcher<ContentsResponseType<any>>(JUDGE_API_V1.ADMIN.ADMIN('1', '32'));
  const options = [UserStatus.ACTIVE, UserStatus.REPORTED, UserStatus.ARCHIVED ];
  const optionsFilterStatus = [
    {
      value: UserStatus.ACTIVE,
      label: <T className="text-capitalize">active</T>,
    },
    {
      value: UserStatus.REPORTED,
      label: <T className="text-capitalize">reported</T>,
    },
    {
      value: UserStatus.ARCHIVED,
      label: <T className="text-capitalize">archived</T>,
    }
  ];
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const changeUserStatus = async (nickname, status) => {
    const response = clean<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.CHANGE_STATUS(nickname, status), POST));
    // async () => clean<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.SIGNIN(), POST, JSON.stringify({
    if (response.success) {
      addSuccessNotification(<T>success</T>);  
    } else {
      addErrorNotification(<T>error</T>)
    }
    console.log(response,'response');
    request();
  }
  
  const columns: DataViewerHeadersType<UsersTable>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="text-uppercase">Name</T>} />,
      index: 'Name',
      field: ({ record: { givenName, familyName } }) => (
        <Field className="jk-row pad">
          {givenName} <br/> {familyName}
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.givenName.localeCompare(rowB.givenName) },
      filter: { type: 'text-auto' },
      cardPosition: 'center',
      minWidth: 250,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">Email</T>} />,
      index: 'email',
      field: ({ record: { email } }) => (
        <Field className="jk-row pad">
          {email}
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.email.localeCompare(rowB.email) },
      filter: { type: 'text-auto' },
      cardPosition: 'center',
      minWidth: 300,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">permissions</T>} />,
      index: 'permissions',
      field: ({ record: { permissions } }) => (
        <div>
          {
            permissions.map( (permission, index) => (
              <div className="jk-row" key={index}>
                <span>{permission.key}</span>
                <span>{permission.value}</span>
              </div>
            ))
          }
        </div>
      ),
      sort: { compareFn: () => (rowA, rowB) => {
        // Each digit has a representation = add, archieve, updated, view
        const rowAAllPermissions = sumEachDigitOfNumber(rowA.permissions[0].value) + sumEachDigitOfNumber(rowA.permissions[1].value) + sumEachDigitOfNumber(rowA.permissions[2].value);
        const rowBAllPermissions = sumEachDigitOfNumber(rowB.permissions[0].value) + sumEachDigitOfNumber(rowB.permissions[1].value) + sumEachDigitOfNumber(rowB.permissions[2].value);

        return rowAAllPermissions - rowBAllPermissions;
      }},
      cardPosition: 'center',
      minWidth: 200,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">nickname</T>} />,
      index: 'nickname',
      field: ({ record: { nickname } }) => (
        <Field className="jk-row">
          {nickname}
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.nickname.localeCompare(rowB.nickname) },
      filter: { type: 'text-auto' },
      cardPosition: 'center',
      minWidth: 250,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">status</T>} />,
      index: 'status',
      field: ({ record: { status, nickname } }) => (
        <Field className="jk-row">
          <Select 
            className=""
            options={options.map( option => ({
              label: <T className="text-sentence-case">{USER_STATUS[option].print}</T>,
              value: option,
            }))}
            optionSelected={{value: status, label: <T className="text-sentence-case">{USER_STATUS[status].print}</T>}}
            onChange={({value}) => changeUserStatus(nickname, value)}
          />
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.status.localeCompare(rowB.status) },
      filter: {
        type: 'select-auto', options: optionsFilterStatus,
      },
      cardPosition: 'center',
      minWidth: 250,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">change password</T>} />,
      index: 'status',
      field: ({ record: { status, nickname } }) => (
        <Field className="jk-row">
          <Button
            className="" 
            icon={<EditIcon />} 
            onClick={() => {}}
            size="small"
          />
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.status.localeCompare(rowB.status) },
      filter: {
        type: 'select-auto', options: optionsFilterStatus,
      },
      cardPosition: 'center',
      minWidth: 200,
    },
  ], []);
  
  const { queryObject, push } = useRouter();
  
  const data: UsersTable[] = (response.success ? response?.contents : []).map(admin => ({
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
    permissions: admin.permissions
  }));
  
  const request = useRequestLoader(JUDGE_API_V1.ADMIN.ADMIN('1', '32'));
  
  return (
    <div>
      {/* <TitleLayout>
       <h3>Contest</h3>
       </TitleLayout> */}
      <ContentLayout>
        <div className="main-content">
          <DataViewer<UsersTable>
            headers={columns}
            data={data}
            rows={{ height: 110 }}
            request={request}
            name="admin"
            // extraButtons={() => (
            //   <div className="extra-buttons">
            //     {can.createProblem(user) && (
            //       <ButtonLoader
            //         size="small"
            //         icon={<PlusIcon />}
            //         onClick={buttonLoaderLink(ROUTES.PROBLEMS.CREATE(ProblemTab.STATEMENT))}
            //       >
            //         <T>create</T>
            //       </ButtonLoader>
            //     )}
            //   </div>
            // )}
            searchParamsObject={queryObject}
            setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
          />
        </div>
      </ContentLayout>
    </div>
  );
}

export default users;