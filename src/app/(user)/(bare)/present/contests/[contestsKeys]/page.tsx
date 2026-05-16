import { ContestDataProvider, ContestNotFoundCard } from 'components';
import { TwoContentLayout, UserPreviewModal } from 'src/components/jukiClientBoundary';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { DEFAULT_METADATA } from 'config/constants';
import { get } from 'helpers';
import { oneTab } from '@juki-team/base-ui/helpers';
import type { Metadata } from 'next';
import { type ContestDataResponseDTO, type MetadataResponseDTO } from '@juki-team/commons/dto';
import { type ContentResponse } from '@juki-team/commons/types';
import { ViewBunchScoreboard } from '../../../../../../components/contest/view/scoreboard/ViewBunchScoreboard';

type Props = {
  params: Promise<{ contestsKeys: string }>
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const contestKey = decodeURIComponent((await params).contestsKeys).split(',')?.[0]!;

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

  const contestsKeys = decodeURIComponent((await params).contestsKeys);
  const contestKey = contestsKeys.split(',')?.[0]!;

  const contestResponse = await get<ContentResponse<ContestDataResponseDTO>>(jukiApiManager.apiV2.contest.getData({ params: { key: contestKey } }).url);

  if (contestResponse.success) {
    return (
      <ContestDataProvider fallbackData={contestResponse.content}>
        <ViewBunchScoreboard contestKeys={contestsKeys.split(',')} />
        <UserPreviewModal />
      </ContestDataProvider>
    );
  }

  return <TwoContentLayout tabs={oneTab(<ContestNotFoundCard />)} />;
}
