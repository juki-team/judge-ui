import { PageNotFound } from 'components';
import { PropsWithChildren } from 'types';

export default function Custom404({ children }: PropsWithChildren<{}>) {
  return (
    <PageNotFound>
      {children}
    </PageNotFound>
  );
}
