import type { Metadata } from "next";

import { getCurrentLocale } from "@/lib/site-locale";

import HomeProjects from "../components/HomeProjects";
import ServicesCTA from "../components/ServicesCTA";
import ServicesGrid from "../components/ServicesGrid";
import ServicesHero from "../components/ServicesHero";
import ServicesProcess from "../components/ServicesProcess";

export const metadata: Metadata = {
  title: "Dịch vụ tổ chức sự kiện",
  description:
    "Khám phá các dịch vụ tổ chức sự kiện, sản xuất sân khấu, thiết bị, truyền thông và vận hành onsite của TRỌNG THÁI EVENT.",
  alternates: {
    canonical: "/services",
  },
};

export default async function ServicesPage() {
  const locale = await getCurrentLocale();

  return (
    <main className="bg-black">
      <ServicesHero locale={locale} />
      <ServicesGrid locale={locale} />
      <ServicesProcess locale={locale} />
      <ServicesCTA locale={locale} />
      <HomeProjects locale={locale} />
    </main>
  );
}
