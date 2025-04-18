export const dynamic = 'force-dynamic';

import { jukiApiSocketManager } from 'config';
import { cleanRequest } from 'helpers';
import { ContentResponseType, ContestDataResponseDTO } from 'types';
import { ContestProblemSetViewPage } from './ContestProblemSetViewPage';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  
  let contestData: ContestDataResponseDTO | null = null;
  
  try {
    
    const { key, jukiSessionId } = (await searchParams) as { key: string, jukiSessionId: string };
    
    const { url } = jukiApiSocketManager.API_V1.contest.getData({ params: { key } });
    const response = await fetch(
      url,
      {
        headers: {
          origin: 'https://juki.app',
          'x-juki-session-id': jukiSessionId,
          'x-forwarded-host': 'juki.app',
        } as HeadersInit,
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
