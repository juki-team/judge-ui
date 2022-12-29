import { useJukiBase } from '@juki-team/base-ui';
import { ContentLayout, DataViewer, Field, Image, T, TextHeadCell, UserNicknameLink } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1, QueryParam } from 'config/constants';
import { searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester2, useRouter } from 'hooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ContentsResponseType, DataViewerHeadersType, GetUrl, UserRankResponseDTO } from 'types';

function Ranking() {
  const { viewPortSize } = useJukiBase();
  const columns: DataViewerHeadersType<UserRankResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">position</T>} />,
      index: 'key',
      field: ({ record: {}, isCard, recordIndex }) => (
        <Field className="jk-row fw-br">
          <div>{recordIndex + 1}</div>
        </Field>
      ),
      cardPosition: 'top',
      minWidth: 80,
      sticky: true,
    },
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">nickname</T>} />,
      index: 'nickname',
      field: ({ record: { nickname, imageUrl } }) => (
        <Field className="jk-row link fw-bd">
          <UserNicknameLink nickname={nickname}>
            <div className="jk-row gap">
              <Image src={imageUrl} className="jk-user-profile-img large jk-shadow" alt={nickname} height={50} width={50} />
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
      head: <TextHeadCell text={<T className="wb-bw tt-ue tx-s">points by problems</T>} />,
      index: 'problem-points',
      field: ({ record: { problemPoints } }) => (
        <Field className="jk-row center">
          <div className="fw-bd">{problemPoints.toFixed(2)}</div>
          &nbsp;<T>pnts</T>.
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.problemPoints - rowA.problemPoints },
      cardPosition: 'center',
      minWidth: 150,
    },
    {
      head: <TextHeadCell text={<T className="wb-bw tt-ue tx-s">points by competitions</T>} />,
      index: 'contest-points',
      field: ({ record: { competitionPoints } }) => (
        <Field className="jk-row center">
          <div className="fw-bd">{competitionPoints?.toFixed(2)}</div>
          &nbsp;<T>pnts</T>.
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.competitionPoints - rowA.competitionPoints },
      cardPosition: 'center',
      minWidth: 150,
    },
    {
      head: <TextHeadCell text={<><T className="tt-ue tx-s">country</T>, <T className="tt-ue tx-s">city</T></>} />,
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
      head: <TextHeadCell text={<T className="tt-ue tx-s">institution</T>} />,
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
  ], [viewPortSize]);
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => (
    JUDGE_API_V1.RANKING.LIST()
  );
  
  const { queryObject, replace } = useRouter();
  
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester2<ContentsResponseType<UserRankResponseDTO>>(url, { refreshInterval: 5 * 60 * 1000 });
  const [_, setRender] = useState(Date.now()); // TODO: Fix the render of DataViewer
  useEffect(() => {
    setTimeout(() => setRender(Date.now()), 100);
  }, [response]);
  
  const setSearchParamsObject = useCallback(params => replace({ query: searchParamsObjectTypeToQuery(params) }), []);
  
  const data: UserRankResponseDTO[] = (response?.success ? response.contents : []);
  
  return (
    <ContentLayout style={{ height: '100%' }}>
      <DataViewer<UserRankResponseDTO>
        headers={columns}
        data={data}
        rows={{ height: 68 }}
        request={request}
        name={QueryParam.RANKING_TABLE}
        setLoaderStatusRef={setLoaderStatusRef}
        searchParamsObject={queryObject}
        setSearchParamsObject={setSearchParamsObject}
        {...DEFAULT_DATA_VIEWER_PROPS}
      />
    </ContentLayout>
  );
}

export default Ranking;
