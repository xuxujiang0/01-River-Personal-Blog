
export interface User {
  id: string | number;
  username?: string;
  name: string;
  nickname?: string;
  avatar: string;
  role: 'admin' | 'user' | 'guest';
  provider?: 'wechat' | 'github';
}

export interface BlogPost {
  id: string | number;
  userId?: number;
  title: string;
  excerpt: string;
  cover: string;
  content: string; // HTML or Markdown text
  contentImages?: string[]; // Extra images gallery
  date: string;
  createdAt?: string;
  updatedAt?: string;
  views: number;
  comments: number;
  tags: string[];
  status: 'published' | 'hidden' | 'draft';
}

export interface Project {
  id: string | number;
  userId?: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  link: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum PageRoute {
  HOME = '/',
  BLOG = '/blog',
  WRITE = '/blog/write',
  WORKS = '/works',
  WRITE_WORK = '/works/write',
  ABOUT = '/about',
}
