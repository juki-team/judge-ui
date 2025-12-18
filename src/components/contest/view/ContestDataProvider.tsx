'use client';

import { useUserStore } from 'hooks';
import { createContext, useContext } from 'react';
import type { ContestDataResponseDTO } from 'types';
import { useContestData } from './useContestData';

const ContestDataContext = createContext<ReturnType<typeof useContestData> | null>(null);

export function ContestDataProvider({
                                      fallbackData,
                                      children,
                                    }: {
  fallbackData: ContestDataResponseDTO;
  children: React.ReactNode;
}) {
  const companyKey = useUserStore(s => s.company.key);
  const value = useContestData(fallbackData, companyKey);
  return <ContestDataContext.Provider value={value}>{children}</ContestDataContext.Provider>;
}

export function useContest() {
  const ctx = useContext(ContestDataContext);
  if (!ctx) throw new Error('useContest must be used within <ContestDataProvider>');
  return ctx;
}
