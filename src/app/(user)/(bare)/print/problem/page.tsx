export const dynamic = 'force-dynamic';

import { ProblemView } from 'src/components/jukiClientBoundary';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { JUKI_INTERNAL_API_KEY } from 'config/constants';
import { HEADER_JUKI_INTERNAL_API_KEY } from '@juki-team/commons/constants';
import { type ProblemDataResponseDTO } from '@juki-team/commons/dto';
import { cleanRequest } from '@juki-team/commons/helpers';
import { type ContentResponse } from '@juki-team/commons/types';
import { getHeaders } from '@juki-team/base-ui/helpers';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {

  let problemData: ProblemDataResponseDTO | null = null;

  try {

    const { key, jukiSessionId } = (await searchParams) as { key: string, jukiSessionId: string };

    const { url } = jukiApiManager.apiV2.problem.getData({ params: { key } });

    const response = await fetch(url, {
      headers: {
        ...getHeaders(jukiSessionId),
        [HEADER_JUKI_INTERNAL_API_KEY]: JUKI_INTERNAL_API_KEY,
      },
    });
    const text = await response.text();
    const result = cleanRequest<ContentResponse<ProblemDataResponseDTO>>(text);
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

  return (
    <ProblemView
      problem={problemData}
      infoPlacement="none"
      codeEditorStoreKey={problemData.key}
      forPrinting
    />
  );
}
