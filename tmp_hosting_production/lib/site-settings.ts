import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type HeroSlideSetting = {
  image: string;
  kicker: string;
  kickerEn?: string;
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
  ctaLabel: string;
  ctaLabelEn?: string;
  ctaHref: string;
};

export type PartnerSetting = {
  name: string;
  logo: string;
  href?: string;
  size?: "sm" | "md" | "lg";
};

export type TestimonialSetting = {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
};

export type SiteSettings = {
  siteName: string;
  siteUrl: string;
  logoUrl: string;
  quoteLogoUrl: string;
  quoteCompanyName: string;
  quoteTaxCode: string;
  quoteAddress: string;
  quoteHotline: string;
  quoteEmail: string;
  defaultTitle: string;
  defaultDescription: string;
  googleAnalyticsId: string;
  hotline: string;
  contactEmail: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  heroSlides: HeroSlideSetting[];
  partnerItems: PartnerSetting[];
  testimonialItems: TestimonialSetting[];
};

const dataDir = path.join(process.cwd(), "data");
const settingsFile = path.join(dataDir, "site-settings.json");

const defaultSettings: SiteSettings = {
  siteName: "TRONG THAI EVENT",
  siteUrl: "https://trongthaievent.vn",
  logoUrl: "/logo.png",
  quoteLogoUrl: "/logo.png",
  quoteCompanyName: "CÔNG TY TNHH TỔ CHỨC SỰ KIỆN TRỌNG THÁI (EVENT)",
  quoteTaxCode: "3603940143",
  quoteAddress: "Tổ 7, Ấp 4, Xã Long Thành, Tỉnh Đồng Nai, Việt Nam",
  quoteHotline: "090 984 43 03",
  quoteEmail: "Thaiguitarman1976@gmail.com",
  defaultTitle: "TRONG THAI EVENT | Công ty tổ chức sự kiện chuyên nghiệp",
  defaultDescription:
    "TRONG THAI EVENT cung cấp dịch vụ tổ chức sự kiện trọn gói: hội nghị, khai trương, team building, year end party, tiệc cưới và sản xuất sân khấu chuyên nghiệp.",
  googleAnalyticsId: "G-JZ55K9763Z",
  hotline: "090 984 43 03",
  contactEmail: "Thaiguitarman1976@gmail.com",
  address: "Tổ 7, Ấp 4, Xã Long Thành, Tỉnh Đồng Nai, Việt Nam",
  facebookUrl: "https://www.facebook.com/congtytcskeventtrongthai",
  instagramUrl: "https://www.instagram.com/",
  tiktokUrl: "https://www.tiktok.com/",
  youtubeUrl: "https://www.youtube.com/",
  heroSlides: [
    {
      image: "/slides/slide-1.jpg",
      kicker: "TRONG THAI EVENT",
      kickerEn: "TRONG THAI EVENT",
      title: "GIẢI PHÁP SỰ KIỆN TỐI ƯU CHO DOANH NGHIỆP",
      titleEn: "SMART EVENT SOLUTIONS FOR MODERN BUSINESSES",
      desc: "Concept • Kịch bản • Sản xuất • Vận hành • Hậu kỳ",
      descEn: "Concept • Script • Production • Operation • Post-event content",
      ctaLabel: "Báo giá và tư vấn miễn phí",
      ctaLabelEn: "Free consultation & quotation",
      ctaHref: "/contact",
    },
    {
      image: "/slides/slide-2.jpg",
      kicker: "TRONG THAI EVENT",
      kickerEn: "TRONG THAI EVENT",
      title: "THIẾT KẾ • THI CÔNG • KỸ THUẬT SÂN KHẤU CHUẨN TIMELINE",
      titleEn: "DESIGN • FABRICATION • STAGE TECHNOLOGY WITH TIMELINE DISCIPLINE",
      desc: "2D/3D • Âm thanh • Ánh sáng • LED • Sân khấu",
      descEn: "2D/3D • Audio • Lighting • LED • Stage setup",
      ctaLabel: "Xem dự án tiêu biểu",
      ctaLabelEn: "View featured projects",
      ctaHref: "/projects",
    },
    {
      image: "/slides/slide-3.jpg",
      kicker: "TRONG THAI EVENT",
      kickerEn: "TRONG THAI EVENT",
      title: "SỰ KIỆN • HỘI NGHỊ",
      titleEn: "EVENTS • CONFERENCES",
      desc: "Triển khai đa địa điểm • Đo lường hiệu quả • Hiệu quả rõ ràng",
      descEn: "Multi-location execution • Measurable efficiency • Clear brand impact",
      ctaLabel: "Xem dịch vụ",
      ctaLabelEn: "View services",
      ctaHref: "/services",
    },
  ],
  partnerItems: [
    { name: "Danh Khôi", logo: "/partners/danhkhoi.png", size: "md" },
    { name: "Hoa Cảnh", logo: "/partners/hoacanh.png", size: "md" },
    { name: "Posco", logo: "/partners/posco.png", size: "lg" },
    { name: "THPT Long Thành", logo: "/partners/thptlongthanh.png", size: "lg" },
    { name: "Action Composites", logo: "/partners/action.png", size: "lg" },
    { name: "Vietcombank", logo: "/partners/vcb.png", size: "md" },
  ],
  testimonialItems: [
    {
      name: "LÊ TUẤN KIỆT",
      role: "CEO",
      company: "TUẤN VIỆT MARKETING",
      content:
        "Đội ngũ làm việc rất chuyên nghiệp, kiểm soát chương trình tốt và xử lý tình huống nhanh.",
      avatar: "/testimonials/TUANKIET.jpg",
    },
    {
      name: "ALEXANDER BEULEKE",
      role: "CEO",
      company: "CÔNG TY TNHH ACTION COMPOSITES HIGHTECH INDUSTRIES",
      content:
        "Concept sáng tạo, thi công chỉnh chu và đặc biệt là phần điều phối onsite rất mượt.",
      avatar: "/testimonials/action.jpg",
    },
    {
      name: "THÁI HÒA",
      role: "",
      company: "",
      content:
        "Đám cưới của tôi trở thành buổi tiệc đáng nhớ nhờ Trọng Thái Event.",
      avatar: "/testimonials/THAIHOA.jpg",
    },
  ],
};

async function ensureSettingsFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(settingsFile, "utf8");
  } catch {
    await writeFile(settingsFile, JSON.stringify(defaultSettings, null, 2), "utf8");
  }
}

function mergeHeroSlides(heroSlides?: HeroSlideSetting[]) {
  return defaultSettings.heroSlides.map((slide, index) => ({
    ...slide,
    ...heroSlides?.[index],
  }));
}

export async function getSiteSettings() {
  await ensureSettingsFile();
  const raw = await readFile(settingsFile, "utf8");
  const parsed = JSON.parse(raw) as Partial<SiteSettings>;

  return {
    ...defaultSettings,
    ...parsed,
    heroSlides: mergeHeroSlides(parsed.heroSlides),
    partnerItems: parsed.partnerItems?.length ? parsed.partnerItems : defaultSettings.partnerItems,
    testimonialItems: parsed.testimonialItems?.length
      ? parsed.testimonialItems
      : defaultSettings.testimonialItems,
  };
}

export async function updateSiteSettings(nextValues: Partial<SiteSettings>) {
  const current = await getSiteSettings();
  const merged = {
    ...current,
    ...nextValues,
    heroSlides: nextValues.heroSlides?.length ? mergeHeroSlides(nextValues.heroSlides) : current.heroSlides,
    partnerItems: nextValues.partnerItems?.length ? nextValues.partnerItems : current.partnerItems,
    testimonialItems: nextValues.testimonialItems?.length
      ? nextValues.testimonialItems
      : current.testimonialItems,
  };

  await ensureSettingsFile();
  await writeFile(settingsFile, JSON.stringify(merged, null, 2), "utf8");
  return merged;
}
