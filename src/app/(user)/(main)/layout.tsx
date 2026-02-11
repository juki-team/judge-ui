import { NavigationBar, SponsoredByTag, ToolButtons } from 'components';
import { type ReactNode } from 'react';
import { UserNotificationProvider } from './UserNotificationsProvider';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <NavigationBar>
      {children}
      <SponsoredByTag />
      <ToolButtons />
      <UserNotificationProvider />
    </NavigationBar>
  );
}
