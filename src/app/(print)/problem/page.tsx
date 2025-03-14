import { jukiApiSocketManager } from 'config';
import { JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME } from 'config/constants';
import { cleanRequest } from 'helpers';
import { headers } from 'next/headers';
import { ContentResponseType, ProblemDataResponseDTO } from 'types';
import ProblemViewPage from './ProblemViewPage';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  
  let problemData: ProblemDataResponseDTO | null = null;
  
  try {
    jukiApiSocketManager.setApiSettings(JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME);
    
    const { key, jukiSessionId } = (await searchParams) as { key: string, jukiSessionId: string };
    
    const { url } = jukiApiSocketManager.API_V1.problem.getData({ params: { key } });
    const headersList = await headers();
    const host = headersList.get('host');
    const response = await fetch(
      url,
      {
        headers: {
          origin: 'https://juki.app',
          'x-juki-session-id': jukiSessionId,
          'x-forwarded-host': host,
        } as HeadersInit,
      });
    
    const text = await response.text();
    const result = cleanRequest<ContentResponseType<ProblemDataResponseDTO>>(text);
    if (result.success) {
      problemData = result.content;
    } else {
      console.error('error on getting problem data', result);
    }
  } catch (error) {
    console.error('error on getting problem data', error);
  }
  
  if (!problemData) {
    return (
      <div>error!</div>
    );
  }
  
  return <ProblemViewPage problem={problemData} />;
}
