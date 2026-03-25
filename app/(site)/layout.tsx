import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnalyticsTracker from "./components/AnalyticsTracker";
import FloatingContactButtons from "./components/FloatingContactButtons";
import { getSiteSettings } from "@/lib/site-settings";
import { getCurrentLocale } from "@/lib/site-locale";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const currentLocale = await getCurrentLocale();

  return (
    <div className="min-h-dvh flex flex-col">
      <AnalyticsTracker />
      <Navbar
        logoUrl={settings.logoUrl}
        siteName={settings.siteName}
        hotline={settings.hotline}
        contactEmail={settings.contactEmail}
        currentLocale={currentLocale}
      />
      <FloatingContactButtons
        hotline={settings.hotline}
        facebookUrl={settings.facebookUrl}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
