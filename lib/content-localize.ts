import type { NewsItem, Project } from "./content-types";
import type { SiteLocale } from "./site-locale";

export function localizeProject(project: Project, locale: SiteLocale) {
  return {
    ...project,
    title: locale === "en" && project.titleEn ? project.titleEn : project.title,
    client: locale === "en" && project.clientEn ? project.clientEn : project.client,
    location: locale === "en" && project.locationEn ? project.locationEn : project.location,
    desc: locale === "en" && project.descEn ? project.descEn : project.desc,
  };
}

export function localizeNews(item: NewsItem, locale: SiteLocale) {
  return {
    ...item,
    title: locale === "en" && item.titleEn ? item.titleEn : item.title,
    excerpt: locale === "en" && item.excerptEn ? item.excerptEn : item.excerpt,
    content: locale === "en" && item.contentEn ? item.contentEn : item.content,
  };
}
