import { NextResponse } from "next/server";

import { createNews, deleteNews, updateNews } from "@/lib/content-store";
import type { NewsItem } from "@/lib/content-types";
import { createRequestUrl } from "@/lib/request-url";

function formToNews(formData: FormData): NewsItem {
  return {
    slug: String(formData.get("newsSlug") || "").trim(),
    title: String(formData.get("title") || "").trim(),
    titleEn: String(formData.get("titleEn") || "").trim(),
    excerpt: String(formData.get("excerpt") || "").trim(),
    excerptEn: String(formData.get("excerptEn") || "").trim(),
    content: String(formData.get("content") || "").trim(),
    contentEn: String(formData.get("contentEn") || "").trim(),
    image: String(formData.get("image") || "").trim(),
    date: String(formData.get("date") || "").trim(),
  };
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const intent = String(formData.get("intent") || "create");

  if (intent === "delete") {
    await deleteNews(String(formData.get("slug") || ""));
    return NextResponse.redirect(createRequestUrl(req, "/admin/news"));
  }

  const item = formToNews(formData);

  if (intent === "update") {
    await updateNews(String(formData.get("slug") || ""), item);
    return NextResponse.redirect(createRequestUrl(req, "/admin/news"));
  }

  await createNews(item);
  return NextResponse.redirect(createRequestUrl(req, "/admin/news"));
}
