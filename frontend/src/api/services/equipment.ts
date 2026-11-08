// src/api/services/equipment.ts
import { apiClient } from '../client';
import type { Equipment, EquipmentCategory } from '../../types';

export const equipmentApi = {
  // Получение всех категорий (или корневых, зависит от бэкенда)
  getCategories: () => 
    apiClient.get<EquipmentCategory[]>('/equipment-categories/'),

  // Получение оборудования по ID категории
  getByCategory: (categoryId: number) => 
    apiClient.get(`/equipment/?category=${categoryId}`),

  // Получение детальной информации об оборудовании
  getBySlug: (slug: string) => 
    apiClient.get<Equipment>(`/equipment/${slug}/`),
};