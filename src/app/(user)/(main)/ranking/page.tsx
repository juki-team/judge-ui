'use client';

import { TextHeadCell } from '@juki-team/base-ui/server-components';
import { DataViewer, Field, FieldText, T, TwoContentLayout, UserNicknameLink, useDataViewerRequester, usePageStore, useUIStore } from '@juki-team/base-ui';
import { JUDGE_API_V1 } from 'config/constants';
import { DEFAULT_DATA_VIEWER_PROPS } from '@juki-team/base-ui/constants';
import { oneTab } from '@juki-team/base-ui/helpers';
import { useMemo } from 'hooks';
import { QueryParam } from 'types';
import { type DataViewerHeadersType } from '@juki-team/base-ui/types';
import { type UserRankResponseDTO } from '@juki-team/commons/dto';
import { type ContentsResponse } from '@juki-team/commons/types';

function Ranking() {

  const isSmallScreen = usePageStore(store => store.viewPort.isSmallScreen);
  const { Image } = useUIStore(store => store.components);
  const columns: DataViewerHeadersType<UserRankResponseDTO>[] = useMemo(() => [
    {
      head: 'position',
      index: 'key',
      Field: ({ record: {}, isCard, recordIndex }) => (
        isCard ? null : (
          <Field className="jk-row fw-br">
            <div>{recordIndex + 1}</div>
          </Field>
        )
      ),
      cardPosition: 'top',
      minWidth: 80,
      sticky: true,
      // sticky: true,
    },
    {
      head: <TextHeadCell text={<T className="tt-se">nickname</T>} className="left" />,
      index: 'nickname',
      Field: ({ record: { nickname, imageUrl, organization }, isCard, recordIndex }) => (
        <Field className="jk-row link fw-bd gap">
          {isCard && <div className="fw-br jk-pg-sm">{recordIndex + 1}</div>}
          <UserNicknameLink nickname={nickname} organizationKey={organization.key}>
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
      sticky: !isSmallScreen,
    },
    {
      head: <TextHeadCell text={<T className="wb-bw tt-se">points by problems</T>} />,
      index: 'problem-points',
      Field: ({ record: { problemPoints } }) => (
        <FieldText
          text={<>
            <div className="fw-bd" style={{ fontFamily: 'monospace' }}>{problemPoints.toFixed(2)}</div>
            &nbsp;<T>pts.</T>
          </>}
          label={<T className="tt-se">on problems</T>}
        />
      ),
      // sort: { compareFn: () => (rowA, rowB) => rowB.problemPoints - rowA.problemPoints },
      cardPosition: 'centerLeft',
      minWidth: 150,
    },
    // {
    //   head: <TextHeadCell text={<T className="wb-bw tt-se">points by competitions</T>} />,
    //   index: 'contest-points',
    //   field: ({ record: { competitionPoints }, isCard }) => (
    //     <FieldText
    //       text={<>
    //         <div className="fw-bd">{competitionPoints?.toFixed(2)}</div>
    //         &nbsp;<T>pts.</T>
    //       </>}
    //       label={<T className="tt-se">on contests</T>}
    //     />
    //   ),
    //   sort: { compareFn: () => (rowA, rowB) => rowB.competitionPoints - rowA.competitionPoints },
    //   cardPosition: 'centerRight',
    //   minWidth: 150,
    // },
    {
      head: <TextHeadCell
        text={<div className="jk-row"><T className="tt-se">country</T>,&nbsp;<T className="tt-se">city</T></div>}
      />,
      index: 'country-city',
      Field: ({ record: { country, city } }) => (
        <Field className="jk-row center">
          {city}{city ? <>,&nbsp;</> : ''}
          <span className="fw-bd">{country}</span>
        </Field>
      ),
      filter: { type: 'text-auto', getValue: ({ record: { country, city } }) => country + city },
      cardPosition: 'bottom',
      minWidth: 200,
    },
    {
      head: 'institution',
      index: 'institution',
      Field: ({ record: { institution } }) => (
        <Field className="jk-row center">
          {institution}
        </Field>
      ),
      filter: { type: 'text-auto' },
      cardPosition: 'bottom',
      minWidth: 200,
    },
  ], [ Image, isSmallScreen ]);

  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponse<UserRankResponseDTO>>(
    () => JUDGE_API_V1.RANKING.LIST(),
    { refreshInterval: 5 * 60 * 1000 },
  );

  const data: UserRankResponseDTO[] = (response?.success ? response.contents : []);

  return (
    <TwoContentLayout
      tabs={oneTab(
        <DataViewer<UserRankResponseDTO>
          headers={columns}
          data={data}
          rowsView={!isSmallScreen}
          rows={{ height: 68 }}
          requestRef={request}
          name={QueryParam.RANKING_TABLE}
          setLoaderStatusRef={setLoaderStatusRef}
          cards={{ height: 240, expanded: true }}
          {...DEFAULT_DATA_VIEWER_PROPS}
        />,
      )}
    >
      <h1><T className="tt-se">ranking</T></h1>
    </TwoContentLayout>
  );
}

export default Ranking;
