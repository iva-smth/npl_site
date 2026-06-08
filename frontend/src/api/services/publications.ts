import { apiClient } from '../client';
import type { PublicationList, PublicationDetail } from '../../types';
import type { PaginatedResponse } from '../../types/api';

export const publicationsApi = {
  getAll: (params?: {
    year?: number;
    direction?: number;
    authors_employees?: number;
    search?: string;
    page?: number;
    ordering?: string;
  }) => 
    apiClient.get<PaginatedResponse<PublicationList>>('/publications/', { params }),
  
  getBySlug: (slug: string) => 
    apiClient.get<PublicationDetail>(`/publications/${slug}/`),
    
  getYears: () => 
    apiClient.get<number[]>('/publications/years/'),
};