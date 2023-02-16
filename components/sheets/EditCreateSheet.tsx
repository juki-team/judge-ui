import {
  Breadcrumbs,
  ButtonLoader,
  CheckUnsavedChanges,
  CloseIcon,
  Input,
  LinkSheets,
  SaveIcon,
  SheetPage,
  T,
  TabsInline,
  TextArea,
  TwoContentSection,
  useNotification,
} from 'components';
import { JUDGE_API_V1, ROUTES, SHEET_DEFAULT } from 'config/constants';
import { authorizedRequest, cleanRequest, notifyResponse } from 'helpers';
import { useRouter } from 'hooks';
import Link from 'next/link';
import React, { useState } from 'react';
import { useSWRConfig } from 'swr';
import { BodySheetType, ContentResponseType, HTTPMethod, SheetResponseDTO, SheetStatus, SheetTab, Status } from 'types';

export type EditCreateSheetType = {
  key: string,
  status: SheetStatus,
  title: string,
  description: string,
  body: BodySheetType[],
};

export function EditCreateSheet({ sheet: initialSheet }: { sheet?: EditCreateSheetType }) {
  const { mutate } = useSWRConfig();
  const [sheet, setSheet] = useState<EditCreateSheetType>(initialSheet || SHEET_DEFAULT());
  const [tab, setTab] = useState(SheetTab.CONTENT);
  const tabs = {
    [SheetTab.CONTENT]: {
      key: SheetTab.CONTENT,
      header: <T className="tt-ce ws-np">content</T>,
      body: (
        <div className="jk-col top stretch extend pad-left-right">
          <SheetPage sheets={sheet.body} setSheets={(body) => setSheet({ ...sheet, body })} />
        </div>
      ),
    },
    [SheetTab.SETUP]: {
      key: SheetTab.SETUP,
      header: <T className="tt-ce ws-np">settings</T>,
      body: (
        <div className="pad-top-bottom pad-left-right">
          setttings
        </div>
      ),
    },
  };
  
  const editing = !!initialSheet;
  const { addNotification } = useNotification();
  const { push } = useRouter();
  const extraNodes = [
    <CheckUnsavedChanges
      onSafeClick={() => push(editing ? ROUTES.SHEETS.VIEW(initialSheet.key) : ROUTES.SHEETS.LIST())}
      value={sheet}
    >
      <ButtonLoader
        size="small"
        type="outline"
        icon={<CloseIcon />}
        responsiveMobile
      >
        <T>cancel</T>
      </ButtonLoader>
    </CheckUnsavedChanges>,
    <ButtonLoader
      size="small"
      icon={<SaveIcon />}
      onClick={async (setLoaderStatus) => {
        setLoaderStatus(Status.LOADING);
        const response = cleanRequest<ContentResponseType<SheetResponseDTO>>(
          await authorizedRequest(editing ? JUDGE_API_V1.SHEET.SHEET(initialSheet.key) : JUDGE_API_V1.SHEET.CREATE(),
            {
              method: editing ? HTTPMethod.PUT : HTTPMethod.POST,
              body: JSON.stringify(sheet),
            },
          ));
        if (notifyResponse(response, addNotification, setLoaderStatus)) {
          await push(ROUTES.SHEETS.VIEW(response.content.key));
          await mutate(JUDGE_API_V1.SHEET.SHEET(response.content.key));
        }
      }}
      responsiveMobile
    >
      <T>{editing ? 'update' : 'create'}</T>
    </ButtonLoader>,
  ];
  
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <LinkSheets><T className="tt-se">sheets</T></LinkSheets>,
  ];
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right jk-row extend center tx-h">
          <h3 style={{ padding: 'var(--pad-sm) 0' }}><T>name</T></h3>:&nbsp;
          <Input
            value={sheet.title}
            onChange={value => setSheet({ ...sheet, title: value })}
          />
        </div>
        <div className="pad-left-right">
          <T className="tt-se fw-bd">description</T>:
          <TextArea value={sheet.description} onChange={value => setSheet({ ...sheet, description: value })} />
        </div>
        <div className="pad-left-right" style={{ overflow: 'hidden' }}>
          <TabsInline
            tabs={tabs}
            onChange={(tab) => setTab(tab)}
            selectedTabKey={tab}
            extraNodes={extraNodes}
          />
        </div>
      </div>
      {tabs[tab].body}
    </TwoContentSection>
  );
}
