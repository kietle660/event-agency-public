import { getCurrentLocale } from "@/lib/site-locale";
import { getSiteSettings } from "@/lib/site-settings";

import TestimonialsSectionClient from "./TestimonialsSectionClient";

export default async function TestimonialsSection() {
  const settings = await getSiteSettings();
  const locale = await getCurrentLocale();
  const testimonials = settings.testimonialItems.filter(
    (item) => item.name && item.content && item.avatar,
  );

  return <TestimonialsSectionClient locale={locale} testimonials={testimonials} />;
}
