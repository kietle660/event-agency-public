export type Project = {
  title: string;
  titleEn?: string;
  client: string;
  clientEn?: string;
  location: string;
  locationEn?: string;
  date: string;
  desc: string;
  descEn?: string;
  image: string;
  gallery: string[];
  href: string;
  tags?: string[];
};

export type NewsItem = {
  slug: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  image: string;
  date: string;
};

export type SiteContent = {
  projects: Project[];
  news: NewsItem[];
};
