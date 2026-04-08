import type { MetadataRoute } from "next";
import { getNews, getProjects } from "@/lib/content-store";

const siteUrl = "https://trongthaievent.vn";
const staticRoutes = ["", "/about", "/services", "/projects", "/news", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNews();
  const projects = await getProjects();
  const now = new Date();

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${siteUrl}/news/${item.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((item) => ({
    url: `${siteUrl}${item.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...pages, ...newsPages, ...projectPages];
}
