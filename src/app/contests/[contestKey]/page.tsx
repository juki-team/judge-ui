import { jukiApiSocketManager } from 'config';
import { JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME } from 'config/constants';
import { cleanRequest } from 'helpers';
import type { Metadata } from 'next';
import { ContentResponseType } from 'types';
import ContestViewPage from './ContestViewPage';

type Props = {
  params: Promise<{ contestKey: string }>
}

async function getMetadata(contestKey: string) {
  jukiApiSocketManager.setApiSettings(JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME);
  let result;
  try {
    const response = await fetch(
      jukiApiSocketManager.API_V1.contest.getMetadata({ params: { key: contestKey } }).url,
      { headers: { origin: 'https://juki.app' } });
    const text = await response.text();
    result = cleanRequest<ContentResponseType<{
      title: string,
      description: string,
      cover: string
    }>>(text);
  } catch (error) {
    console.error('error on generateMetadata', error);
  }
  
  const { title, description, cover } = result?.success ? result.content : { title: '', description: '', cover: '' };
  
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      images: [
        {
          url: cover,
        },
      ],
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return await getMetadata((await params).contestKey);
}

export default function Page() {
  
  return <ContestViewPage />;
}
