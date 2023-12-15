import {
  Breadcrumbs,
  DataViewer,
  Field,
  HomeLink,
  Image,
  T,
  TextField,
  TextHeadCell,
  TwoContentSection,
  UserNicknameLink,
} from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { useDataViewerRequester, useEffect, useJukiUI, useMemo, useState } from 'hooks';
import { ContentsResponseType, DataViewerHeadersType, QueryParam, UserRankResponseDTO } from 'types';

function Ranking() {
  
  const { viewPortSize } = useJukiUI();
  const columns: DataViewerHeadersType<UserRankResponseDTO>[] = useMemo(() => [
    {
      head: 'position',
      index: 'key',
      field: ({ record: {}, isCard, recordIndex }) => (
        isCard ? null : (
          <Field className="jk-row fw-br">
            <div>{recordIndex + 1}</div>
          </Field>
        )
      ),
      cardPosition: 'top',
      minWidth: 80,
      sticky: true,
    },
    {
      head: <TextHeadCell text={<T className="tt-se">nickname</T>} className="left" />,
      index: 'nickname',
      field: ({ record: { nickname, imageUrl }, isCard, recordIndex }) => (
        <Field className="jk-row link fw-bd gap">
          {isCard && <div className="fw-br jk-pad-sm">{recordIndex + 1}</div>}
          <UserNicknameLink nickname={nickname}>
            <div className="jk-row flex-1 gap left">
              <Image
                src={imageUrl}
                className="jk-user-profile-img large elevation-1"
                alt={nickname}
                height={50}
                width={50}
              />
              {nickname}
            </div>
          </UserNicknameLink>
        </Field>
      ),
      filter: { type: 'text-auto' },
      cardPosition: 'top',
      minWidth: 300,
      sticky: viewPortSize !== 'sm',
    },
    {
      head: <TextHeadCell text={<T className="wb-bw tt-se">points by problems</T>} />,
      index: 'problem-points',
      field: ({ record: { problemPoints }, isCard }) => (
        <TextField
          text={<>
            <div className="fw-bd">{problemPoints.toFixed(2)}</div>
            &nbsp;<T>pts.</T>
          </>}
          label={<T className="tt-se">on problems</T>}
        />
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.problemPoints - rowA.problemPoints },
      cardPosition: 'centerLeft',
      minWidth: 150,
    },
    {
      head: <TextHeadCell text={<T className="wb-bw tt-se">points by competitions</T>} />,
      index: 'contest-points',
      field: ({ record: { competitionPoints }, isCard }) => (
        <TextField
          text={<>
            <div className="fw-bd">{competitionPoints?.toFixed(2)}</div>
            &nbsp;<T>pts.</T>
          </>}
          label={<T className="tt-se">on contests</T>}
        />
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.competitionPoints - rowA.competitionPoints },
      cardPosition: 'centerRight',
      minWidth: 150,
    },
    {
      head: <TextHeadCell text={<><T className="tt-se">country</T>, <T className="tt-se">city</T></>} />,
      index: 'country-city',
      field: ({ record: { country, city } }) => (
        <Field className="jk-row center">
          {city}{city ? <>,&nbsp;</> : ''}<span className="fw-bd">{country}</span>
        </Field>
      ),
      filter: { type: 'text-auto' },
      cardPosition: 'bottom',
      minWidth: 200,
    },
    {
      head: 'institution',
      index: 'institution',
      field: ({ record: { institution } }) => (
        <Field className="jk-row center">
          {institution}
        </Field>
      ),
      filter: { type: 'text-auto' },
      cardPosition: 'bottom',
      minWidth: 200,
    },
  ], [ viewPortSize ]);
  
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<UserRankResponseDTO>>(
    ({ pagination: { page, pageSize }, filter, sort }) => (
      JUDGE_API_V1.RANKING.LIST()
    ),
    { refreshInterval: 5 * 60 * 1000 },
  );
  const [ _, setRender ] = useState(Date.now()); // TODO: Fix the render of DataViewer
  useEffect(() => {
    setTimeout(() => setRender(Date.now()), 100);
  }, [ response ]);
  
  const data: UserRankResponseDTO[] = (response?.success ? response.contents : []);
  
  const breadcrumbs = [
    <HomeLink key="home" />,
    <T className="tt-se" key="ranking">ranking</T>,
  ];
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right pad-top-bottom">
          <h1><T>ranking</T></h1>
        </div>
      </div>
      <div className="pad-left-right pad-top-bottom">
        <DataViewer<UserRankResponseDTO>
          headers={columns}
          data={data}
          rowsView={viewPortSize !== 'sm'}
          rows={{ height: 68 }}
          request={request}
          name={QueryParam.RANKING_TABLE}
          setLoaderStatusRef={setLoaderStatusRef}
          cards={{ height: 240, expanded: true }}
          {...DEFAULT_DATA_VIEWER_PROPS}
        />
      </div>
    </TwoContentSection>
  );
}

export default Ranking;
