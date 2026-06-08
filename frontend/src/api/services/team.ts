import { apiClient } from '../client';
import type { Employee, EmployeeDetail } from '../../types';
import type { PaginatedResponse } from '../../types/api';

export const teamApi = {
  getAll: (params?: { direction?: number; group?: number; search?: string }) => 
    apiClient.get<PaginatedResponse<Employee>>('/employees/', { params }),
  
  getById: (id: number) => 
    apiClient.get<EmployeeDetail>(`/employees/${id}/`),

  // Новый метод для страницы контактов
  getContacts: () => 
    apiClient.get<Employee[]>('/employees/contacts/'),
};