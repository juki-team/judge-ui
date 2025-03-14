import { ReactNode } from 'react';
import { RootLayout } from './RootLayout';

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <RootLayout>
      {children}
    </RootLayout>
  );
}
