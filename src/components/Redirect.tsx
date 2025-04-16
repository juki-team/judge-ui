import { SpinIcon } from '@juki-team/base-ui/server-components';
import { redirect } from 'next/navigation';

export const Redirect = ({ url }: { url?: string }) => {
  
  redirect(url ?? '/');
  
  return <div className="jk-loader-layer"><SpinIcon size="large" /></div>;
};
