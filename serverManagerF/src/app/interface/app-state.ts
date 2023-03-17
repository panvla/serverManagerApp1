import { DataState } from '../enum/data_state.enum';

export interface AppState<T> {
  dataState: DataState;
  appData?: T;
  error?: string;
}
