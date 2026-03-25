import Reveal from "./components/Reveal";
import HeroImageSlider from "./components/HeroImageSlider";
import HomeAboutDark from "./components/HomeAboutDark";
import HomeServices from "./components/HomeServices";
import ProjectsSlider from "./components/ProjectsSlider";
import PartnersSection from "./components/PartnersSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import { localizeProject } from "@/lib/content-localize";
import { getProjects } from "@/lib/content-store";
import { getCurrentLocale } from "@/lib/site-locale";

export default async function HomePage() {
  const locale = await getCurrentLocale();
  const projects = await getProjects();

  return (
    <main>
      <Reveal delay={0.05}><HeroImageSlider /></Reveal>
      <Reveal delay={0.05}><HomeAboutDark locale={locale} /></Reveal>
      <Reveal delay={0.05}><HomeServices locale={locale} /></Reveal>
      <Reveal delay={0.05}><ProjectsSlider locale={locale} projects={projects.map((project) => localizeProject(project, locale))} /></Reveal>
      <Reveal delay={0.05}><PartnersSection /></Reveal>
      <Reveal delay={0.05}><TestimonialsSection /></Reveal>
      <Reveal delay={0.05}><CTASection locale={locale} /></Reveal>
    </main>
  );
}
