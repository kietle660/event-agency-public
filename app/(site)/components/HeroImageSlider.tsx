import { getSiteSettings } from "@/lib/site-settings";
import { getCurrentLocale } from "@/lib/site-locale";

import HeroImageSliderClient from "./HeroImageSliderClient";

export default async function HeroImageSlider() {
  const locale = await getCurrentLocale();
  const settings = await getSiteSettings();
  const slides = settings.heroSlides.map((slide) => ({
    ...slide,
    kicker: locale === "en" ? slide.kickerEn || slide.kicker : slide.kicker,
    title: locale === "en" ? slide.titleEn || slide.title : slide.title,
    desc: locale === "en" ? slide.descEn || slide.desc : slide.desc,
    ctaLabel: locale === "en" ? slide.ctaLabelEn || slide.ctaLabel : slide.ctaLabel,
  }));

  return (
    <HeroImageSliderClient
      slides={slides}
      hotline={settings.hotline}
    />
  );
}
