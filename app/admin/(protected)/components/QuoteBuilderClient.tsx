"use client";

import { useMemo, useRef, useState } from "react";
import { Download, FileSpreadsheet, Plus, Printer, Trash2 } from "lucide-react";

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

function numericInput(value: string) {
  return Number(value.replaceAll(".", "").replaceAll(",", "")) || 0;
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
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [customerName, setCustomerName] = useState(initialCustomerName);
  const [customerCompany, setCustomerCompany] = useState(initialCustomerCompany);
  const [customerTaxCode, setCustomerTaxCode] = useState("");
  const [customerPhone, setCustomerPhone] = useState(initialCustomerPhone);
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerEmail, setCustomerEmail] = useState(initialCustomerEmail);
  const [eventName, setEventName] = useState("");
  const [vatPercent, setVatPercent] = useState(8);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notes, setNotes] = useState("Báo giá có hiệu lực trong 07 ngày kể từ ngày phát hành.");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
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

  const normalizedCustomerName = customerName.trim();
  const normalizedCustomerCompany = customerCompany.trim();
  const customerDisplayName =
    normalizedCustomerCompany || normalizedCustomerName || "Chưa nhập khách hàng";
  const customerSecondaryName =
    normalizedCustomerCompany && normalizedCustomerName
        ? normalizedCustomerName
        : normalizedCustomerCompany
          ? ""
        : "Chưa nhập công ty / đơn vị";

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
    if (!previewRef.current || isExporting) {
      return;
    }

    try {
      setExportError("");
      setIsExporting(true);

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(previewRef.current, {
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
      setExportError("Không thể tạo PDF tự động. Hãy thử lại hoặc dùng nút in trình duyệt.");
    } finally {
      setIsExporting(false);
    }
  }

  function printQuote() {
    window.print();
  }

  function exportExcel() {
    const rows = lines
      .map((line, index) => {
        const total = line.quantity * line.unitPrice;
        return `
          <tr>
            <td class="center">${index + 1}</td>
            <td class="cell strong">${escapeHtml(line.category || "-")}</td>
            <td class="cell">${escapeHtml(line.item || "-")}</td>
            <td class="center">${escapeHtml(line.unit || "-")}</td>
            <td class="center">${line.quantity}</td>
            <td class="right">${formatCurrency(line.unitPrice)}</td>
            <td class="right strong">${formatCurrency(total)}</td>
            <td class="cell note">${escapeHtml(line.note || "")}</td>
          </tr>
        `;
      })
      .join("");

    const workbook = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; color: #18181b; }
            table { border-collapse: collapse; width: 100%; }
            .sheet { width: 100%; }
            .no-border td { border: none; padding: 4px 0; }
            .title { font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; color: #71717a; }
            .company { font-size: 24px; font-weight: 700; padding-top: 10px; }
            .muted { color: #52525b; }
            .section-label {
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.22em;
              color: #71717a;
              padding-bottom: 8px;
            }
            .box {
              border: 1px solid #d4d4d8;
              background: #fafafa;
              padding: 14px 16px;
              border-radius: 18px;
            }
            .summary-box {
              border: 1px solid #d4d4d8;
              border-radius: 18px;
              padding: 14px 16px;
              text-align: right;
            }
            .table th, .table td { border: 1px solid #d4d4d8; padding: 10px 12px; vertical-align: top; }
            .table th { background: #f4f4f5; font-weight: 700; }
            .cell { white-space: normal; }
            .center { text-align: center; }
            .right { text-align: right; }
            .strong { font-weight: 700; }
            .note { color: #52525b; }
            .spacer td { border: none; height: 12px; padding: 0; }
            .total-row td { border: none; padding: 10px 0; }
            .total-label { color: #18181b; }
            .grand-label, .grand-value {
              background: #3f3f46;
              color: #fff;
              font-weight: 700;
              padding: 12px 14px !important;
            }
            .grand-label { border-radius: 14px 0 0 14px; }
            .grand-value { border-radius: 0 14px 14px 0; }
          </style>
        </head>
        <body>
          <table class="sheet no-border">
            <tr><td colspan="8" class="title">BẢNG BÁO GIÁ</td></tr>
            <tr><td colspan="5" class="company">${escapeHtml(companyName)}</td><td colspan="3" class="summary-box"><div class="section-label">Số báo giá</div><div style="font-size: 24px; font-weight: 700;">${escapeHtml(quoteNumber)}</div><div class="muted" style="padding-top: 6px;">Ngày: ${escapeHtml(issueDate)}</div></td></tr>
            <tr><td colspan="8" class="muted">${escapeHtml(address)}</td></tr>
            ${taxCode ? `<tr><td colspan="8" class="muted">MST: ${escapeHtml(taxCode)}</td></tr>` : ""}
            <tr><td colspan="8" class="muted">${escapeHtml(hotline)}${email ? ` | ${escapeHtml(email)}` : ""}</td></tr>
            <tr class="spacer"><td colspan="8"></td></tr>
            <tr>
              <td colspan="4" class="box">
                <div class="section-label">Khách hàng</div>
                <div style="font-size:18px;font-weight:700;">${escapeHtml(customerDisplayName)}</div>
                ${customerSecondaryName ? `<div class="muted" style="padding-top:6px;">${escapeHtml(customerSecondaryName)}</div>` : ""}
                ${customerTaxCode ? `<div class="muted" style="padding-top:6px;">MST: ${escapeHtml(customerTaxCode)}</div>` : ""}
                ${customerPhone ? `<div class="muted" style="padding-top:6px;">SĐT: ${escapeHtml(customerPhone)}</div>` : ""}
                ${customerAddress ? `<div class="muted" style="padding-top:6px;">Địa chỉ: ${escapeHtml(customerAddress)}</div>` : ""}
                ${customerEmail ? `<div class="muted" style="padding-top:6px;">Email: ${escapeHtml(customerEmail)}</div>` : ""}
              </td>
              <td colspan="4" class="box">
                <div class="section-label">Nội dung báo giá</div>
                <div style="font-size:18px;font-weight:700;">${escapeHtml(eventName || "Chưa nhập tên sự kiện / hạng mục")}</div>
              </td>
            </tr>
            <tr class="spacer"><td colspan="8"></td></tr>
          </table>
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Hạng mục</th>
                <th>Mô tả</th>
                <th>ĐVT</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              <tr class="spacer"><td colspan="8"></td></tr>
              <tr class="total-row">
                <td colspan="5"></td>
                <td colspan="2" class="total-label strong">Tạm tính</td>
                <td class="right strong">${formatCurrency(totals.subtotal)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="5"></td>
                <td colspan="2" class="total-label strong">Chiết khấu (${discountPercent}%)</td>
                <td class="right strong">- ${formatCurrency(totals.discountValue)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="5"></td>
                <td colspan="2" class="total-label strong">VAT (${vatPercent}%)</td>
                <td class="right strong">${formatCurrency(totals.vatValue)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="5"></td>
                <td colspan="2" class="grand-label">Tổng cộng</td>
                <td class="right grand-value">${formatCurrency(totals.grandTotal)}</td>
              </tr>
            </tbody>
          </table>
          <table class="sheet no-border" style="margin-top: 16px;">
            <tr><td class="section-label">Ghi chú</td></tr>
            <tr><td class="muted">${escapeHtml(notes).replaceAll("\n", "<br />")}</td></tr>
          </table>
        </body>
      </html>`;

    const blob = new Blob([`\uFEFF${workbook}`], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${quoteNumber || "bao-gia"}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const rowsMarkup = lines
    .map((line, index) => {
      const lineTotal = line.quantity * line.unitPrice;
      return `
        <tr>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;text-align:center;">${index + 1}</td>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;">${escapeHtml(line.category || "-")}</td>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;">${escapeHtml(line.item || "-")}</td>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;text-align:center;">${escapeHtml(line.unit || "-")}</td>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;text-align:center;">${line.quantity}</td>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;text-align:right;">${formatCurrency(line.unitPrice)}</td>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;text-align:right;font-weight:700;">${formatCurrency(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  const pdfCustomerBlock = `
      <div style="border-radius:18px;background:#f4f4f5;padding:16px;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#71717a;">KHÁCH HÀNG</div>
      <div style="margin-top:10px;font-size:18px;font-weight:700;">${escapeHtml(customerDisplayName)}</div>
      ${customerSecondaryName ? `<div style="margin-top:6px;color:#52525b;">${escapeHtml(customerSecondaryName)}</div>` : ""}
      ${customerTaxCode ? `<div style="margin-top:6px;color:#52525b;">MST: ${escapeHtml(customerTaxCode)}</div>` : ""}
      ${customerPhone ? `<div style="margin-top:6px;color:#52525b;">SĐT: ${escapeHtml(customerPhone)}</div>` : ""}
      ${customerAddress ? `<div style="margin-top:6px;color:#52525b;">Địa chỉ: ${escapeHtml(customerAddress)}</div>` : ""}
      ${customerEmail ? `<div style="margin-top:6px;color:#52525b;">Email: ${escapeHtml(customerEmail)}</div>` : ""}
    </div>
  `;

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
              placeholder="Nhập nếu là cá nhân hoặc người liên hệ"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Công ty / đơn vị</span>
            <input
              value={customerCompany}
              onChange={(event) => setCustomerCompany(event.target.value)}
              placeholder="Nhập nếu là công ty / đơn vị"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
        </div>

        <p className="mt-3 text-xs leading-5 text-white/45">
          Chỉ cần nhập một trong hai trường trên. Nếu khách là công ty thì có thể để trống tên
          khách hàng. Nếu khách là cá nhân thì có thể để trống công ty / đơn vị.
        </p>

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
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white">Hạng mục {index + 1}</div>
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="rounded-full border border-red-400/30 p-2 text-red-300 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <input
                  value={line.category}
                  onChange={(event) => updateLine(line.id, "category", event.target.value)}
                  placeholder="Hạng mục"
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
                <input
                  value={line.unit}
                  onChange={(event) => updateLine(line.id, "unit", event.target.value)}
                  placeholder="ĐVT"
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(event) => updateLine(line.id, "quantity", Number(event.target.value) || 1)}
                  placeholder="SL"
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
                <input
                  value={line.unitPrice}
                  onChange={(event) => updateLine(line.id, "unitPrice", numericInput(event.target.value))}
                  placeholder="Đơn giá"
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
              </div>

              <input
                value={line.item}
                onChange={(event) => updateLine(line.id, "item", event.target.value)}
                placeholder="Mô tả"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
              />
              <textarea
                rows={2}
                value={line.note}
                onChange={(event) => updateLine(line.id, "note", event.target.value)}
                placeholder="Ghi chú"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Chiết khấu (%)</span>
            <input
              type="number"
              min={0}
              value={discountPercent}
              onChange={(event) => setDiscountPercent(Number(event.target.value) || 0)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">VAT (%)</span>
            <input
              type="number"
              min={0}
              value={vatPercent}
              onChange={(event) => setVatPercent(Number(event.target.value) || 0)}
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
            onClick={exportExcel}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/15"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Tải Excel
          </button>
          <button
            type="button"
            onClick={exportPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Đang tạo PDF..." : "Tải PDF"}
          </button>
          <button
            type="button"
            onClick={printQuote}
            className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            <Printer className="h-4 w-4" />
            In trình duyệt
          </button>
        </div>

        {exportError ? <div className="mt-4 text-sm text-red-300">{exportError}</div> : null}
      </section>

      <section
        ref={previewRef}
        className="rounded-[28px] bg-white p-6 text-zinc-900 shadow-[0_30px_80px_rgba(0,0,0,0.18)] print:rounded-none print:p-0 print:shadow-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            {logoUrl ? (
              <div className="mb-4">
                <img
                  src={logoUrl}
                  alt={`${companyName} logo`}
                  className="h-20 w-auto max-w-[320px] object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : null}
            <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Bảng báo giá</div>
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
            <div className="mt-2 font-semibold">{customerDisplayName}</div>
            {customerSecondaryName ? (
              <div className="mt-1 text-sm text-zinc-600">{customerSecondaryName}</div>
            ) : null}
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
                <th className="px-4 py-3 text-left font-semibold">ĐVT</th>
                <th className="px-4 py-3 text-left font-semibold">SL</th>
                <th className="px-4 py-3 text-right font-semibold">Đơn giá</th>
                <th className="px-4 py-3 text-right font-semibold">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => {
                const total = line.quantity * line.unitPrice;
                return (
                  <tr key={line.id} className="border-t border-zinc-200">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{line.category || "-"}</td>
                    <td className="px-4 py-3">
                      <div>{line.item || "-"}</div>
                      {line.note ? <div className="mt-1 text-xs text-zinc-500">{line.note}</div> : null}
                    </td>
                    <td className="px-4 py-3">{line.unit || "-"}</td>
                    <td className="px-4 py-3">{line.quantity}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(line.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="ml-auto mt-6 max-w-[380px] space-y-3">
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
          <div className="flex items-center justify-between rounded-2xl bg-zinc-700 px-4 py-3 text-white">
            <span className="font-semibold">Tổng cộng</span>
            <strong>{formatCurrency(totals.grandTotal)}</strong>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-zinc-50 p-4">
          <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Ghi chú</div>
          <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-zinc-600">{notes}</div>
        </div>

        <div className="hidden">
          <div dangerouslySetInnerHTML={{ __html: rowsMarkup + pdfCustomerBlock }} />
        </div>
      </section>
    </div>
  );
}

