import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { NewsItem, Project } from "./content-types";

type ProjectTranslation = Pick<Project, "titleEn" | "clientEn" | "locationEn" | "descEn">;
type NewsTranslation = Pick<NewsItem, "titleEn" | "excerptEn" | "contentEn">;

type ContentTranslations = {
  projects: Record<string, ProjectTranslation>;
  news: Record<string, NewsTranslation>;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "content-translations.json");

const defaultTranslations: ContentTranslations = {
  projects: {},
  news: {},
};

async function ensureTranslationsFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(dataFile, "utf8");
  } catch {
    await writeFile(dataFile, JSON.stringify(defaultTranslations, null, 2), "utf8");
  }
}

async function readTranslations() {
  await ensureTranslationsFile();
  const raw = await readFile(dataFile, "utf8");
  return JSON.parse(raw) as ContentTranslations;
}

async function writeTranslations(value: ContentTranslations) {
  await ensureTranslationsFile();
  await writeFile(dataFile, JSON.stringify(value, null, 2), "utf8");
}

export async function getContentTranslations() {
  return readTranslations();
}

export async function upsertProjectTranslation(
  key: string,
  translation: ProjectTranslation,
) {
  const current = await readTranslations();
  current.projects[key] = translation;
  await writeTranslations(current);
}

export async function deleteProjectTranslation(key: string) {
  const current = await readTranslations();
  delete current.projects[key];
  await writeTranslations(current);
}

export async function upsertNewsTranslation(key: string, translation: NewsTranslation) {
  const current = await readTranslations();
  current.news[key] = translation;
  await writeTranslations(current);
}

export async function deleteNewsTranslation(key: string) {
  const current = await readTranslations();
  delete current.news[key];
  await writeTranslations(current);
}
