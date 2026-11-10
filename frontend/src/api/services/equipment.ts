import { apiClient } from '../client';
import type { Equipment, EquipmentCategory, EquipmentDirectionWithGroups } from '../../types';

export const equipmentApi = {
    getCategories: () =>
        apiClient.get<EquipmentCategory[]>('/equipment-categories/'),

    getByCategory: (categoryId: number) =>
        apiClient.get(`/equipment/?category=${categoryId}`),

    getBySlug: (slug: string) =>
        apiClient.get<Equipment>(`/equipment/${slug}/`),

    getFilterOptions: () =>
        apiClient.get<EquipmentDirectionWithGroups[]>('/equipment/filter-options/'),
};