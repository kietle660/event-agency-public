"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Printer, Trash2 } from "lucide-react";

type ContractBuilderClientProps = {
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

type ContractLine = {
  id: string;
  service: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  note: string;
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

function formatDisplayDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function numberToVietnamese(value: number) {
  if (!value) return "không đồng";
  const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const units = ["", "nghìn", "triệu", "tỷ"];

  function readTriple(num: number, full: boolean) {
    const hundred = Math.floor(num / 100);
    const ten = Math.floor((num % 100) / 10);
    const one = num % 10;
    const parts: string[] = [];
    if (full || hundred > 0) {
      parts.push(`${digits[hundred]} trăm`);
      if (ten === 0 && one > 0) parts.push("linh");
    }
    if (ten > 1) {
      parts.push(`${digits[ten]} mươi`);
      if (one === 1) parts.push("mốt");
      else if (one === 5) parts.push("lăm");
      else if (one > 0) parts.push(digits[one]);
    } else if (ten === 1) {
      parts.push("mười");
      if (one === 5) parts.push("lăm");
      else if (one > 0) parts.push(digits[one]);
    } else if (one > 0) {
      parts.push(digits[one]);
    }
    return parts.join(" ");
  }

  const groups: number[] = [];
  let remaining = Math.round(value);
  while (remaining > 0) {
    groups.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i -= 1) {
    if (!groups[i]) continue;
    parts.push(readTriple(groups[i], i !== groups.length - 1));
    if (units[i]) parts.push(units[i]);
  }

  return `${parts.join(" ").replace(/\s+/g, " ").trim()} đồng`;
}

function createLine(index: number): ContractLine {
  return {
    id: `contract-line-${index}-${Date.now()}`,
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

type ContractHtmlInput = {
  companyName: string;
  logoUrl?: string;
  taxCode?: string;
  hotline: string;
  email: string;
  address: string;
  contractNumber: string;
  signingDate: string;
  signingPlace: string;
  companyRepresentative: string;
  companyPosition: string;
  companyBankName: string;
  companyBankAccount: string;
  customerName: string;
  customerRepresentative: string;
  customerPosition: string;
  customerTaxCode: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  serviceName: string;
  serviceScope: string;
  eventDate: string;
  eventLocation: string;
  contractValue: number;
  subtotal: number;
  vatPercent: number;
  vatValue: number;
  depositPercent: number;
  depositAmount: number;
  remainingAmount: number;
  paymentTerms: string;
  extraTerms: string;
  basisText: string;
  introText: string;
  clause1Text: string;
  clause2Text: string;
  clause3Text: string;
  clause4Text: string;
  clause5Text: string;
  clause6Text: string;
  clause7Text: string;
  clause8Text: string;
  clause9Text: string;
  clause10Text: string;
  clause12Text: string;
  clause13Text: string;
  lines: ContractLine[];
};

function buildContractHtml(input: ContractHtmlInput) {
  const logo = input.logoUrl
    ? `<img src="${escapeHtml(`${window.location.origin}${input.logoUrl}`)}" alt="Logo" style="height:72px;max-width:220px;object-fit:contain;display:block;margin-bottom:16px;" onerror="this.style.display='none'" />`
    : "";
  const signingDay = input.signingDate ? input.signingDate.slice(8, 10) : "__";
  const signingMonth = input.signingDate ? input.signingDate.slice(5, 7) : "__";
  const signingYear = input.signingDate ? input.signingDate.slice(0, 4) : "____";
  const rowsMarkup = input.lines.map((line, index) => {
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
  }).join("");

  return `
    <div style="background:#fff;color:#111827;font-family:Arial,Helvetica,sans-serif;padding:36px 44px;line-height:1.6;font-size:14px;">
      <div style="display:flex;justify-content:space-between;gap:24px;">
        <div style="max-width:320px;">${logo}<div style="font-size:13px;">Số: ${escapeHtml(input.contractNumber || "HĐDV-0001")}</div></div>
        <div style="text-align:center;flex:1;">
          <div style="font-weight:700;text-transform:uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div style="font-weight:600;margin-top:4px;">Độc lập - Tự do - Hạnh phúc</div>
          <div style="border-top:1px solid #111827;width:220px;margin:8px auto 0;"></div>
        </div>
      </div>
      <div style="margin-top:24px;text-align:right;font-style:italic;">${escapeHtml(input.signingPlace || "Đồng Nai")}, ngày ${escapeHtml(signingDay)} tháng ${escapeHtml(signingMonth)} năm ${escapeHtml(signingYear)}</div>
      <div style="margin-top:18px;text-align:center;">
        <div style="font-size:28px;font-weight:700;text-transform:uppercase;">HỢP ĐỒNG DỊCH VỤ</div>
        <div style="margin-top:8px;font-size:16px;">V/v: ${escapeHtml(input.serviceName || "Cung cấp dịch vụ tổ chức sự kiện")}</div>
      </div>
      <div style="margin-top:20px;white-space:pre-wrap;">${createMultilineHtml(input.basisText)}</div>
      <div style="margin-top:18px;">${createMultilineHtml(input.introText)}</div>
      <div style="margin-top:16px;border:1px solid #d4d4d8;border-radius:16px;padding:18px;">
        <div style="font-size:18px;font-weight:700;text-transform:uppercase;">Bên A: ${escapeHtml(input.customerName || "Khách hàng")}</div>
        <div style="margin-top:8px;">Đại diện: ${escapeHtml(input.customerRepresentative || "................................")}</div>
        <div>Chức vụ: ${escapeHtml(input.customerPosition || "................................")}</div>
        <div>Mã số thuế: ${escapeHtml(input.customerTaxCode || "................................")}</div>
        <div>Địa chỉ: ${escapeHtml(input.customerAddress || "................................")}</div>
        <div>Điện thoại: ${escapeHtml(input.customerPhone || "................................")}</div>
        <div>Email: ${escapeHtml(input.customerEmail || "................................")}</div>
      </div>
      <div style="margin-top:14px;border:1px solid #d4d4d8;border-radius:16px;padding:18px;">
        <div style="font-size:18px;font-weight:700;text-transform:uppercase;">Bên B: ${escapeHtml(input.companyName)}</div>
        <div style="margin-top:8px;">Đại diện: ${escapeHtml(input.companyRepresentative || "................................")}</div>
        <div>Chức vụ: ${escapeHtml(input.companyPosition || "................................")}</div>
        ${input.taxCode ? `<div>Mã số thuế: ${escapeHtml(input.taxCode)}</div>` : ""}
        <div>Địa chỉ: ${escapeHtml(input.address || "................................")}</div>
        <div>Điện thoại: ${escapeHtml(input.hotline || "................................")}</div>
        <div>Email: ${escapeHtml(input.email || "................................")}</div>
        ${input.companyBankName ? `<div>Ngân hàng: ${escapeHtml(input.companyBankName)}</div>` : ""}
        ${input.companyBankAccount ? `<div>Số tài khoản: ${escapeHtml(input.companyBankAccount)}</div>` : ""}
      </div>
      <div style="margin-top:20px;">Sau khi bàn bạc trên tinh thần hợp tác và thiện chí, hai bên thống nhất ký kết hợp đồng với các điều khoản sau:</div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 1. Nội dung dịch vụ</div><div style="margin-top:8px;">Bên B thực hiện cho Bên A dịch vụ <b>${escapeHtml(input.serviceName || "Tổ chức sự kiện")}</b>.</div><div style="margin-top:6px;white-space:pre-wrap;">${createMultilineHtml(input.clause1Text)}</div><div style="margin-top:6px;white-space:pre-wrap;">${createMultilineHtml(input.serviceScope)}</div></div>
      <div style="margin-top:14px;">- Địa điểm: ${escapeHtml(input.eventLocation || "Theo thỏa thuận của hai bên")}.</div>
      <div style="margin-top:14px;">- Nội dung công việc như bên dưới bảng:</div>
      <div style="margin-top:10px;padding:0 12px;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead><tr><th style="border:1px solid #111827;padding:6px 8px;text-align:center;">STT</th><th style="border:1px solid #111827;padding:6px 8px;text-align:center;">TÊN DỊCH VỤ</th><th style="border:1px solid #111827;padding:6px 8px;text-align:center;">ĐVT</th><th style="border:1px solid #111827;padding:6px 8px;text-align:center;">SL</th><th style="border:1px solid #111827;padding:6px 8px;text-align:center;">ĐƠN GIÁ</th><th style="border:1px solid #111827;padding:6px 8px;text-align:center;">THÀNH TIỀN</th><th style="border:1px solid #111827;padding:6px 8px;text-align:center;">GHI CHÚ</th></tr></thead>
          <tbody>
            ${rowsMarkup}
            <tr><td style="border:1px solid #111827;padding:6px 8px;"></td><td colspan="4" style="border:1px solid #111827;padding:6px 8px;text-align:center;font-weight:700;">Thành tiền</td><td style="border:1px solid #111827;padding:6px 8px;text-align:right;">${currency.format(input.subtotal)}</td><td style="border:1px solid #111827;padding:6px 8px;"></td></tr>
            <tr><td style="border:1px solid #111827;padding:6px 8px;"></td><td colspan="4" style="border:1px solid #111827;padding:6px 8px;text-align:center;">VAT ${input.vatPercent}%</td><td style="border:1px solid #111827;padding:6px 8px;text-align:right;">${currency.format(input.vatValue)}</td><td style="border:1px solid #111827;padding:6px 8px;"></td></tr>
            <tr><td style="border:1px solid #111827;padding:6px 8px;"></td><td colspan="4" style="border:1px solid #111827;padding:6px 8px;text-align:center;font-weight:700;">Tổng cộng</td><td style="border:1px solid #111827;padding:6px 8px;text-align:right;font-weight:700;">${currency.format(input.contractValue)}</td><td style="border:1px solid #111827;padding:6px 8px;"></td></tr>
          </tbody>
        </table>
      </div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 2. Thời gian và địa điểm thực hiện</div><div style="margin-top:8px;">Thời gian tổ chức / triển khai: ${escapeHtml(formatDisplayDate(input.eventDate) || "Theo thỏa thuận của hai bên")}.</div><div>Địa điểm thực hiện: ${escapeHtml(input.eventLocation || "Theo thỏa thuận của hai bên")}.</div><div style="margin-top:6px;white-space:pre-wrap;">${createMultilineHtml(input.clause2Text)}</div></div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 3. Giá trị hợp đồng</div><div style="margin-top:8px;">Tổng giá trị hợp đồng là: <b>${formatCurrency(input.contractValue)}</b>.</div><div>Bằng chữ: <i>${escapeHtml(numberToVietnamese(input.contractValue))}</i>.</div><div style="margin-top:6px;white-space:pre-wrap;">${createMultilineHtml(input.clause3Text)}</div></div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 4. Tiến độ và phương thức thanh toán</div><div style="margin-top:8px;">Đợt 1 / Đặt cọc (${input.depositPercent}%): <b>${formatCurrency(input.depositAmount)}</b>.</div><div>Đợt 2 / Thanh toán còn lại: <b>${formatCurrency(input.remainingAmount)}</b>.</div><div style="margin-top:8px;white-space:pre-wrap;">${createMultilineHtml(input.clause4Text)}</div><div style="margin-top:8px;white-space:pre-wrap;">${createMultilineHtml(input.paymentTerms)}</div></div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 5. Quyền và nghĩa vụ của Bên A</div><div style="margin-top:8px;white-space:pre-wrap;">${createMultilineHtml(input.clause5Text)}</div></div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 6. Quyền và nghĩa vụ của Bên B</div><div style="margin-top:8px;white-space:pre-wrap;">${createMultilineHtml(input.clause6Text)}</div></div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 7. Nghiệm thu và bàn giao</div><div style="margin-top:8px;white-space:pre-wrap;">${createMultilineHtml(input.clause7Text)}</div></div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 8. Bảo mật thông tin</div><div style="margin-top:8px;white-space:pre-wrap;">${createMultilineHtml(input.clause8Text)}</div></div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 9. Bất khả kháng</div><div style="margin-top:8px;white-space:pre-wrap;">${createMultilineHtml(input.clause9Text)}</div></div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 10. Tạm ngừng hoặc chấm dứt hợp đồng</div><div style="margin-top:8px;white-space:pre-wrap;">${createMultilineHtml(input.clause10Text)}</div></div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 11. Điều khoản bổ sung</div><div style="margin-top:8px;white-space:pre-wrap;">${createMultilineHtml(input.extraTerms)}</div></div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 12. Giải quyết tranh chấp</div><div style="margin-top:8px;white-space:pre-wrap;">${createMultilineHtml(input.clause12Text)}</div></div>
      <div style="margin-top:18px;"><div style="font-size:17px;font-weight:700;text-transform:uppercase;">Điều 13. Hiệu lực hợp đồng</div><div style="margin-top:8px;white-space:pre-wrap;">${createMultilineHtml(input.clause13Text)}</div></div>
      <div style="margin-top:56px;display:grid;grid-template-columns:1fr 1fr;gap:48px;text-align:center;">
        <div><div style="font-weight:700;text-transform:uppercase;">Bên A</div><div style="margin-top:6px;font-style:italic;">(Ký, ghi rõ họ tên)</div><div style="height:96px;"></div><div style="font-weight:700;">${escapeHtml(input.customerRepresentative || input.customerName || "....................")}</div></div>
        <div><div style="font-weight:700;text-transform:uppercase;">Bên B</div><div style="margin-top:6px;font-style:italic;">(Ký, đóng dấu)</div><div style="height:96px;"></div><div style="font-weight:700;">${escapeHtml(input.companyRepresentative || "....................")}</div></div>
      </div>
    </div>
  `;
}

export default function ContractBuilderClient(props: ContractBuilderClientProps) {
  const initialCustomerLegalName = props.initialCustomerCompany || props.initialCustomerName || "";
  const initialCustomerRepresentative = props.initialCustomerCompany && props.initialCustomerName ? props.initialCustomerName : "";
  const [contractNumber, setContractNumber] = useState(`HĐDV-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}`);
  const [signingDate, setSigningDate] = useState(new Date().toISOString().slice(0, 10));
  const [signingPlace, setSigningPlace] = useState("Đồng Nai");
  const [companyRepresentative, setCompanyRepresentative] = useState("");
  const [companyPosition, setCompanyPosition] = useState("Giám đốc");
  const [companyBankName, setCompanyBankName] = useState("");
  const [companyBankAccount, setCompanyBankAccount] = useState("");
  const [customerName, setCustomerName] = useState(initialCustomerLegalName);
  const [customerRepresentative, setCustomerRepresentative] = useState(initialCustomerRepresentative);
  const [customerPosition, setCustomerPosition] = useState("");
  const [customerTaxCode, setCustomerTaxCode] = useState("");
  const [customerPhone, setCustomerPhone] = useState(props.initialCustomerPhone || "");
  const [customerEmail, setCustomerEmail] = useState(props.initialCustomerEmail || "");
  const [customerAddress, setCustomerAddress] = useState("");
  const [serviceName, setServiceName] = useState("Tổ chức sự kiện");
  const [serviceScope, setServiceScope] = useState("Thiết kế concept, thi công, nhân sự điều phối, âm thanh, ánh sáng và vận hành chương trình theo kịch bản đã thống nhất.");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [vatPercent, setVatPercent] = useState(8);
  const [depositPercent, setDepositPercent] = useState(50);
  const [depositAmountOverride, setDepositAmountOverride] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Bên A đặt cọc ngay sau khi ký hợp đồng.\nPhần còn lại được thanh toán chậm nhất trong vòng 03 ngày kể từ ngày chương trình kết thúc.");
  const [extraTerms, setExtraTerms] = useState("Báo giá, phụ lục kỹ thuật, timeline và các xác nhận phát sinh bằng văn bản là bộ phận không tách rời của hợp đồng này.");
  const [basisText, setBasisText] = useState("Căn cứ Bộ luật dân sự số 91/2015/QH13;\nCăn cứ Luật Thương mại số 36/2005/QH11;\nCăn cứ nhu cầu và khả năng thực hiện của các bên.");
  const [introText, setIntroText] = useState("Hôm nay, chúng tôi gồm có:");
  const [clause1Text, setClause1Text] = useState("Phạm vi công việc bao gồm:");
  const [clause2Text, setClause2Text] = useState("Trong trường hợp cần điều chỉnh thời gian hoặc địa điểm, hai bên sẽ thống nhất bằng văn bản hoặc email xác nhận hợp lệ.");
  const [clause3Text, setClause3Text] = useState("Giá trị trên đã bao gồm các hạng mục hai bên đã thống nhất tại thời điểm ký hợp đồng.");
  const [clause4Text, setClause4Text] = useState("Bên A thanh toán theo các đợt đã thỏa thuận dưới đây.");
  const [clause5Text, setClause5Text] = useState("Bên A có trách nhiệm cung cấp thông tin, đầu mối phối hợp và phê duyệt nội dung đúng thời hạn để Bên B triển khai công việc.\nBên A thanh toán đúng tiến độ, hỗ trợ thủ tục làm việc tại địa điểm tổ chức và cử người đại diện phối hợp trong quá trình thực hiện.");
  const [clause6Text, setClause6Text] = useState("Bên B tổ chức thực hiện đầy đủ khối lượng công việc đã cam kết, đảm bảo chất lượng dịch vụ, tiến độ triển khai và nhân sự vận hành theo kế hoạch.\nBên B có trách nhiệm thông báo kịp thời cho Bên A về các phát sinh ảnh hưởng đến tiến độ, chất lượng hoặc chi phí thực hiện.");
  const [clause7Text, setClause7Text] = useState("Việc nghiệm thu được thực hiện dựa trên khối lượng công việc đã hoàn thành và mức độ đáp ứng theo nội dung hợp đồng, báo giá và phụ lục đi kèm.\nKhi chương trình kết thúc hoặc công việc hoàn tất, hai bên xác nhận nghiệm thu làm căn cứ thanh toán phần còn lại.");
  const [clause8Text, setClause8Text] = useState("Hai bên cam kết bảo mật các thông tin kinh doanh, dữ liệu khách hàng, phương án tổ chức, tài liệu kỹ thuật và các nội dung nội bộ có liên quan đến việc thực hiện hợp đồng.");
  const [clause9Text, setClause9Text] = useState("Trường hợp xảy ra sự kiện bất khả kháng như thiên tai, dịch bệnh, chiến tranh, quyết định của cơ quan nhà nước hoặc các sự kiện nằm ngoài khả năng kiểm soát hợp lý của các bên, hai bên sẽ cùng trao đổi để điều chỉnh kế hoạch thực hiện.");
  const [clause10Text, setClause10Text] = useState("Mọi thay đổi, tạm ngừng hoặc chấm dứt hợp đồng phải được lập thành văn bản.\nBên vi phạm nghĩa vụ thanh toán hoặc nghĩa vụ thực hiện phải chịu trách nhiệm đối với phần thiệt hại phát sinh theo quy định pháp luật.");
  const [clause12Text, setClause12Text] = useState("Mọi tranh chấp liên quan đến hợp đồng này đều được giải quyết trước hết bằng thương lượng và hòa giải giữa các bên.\nTrường hợp hòa giải không thành, các bên có quyền yêu cầu Tòa án có thẩm quyền nơi Bên B đặt trụ sở giải quyết theo quy định pháp luật.");
  const [clause13Text, setClause13Text] = useState("Hợp đồng có hiệu lực kể từ ngày ký.\nHợp đồng được lập thành 02 (hai) bản có giá trị pháp lý như nhau, mỗi bên giữ 01 (một) bản. Báo giá và các văn bản đính kèm là bộ phận không thể tách rời và có giá trị pháp lý như các điều khoản được ghi nhận trong hợp đồng này.");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [lines, setLines] = useState<ContractLine[]>([
    { id: "line-1", service: "Gói âm thanh", unit: "Gói", quantity: 1, unitPrice: 7500000, note: "" },
    { id: "line-2", service: "Gói ánh sáng", unit: "Gói", quantity: 1, unitPrice: 4500000, note: "" },
    { id: "line-3", service: "Sân khấu và backdrop", unit: "Gói", quantity: 1, unitPrice: 9760000, note: "" },
  ]);

  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0), [lines]);
  const vatValue = useMemo(() => subtotal * (vatPercent / 100), [subtotal, vatPercent]);
  const contractValue = useMemo(() => subtotal + vatValue, [subtotal, vatValue]);
  const calculatedDepositAmount = useMemo(() => contractValue * (depositPercent / 100), [contractValue, depositPercent]);
  const depositAmount = useMemo(() => {
    const parsed = Number(depositAmountOverride);
    if (depositAmountOverride !== "" && !Number.isNaN(parsed)) {
      return Math.max(parsed, 0);
    }
    return calculatedDepositAmount;
  }, [calculatedDepositAmount, depositAmountOverride]);
  const remainingAmount = useMemo(() => Math.max(contractValue - depositAmount, 0), [contractValue, depositAmount]);

  function updateLine(id: string, field: keyof ContractLine, value: string | number) {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, [field]: value } : line)));
  }

  function addLine() {
    setLines((current) => [...current, createLine(current.length + 1)]);
  }

  function removeLine(id: string) {
    setLines((current) => (current.length > 1 ? current.filter((line) => line.id !== id) : current));
  }

  function goToLiquidation() {
    const params = new URLSearchParams({
      customerName: customerRepresentative || customerName,
      customerCompany: customerName,
      customerPhone,
      customerEmail,
      customerRepresentative,
      customerPosition,
      customerAddress,
      companyRepresentative,
      companyPosition,
      contractNumber,
      contractDate: signingDate,
      liquidationPlace: signingPlace,
      workItemsText: serviceScope,
      contractValue: String(contractValue),
      lines: JSON.stringify(lines),
    });

    window.location.href = `/admin/liquidations?${params.toString()}`;
  }

  const previewHtml = useMemo(() => buildContractHtml({
    ...props,
    contractNumber,
    signingDate,
    signingPlace,
    companyRepresentative,
    companyPosition,
    companyBankName,
    companyBankAccount,
    customerName,
    customerRepresentative,
    customerPosition,
    customerTaxCode,
    customerPhone,
    customerEmail,
    customerAddress,
    serviceName,
    serviceScope,
    eventDate,
    eventLocation,
    contractValue,
    subtotal,
    vatPercent,
    vatValue,
    depositPercent,
    depositAmount,
    remainingAmount,
    paymentTerms,
    extraTerms,
    basisText,
    introText,
    clause1Text,
    clause2Text,
    clause3Text,
    clause4Text,
    clause5Text,
    clause6Text,
    clause7Text,
    clause8Text,
    clause9Text,
    clause10Text,
    clause12Text,
    clause13Text,
    lines,
  }), [
    basisText, clause1Text, clause10Text, clause12Text, clause13Text, clause2Text, clause3Text, clause4Text, clause5Text, clause6Text, clause7Text, clause8Text, clause9Text,
    companyBankAccount, companyBankName, companyPosition, companyRepresentative, contractNumber, contractValue, customerAddress,
    customerEmail, customerName, customerPhone, customerPosition, customerRepresentative, customerTaxCode, depositAmount, depositPercent,
    eventDate, eventLocation, extraTerms, introText, lines, paymentTerms, props, remainingAmount, serviceName, serviceScope, signingDate,
    signingPlace, subtotal, vatPercent, vatValue,
  ]);

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
      await Promise.all(images.map((image) => new Promise<void>((resolve) => {
        if (image.complete) {
          resolve();
          return;
        }
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      })));
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
      const canvas = await html2canvas(wrapper, { backgroundColor: "#ffffff", scale: 2, useCORS: true });
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
      pdf.save(`${contractNumber || "hop-dong"}.pdf`);
    } catch (error) {
      console.error("Contract PDF export failed:", error);
      setExportError("Không thể tạo PDF. Hãy thử lại hoặc dùng nút In trình duyệt.");
    } finally {
      document.body.removeChild(wrapper);
      setIsExporting(false);
    }
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 print:hidden">
        <h2 className="text-2xl font-semibold">Thiết lập hợp đồng</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Mẫu hợp đồng dịch vụ được bố cục theo file mẫu. Tất cả hạng mục, dòng dịch vụ và điều khoản chính đều sửa trực tiếp được trong form này.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block"><span className="mb-2 block text-sm text-white/70">Số hợp đồng</span><input value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Ngày ký</span><input type="date" value={signingDate} onChange={(e) => setSigningDate(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm text-white/70">Địa điểm ký</span><input value={signingPlace} onChange={(e) => setSigningPlace(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">Bên B - Công ty mình</div>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Người đại diện</span><input value={companyRepresentative} onChange={(e) => setCompanyRepresentative(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Chức vụ</span><input value={companyPosition} onChange={(e) => setCompanyPosition(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Ngân hàng</span><input value={companyBankName} onChange={(e) => setCompanyBankName(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Số tài khoản</span><input value={companyBankAccount} onChange={(e) => setCompanyBankAccount(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">Bên A - Khách hàng</div>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Tên công ty / cá nhân</span><input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Người đại diện</span><input value={customerRepresentative} onChange={(e) => setCustomerRepresentative(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Chức vụ</span><input value={customerPosition} onChange={(e) => setCustomerPosition(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block"><span className="mb-2 block text-sm text-white/70">Mã số thuế</span><input value={customerTaxCode} onChange={(e) => setCustomerTaxCode(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
              <label className="block"><span className="mb-2 block text-sm text-white/70">Số điện thoại</span><input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            </div>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Email</span><input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Địa chỉ</span><textarea rows={3} value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">Nội dung hợp đồng</div>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Tên dịch vụ / sự kiện</span><input value={serviceName} onChange={(e) => setServiceName(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Phạm vi thực hiện</span><textarea rows={5} value={serviceScope} onChange={(e) => setServiceScope(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block"><span className="mb-2 block text-sm text-white/70">Ngày tổ chức</span><input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="block"><span className="mb-2 block text-sm text-white/70">Địa điểm</span><input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">Bảng nội dung công việc</div>
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

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="block"><span className="mb-2 block text-sm text-white/70">VAT (%)</span><input type="number" min={0} max={100} value={vatPercent} onChange={(e) => setVatPercent(Number(e.target.value) || 0)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Đặt cọc (%)</span><input type="number" min={0} max={100} value={depositPercent} onChange={(e) => setDepositPercent(Number(e.target.value) || 0)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
        </div>
        <div className="mt-4">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Tiền đặt cọc (tùy chỉnh)</span>
            <input
              type="number"
              min={0}
              value={depositAmountOverride}
              onChange={(e) => setDepositAmountOverride(e.target.value)}
              placeholder="Để trống nếu muốn tự tính theo %"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
            <span className="mt-2 block text-xs text-white/45">
              Nếu nhập số tiền ở đây, hợp đồng sẽ ưu tiên số cọc này thay vì tự tính theo phần trăm.
            </span>
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">Thành tiền: <span className="font-semibold text-white">{formatCurrency(subtotal)}</span></div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">Tiền VAT: <span className="font-semibold text-white">{formatCurrency(vatValue)}</span></div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">Đặt cọc tạm tính: <span className="font-semibold text-white">{formatCurrency(depositAmount)}</span></div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">Còn lại tạm tính: <span className="font-semibold text-white">{formatCurrency(remainingAmount)}</span></div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">Điều khoản hợp đồng</div>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Căn cứ hợp đồng</span><textarea rows={4} value={basisText} onChange={(e) => setBasisText(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Đoạn mở đầu</span><textarea rows={2} value={introText} onChange={(e) => setIntroText(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 1 - Nội dung dịch vụ</span><textarea rows={3} value={clause1Text} onChange={(e) => setClause1Text(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 2 - Thời gian và địa điểm</span><textarea rows={3} value={clause2Text} onChange={(e) => setClause2Text(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 3 - Giá trị hợp đồng</span><textarea rows={3} value={clause3Text} onChange={(e) => setClause3Text(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 4 - Tiến độ và phương thức thanh toán</span><textarea rows={3} value={clause4Text} onChange={(e) => setClause4Text(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều kiện thanh toán</span><textarea rows={4} value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 5 - Quyền và nghĩa vụ của Bên A</span><textarea rows={4} value={clause5Text} onChange={(e) => setClause5Text(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 6 - Quyền và nghĩa vụ của Bên B</span><textarea rows={4} value={clause6Text} onChange={(e) => setClause6Text(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 7 - Nghiệm thu và bàn giao</span><textarea rows={4} value={clause7Text} onChange={(e) => setClause7Text(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 8 - Bảo mật thông tin</span><textarea rows={3} value={clause8Text} onChange={(e) => setClause8Text(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 9 - Bất khả kháng</span><textarea rows={4} value={clause9Text} onChange={(e) => setClause9Text(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 10 - Tạm ngừng / chấm dứt</span><textarea rows={4} value={clause10Text} onChange={(e) => setClause10Text(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 11 - Điều khoản bổ sung</span><textarea rows={4} value={extraTerms} onChange={(e) => setExtraTerms(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 12 - Giải quyết tranh chấp</span><textarea rows={4} value={clause12Text} onChange={(e) => setClause12Text(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
          <label className="block"><span className="mb-2 block text-sm text-white/70">Điều 13 - Hiệu lực hợp đồng</span><textarea rows={4} value={clause13Text} onChange={(e) => setClause13Text(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400" /></label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" onClick={exportPdf} disabled={isExporting} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" />{isExporting ? "Đang tạo PDF..." : "Tải PDF"}</button>
          <button type="button" onClick={goToLiquidation} className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 px-5 py-3 font-semibold text-yellow-300 transition hover:bg-yellow-400/10">Tạo thanh lý</button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:brightness-105"><Printer className="h-4 w-4" />In trình duyệt</button>
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
