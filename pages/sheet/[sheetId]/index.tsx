import { authorizedRequest, cleanRequest } from '@juki-team/base-ui';
import { ContentResponseType } from '@juki-team/commons';
import { DateLiteral, SheetPage } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { useRouter } from 'hooks';
import React, { useEffect, useState } from 'react';

function Sheet() {
  
  const [sheets, setSheets] = useState([]);
  const [isEditor, setIsEditor] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(0);
  const { query } = useRouter();
  const sheetId = query.sheetId as string;
  
  useEffect(() => {
    (async () => {
      const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.SHEET.SHEET(sheetId)));
      if (response.success) {
        setSheets(response.content?.body);
        setIsEditor(response.content?.user?.isEditor);
        setUpdatedAt(response.content?.updatedAt);
      }
    })();
  }, []);
  
  return (
    <div className="jk-pad-md">
      <>
        <SheetPage
          sheets={sheets}
          setSheets={isEditor ? setSheets : undefined}
          sheetId={sheetId}
        />
        <div className="jk-row right">
          <DateLiteral date={new Date(updatedAt)} show="year-month-day-hours-minutes" />
        </div>
      </>
    </div>
  );
}

export default Sheet;
