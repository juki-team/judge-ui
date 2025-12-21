export const dynamic = 'force-dynamic';

import { HEADER_JUKI_INTERNAL_API_KEY } from '@juki-team/commons';
import { jukiApiManager } from 'config';
import { JUKI_INTERNAL_API_KEY } from 'config/constants';
import { cleanRequest, getHeaders } from 'helpers';
import { ContentResponseType, ContestDataResponseDTO } from 'types';
import { ContestProblemSetViewPage } from './ContestProblemSetViewPage';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  
  let contestData: ContestDataResponseDTO | null = null;
  
  try {
    
    const { key, jukiSessionId } = (await searchParams) as { key: string, jukiSessionId: string };
    
    const { url } = jukiApiManager.API_V2.contest.getData({ params: { key } });
    const response = await fetch(url, {
      headers: {
        ...getHeaders(jukiSessionId),
        [HEADER_JUKI_INTERNAL_API_KEY]: JUKI_INTERNAL_API_KEY,
      },
    });
    const text = await response.text();
    const result = cleanRequest<ContentResponseType<ContestDataResponseDTO>>(text);
    if (result.success) {
      contestData = result.content;
    } else {
      console.error('error on getting problem data', result);
    }
  } catch (error) {
    console.error('error on getting problem data', error);
  }
  
  if (!contestData) {
    return (
      <div>error!</div>
    );
  }
  
  return <ContestProblemSetViewPage contest={contestData} />;
}
