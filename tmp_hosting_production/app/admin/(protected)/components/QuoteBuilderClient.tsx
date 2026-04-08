"use client";

import { useMemo, useRef, useState } from "react";
import { Download, Plus, Printer, Trash2 } from "lucide-react";

type QuoteLine = {
  id: string;
  category: string;
  item: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  note: string;
};

type QuoteBuilderClientProps = {
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
};

const currency = new Intl.NumberFormat("vi-VN");

function formatCurrency(value: number) {
  return `${currency.format(Math.round(value))} đ`;
}

function createLine(index: number): QuoteLine {
  return {
    id: `line-${index}-${Date.now()}`,
    category: "",
    item: "",
    unit: "gói",
    quantity: 1,
    unitPrice: 0,
    note: "",
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export default function QuoteBuilderClient({
  companyName,
  logoUrl,
  taxCode,
  hotline,
  email,
  address,
  initialCustomerName = "",
  initialCustomerCompany = "",
  initialCustomerPhone = "",
  initialCustomerEmail = "",
}: QuoteBuilderClientProps) {
  const previewRef = useRef<HTMLElement | null>(null);
  const [quoteNumber, setQuoteNumber] = useState(
    `BG-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}`,
  );
  const [customerName, setCustomerName] = useState(initialCustomerName);
  const [customerCompany, setCustomerCompany] = useState(initialCustomerCompany);
  const [customerTaxCode, setCustomerTaxCode] = useState("");
  const [customerPhone, setCustomerPhone] = useState(initialCustomerPhone);
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerEmail, setCustomerEmail] = useState(initialCustomerEmail);
  const [eventName, setEventName] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [vatPercent, setVatPercent] = useState(8);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [notes, setNotes] = useState("Báo giá có hiệu lực trong 07 ngày kể từ ngày phát hành.");
  const [lines, setLines] = useState<QuoteLine[]>([
    {
      id: "line-1",
      category: "Sân khấu",
      item: "Thi công sân khấu chính và backdrop",
      unit: "gói",
      quantity: 1,
      unitPrice: 12000000,
      note: "",
    },
    {
      id: "line-2",
      category: "Âm thanh",
      item: "Hệ thống âm thanh sự kiện",
      unit: "gói",
      quantity: 1,
      unitPrice: 8500000,
      note: "",
    },
  ]);

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
    const discountValue = subtotal * (discountPercent / 100);
    const vatBase = subtotal - discountValue;
    const vatValue = vatBase * (vatPercent / 100);
    const grandTotal = vatBase + vatValue;

    return { subtotal, discountValue, vatValue, grandTotal };
  }, [discountPercent, lines, vatPercent]);

  function updateLine(id: string, field: keyof QuoteLine, value: string | number) {
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, [field]: value } : line)),
    );
  }

  function addLine() {
    setLines((current) => [...current, createLine(current.length + 1)]);
  }

  function removeLine(id: string) {
    setLines((current) => (current.length > 1 ? current.filter((line) => line.id !== id) : current));
  }

  async function exportPdf() {
    if (isExporting) {
      return;
    }

    const rowsMarkup = lines
      .map((line, index) => {
        const lineTotal = line.quantity * line.unitPrice;
        return `
          <tr>
            <td style="padding:10px 12px;border:1px solid #e4e4e7;text-align:center;">${index + 1}</td>
            <td style="padding:10px 12px;border:1px solid #e4e4e7;">${escapeHtml(line.category || "-")}</td>
            <td style="padding:10px 12px;border:1px solid #e4e4e7;">
              <div>${escapeHtml(line.item || "-")}</div>
              ${line.note ? `<div style="margin-top:6px;font-size:12px;color:#71717a;">${escapeHtml(line.note)}</div>` : ""}
            </td>
            <td style="padding:10px 12px;border:1px solid #e4e4e7;text-align:center;">${escapeHtml(line.unit || "-")}</td>
            <td style="padding:10px 12px;border:1px solid #e4e4e7;text-align:center;">${line.quantity}</td>
            <td style="padding:10px 12px;border:1px solid #e4e4e7;text-align:right;">${formatCurrency(line.unitPrice)}</td>
            <td style="padding:10px 12px;border:1px solid #e4e4e7;text-align:right;font-weight:700;">${formatCurrency(lineTotal)}</td>
          </tr>
        `;
      })
      .join("");

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-10000px";
    wrapper.style.top = "0";
    wrapper.style.width = "1120px";
    wrapper.style.background = "#ffffff";
    wrapper.style.padding = "40px";
    wrapper.style.fontFamily = "Arial, Helvetica, sans-serif";
    wrapper.style.color = "#18181b";
    wrapper.style.zIndex = "-1";

    wrapper.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:24px;border-bottom:1px solid #e4e4e7;padding-bottom:20px;">
        <div>
          ${logoUrl ? `<img src="${escapeHtml(`${window.location.origin}${logoUrl}`)}" alt="Logo" style="height:88px;max-width:320px;width:auto;display:block;margin-bottom:16px;object-fit:contain;" onerror="this.style.display='none'" />` : ""}
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#71717a;">BẢNG BÁO GIÁ</div>
          <div style="font-size:28px;font-weight:700;margin-top:12px;">${escapeHtml(companyName || "TRONG THAI EVENT")}</div>
          <div style="margin-top:12px;color:#52525b;line-height:1.8;">
            <div>${escapeHtml(address || "-")}</div>
            ${taxCode ? `<div>MST: ${escapeHtml(taxCode)}</div>` : ""}
            <div>${escapeHtml(hotline || "-")}</div>
            <div>${escapeHtml(email || "-")}</div>
          </div>
        </div>
        <div style="min-width:280px;border:1px solid #e4e4e7;border-radius:18px;padding:16px;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#71717a;">SỐ BÁO GIÁ</div>
          <div style="font-size:24px;font-weight:700;margin-top:12px;white-space:nowrap;">${escapeHtml(quoteNumber)}</div>
          <div style="margin-top:12px;color:#52525b;white-space:nowrap;">Ngày: ${escapeHtml(issueDate)}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px;">
        <div style="border-radius:18px;background:#f4f4f5;padding:16px;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#71717a;">KHÁCH HÀNG</div>
          <div style="margin-top:10px;font-size:18px;font-weight:700;">${escapeHtml(customerName || "Chưa nhập tên khách")}</div>
          <div style="margin-top:6px;color:#52525b;">${escapeHtml(customerCompany || "Chưa nhập công ty / đơn vị")}</div>
          ${customerTaxCode ? `<div style="margin-top:6px;color:#52525b;">MST: ${escapeHtml(customerTaxCode)}</div>` : ""}
          ${customerPhone ? `<div style="margin-top:6px;color:#52525b;">SĐT: ${escapeHtml(customerPhone)}</div>` : ""}
          ${customerAddress ? `<div style="margin-top:6px;color:#52525b;">Địa chỉ: ${escapeHtml(customerAddress)}</div>` : ""}
          ${customerEmail ? `<div style="margin-top:6px;color:#52525b;">Email: ${escapeHtml(customerEmail)}</div>` : ""}
        </div>
        <div style="border-radius:18px;background:#f4f4f5;padding:16px;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#71717a;">NỘI DUNG BÁO GIÁ</div>
          <div style="margin-top:10px;font-size:18px;font-weight:700;">${escapeHtml(eventName || "Chưa nhập tên sự kiện / hạng mục")}</div>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-top:24px;font-size:14px;">
        <thead>
          <tr style="background:#f4f4f5;">
            <th style="padding:10px 12px;border:1px solid #e4e4e7;">#</th>
            <th style="padding:10px 12px;border:1px solid #e4e4e7;text-align:left;">Hạng mục</th>
            <th style="padding:10px 12px;border:1px solid #e4e4e7;text-align:left;">Mô tả</th>
            <th style="padding:10px 12px;border:1px solid #e4e4e7;">ĐVT</th>
            <th style="padding:10px 12px;border:1px solid #e4e4e7;">SL</th>
            <th style="padding:10px 12px;border:1px solid #e4e4e7;text-align:right;">Đơn giá</th>
            <th style="padding:10px 12px;border:1px solid #e4e4e7;text-align:right;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>${rowsMarkup}</tbody>
      </table>

      <div style="margin-left:auto;max-width:380px;margin-top:24px;">
        <div style="display:flex;justify-content:space-between;border-radius:14px;background:#f4f4f5;padding:12px 14px;margin-top:10px;">
          <span>Tạm tính</span>
          <strong>${formatCurrency(totals.subtotal)}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;border-radius:14px;background:#f4f4f5;padding:12px 14px;margin-top:10px;">
          <span>Chiết khấu (${discountPercent}%)</span>
          <strong>- ${formatCurrency(totals.discountValue)}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;border-radius:14px;background:#f4f4f5;padding:12px 14px;margin-top:10px;">
          <span>VAT (${vatPercent}%)</span>
          <strong>${formatCurrency(totals.vatValue)}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;border-radius:14px;background:#18181b;color:#ffffff;padding:12px 14px;margin-top:10px;">
          <span style="font-weight:700;">Tổng cộng</span>
          <strong>${formatCurrency(totals.grandTotal)}</strong>
        </div>
      </div>

      <div style="margin-top:28px;border-radius:18px;background:#f4f4f5;padding:16px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#71717a;">GHI CHÚ</div>
        <div style="margin-top:10px;white-space:pre-wrap;line-height:1.8;color:#3f3f46;">${escapeHtml(notes || "-")}</div>
      </div>
    `;

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

      pdf.save(`${quoteNumber || "bao-gia"}.pdf`);
    } catch (error) {
      console.error("Quote PDF export failed:", error);
      setExportError(
        "Không thể tạo PDF tự động. Hãy thử tải lại trang hoặc dùng nút In trình duyệt để lưu PDF tạm thời.",
      );
    } finally {
      document.body.removeChild(wrapper);
      setIsExporting(false);
    }
  }

  return (
    <div className="grid items-start gap-6 print:block xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 print:hidden">
        <h2 className="text-2xl font-semibold">Thiết lập báo giá</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Nhập thông tin khách hàng và các hạng mục. Hệ thống sẽ tự tính thành tiền, VAT,
          chiết khấu và tổng cộng.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Số báo giá</span>
            <input
              value={quoteNumber}
              onChange={(event) => setQuoteNumber(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Ngày phát hành</span>
            <input
              type="date"
              value={issueDate}
              onChange={(event) => setIssueDate(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Tên khách hàng</span>
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Công ty / đơn vị</span>
            <input
              value={customerCompany}
              onChange={(event) => setCustomerCompany(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Mã số thuế khách hàng</span>
            <input
              value={customerTaxCode}
              onChange={(event) => setCustomerTaxCode(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Số điện thoại khách hàng</span>
            <input
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-white/70">Địa chỉ khách hàng</span>
          <textarea
            rows={3}
            value={customerAddress}
            onChange={(event) => setCustomerAddress(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-white/70">Email khách hàng</span>
          <input
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-white/70">Tên sự kiện / hạng mục</span>
          <input
            value={eventName}
            onChange={(event) => setEventName(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          />
        </label>

        <div className="mt-6 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Danh sách hạng mục</h3>
          <button
            type="button"
            onClick={addLine}
            className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            <Plus className="h-4 w-4" />
            Thêm dòng
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {lines.map((line, index) => (
            <div key={line.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white">Hạng mục {index + 1}</div>
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="rounded-full border border-red-400/30 p-2 text-red-300 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input
                  value={line.category}
                  onChange={(event) => updateLine(line.id, "category", event.target.value)}
                  placeholder="Nhóm hạng mục"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
                <input
                  value={line.item}
                  onChange={(event) => updateLine(line.id, "item", event.target.value)}
                  placeholder="Tên hạng mục"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
                <input
                  value={line.unit}
                  onChange={(event) => updateLine(line.id, "unit", event.target.value)}
                  placeholder="Đơn vị"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
                <input
                  type="number"
                  min="0"
                  value={line.quantity}
                  onChange={(event) => updateLine(line.id, "quantity", Number(event.target.value))}
                  placeholder="Số lượng"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
                <input
                  type="number"
                  min="0"
                  value={line.unitPrice}
                  onChange={(event) => updateLine(line.id, "unitPrice", Number(event.target.value))}
                  placeholder="Đơn giá"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400 md:col-span-2"
                />
              </div>

              <input
                value={line.note}
                onChange={(event) => updateLine(line.id, "note", event.target.value)}
                placeholder="Ghi chú"
                className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Chiết khấu (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(event) => setDiscountPercent(Number(event.target.value))}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">VAT (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={vatPercent}
              onChange={(event) => setVatPercent(Number(event.target.value))}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-white/70">Điều khoản / ghi chú chung</span>
          <textarea
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          />
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={exportPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-yellow-400/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
            title="Tải trực tiếp file PDF từ dữ liệu báo giá"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Đang tạo PDF..." : "Tải PDF"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
            title="Chế độ in của trình duyệt có thể tự chèn giờ, tên file và URL ở đầu/cuối trang"
          >
            <Printer className="h-4 w-4" />
            In trình duyệt
          </button>
        </div>
        <p className="mt-3 text-xs leading-6 text-white/55">
          Nút <span className="font-semibold text-white">Tải PDF</span> sẽ tải file trực tiếp và không có dòng
          giờ hoặc URL. Nếu dùng <span className="font-semibold text-white">In trình duyệt</span>, hãy tắt
          tùy chọn <span className="font-semibold text-white">Headers and footers</span> trong hộp thoại in để
          bỏ các dòng đó.
        </p>
        {exportError ? <p className="mt-2 text-xs leading-6 text-red-300">{exportError}</p> : null}
      </section>

      <section
        ref={previewRef}
        className="rounded-[28px] border border-white/10 bg-white p-6 text-zinc-900 print:rounded-none print:border-0 print:p-0"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            {logoUrl ? (
              <div className="mb-4">
                <img
                  src={logoUrl}
                  alt={`${companyName} logo`}
                  className="h-20 max-w-[320px] w-auto object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : null}
            <div className="text-sm uppercase tracking-[0.26em] text-zinc-500">Bảng báo giá</div>
            <h2 className="mt-3 text-3xl font-semibold">{companyName}</h2>
            <div className="mt-3 space-y-1 text-sm text-zinc-600">
              <div>{address}</div>
              {taxCode ? <div>MST: {taxCode}</div> : null}
              <div>{hotline}</div>
              <div>{email}</div>
            </div>
          </div>
          <div className="min-w-[220px] rounded-3xl border border-zinc-200 px-5 py-4 text-right">
            <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Số báo giá</div>
            <div className="mt-3 whitespace-nowrap text-3xl font-semibold">{quoteNumber}</div>
            <div className="mt-2 whitespace-nowrap text-sm text-zinc-600">Ngày: {issueDate}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-zinc-50 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Khách hàng</div>
            <div className="mt-2 font-semibold">{customerName || "Chưa nhập tên khách"}</div>
            <div className="mt-1 text-sm text-zinc-600">
              {customerCompany || "Chưa nhập công ty / đơn vị"}
            </div>
            {customerTaxCode ? <div className="mt-1 text-sm text-zinc-600">MST: {customerTaxCode}</div> : null}
            {customerPhone ? <div className="mt-1 text-sm text-zinc-600">SĐT: {customerPhone}</div> : null}
            {customerAddress ? <div className="mt-1 text-sm text-zinc-600">Địa chỉ: {customerAddress}</div> : null}
            {customerEmail ? <div className="mt-1 text-sm text-zinc-600">Email: {customerEmail}</div> : null}
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Nội dung báo giá</div>
            <div className="mt-2 font-semibold">{eventName || "Chưa nhập tên sự kiện / hạng mục"}</div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-zinc-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Hạng mục</th>
                <th className="px-4 py-3 text-left font-semibold">Mô tả</th>
                <th className="px-4 py-3 text-center font-semibold">ĐVT</th>
                <th className="px-4 py-3 text-center font-semibold">SL</th>
                <th className="px-4 py-3 text-right font-semibold">Đơn giá</th>
                <th className="px-4 py-3 text-right font-semibold">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => {
                const lineTotal = line.quantity * line.unitPrice;

                return (
                  <tr key={line.id} className="border-t border-zinc-200 align-top">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{line.category || "-"}</td>
                    <td className="px-4 py-3">
                      <div>{line.item || "-"}</div>
                      {line.note ? <div className="mt-1 text-xs text-zinc-500">{line.note}</div> : null}
                    </td>
                    <td className="px-4 py-3 text-center">{line.unit || "-"}</td>
                    <td className="px-4 py-3 text-center">{line.quantity}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(line.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(lineTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="ml-auto mt-6 max-w-md space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
            <span>Tạm tính</span>
            <strong>{formatCurrency(totals.subtotal)}</strong>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
            <span>Chiết khấu ({discountPercent}%)</span>
            <strong>- {formatCurrency(totals.discountValue)}</strong>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
            <span>VAT ({vatPercent}%)</span>
            <strong>{formatCurrency(totals.vatValue)}</strong>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-zinc-900 px-4 py-4 text-white">
            <span className="text-base font-semibold">Tổng cộng</span>
            <strong className="text-xl">{formatCurrency(totals.grandTotal)}</strong>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-zinc-50 p-4">
          <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Ghi chú</div>
          <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-700">{notes}</div>
        </div>
      </section>
    </div>
  );
}
