import {
  Breadcrumbs,
  ButtonLoader,
  DateLiteral,
  EditIcon,
  FetcherLayer,
  LinkSheets,
  SheetPage,
  T,
  TwoContentSection,
} from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useRouter } from 'hooks';
import Link from 'next/link';
import Custom404 from 'pages/404';
import React from 'react';
import { ContentResponseType, SheetResponseDTO, Status } from 'types';

function Sheet() {
  
  const { query } = useRouter();
  const sheetId = query.sheetId as string;
  const { push } = useRouter();
  
  return (
    <FetcherLayer<ContentResponseType<SheetResponseDTO>>
      url={JUDGE_API_V1.SHEET.SHEET(sheetId)}
      errorView={<Custom404 />}
    >
      {({ data }) => {
        
        const breadcrumbs = [
          <Link href="/" className="link"><T className="tt-se">home</T></Link>,
          <LinkSheets><T className="tt-se">sheets</T></LinkSheets>,
          <div className="ws-np">{data.content.title}</div>,
        ];
        
        return (
          <TwoContentSection>
            <div>
              <Breadcrumbs breadcrumbs={breadcrumbs} />
              <div className="jk-row pad-left-right">
                <div className="jk-row left flex-1 pad-top">
                  <h1>{data.content.title}</h1>
                  <div>
                    {data.content.description}
                  </div>
                </div>
                {data?.content?.user?.isEditor && (
                  <ButtonLoader
                    size="small"
                    icon={<EditIcon />}
                    onClick={async setLoaderStatus => {
                      setLoaderStatus(Status.LOADING);
                      await push(ROUTES.SHEETS.EDIT(sheetId));
                      setLoaderStatus(Status.SUCCESS);
                    }}
                    responsiveMobile
                  >
                    {<T>edit</T>}
                  </ButtonLoader>
                )}
              </div>
            </div>
            <div>
              <div className="jk-row center extend">
                <div style={{ width: 'var(--modal-width)' }}>
                  <SheetPage sheets={data.content.body} />
                  <div className="jk-row right">
                    <DateLiteral date={new Date(data.content.updatedAt)} show="year-month-day-hours-minutes" />
                  </div>
                </div>
              </div>
            </div>
          </TwoContentSection>
        );
      }}
    </FetcherLayer>
  );
}

export default Sheet;
