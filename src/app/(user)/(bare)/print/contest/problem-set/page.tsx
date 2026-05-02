export const dynamic = 'force-dynamic';

import { jukiApiManager } from '@juki-team/base-ui/settings';
import { JUKI_INTERNAL_API_KEY } from 'config/constants';
import { HEADER_JUKI_INTERNAL_API_KEY } from '@juki-team/commons/constants';
import { type ContestDataResponseDTO } from '@juki-team/commons/dto';
import { cleanRequest } from '@juki-team/commons/helpers';
import { type ContentResponse } from '@juki-team/commons/types';
import { getHeaders } from '@juki-team/base-ui/helpers';
import { ContestProblemSetViewPage } from './ContestProblemSetViewPage';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {

  let contestData: ContestDataResponseDTO | null = null;

  try {

    const { key, jukiSessionId } = (await searchParams) as { key: string, jukiSessionId: string };

    const { url } = jukiApiManager.apiV2.contest.getData({ params: { key } });
    const response = await fetch(url, {
      headers: {
        ...getHeaders(jukiSessionId),
        [HEADER_JUKI_INTERNAL_API_KEY]: JUKI_INTERNAL_API_KEY,
      },
    });
    const text = await response.text();
    const result = cleanRequest<ContentResponse<ContestDataResponseDTO>>(text);
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
