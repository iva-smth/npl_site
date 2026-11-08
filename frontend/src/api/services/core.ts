import { apiClient } from '../client';
import type { HomeData } from '../../types';

export const coreApi = {
  getHomeData: () =>
    apiClient.get<HomeData>('/home/'),
};