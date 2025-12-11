export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: {
    html: string;
    type?: string;
  };
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  category_id?: string;
  author_id?: string;
  author_name?: string;
  is_featured: boolean;
  display_order: number;
  published_at?: string;
  archived_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsResponse {
  data: NewsItem;
  message?: string;
}

export interface NewsListResponse {
  data: NewsItem[];
  total: number;
  page: number;
  per_page: number;
}

export interface CreateNewsDto {
  title: string;
  slug?: string;
  summary?: string;
  content: {
    html: string;
    type?: string;
  };
  featured_image?: File;
  status: 'draft' | 'published' | 'archived';
  category_id?: string;
  author_id?: string;
  author_name?: string;
  is_featured?: boolean;
  display_order?: number;
  published_at?: string;
}