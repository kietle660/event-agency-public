import AdminSectionHeader from "../components/AdminSectionHeader";
import LiquidationBuilderClient from "../components/LiquidationBuilderClient";
import { getSiteSettings } from "@/lib/site-settings";

type LiquidationSearchParams = Promise<{
  customerName?: string;
  customerCompany?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerRepresentative?: string;
  customerPosition?: string;
  customerAddress?: string;
  companyRepresentative?: string;
  companyPosition?: string;
  contractNumber?: string;
  contractDate?: string;
  liquidationPlace?: string;
  workItemsText?: string;
  contractValue?: string;
  lines?: string;
}>;

export default async function AdminLiquidationsPage({
  searchParams,
}: {
  searchParams?: LiquidationSearchParams;
}) {
  const settings = await getSiteSettings();
  const params = searchParams ? await searchParams : {};
  let initialLines = undefined;

  if (params.lines) {
    try {
      const parsed = JSON.parse(params.lines);
      if (Array.isArray(parsed)) {
        initialLines = parsed;
      }
    } catch {
      initialLines = undefined;
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8 print:max-w-none print:px-0 print:py-0">
      <div className="print:hidden">
        <AdminSectionHeader
          title="Thanh lý hợp đồng"
          description="Soạn biên bản nghiệm thu và thanh lý hợp đồng theo mẫu có sẵn, tự điền thông tin hai bên và xuất bản in hoặc PDF để gửi khách."
        />
      </div>

      <div className="mt-8 print:mt-0">
        <LiquidationBuilderClient
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
          initialCustomerRepresentative={params.customerRepresentative || ""}
          initialCustomerPosition={params.customerPosition || ""}
          initialCustomerAddress={params.customerAddress || ""}
          initialCompanyRepresentative={params.companyRepresentative || ""}
          initialCompanyPosition={params.companyPosition || ""}
          initialContractNumber={params.contractNumber || ""}
          initialContractDate={params.contractDate || ""}
          initialLiquidationPlace={params.liquidationPlace || ""}
          initialWorkItemsText={params.workItemsText || ""}
          initialContractValue={params.contractValue ? Number(params.contractValue) || 0 : 0}
          initialLines={initialLines}
        />
      </div>
    </main>
  );
}
