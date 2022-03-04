import { NotificationType } from '../types';

export interface FlagsState {
  openLoginModal: boolean,
  openSignUpModal: boolean,
  openWelcomeModal: boolean,
  requestingApiContestScoreboard: boolean,
  requestingApiContestStatus: number,
  requestingApiContestPendingStatus: number,
  requestingApiContestMySubmissions: number,
  requestingApiProblemStatus: number,
  requestingApiProfileSubmissions: number,
  closeSideBar: boolean,
  lastNotification: {
    type: NotificationType,
    description: string
    title?: string,
    duration?: number,
  } | null
}

export interface FlagsStateOptions {
  openLoginModal?: boolean,
  openSignUpModal?: boolean,
  openWelcomeModal?: boolean,
  requestingApiContestScoreboard?: boolean,
  requestingApiContestStatus?: number,
  requestingApiContestPendingStatus?: number,
  requestingApiContestMySubmissions?: number,
  requestingApiProblemStatus?: number,
  requestingApiProfileSubmissions?: number,
  closeSideBar?: boolean,
  lastNotification?: {
    type: NotificationType,
    description: string,
    title?: string,
    duration?: number,
  } | null
}
