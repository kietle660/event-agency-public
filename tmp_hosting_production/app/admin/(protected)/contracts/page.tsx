import AdminSectionHeader from "../components/AdminSectionHeader";
import ContractBuilderClient from "../components/ContractBuilderClient";
import { getSiteSettings } from "@/lib/site-settings";

type ContractSearchParams = Promise<{
  customerName?: string;
  customerCompany?: string;
  customerPhone?: string;
  customerEmail?: string;
}>;

export default async function AdminContractsPage({
  searchParams,
}: {
  searchParams?: ContractSearchParams;
}) {
  const settings = await getSiteSettings();
  const params = searchParams ? await searchParams : {};

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8 print:max-w-none print:px-0 print:py-0">
      <AdminSectionHeader
        title="Hợp đồng"
        description="Soạn hợp đồng dịch vụ theo mẫu có sẵn, tự điền thông tin hai bên và xuất bản gửi khách."
      />

      <div className="mt-8 print:mt-0">
        <ContractBuilderClient
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
