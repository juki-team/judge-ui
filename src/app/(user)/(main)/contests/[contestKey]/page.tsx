import { oneTab } from '@juki-team/base-ui/helpers';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { type ContestDataResponseDTO, type MetadataResponseDTO } from '@juki-team/commons/dto';
import { type ContentResponse } from '@juki-team/commons/types';
import { ContestNotFoundCard, ContestViewLayout } from 'components';
import { DEFAULT_METADATA } from 'config/constants';
import { get } from 'helpers/fetch';
import type { Metadata } from 'next';
import { TwoContentLayout } from 'src/components/jukiClientBoundary';
import { ContestDataProvider } from '../../../../../components/contest/view/ContestDataProvider';

type Props = {
  params: Promise<{ contestKey: string }>
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const contestKey = (await params).contestKey;

  const result = await get<ContentResponse<MetadataResponseDTO>>(jukiApiManager.apiV2.contest.getMetadata({ params: { key: contestKey } }).url);

  const { title, description } = result?.success ? result.content : { title: '', description: '' };

  return {
    ...DEFAULT_METADATA,
    title,
    description,
    openGraph: {
      ...DEFAULT_METADATA.openGraph,
      title,
      description,
      // images: [
      //   {
      //     url: cover,
      //     width: 400,
      //     height: 210,
      //   },
      // ],
    },
    twitter: {
      ...DEFAULT_METADATA.twitter,
      title,
      description,
    },
  };
}

export default async function Page({ params }: Props) {

  const { contestKey } = await params;

  const contestResponse = await get<ContentResponse<ContestDataResponseDTO>>(jukiApiManager.apiV2.contest.getData({ params: { key: contestKey } }).url);

  if (contestResponse.success) {
    return (
      <ContestDataProvider fallbackData={contestResponse.content}>
        <ContestViewLayout />
      </ContestDataProvider>
    );
  }

  return <TwoContentLayout tabs={oneTab(<ContestNotFoundCard />)} />;
}
