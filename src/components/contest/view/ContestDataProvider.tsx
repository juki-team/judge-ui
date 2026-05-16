'use client';

import { useUserStore } from '@juki-team/base-ui';
import { createContext, useContext } from 'react';
import type { ContestDataResponseDTO } from '@juki-team/commons/dto';
import { useContestData } from './useContestData';

const ContestDataContext = createContext<ReturnType<typeof useContestData> | null>(null);

export function ContestDataProvider({
                                      fallbackData,
                                      children,
                                    }: {
  fallbackData: ContestDataResponseDTO;
  children: React.ReactNode;
}) {
  const companyKey = useUserStore(s => s.organization.key);
  const value = useContestData(fallbackData, companyKey);
  return <ContestDataContext.Provider value={value}>{children}</ContestDataContext.Provider>;
}

export function useContest() {
  const ctx = useContext(ContestDataContext);
  if (!ctx) throw new Error('useContest must be used within <ContestDataProvider>');
  return ctx;
}
