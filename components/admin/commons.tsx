import { useLasLink } from 'hooks';
import Link from 'next/link';
import React from 'react';
import { LastLinkKey } from 'types';

export const LinkSectionAdmin = ({ children }) => {
  const { lastLink } = useLasLink();
  return (
    <Link
      href={{ pathname: lastLink[LastLinkKey.SECTION_ADMIN].pathname, query: lastLink[LastLinkKey.SECTION_ADMIN].query }}
      className="link"
    >
      {children}
    </Link>
  );
};
