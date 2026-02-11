import { ContestEditPage } from './ContestEditPage';

type Props = {
  params: Promise<{ contestKey: string }>
}

export default async function Page({ params }: Props) {
  
  const { contestKey } = await params;
  
  return <ContestEditPage contestKey={contestKey} />;
}
