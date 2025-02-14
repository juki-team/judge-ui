import { jukiApiSocketManager } from 'config';
import { JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME } from 'config/constants';
import { cleanRequest } from 'helpers';
import type { Metadata } from 'next';
import { ContentResponseType } from 'types';
import ProblemViewPage from './ProblemViewPage';

type Props = {
  params: Promise<{ problemKey: string }>
}

async function getMetadata(problemKey: string) {
  jukiApiSocketManager.setApiSettings(JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME);
  let result;
  try {
    const response = await fetch(
      jukiApiSocketManager.API_V1.problem.getMetadata({ params: { key: problemKey } }).url,
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
      siteName: 'Juki Judge',
      url: 'https://judge.juki.app',
      images: [
        {
          url: cover,
        },
      ],
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return await getMetadata((await params).problemKey);
}

export default async function Page({ params }: Props) {
  
  return <ProblemViewPage />;
}
