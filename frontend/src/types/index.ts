export interface ResearchDirection {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  order: number;
  groups: ResearchGroup[];
  created_at: string;
  updated_at: string;
}

export interface ResearchGroup {
  id: number;
  title: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface Employee {
  id: number;
  full_name: string;
  photo_url: string | null;
  position_title: string | null;
  position_order: number | null;
  position: number | null;
  bio?: string;
  email: string | null;
  phone: string | null;
  show_email: boolean;
  show_phone: boolean;
  direction: number | null;
  group: number | null;
  direction_title: string | null;
  group_title: string | null;
  is_public_contact: boolean; // <-- Добавлено
}

export interface EmployeeDetail extends Omit<Employee, 'bio' | 'email' | 'phone'> {
  bio: string; // Теперь точно есть, но может быть пустым
  email: string | null;
  phone: string | null;
  show_email: boolean;
  show_phone: boolean;
  recent_publications: PublicationList[]; // Массив публикаций
}

export interface EquipmentCategory {
  id: number;
  title: string;
  slug: string;
  parent: number | null;
  children?: EquipmentCategory[]; // Рекурсивная структура
}

export interface Equipment {
  id: number;
  title: string;
  slug: string;
  description: string;
  specs: string;
  image_url: string | null;
  category: EquipmentCategory | null;
  direction: number | null;
}

export interface Publication {
  id: number;
  title: string;
  slug: string;
  external_authors: string
  abstract?: string;
  year: number;
  doi: string;
  link?: string;
  pdf_url?: string;
  direction: number | null;
  authors_employees: AuthorMinimal[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'moderator';
  avatar_url: string | null;
  is_staff: boolean;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  logo_url: string | null;
  description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_vk: string;
  social_telegram: string;
}

export interface Keyword {
  id: number;
  word: string;
  count: number;
}

export interface AuthorMinimal {
  id: number;
  full_name: string;
}

export interface PublicationList {
  id: number;
  title: string;
  slug: string;
  external_authors: string;
  year: number;
  doi: string;
  direction: number | null;
  authors_employees: AuthorMinimal[];
}

export interface PublicationDetail extends Omit<PublicationList, 'authors_employees'> {
  abstract: string;
  link: string;
  pdf_url: string | null;
  authors_employees: Employee[]; // Полные объекты сотрудников для детальной страницы
}