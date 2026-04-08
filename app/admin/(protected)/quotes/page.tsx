import Link from "next/link";

import AdminSectionHeader from "../components/AdminSectionHeader";
import QuoteBuilderClient from "../components/QuoteBuilderClient";
import { getSiteSettings } from "@/lib/site-settings";

type QuoteSearchParams = Promise<{
  customerName?: string;
  customerCompany?: string;
  customerPhone?: string;
  customerEmail?: string;
}>;

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams?: QuoteSearchParams;
}) {
  const settings = await getSiteSettings();
  const params = searchParams ? await searchParams : {};

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8 print:max-w-none print:px-0 print:py-0">
      <div className="print:hidden">
        <AdminSectionHeader
          title="Bảng báo giá"
          description="Tạo báo giá nhanh theo hạng mục, số lượng, đơn giá, VAT và chiết khấu. Bạn có thể in trực tiếp hoặc tải PDF để gửi khách."
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 print:hidden">
        <span>Đổi logo và thông tin công ty trên bảng báo giá tại phần cài đặt.</span>
        <Link
          href="/admin/settings?section=basic"
          className="inline-flex items-center rounded-full border border-yellow-400/30 px-4 py-2 font-semibold text-yellow-300 transition hover:bg-yellow-400/10"
        >
          Mở cài đặt báo giá
        </Link>
      </div>

      <div className="mt-8 print:mt-0">
        <QuoteBuilderClient
          companyName={settings.quoteCompanyName || settings.siteName}
          logoUrl={settings.quoteLogoUrl || settings.logoUrl}
          taxCode={settings.quoteTaxCode || ""}
          hotline={settings.quoteHotline || settings.hotline}
          email={settings.quoteEmail || settings.contactEmail}
          address={settings.quoteAddress || settings.address}
          initialCustomerName={params.customerName || ""}
          initialCustomerCompany={params.customerCompany || ""}
          initialCustomerPhone={params.customerPhone || ""}
          initialCustomerEmail={params.customerEmail || ""}
        />
      </div>
    </main>
  );
}
