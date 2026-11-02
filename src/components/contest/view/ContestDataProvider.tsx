'use client';

import { useUserStore } from 'hooks';
import { createContext, useContext } from 'react';
import type { ContestDataResponseDto } from 'types';
import { useContestData } from './useContestData';

const ContestDataContext = createContext<ReturnType<typeof useContestData> | null>(null);

export function ContestDataProvider({
                                      fallbackData,
                                      children,
                                    }: {
  fallbackData: ContestDataResponseDto;
  children: React.ReactNode;
}) {
  const organizationKey = useUserStore(s => s.organization.key);
  const value = useContestData(fallbackData, organizationKey);
  return <ContestDataContext.Provider value={value}>{children}</ContestDataContext.Provider>;
}

export function useContest() {
  const ctx = useContext(ContestDataContext);
  if (!ctx) throw new Error('useContest must be used within <ContestDataProvider>');
  return ctx;
}
