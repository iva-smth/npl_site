// src/types/index.ts

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
  key_employees?: Employee[];
  featured_equipment?: Equipment[];
  head?: EmployeeHead | null;  // <-- НОВОЕ ПОЛЕ
}

export interface ResearchGroup {
  id: number;
  title: string;
  slug: string;
  description: string;
  created_at: string;
  head: Employee | null;
  // Поля для детальной страницы (могут быть undefined в списке)
  direction?: number;
  direction_title?: string;
  topics?: ResearchTopic[];
  employees?: Employee[];
  direction_equipment?: Equipment[];
}

export interface ResearchTopic {
  id: number;
  title: string;
  description: string;
}
export interface Position {
  id: number;
  title: string;
  is_leadership?: boolean; // Если вы решите отдавать это поле
}

export interface Employee {
    id: number;
    full_name: string;
    photo_url: string | null;
    position: number | null;          // ID должности
    position_title: string | null;    // ← добавлено
    position_order?: number;          // ← добавлено (опционально)
    bio?: string;
    email: string | null;
    phone: string | null;
    show_email: boolean;
    show_phone: boolean;
    direction: number | null;
    group: number | null;
    direction_title: string | null;
    group_title: string | null;
    is_public_contact: boolean;
}

export interface EmployeeHead {
  id: number;
  full_name: string;
  position_title: string | null;
  photo_url: string | null;
}

export interface EmployeeDetail extends Omit<Employee, 'bio' | 'email' | 'phone'> {
    bio: string;
    email: string | null;
    phone: string | null;
    show_email: boolean;
    show_phone: boolean;
    recent_publications: PublicationList[];
}

export interface EquipmentCategory {
  id: number;
  title: string;
  slug: string;
  parent: number | null;
  children?: EquipmentCategory[];
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
  // Добавлено поле для сопутствующего оборудования
  related_equipment?: Pick<Equipment, 'id' | 'title' | 'slug' | 'image_url'>[]; 
}

export interface Publication {
  id: number;
  title: string;
  slug: string;
  external_authors: string;
  abstract?: string;
  year: number;
  doi: string;
  link?: string;
  pdf_url?: string;
  direction: number | null;
  authors_employees: AuthorMinimal[];
}

export interface PublicationFilters {
  year?: number;
  year_from?: number;
  year_to?: number;
  direction?: number;
  authors_employees?: number;
  search?: string;
  page?: number;
  ordering?: string;
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
  authors_employees: Employee[];
}

export interface HomeData {
  message: string;
  stats: {
    directions: number;
    publications: number;
    employees: number;
  };
  slider_directions: ResearchDirection[];
  latest_publications: PublicationList[];
  top_keywords: Keyword[];
}

export interface ResearchGroupDetail extends ResearchGroup {
    direction_title: string;
    topics: ResearchTopic[];
    employees: Employee[];
    direction_equipment?: Equipment[];
}