import { Dispatch, SetStateAction } from 'react';
import { Status  } from './commons';

export type LoaderStatus = Status.SUCCESS | Status.ERROR | Status.LOADING | Status.NONE;
export type LoaderState = [number, LoaderStatus];
export type LoaderAction = Dispatch<SetStateAction<LoaderState>>;
