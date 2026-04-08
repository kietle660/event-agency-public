"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Printer, Trash2 } from "lucide-react";

type LiquidationLine = {
  id: string;
  service: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  note: string;
};

type LiquidationBuilderClientProps = {
  companyName: string;
  logoUrl?: string;
  taxCode?: string;
  hotline: string;
  email: string;
  address: string;
  initialCustomerName?: string;
  initialCustomerCompany?: string;
  initialCustomerPhone?: string;
  initialCustomerEmail?: string;
  initialCustomerRepresentative?: string;
  initialCustomerPosition?: string;
  initialCustomerAddress?: string;
  initialCompanyRepresentative?: string;
  initialCompanyPosition?: string;
  initialContractNumber?: string;
  initialContractDate?: string;
  initialLiquidationPlace?: string;
  initialWorkItemsText?: string;
  initialContractValue?: number;
  initialVatPercent?: number;
  initialLines?: LiquidationLine[];
};

const currency = new Intl.NumberFormat("vi-VN");

function formatCurrency(value: number) {
  return `${currency.format(Math.round(value))} đ`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createMultilineHtml(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function createLine(index: number): LiquidationLine {
  return {
    id: `liquidation-line-${index}-${Date.now()}`,
    service: "",
    unit: "Gói",
    quantity: 1,
    unitPrice: 0,
    note: "",
  };
}

function parseCurrencyInput(value: string) {
  const normalized = value.replace(/[^\d]/g, "");
  return normalized ? Number(normalized) : 0;
}

function buildLiquidationHtml(input: {
  logoUrl?: string;
  minuteNumber: string;
  liquidationDate: string;
  liquidationPlace: string;
  legalBasisText: string;
  contractBasisText: string;
  partyAName: string;
  partyARepresentative: string;
  partyAPosition: string;
  partyAAddress: string;
  partyAPhone: string;
  partyAEmail: string;
  partyBName: string;
  partyBRepresentative: string;
  partyBPosition: string;
  partyBAddress: string;
  partyBPhone: string;
  partyBEmail: string;
  workItemsText: string;
  workCompletionText: string;
  contractValue: number;
  paymentMethodText: string;
  settlementText: string;
  liquidationText: string;
  lines: LiquidationLine[];
  subtotal: number;
  vatPercent: number;
  vatValue: number;
}) {
  const logo = input.logoUrl
    ? `<img src="${escapeHtml(`${window.location.origin}${input.logoUrl}`)}" alt="Logo" style="height:64px;max-width:180px;object-fit:contain;display:block;margin:0 auto 14px;" onerror="this.style.display='none'" />`
    : "";

  const date = input.liquidationDate ? new Date(input.liquidationDate) : null;
  const day =
    date && !Number.isNaN(date.getTime()) ? date.toLocaleString("vi-VN", { day: "2-digit" }) : "__";
  const month =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleString("vi-VN", { month: "2-digit" })
      : "__";
  const year =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleString("vi-VN", { year: "numeric" })
      : "____";

  const rowsMarkup = input.lines
    .map((line, index) => {
      const total = line.quantity * line.unitPrice;
      return `
        <tr>
          <td style="border:1px solid #111827;padding:6px 8px;text-align:center;">${index + 1}</td>
          <td style="border:1px solid #111827;padding:6px 8px;">${escapeHtml(line.service)}</td>
          <td style="border:1px solid #111827;padding:6px 8px;text-align:center;">${escapeHtml(line.unit)}</td>
          <td style="border:1px solid #111827;padding:6px 8px;text-align:center;">${line.quantity}</td>
          <td style="border:1px solid #111827;padding:6px 8px;text-align:right;">${currency.format(line.unitPrice)}</td>
          <td style="border:1px solid #111827;padding:6px 8px;text-align:right;">${currency.format(total)}</td>
          <td style="border:1px solid #111827;padding:6px 8px;">${escapeHtml(line.note)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="background:#fff;color:#111827;font-family:'Times New Roman',Times,serif;padding:40px 48px;line-height:1.65;font-size:14px;">
      <div style="text-align:center;">
        <div style="font-weight:700;text-transform:uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-weight:700;">Độc lập - Tự do - Hạnh phúc</div>
        <div style="margin:8px auto 0;width:160px;border-top:1px solid #111827;"></div>
      </div>

      <div style="margin-top:18px;text-align:center;">
        ${logo}
        <div style="font-size:28px;font-weight:700;text-transform:uppercase;">BIÊN BẢN NGHIỆM THU VÀ THANH LÝ HỢP ĐỒNG</div>
        <div style="margin-top:6px;">Số: ${escapeHtml(input.minuteNumber || "BBNTTLHĐ-0001")}</div>
      </div>

      <div style="margin-top:18px;text-align:right;font-style:italic;">
        ${escapeHtml(input.liquidationPlace || "Đồng Nai")}, ngày ${escapeHtml(day)} tháng ${escapeHtml(month)} năm ${escapeHtml(year)}
      </div>

      <div style="margin-top:16px;white-space:pre-wrap;">${createMultilineHtml(input.legalBasisText)}</div>
      <div style="margin-top:10px;white-space:pre-wrap;">${createMultilineHtml(input.contractBasisText)}</div>

      <div style="margin-top:16px;">Hôm nay, chúng tôi gồm có:</div>

      <div style="margin-top:16px;border:1px solid #d4d4d8;border-radius:16px;padding:16px;">
        <div style="font-size:18px;font-weight:700;text-transform:uppercase;">ĐẠI DIỆN BÊN A</div>
        <div style="margin-top:8px;">Tên đơn vị: ${escapeHtml(input.partyAName)}</div>
        <div>Đại diện: ${escapeHtml(input.partyARepresentative || "................................")}</div>
        <div>Chức vụ: ${escapeHtml(input.partyAPosition || "................................")}</div>
        <div>Địa chỉ: ${escapeHtml(input.partyAAddress || "................................")}</div>
        <div>Điện thoại: ${escapeHtml(input.partyAPhone || "................................")}</div>
        <div>Email: ${escapeHtml(input.partyAEmail || "................................")}</div>
      </div>

      <div style="margin-top:14px;border:1px solid #d4d4d8;border-radius:16px;padding:16px;">
        <div style="font-size:18px;font-weight:700;text-transform:uppercase;">ĐẠI DIỆN BÊN B</div>
        <div style="margin-top:8px;">Tên đơn vị: ${escapeHtml(input.partyBName)}</div>
        <div>Đại diện: ${escapeHtml(input.partyBRepresentative || "................................")}</div>
        <div>Chức vụ: ${escapeHtml(input.partyBPosition || "................................")}</div>
        <div>Địa chỉ: ${escapeHtml(input.partyBAddress || "................................")}</div>
        <div>Điện thoại: ${escapeHtml(input.partyBPhone || "................................")}</div>
        <div>Email: ${escapeHtml(input.partyBEmail || "................................")}</div>
      </div>

      <div style="margin-top:20px;font-weight:700;text-transform:uppercase;">ĐIỀU 1: NGHIỆM THU</div>
      <div style="margin-top:8px;"><b>Nội dung công việc / hạng mục thực hiện:</b></div>
      <div style="margin-top:6px;white-space:pre-wrap;">${createMultilineHtml(input.workItemsText)}</div>
      <div style="margin-top:10px;">- Nội dung công việc như bảng dưới đây:</div>
      <div style="margin-top:10px;padding:0 12px;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr>
              <th style="border:1px solid #111827;padding:6px 8px;text-align:center;">STT</th>
              <th style="border:1px solid #111827;padding:6px 8px;text-align:center;">TÊN DỊCH VỤ</th>
              <th style="border:1px solid #111827;padding:6px 8px;text-align:center;">ĐVT</th>
              <th style="border:1px solid #111827;padding:6px 8px;text-align:center;">SL</th>
              <th style="border:1px solid #111827;padding:6px 8px;text-align:center;">ĐƠN GIÁ</th>
              <th style="border:1px solid #111827;padding:6px 8px;text-align:center;">THÀNH TIỀN</th>
              <th style="border:1px solid #111827;padding:6px 8px;text-align:center;">GHI CHÚ</th>
            </tr>
          </thead>
          <tbody>
            ${rowsMarkup}
            <tr>
              <td style="border:1px solid #111827;padding:6px 8px;"></td>
              <td colspan="4" style="border:1px solid #111827;padding:6px 8px;text-align:center;font-weight:700;">Thành tiền</td>
              <td style="border:1px solid #111827;padding:6px 8px;text-align:right;">${currency.format(input.subtotal)}</td>
              <td style="border:1px solid #111827;padding:6px 8px;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #111827;padding:6px 8px;"></td>
              <td colspan="4" style="border:1px solid #111827;padding:6px 8px;text-align:center;">VAT ${input.vatPercent}%</td>
              <td style="border:1px solid #111827;padding:6px 8px;text-align:right;">${currency.format(input.vatValue)}</td>
              <td style="border:1px solid #111827;padding:6px 8px;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #111827;padding:6px 8px;"></td>
              <td colspan="4" style="border:1px solid #111827;padding:6px 8px;text-align:center;font-weight:700;">Giá trị hợp đồng</td>
              <td style="border:1px solid #111827;padding:6px 8px;text-align:right;font-weight:700;">${currency.format(input.contractValue)}</td>
              <td style="border:1px solid #111827;padding:6px 8px;"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="margin-top:10px;white-space:pre-wrap;">${createMultilineHtml(input.workCompletionText)}</div>

      <div style="margin-top:18px;font-weight:700;text-transform:uppercase;">ĐIỀU 2: THANH TOÁN</div>
      <div style="margin-top:8px;">Giá trị hợp đồng: <b>${formatCurrency(input.contractValue)}</b></div>
      <div style="margin-top:6px;white-space:pre-wrap;">${createMultilineHtml(input.paymentMethodText)}</div>
      <div style="margin-top:6px;white-space:pre-wrap;">${createMultilineHtml(input.settlementText)}</div>

      <div style="margin-top:18px;font-weight:700;text-transform:uppercase;">ĐIỀU 3: THANH LÝ HỢP ĐỒNG</div>
      <div style="margin-top:8px;white-space:pre-wrap;">${createMultilineHtml(input.liquidationText)}</div>

      <div style="margin-top:18px;">
        Biên bản nghiệm thu và thanh lý hợp đồng này được lập thành 02 (hai) bản, bên A giữ 01 (một) bản, bên B giữ 01 (một) bản và có giá trị pháp lý ngang nhau.
      </div>

      <div style="margin-top:52px;display:grid;grid-template-columns:1fr 1fr;gap:48px;text-align:center;">
        <div>
          <div style="font-weight:700;">ĐẠI DIỆN BÊN A</div>
          <div style="margin-top:6px;font-style:italic;">(Ký, ghi rõ họ tên)</div>
          <div style="height:90px;"></div>
          <div style="font-weight:700;">${escapeHtml(input.partyARepresentative || input.partyAName)}</div>
        </div>
        <div>
          <div style="font-weight:700;">ĐẠI DIỆN BÊN B</div>
          <div style="margin-top:6px;font-style:italic;">(Ký, ghi rõ họ tên)</div>
          <div style="height:90px;"></div>
          <div style="font-weight:700;">${escapeHtml(input.partyBRepresentative || input.partyBName)}</div>
        </div>
      </div>
    </div>
  `;
}

export default function LiquidationBuilderClient(props: LiquidationBuilderClientProps) {
  const initialCustomerLegalName = props.initialCustomerCompany || props.initialCustomerName || "";
  const initialCustomerRepresentative =
    props.initialCustomerRepresentative ||
    (props.initialCustomerCompany && props.initialCustomerName ? props.initialCustomerName : "");

  const [minuteNumber, setMinuteNumber] = useState(
    `BBNTTLHĐ-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}`,
  );
  const [liquidationDate, setLiquidationDate] = useState(new Date().toISOString().slice(0, 10));
  const [liquidationPlace, setLiquidationPlace] = useState(props.initialLiquidationPlace || "Đồng Nai");

  const [partyAName, setPartyAName] = useState(props.companyName);
  const [partyARepresentative, setPartyARepresentative] = useState(
    props.initialCompanyRepresentative || "",
  );
  const [partyAPosition, setPartyAPosition] = useState(props.initialCompanyPosition || "Giám đốc");
  const [partyAAddress, setPartyAAddress] = useState(props.address);
  const [partyAPhone, setPartyAPhone] = useState(props.hotline);
  const [partyAEmail, setPartyAEmail] = useState(props.email);

  const [partyBName, setPartyBName] = useState(initialCustomerLegalName);
  const [partyBRepresentative, setPartyBRepresentative] = useState(initialCustomerRepresentative);
  const [partyBPosition, setPartyBPosition] = useState(props.initialCustomerPosition || "");
  const [partyBAddress, setPartyBAddress] = useState(props.initialCustomerAddress || "");
  const [partyBPhone, setPartyBPhone] = useState(props.initialCustomerPhone || "");
  const [partyBEmail, setPartyBEmail] = useState(props.initialCustomerEmail || "");

  const [vatPercent, setVatPercent] = useState(props.initialVatPercent ?? 8);
  const [contractValue, setContractValue] = useState(props.initialContractValue || 0);
  const [legalBasisText, setLegalBasisText] = useState(
    "Căn cứ Bộ luật Dân sự số 91/2015/QH13;\nCăn cứ Luật Thương mại số 36/2005/QH11;",
  );
  const [contractBasisText, setContractBasisText] = useState(
    `Căn cứ theo hợp đồng dịch vụ số ${props.initialContractNumber || "................"} ký ngày ${props.initialContractDate || "................"} giữa hai bên;\nCăn cứ vào kết quả thực hiện công việc thực tế.`,
  );
  const [workItemsText, setWorkItemsText] = useState(
    props.initialWorkItemsText ||
      "Liệt kê các hạng mục đã triển khai và nghiệm thu theo hợp đồng giữa hai bên.",
  );
  const [workCompletionText, setWorkCompletionText] = useState(
    "Hai bên xác nhận các hạng mục công việc theo hợp đồng đã được thực hiện hoàn tất, đúng nội dung và khối lượng đã thỏa thuận.",
  );
  const [paymentMethodText, setPaymentMethodText] = useState(
    "Phương thức thanh toán: Thanh toán theo đúng tiến độ và giá trị hai bên đã thống nhất trong hợp đồng.",
  );
  const [settlementText, setSettlementText] = useState(
    "Bên B đã hoàn tất nghĩa vụ thanh toán cho Bên A theo giá trị hợp đồng nêu trên.",
  );
  const [liquidationText, setLiquidationText] = useState(
    "Sau khi bên B thanh toán đầy đủ số tiền trên cho bên A thì hợp đồng nêu trên giữa hai bên được nghiệm thu và thanh lý.",
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [lines, setLines] = useState<LiquidationLine[]>(
    props.initialLines && props.initialLines.length ? props.initialLines : [createLine(1)],
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
    [lines],
  );
  const vatValue = useMemo(() => subtotal * (vatPercent / 100), [subtotal, vatPercent]);

  function updateLine(id: string, field: keyof LiquidationLine, value: string | number) {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, [field]: value } : line)));
  }

  function addLine() {
    setLines((current) => [...current, createLine(current.length + 1)]);
  }

  function removeLine(id: string) {
    setLines((current) => (current.length > 1 ? current.filter((line) => line.id !== id) : current));
  }

  const previewHtml = useMemo(
    () =>
      buildLiquidationHtml({
        logoUrl: props.logoUrl,
        minuteNumber,
        liquidationDate,
        liquidationPlace,
        legalBasisText,
        contractBasisText,
        partyAName,
        partyARepresentative,
        partyAPosition,
        partyAAddress,
        partyAPhone,
        partyAEmail,
        partyBName,
        partyBRepresentative,
        partyBPosition,
        partyBAddress,
        partyBPhone,
        partyBEmail,
        workItemsText,
        workCompletionText,
        contractValue,
        paymentMethodText,
        settlementText,
        liquidationText,
        lines,
        subtotal,
        vatPercent,
        vatValue,
      }),
    [
      contractBasisText,
      contractValue,
      legalBasisText,
      liquidationDate,
      liquidationPlace,
      liquidationText,
      lines,
      minuteNumber,
      partyAAddress,
      partyAEmail,
      partyAName,
      partyAPhone,
      partyAPosition,
      partyARepresentative,
      partyBAddress,
      partyBEmail,
      partyBName,
      partyBPhone,
      partyBPosition,
      partyBRepresentative,
      paymentMethodText,
      props.logoUrl,
      settlementText,
      subtotal,
      vatPercent,
      vatValue,
      workCompletionText,
      workItemsText,
    ],
  );

  async function exportPdf() {
    if (isExporting) return;
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-10000px";
    wrapper.style.top = "0";
    wrapper.style.width = "1120px";
    wrapper.style.background = "#ffffff";
    wrapper.style.zIndex = "-1";
    wrapper.innerHTML = previewHtml;
    document.body.appendChild(wrapper);

    try {
      setIsExporting(true);
      setExportError("");
      const images = Array.from(wrapper.querySelectorAll("img"));
      await Promise.all(
        images.map(
          (image) =>
            new Promise<void>((resolve) => {
              if (image.complete) {
                resolve();
                return;
              }
              image.addEventListener("load", () => resolve(), { once: true });
              image.addEventListener("error", () => resolve(), { once: true });
            }),
        ),
      );

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(wrapper, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pageWidth;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      let heightLeft = imageHeight;
      let position = 0;

      pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight, undefined, "FAST");
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imageHeight;
        pdf.addPage();
        pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      pdf.save(`${minuteNumber || "bien-ban-thanh-ly"}.pdf`);
    } catch (error) {
      console.error("Liquidation PDF export failed:", error);
      setExportError("Không thể tạo PDF. Hãy thử lại hoặc dùng nút In trình duyệt.");
    } finally {
      document.body.removeChild(wrapper);
      setIsExporting(false);
    }
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 print:hidden">
        <h2 className="text-2xl font-semibold">Thiết lập biên bản thanh lý</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Biên bản nghiệm thu và thanh lý hợp đồng được liên kết theo dữ liệu từ hợp đồng. Bạn có thể chỉnh lại thông tin hai bên, nội dung công việc, bảng hạng mục và điều khoản thanh lý trước khi in hoặc xuất PDF.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Số biên bản</span>
            <input value={minuteNumber} onChange={(e) => setMinuteNumber(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Ngày lập biên bản</span>
            <input type="date" value={liquidationDate} onChange={(e) => setLiquidationDate(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-white/70">Địa điểm lập biên bản</span>
            <input value={liquidationPlace} onChange={(e) => setLiquidationPlace(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" />
          </label>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">Bên A</div>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Tên đơn vị</span><input value={partyAName} onChange={(e) => setPartyAName(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Đại diện</span><input value={partyARepresentative} onChange={(e) => setPartyARepresentative(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Chức vụ</span><input value={partyAPosition} onChange={(e) => setPartyAPosition(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Địa chỉ</span><textarea rows={3} value={partyAAddress} onChange={(e) => setPartyAAddress(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Số điện thoại</span><input value={partyAPhone} onChange={(e) => setPartyAPhone(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Email</span><input value={partyAEmail} onChange={(e) => setPartyAEmail(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">Bên B</div>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Tên đơn vị</span><input value={partyBName} onChange={(e) => setPartyBName(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Đại diện</span><input value={partyBRepresentative} onChange={(e) => setPartyBRepresentative(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Chức vụ</span><input value={partyBPosition} onChange={(e) => setPartyBPosition(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Địa chỉ</span><textarea rows={3} value={partyBAddress} onChange={(e) => setPartyBAddress(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Số điện thoại</span><input value={partyBPhone} onChange={(e) => setPartyBPhone(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Email</span><input value={partyBEmail} onChange={(e) => setPartyBEmail(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">Nội dung biên bản</div>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Căn cứ pháp lý</span><textarea rows={4} value={legalBasisText} onChange={(e) => setLegalBasisText(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Căn cứ theo hợp đồng</span><textarea rows={3} value={contractBasisText} onChange={(e) => setContractBasisText(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Nội dung công việc / hạng mục</span><textarea rows={4} value={workItemsText} onChange={(e) => setWorkItemsText(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 1 - Nghiệm thu</span><textarea rows={4} value={workCompletionText} onChange={(e) => setWorkCompletionText(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">Bảng hạng mục nghiệm thu</div>
            <button type="button" onClick={addLine} className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:brightness-105"><Plus className="h-4 w-4" />Thêm dòng</button>
          </div>
          <div className="space-y-3">
            {lines.map((line, index) => (
              <div key={line.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-3 text-sm font-medium text-white/70">Hạng mục {index + 1}</div>
                <div className="grid gap-3 md:grid-cols-[1.8fr_0.8fr_0.7fr_1fr_auto]">
                  <input value={line.service} onChange={(e) => updateLine(line.id, "service", e.target.value)} placeholder="Tên dịch vụ" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" />
                  <input value={line.unit} onChange={(e) => updateLine(line.id, "unit", e.target.value)} placeholder="ĐVT" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" />
                  <input type="number" min={1} value={line.quantity} onChange={(e) => updateLine(line.id, "quantity", Number(e.target.value) || 1)} placeholder="SL" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" />
                  <input value={line.unitPrice ? currency.format(line.unitPrice) : ""} onChange={(e) => updateLine(line.id, "unitPrice", parseCurrencyInput(e.target.value))} placeholder="Đơn giá" inputMode="numeric" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" />
                  <button type="button" onClick={() => removeLine(line.id)} className="inline-flex items-center justify-center rounded-2xl border border-rose-400/30 px-4 py-3 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button>
                </div>
                <textarea rows={2} value={line.note} onChange={(e) => updateLine(line.id, "note", e.target.value)} placeholder="Ghi chú" className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="block"><span className="mb-2 block text-sm text-white/70">VAT (%)</span><input type="number" min={0} max={100} value={vatPercent} onChange={(e) => setVatPercent(Number(e.target.value) || 0)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Giá trị hợp đồng</span><input type="number" min={0} value={contractValue} onChange={(e) => setContractValue(Number(e.target.value) || 0)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">Tổng hạng mục tạm tính: <span className="font-semibold text-white">{formatCurrency(subtotal)}</span></div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 2 - Phương thức thanh toán</span><textarea rows={3} value={paymentMethodText} onChange={(e) => setPaymentMethodText(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Xác nhận thanh toán</span><textarea rows={3} value={settlementText} onChange={(e) => setSettlementText(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 3 - Thanh lý hợp đồng</span><textarea rows={4} value={liquidationText} onChange={(e) => setLiquidationText(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" onClick={exportPdf} disabled={isExporting} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">
            <Download className="h-4 w-4" />
            {isExporting ? "Đang tạo PDF..." : "Tải PDF"}
          </button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:brightness-105">
            <Printer className="h-4 w-4" />
            In trình duyệt
          </button>
        </div>

        {exportError ? <div className="mt-4 text-sm text-rose-300">{exportError}</div> : null}
      </section>

      <section className="print-area print:block">
        <div className="rounded-[28px] bg-white text-black shadow-[0_24px_80px_rgba(0,0,0,0.28)] print:rounded-none print:shadow-none">
          <div className="overflow-hidden rounded-[28px] print:rounded-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </section>
    </div>
  );
}
