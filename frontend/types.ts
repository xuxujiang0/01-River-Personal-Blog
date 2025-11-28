
export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'user' | 'guest';
  provider?: 'wechat' | 'github';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  cover: string;
  content: string; // HTML or Markdown text
  contentImages?: string[]; // Extra images gallery
  date: string;
  views: number;
  comments: number;
  tags: string[];
  status: 'published' | 'hidden';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  link: string;
}

export enum PageRoute {
  HOME = '/',
  BLOG = '/blog',
  WRITE = '/blog/write',
  WORKS = '/works',
  WRITE_WORK = '/works/write',
  ABOUT = '/about',
}
