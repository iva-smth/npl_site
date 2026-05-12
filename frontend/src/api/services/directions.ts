// src/api/services/directions.ts
import { apiClient } from '../client'; // Используем ваш настроенный клиент с токенами
import type { ResearchDirection, ResearchGroup } from '../../types';
import type { PaginatedResponse } from '../../types/api';

export const directionsApi = {
  // Явно указываем, что возвращается PaginatedResponse<ResearchDirection>
  getAll: () => 
    apiClient.get<PaginatedResponse<ResearchDirection>>('/directions/'),
  
  getBySlug: (slug: string) => 
    apiClient.get<ResearchDirection>(`/directions/${slug}/`),

  getGroups: () => 
    apiClient.get<ResearchGroup[]>('/groups/'),
};