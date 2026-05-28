'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Styles = dynamic(() => import('./Styles'), {
  ssr: false,
  loading: () => null,
});

export const StylesLazy = () => {
  
  const [ render, setRender ] = useState(false);
  
  useEffect(() => {
    const id = setTimeout(() => {
      setRender(true);
    }, 10000);
    return () => clearTimeout(id);
  }, []);
  
  if (render) {
    return <Styles />;
  }
  
  return null;
};
