import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { unstable_noStore as noStore } from "next/cache";

import { news as defaultNews } from "@/app/(site)/data/news";
import { projects as defaultProjects } from "@/app/(site)/data/projects";

import type { NewsItem, Project, SiteContent } from "./content-types";
import {
  deleteNewsTranslation,
  deleteProjectTranslation,
  getContentTranslations,
  upsertNewsTranslation,
  upsertProjectTranslation,
} from "./content-translations";
import {
  isSupabaseConfigured,
  supabaseDelete,
  supabaseInsert,
  supabaseSelect,
  supabaseUpdate,
} from "./supabase-rest";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "site-content.json");

const defaultContent: SiteContent = {
  projects: defaultProjects,
  news: defaultNews,
};

type ProjectRow = {
  href: string;
  title: string;
  client: string;
  location: string;
  date: string;
  description: string;
  image: string;
  gallery: string[] | null;
  tags: string[] | null;
};

type NewsRow = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
};

async function ensureStoreFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(dataFile, "utf8");
  } catch {
    await writeFile(dataFile, JSON.stringify(defaultContent, null, 2), "utf8");
  }
}

async function readContent(): Promise<SiteContent> {
  await ensureStoreFile();
  const raw = await readFile(dataFile, "utf8");
  return JSON.parse(raw) as SiteContent;
}

async function writeContent(content: SiteContent) {
  await ensureStoreFile();
  await writeFile(dataFile, JSON.stringify(content, null, 2), "utf8");
}

function projectToRow(project: Project): ProjectRow {
  return {
    href: project.href,
    title: project.title,
    client: project.client,
    location: project.location,
    date: project.date,
    description: project.desc,
    image: project.image,
    gallery: project.gallery,
    tags: project.tags || [],
  };
}

function rowToProject(row: ProjectRow): Project {
  return {
    href: row.href,
    title: row.title,
    client: row.client,
    location: row.location,
    date: row.date,
    desc: row.description,
    image: row.image,
    gallery: row.gallery || [],
    tags: row.tags || [],
  };
}

function withProjectTranslation(project: Project, translation?: Partial<Project>): Project {
  return {
    ...project,
    titleEn: translation?.titleEn || project.titleEn || "",
    clientEn: translation?.clientEn || project.clientEn || "",
    locationEn: translation?.locationEn || project.locationEn || "",
    descEn: translation?.descEn || project.descEn || "",
  };
}

function newsToRow(item: NewsItem): NewsRow {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    image: item.image,
    date: item.date,
  };
}

function rowToNews(row: NewsRow): NewsItem {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image,
    date: row.date,
  };
}

function withNewsTranslation(item: NewsItem, translation?: Partial<NewsItem>): NewsItem {
  return {
    ...item,
    titleEn: translation?.titleEn || item.titleEn || "",
    excerptEn: translation?.excerptEn || item.excerptEn || "",
    contentEn: translation?.contentEn || item.contentEn || "",
  };
}

async function ensureSupabaseContentBootstrapped() {
  if (!isSupabaseConfigured()) {
    return;
  }

  const localContent = await readContent();
  const [projectRows, newsRows] = await Promise.all([
    supabaseSelect<ProjectRow>("projects", {
      select: "*",
      order: "date.desc",
    }),
    supabaseSelect<NewsRow>("news", {
      select: "*",
      order: "date.desc",
    }),
  ]);

  const existingProjectHrefs = new Set(projectRows.map((row) => row.href));
  const missingProjects = localContent.projects.filter(
    (project) => !existingProjectHrefs.has(project.href),
  );

  if (missingProjects.length > 0) {
    await supabaseInsert<ProjectRow>("projects", missingProjects.map(projectToRow));
  }

  const existingNewsSlugs = new Set(newsRows.map((row) => row.slug));
  const missingNews = localContent.news.filter((item) => !existingNewsSlugs.has(item.slug));

  if (missingNews.length > 0) {
    await supabaseInsert<NewsRow>("news", missingNews.map(newsToRow));
  }
}

export function getProjectSlug(href: string) {
  return href.replace(/^\/+/, "").split("/")[1] ?? "";
}

export function normalizeProjectHref(input: string) {
  const trimmed = input.trim().replace(/^\/+/, "");
  const slug = trimmed.startsWith("projects/") ? trimmed.slice("projects/".length) : trimmed;
  return `/projects/${slug}`;
}

export async function getSiteContent() {
  noStore();
  return readContent();
}

export async function getProjects() {
  const translations = await getContentTranslations();

  if (isSupabaseConfigured()) {
    await ensureSupabaseContentBootstrapped();
    const rows = await supabaseSelect<ProjectRow>("projects", {
      select: "*",
      order: "date.desc",
    });
    return rows.map((row) =>
      withProjectTranslation(rowToProject(row), translations.projects[row.href]),
    );
  }

  const content = await getSiteContent();
  return content.projects.map((project) =>
    withProjectTranslation(project, translations.projects[project.href]),
  );
}

export async function getNews() {
  const translations = await getContentTranslations();

  if (isSupabaseConfigured()) {
    await ensureSupabaseContentBootstrapped();
    const rows = await supabaseSelect<NewsRow>("news", {
      select: "*",
      order: "date.desc",
    });
    return rows.map((row) => withNewsTranslation(rowToNews(row), translations.news[row.slug]));
  }

  const content = await getSiteContent();
  return content.news.map((item) => withNewsTranslation(item, translations.news[item.slug]));
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((entry) => getProjectSlug(entry.href) === slug);
}

export async function getNewsBySlug(slug: string) {
  const items = await getNews();
  return items.find((entry) => entry.slug === slug);
}

export async function createProject(project: Project) {
  if (isSupabaseConfigured()) {
    await supabaseInsert<ProjectRow>("projects", projectToRow(project));
  } else {
    const content = await readContent();
    content.projects.unshift(project);
    await writeContent(content);
  }

  await upsertProjectTranslation(project.href, {
    titleEn: project.titleEn || "",
    clientEn: project.clientEn || "",
    locationEn: project.locationEn || "",
    descEn: project.descEn || "",
  });
}

export async function updateProject(slug: string, nextProject: Project) {
  if (isSupabaseConfigured()) {
    await supabaseUpdate<ProjectRow>(
      "projects",
      { href: `eq.${normalizeProjectHref(slug)}` },
      projectToRow(nextProject)
    );
  } else {
    const content = await readContent();
    content.projects = content.projects.map((entry) =>
      getProjectSlug(entry.href) === slug ? nextProject : entry
    );
    await writeContent(content);
  }

  await upsertProjectTranslation(nextProject.href, {
    titleEn: nextProject.titleEn || "",
    clientEn: nextProject.clientEn || "",
    locationEn: nextProject.locationEn || "",
    descEn: nextProject.descEn || "",
  });

  if (normalizeProjectHref(slug) !== nextProject.href) {
    await deleteProjectTranslation(normalizeProjectHref(slug));
  }
}

export async function deleteProject(slug: string) {
  if (isSupabaseConfigured()) {
    await supabaseDelete("projects", { href: `eq.${normalizeProjectHref(slug)}` });
  } else {
    const content = await readContent();
    content.projects = content.projects.filter((entry) => getProjectSlug(entry.href) !== slug);
    await writeContent(content);
  }

  await deleteProjectTranslation(normalizeProjectHref(slug));
}

export async function createNews(item: NewsItem) {
  if (isSupabaseConfigured()) {
    await supabaseInsert<NewsRow>("news", newsToRow(item));
  } else {
    const content = await readContent();
    content.news.unshift(item);
    await writeContent(content);
  }

  await upsertNewsTranslation(item.slug, {
    titleEn: item.titleEn || "",
    excerptEn: item.excerptEn || "",
    contentEn: item.contentEn || "",
  });
}

export async function updateNews(slug: string, nextItem: NewsItem) {
  if (isSupabaseConfigured()) {
    await supabaseUpdate<NewsRow>("news", { slug: `eq.${slug}` }, newsToRow(nextItem));
  } else {
    const content = await readContent();
    content.news = content.news.map((entry) => (entry.slug === slug ? nextItem : entry));
    await writeContent(content);
  }

  await upsertNewsTranslation(nextItem.slug, {
    titleEn: nextItem.titleEn || "",
    excerptEn: nextItem.excerptEn || "",
    contentEn: nextItem.contentEn || "",
  });

  if (slug !== nextItem.slug) {
    await deleteNewsTranslation(slug);
  }
}

export async function deleteNews(slug: string) {
  if (isSupabaseConfigured()) {
    await supabaseDelete("news", { slug: `eq.${slug}` });
  } else {
    const content = await readContent();
    content.news = content.news.filter((entry) => entry.slug !== slug);
    await writeContent(content);
  }

  await deleteNewsTranslation(slug);
}
