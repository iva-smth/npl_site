import { apiClient } from '../client';
import type { ResearchDirection } from '../../types';
import type { PaginatedResponse } from '../../types/api';

export const directionsApi = {
  getAll: () => apiClient.get<PaginatedResponse<ResearchDirection>>('/directions/'),
  getBySlug: (slug: string) => apiClient.get<ResearchDirection>(`/directions/${slug}/`),
};