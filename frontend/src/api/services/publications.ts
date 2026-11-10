// frontend/src/api/services/publications.ts
import { apiClient } from '../client';
import type { PublicationList, PublicationDetail, PublicationFilters } from '../../types';
import type { PaginatedResponse } from '../../types/api';

export const publicationsApi = {
  getAll: (params?: PublicationFilters) =>
    apiClient.get<PaginatedResponse<PublicationList>>('/publications/', { params }),
  
  getBySlug: (slug: string) =>
    apiClient.get<PublicationDetail>(`/publications/${slug}/`),
  
  getYears: () =>
    apiClient.get<number[]>('/publications/years/'),
};