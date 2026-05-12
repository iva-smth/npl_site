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
  position_label: string;
  position: string;
  bio: string;
  email: string | null;
  phone: string | null;
  direction: number | null;
  group: number | null;
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

export interface EquipmentCategory {
  id: number;
  title: string;
  slug: string;
}

export interface Publication {
  id: number;
  title: string;
  slug: string;
  authors: string;
  abstract: string;
  pub_type: PublicationType | null;
  year: number;
  doi: string;
  link: string;
  pdf_url: string | null;
  authors_employees: Employee[];
}

export interface PublicationType {
  id: number;
  title: string;
  slug: string;
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