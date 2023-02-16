import {
  Breadcrumbs,
  ButtonLoader,
  Field,
  PagedDataViewer,
  PlusIcon,
  T,
  TextField,
  TextHeadCell,
  TwoContentSection,
  UserNicknameLink,
} from 'components';
import { JUDGE_API_V1, QueryParam, ROUTES, SHEET_STATUS } from 'config/constants';
import { buttonLoaderLink, toFilterUrl, toSortUrl } from 'helpers';
import { useJukiBase, useRouter, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { DataViewerHeadersType, GetUrl, LastLinkKey, SheetStatus, SheetSummaryListResponseDTO } from 'types';

function Sheets() {
  
  useTrackLastPath(LastLinkKey.SHEETS);
  useTrackLastPath(LastLinkKey.SECTION_SHEET);
  const { user: { canCreatePublicSheet, canCreatePrivateSheet } } = useJukiBase();
  const columns: DataViewerHeadersType<SheetSummaryListResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">title</T>} />,
      index: 'title',
      field: ({ record: { key, title }, isCard }) => (
        <Field className="jk-row fw-bd">
          <Link href={ROUTES.SHEETS.VIEW(key)} className="link">
            {title}
          </Link>
        </Field>
      ),
      cardPosition: 'top',
      minWidth: 200,
    },
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">description</T>} />,
      index: 'description',
      field: ({ record: { description }, isCard }) => (
        <Field className="jk-row tx-s">
          <div style={{ lineHeight: '1.1' }}>{description}</div>
        </Field>
      ),
      cardPosition: 'center',
      minWidth: 220,
    },
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">owner</T>} />,
      index: 'ownerUserNickname',
      field: ({ record: { ownerUserNickname }, isCard }) => (
        <Field className="jk-row fw-bd">
          <UserNicknameLink nickname={ownerUserNickname}>
            <div>{ownerUserNickname}</div>
          </UserNicknameLink>
        </Field>
      ),
      cardPosition: 'bottom',
      minWidth: 120,
    },
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">visibility</T>} />,
      index: 'status',
      field: ({ record: { status } }) => (
        <TextField
          text={<T className="tt-se">{SHEET_STATUS[status].label}</T>}
          label={<T className="tt-se">visibility</T>}
        />
      ),
      // sort: true,
      // filter: {
      //   type: 'select',
      //   options: ([
      //     SheetStatus.ARCHIVED,
      //     SheetStatus.PRIVATE,
      //     SheetStatus.PUBLIC,
      //   ] as SheetStatus[]).map(status => ({
      //     value: status,
      //     label: <T className="tt-se">{SHEET_STATUS[status].label}</T>,
      //   })),
      // },
      cardPosition: 'bottom',
      minWidth: 140,
    } as DataViewerHeadersType<SheetSummaryListResponseDTO>,
  ], []);
  
  const { push } = useRouter();
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => (
    JUDGE_API_V1.SHEET.LIST(page, pageSize, toFilterUrl(filter), toSortUrl(sort))
  );
  
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <T className="tt-se">sheets</T>,
  ];
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right pad-top-bottom">
          <h1><T>sheets</T></h1>
        </div>
      </div>
      <div className="pad-top-bottom pad-left-right">
        <PagedDataViewer<SheetSummaryListResponseDTO, SheetSummaryListResponseDTO>
          headers={columns}
          url={url}
          name={QueryParam.SHEETS_TABLE}
          refreshInterval={60000}
          extraNodes={[
            ...(canCreatePublicSheet || canCreatePrivateSheet ? [
              <ButtonLoader
                size="small"
                icon={<PlusIcon />}
                responsiveMobile
                onClick={buttonLoaderLink(() => push(ROUTES.SHEETS.CREATE()))}
              >
                <T>create</T>
              </ButtonLoader>,
            ] : []),
          ]}
          cards={{ height: 256 }}
          rows={{ height: 80 }}
        />
      </div>
    </TwoContentSection>
  );
}

export default Sheets;
