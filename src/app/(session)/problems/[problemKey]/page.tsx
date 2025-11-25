import { LinkLastPath, ProblemViewLayout, T, TwoContentLayout } from 'components';
import { jukiApiManager } from 'config';
import { DEFAULT_METADATA } from 'config/constants';
import { oneTab } from 'helpers';
import type { Metadata } from 'next';
import Image from 'next/image';
import { ContentResponseType, LastPathKey, MetadataResponseDTO, ProblemDataResponseDTO } from 'types';
import { get } from '../../../../helpers/fetch';
import { ButtonLogin } from './ButtonLogin';
import { ProblemTour } from './ProblemTour';

type Props = {
  params: Promise<{ problemKey: string }>
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  
  const problemKey = (await params).problemKey;
  
  let result;
  try {
    result = await get<ContentResponseType<MetadataResponseDTO>>(jukiApiManager.API_V2.problem.getMetadata({ params: { key: problemKey } }).url);
  } catch (error) {
    console.error('error on generateMetadata', error);
  }
  
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

export default async function ProblemViewPage({ params }: Props) {
  
  const problemKey = (await params).problemKey;
  
  const problemResponse = await get<ContentResponseType<ProblemDataResponseDTO>>(jukiApiManager.API_V2.problem.getData({ params: { key: problemKey as string } }).url);
  
  if (problemResponse.success) {
    return (
      <ProblemTour>
        <ProblemViewLayout problem={problemResponse.content} />
      </ProblemTour>
    );
  }
  
  return (
    <TwoContentLayout
      tabs={oneTab(
        <div className="jk-row ht-100">
          <div className="jk-col jk-br-ie gap bc-we jk-pg elevation-1">
            <h3 className="tt-se"><T>problem not found</T></h3>
            <Image
              alt="Juki surprised image"
              className="image-border"
              height={140}
              width={280}
              style={{ objectFit: 'contain' }}
              src="https://images.juki.pub/assets/juki-image-surprised.png"
            />
            <p>
              <T className="tt-se">the problem does not exist or you do not have permissions to view it</T>
            </p>
            <p>
              <LinkLastPath lastPathKey={LastPathKey.PROBLEMS}>
                <T className="tt-se fw-bd">go to problem list</T>
              </LinkLastPath>
            </p>
            <ButtonLogin />
          </div>
        </div>,
      )}
    >
    </TwoContentLayout>
  );
};
