import { apiClient } from '../client';
import type { ResearchDirection, ResearchGroup, ResearchGroupDetail } from '../../types';
import type { PaginatedResponse } from '../../types/api';

export const directionsApi = {
  getAll: () =>
    apiClient.get<PaginatedResponse<ResearchDirection>>('/directions/'),
  getBySlug: (slug: string) =>
    apiClient.get<ResearchDirection>(`/directions/${slug}/`),
  getGroups: () =>
    apiClient.get<ResearchGroup[]>('/groups/'),
  
  // Новый метод для детальной страницы группы
  getGroupBySlug: (slug: string) =>
    apiClient.get<ResearchGroupDetail>(`/groups/${slug}/`),
};