import { NextResponse } from "next/server";

import {
  createProject,
  deleteProject,
  normalizeProjectHref,
  updateProject,
} from "@/lib/content-store";
import type { Project } from "@/lib/content-types";
import { createRequestUrl } from "@/lib/request-url";

function toList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formToProject(formData: FormData): Project {
  return {
    title: String(formData.get("title") || "").trim(),
    titleEn: String(formData.get("titleEn") || "").trim(),
    client: String(formData.get("client") || "").trim(),
    clientEn: String(formData.get("clientEn") || "").trim(),
    location: String(formData.get("location") || "").trim(),
    locationEn: String(formData.get("locationEn") || "").trim(),
    date: String(formData.get("date") || "").trim(),
    desc: String(formData.get("desc") || "").trim(),
    descEn: String(formData.get("descEn") || "").trim(),
    image: String(formData.get("image") || "").trim(),
    gallery: toList(String(formData.get("gallery") || "")),
    href: normalizeProjectHref(String(formData.get("projectSlug") || "")),
    tags: toList(String(formData.get("tags") || "")),
  };
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const intent = String(formData.get("intent") || "create");

  if (intent === "delete") {
    await deleteProject(String(formData.get("slug") || ""));
    return NextResponse.redirect(createRequestUrl(req, "/admin/projects"));
  }

  const project = formToProject(formData);

  if (intent === "update") {
    await updateProject(String(formData.get("slug") || ""), project);
    return NextResponse.redirect(createRequestUrl(req, "/admin/projects"));
  }

  await createProject(project);
  return NextResponse.redirect(createRequestUrl(req, "/admin/projects"));
}
