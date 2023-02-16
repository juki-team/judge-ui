import { EditCreateSheet, FetcherLayer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { useRouter } from 'hooks';
import React from 'react';
import { ContentResponseType, SheetResponseDTO } from 'types';
import Custom404 from '../../../404';

function SheetEdit() {
  
  const { query: { sheetId } } = useRouter();
  
  return (
    <FetcherLayer<ContentResponseType<SheetResponseDTO>>
      url={JUDGE_API_V1.SHEET.SHEET(sheetId as string)}
      errorView={<Custom404 />}
    >
      {({ data }) => {
        if (data.success && data.content.user.isEditor) {
          return <EditCreateSheet sheet={data.content} />;
        }
        return <Custom404 />;
      }}
    </FetcherLayer>
  );
}

export default SheetEdit;
