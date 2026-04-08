import { NextResponse } from "next/server";

import { updateSiteSettings } from "@/lib/site-settings";

export async function POST(req: Request) {
  const formData = await req.formData();

  await updateSiteSettings({
    siteName: String(formData.get("siteName") || "").trim(),
    siteUrl: String(formData.get("siteUrl") || "").trim(),
    logoUrl: String(formData.get("logoUrl") || "").trim(),
    quoteLogoUrl: String(formData.get("quoteLogoUrl") || "").trim(),
    quoteCompanyName: String(formData.get("quoteCompanyName") || "").trim(),
    quoteTaxCode: String(formData.get("quoteTaxCode") || "").trim(),
    quoteAddress: String(formData.get("quoteAddress") || "").trim(),
    quoteHotline: String(formData.get("quoteHotline") || "").trim(),
    quoteEmail: String(formData.get("quoteEmail") || "").trim(),
    defaultTitle: String(formData.get("defaultTitle") || "").trim(),
    defaultDescription: String(formData.get("defaultDescription") || "").trim(),
    googleAnalyticsId: String(formData.get("googleAnalyticsId") || "").trim(),
    hotline: String(formData.get("hotline") || "").trim(),
    contactEmail: String(formData.get("contactEmail") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    facebookUrl: String(formData.get("facebookUrl") || "").trim(),
    instagramUrl: String(formData.get("instagramUrl") || "").trim(),
    tiktokUrl: String(formData.get("tiktokUrl") || "").trim(),
    youtubeUrl: String(formData.get("youtubeUrl") || "").trim(),
    heroSlides: [1, 2, 3].map((index) => ({
      image: String(formData.get(`heroSlide${index}Image`) || "").trim(),
      kicker: String(formData.get(`heroSlide${index}Kicker`) || "").trim(),
      kickerEn: String(formData.get(`heroSlide${index}KickerEn`) || "").trim(),
      title: String(formData.get(`heroSlide${index}Title`) || "").trim(),
      titleEn: String(formData.get(`heroSlide${index}TitleEn`) || "").trim(),
      desc: String(formData.get(`heroSlide${index}Desc`) || "").trim(),
      descEn: String(formData.get(`heroSlide${index}DescEn`) || "").trim(),
      ctaLabel: String(formData.get(`heroSlide${index}CtaLabel`) || "").trim(),
      ctaLabelEn: String(formData.get(`heroSlide${index}CtaLabelEn`) || "").trim(),
      ctaHref: String(formData.get(`heroSlide${index}CtaHref`) || "").trim(),
    })),
    partnerItems: [1, 2, 3, 4, 5, 6].map((index) => ({
      name: String(formData.get(`partner${index}Name`) || "").trim(),
      logo: String(formData.get(`partner${index}Logo`) || "").trim(),
      href: String(formData.get(`partner${index}Href`) || "").trim(),
      size: String(formData.get(`partner${index}Size`) || "md").trim() as "sm" | "md" | "lg",
    })),
    testimonialItems: [1, 2, 3].map((index) => ({
      name: String(formData.get(`testimonial${index}Name`) || "").trim(),
      role: String(formData.get(`testimonial${index}Role`) || "").trim(),
      company: String(formData.get(`testimonial${index}Company`) || "").trim(),
      content: String(formData.get(`testimonial${index}Content`) || "").trim(),
      avatar: String(formData.get(`testimonial${index}Avatar`) || "").trim(),
    })),
  });

  return NextResponse.redirect(new URL("/admin/settings?saved=1", req.url));
}
