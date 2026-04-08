"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Printer, Trash2 } from "lucide-react";

import type { EmployeeRecord } from "@/lib/hrm-store";

type Props = { employee: EmployeeRecord };
type Item = { id: string; name: string; unit: string; quantity: string; unitPrice: string; note: string };

const inputClass =
  "h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-yellow-400/50";
const textareaClass =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400/50";

const createItem = (id: number): Item => ({
  id: `item-${id}`,
  name: "",
  unit: "Gói",
  quantity: "1",
  unitPrice: "",
  note: "",
});

const toNumber = (value: string) => {
  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatMoney = (value: number) => new Intl.NumberFormat("vi-VN").format(value);
const formatDateText = (value: string) => {
  if (!value) return "..... tháng ..... năm ........";
  const [year, month, day] = value.split("-");
  return day && month && year ? `ngày ${day} tháng ${month} năm ${year}` : value;
};
const lines = (text: string) => text.split("\n").filter(Boolean);

export function HrmPieceworkContractBuilder({ employee }: Props) {
  const [contractCode, setContractCode] = useState(`0201262/HDKV/${new Date().getFullYear()}`);
  const [signDate, setSignDate] = useState(new Date().toISOString().slice(0, 10));
  const [signPlace, setSignPlace] = useState("Đồng Nai");
  const [isExporting] = useState(false);
  const [exportError] = useState("");
  const [basisOne, setBasisOne] = useState(
    "Căn cứ Bộ luật Dân sự số 91/2015/QH13 được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam thông qua ngày 24 tháng 11 năm 2015 có hiệu lực từ ngày 01 tháng 01 năm 2017.",
  );
  const [basisTwo, setBasisTwo] = useState("Căn cứ nhu cầu của hai bên.");
  const [companyRepresentative, setCompanyRepresentative] = useState("Ông NGUYỄN TRỌNG THÁI");
  const [companyRepresentativeTitle, setCompanyRepresentativeTitle] = useState("Giám đốc");
  const [companyAddress, setCompanyAddress] = useState("Tổ 7, Ấp 4, Xã Long Thành, Tỉnh Đồng Nai, Việt Nam.");
  const [companyPhone, setCompanyPhone] = useState("090 984 43 03");
  const [companyTaxCode, setCompanyTaxCode] = useState("3603940143");
  const [employeeRepresentative, setEmployeeRepresentative] = useState(employee.fullName || "");
  const [employeeTitle, setEmployeeTitle] = useState(employee.position || "");
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [employeePhone, setEmployeePhone] = useState(employee.phone || "");
  const [employeeCitizenId, setEmployeeCitizenId] = useState(employee.citizenId || "");
  const [workSummary, setWorkSummary] = useState("Bên A thuê Bên B gói chụp hình tổ chức sự kiện.");
  const [workLocation, setWorkLocation] = useState("Địa điểm thực hiện: KCN Nhơn Trạch 1, Xã Nhơn Trạch, Đồng Nai.");
  const [workTime, setWorkTime] = useState("Thời gian thực hiện: ngày 31/01/2026 bắt đầu từ 8 giờ sáng.");
  const [workType, setWorkType] = useState("Loại hợp đồng: Trọn gói.");
  const [completionRule, setCompletionRule] = useState("Thời gian kết thúc hợp đồng: khi Bên B hoàn thành công việc quay chụp và trả hình ảnh đã xử lý cho Bên A.");
  const [paymentMethod, setPaymentMethod] = useState("Phương thức thanh toán: Thanh toán 100% giá trị hợp đồng bằng chuyển khoản.");
  const [beneficiaryName, setBeneficiaryName] = useState("Tên đơn vị thụ hưởng:");
  const [bankAccount, setBankAccount] = useState("Số tài khoản:");
  const [paymentDeadline, setPaymentDeadline] = useState("Thời hạn thanh toán: Sau khi Bên B hoàn thành xong công việc đã cam kết.");
  const [partyAResponsibility, setPartyAResponsibility] = useState("- Cung cấp nội dung, thời gian, địa điểm diễn ra sự kiện.\n- Phối hợp với Bên B hoàn thành công việc đã ký kết.\n- Thanh toán chi phí thực hiện cho Bên B theo Điều 2 của hợp đồng này.");
  const [partyBResponsibility, setPartyBResponsibility] = useState("- Phối hợp với Bên A hoàn thành công việc đã ký kết.\n- Bảo mật thông tin cho Bên A và hoàn thành hình ảnh đúng theo thỏa thuận.\n- Nhận chi phí dịch vụ từ Bên A theo Điều 2 của hợp đồng này.");
  const [generalTerms, setGeneralTerms] = useState("Trong quá trình thực hiện hợp đồng nếu có phát sinh, hai bên phải kịp thời thông báo cho nhau và cùng bàn bạc để giải quyết trên tinh thần hợp tác, cùng có lợi.\nHai bên cam kết thực hiện tất cả các điều khoản đã ghi trong hợp đồng này. Mọi sự thay đổi, bổ sung hợp đồng phải được lập thành văn bản và có chữ ký của đại diện hai bên.");
  const [items, setItems] = useState<Item[]>([{ id: "item-1", name: "Gói chụp hình tổ chức sự kiện", unit: "Gói", quantity: "1", unitPrice: "7000000", note: "" }]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + toNumber(item.quantity) * toNumber(item.unitPrice), 0), [items]);
  const addItem = () => setItems((current) => [...current, createItem(current.length + 1)]);
  const updateItem = (id: string, key: keyof Item, value: string) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  const removeItem = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  async function exportPdf() {
    window.print();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[520px_minmax(0,1fr)] print:block">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 print:hidden">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-yellow-300/80">Mẫu hợp đồng</p>
          <h2 className="text-2xl font-semibold text-white">Hợp đồng khoán việc</h2>
        </div>

        <div className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-white/70"><span>Số hợp đồng</span><input value={contractCode} onChange={(e) => setContractCode(e.target.value)} className={inputClass} /></label>
            <label className="space-y-2 text-sm text-white/70"><span>Ngày ký</span><input type="date" value={signDate} onChange={(e) => setSignDate(e.target.value)} className={inputClass} /></label>
          </div>
          <label className="space-y-2 text-sm text-white/70"><span>Nơi ký hợp đồng</span><input value={signPlace} onChange={(e) => setSignPlace(e.target.value)} className={inputClass} /></label>
          <textarea value={basisOne} onChange={(e) => setBasisOne(e.target.value)} rows={3} className={textareaClass} />
          <textarea value={basisTwo} onChange={(e) => setBasisTwo(e.target.value)} rows={2} className={textareaClass} />
          <div className="grid gap-3 md:grid-cols-2">
            <input value={companyRepresentative} onChange={(e) => setCompanyRepresentative(e.target.value)} placeholder="Người đại diện bên A" className={inputClass} />
            <input value={companyRepresentativeTitle} onChange={(e) => setCompanyRepresentativeTitle(e.target.value)} placeholder="Chức vụ bên A" className={inputClass} />
            <input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="Điện thoại bên A" className={inputClass} />
            <input value={companyTaxCode} onChange={(e) => setCompanyTaxCode(e.target.value)} placeholder="Mã số thuế bên A" className={inputClass} />
          </div>
          <textarea value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} rows={2} className={textareaClass} />
          <div className="grid gap-3 md:grid-cols-2">
            <input value={employeeRepresentative} onChange={(e) => setEmployeeRepresentative(e.target.value)} placeholder="Người đại diện bên B" className={inputClass} />
            <input value={employeeTitle} onChange={(e) => setEmployeeTitle(e.target.value)} placeholder="Chức vụ bên B" className={inputClass} />
            <input value={employeePhone} onChange={(e) => setEmployeePhone(e.target.value)} placeholder="Điện thoại bên B" className={inputClass} />
            <input value={employeeCitizenId} onChange={(e) => setEmployeeCitizenId(e.target.value)} placeholder="CCCD" className={inputClass} />
          </div>
          <textarea value={employeeAddress} onChange={(e) => setEmployeeAddress(e.target.value)} rows={2} placeholder="Địa chỉ bên B" className={textareaClass} />
          <textarea value={workSummary} onChange={(e) => setWorkSummary(e.target.value)} rows={2} className={textareaClass} />
          <textarea value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} rows={2} className={textareaClass} />
          <textarea value={workTime} onChange={(e) => setWorkTime(e.target.value)} rows={2} className={textareaClass} />
          <textarea value={workType} onChange={(e) => setWorkType(e.target.value)} rows={2} className={textareaClass} />
          <textarea value={completionRule} onChange={(e) => setCompletionRule(e.target.value)} rows={3} className={textareaClass} />

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">Hạng mục {index + 1}</p>
                  {items.length > 1 ? <button type="button" onClick={() => removeItem(item.id)} className="inline-flex h-9 items-center justify-center rounded-full border border-red-500/30 px-3 text-xs font-medium text-red-300 transition hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button> : null}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} placeholder="Tên dịch vụ" className={inputClass} />
                  <input value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)} placeholder="ĐVT" className={inputClass} />
                  <input value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", e.target.value)} placeholder="SL" className={inputClass} />
                  <input value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)} placeholder="Đơn giá" className={inputClass} />
                </div>
                <textarea value={item.note} onChange={(e) => updateItem(item.id, "note", e.target.value)} rows={2} placeholder="Ghi chú" className={`mt-3 ${textareaClass}`} />
              </div>
            ))}
            <button type="button" onClick={addItem} className="inline-flex h-10 items-center justify-center rounded-full bg-yellow-400 px-4 text-sm font-semibold text-black transition hover:bg-yellow-300"><Plus className="mr-2 h-4 w-4" />Thêm hạng mục</button>
          </div>

          <textarea value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} rows={2} className={textareaClass} />
          <input value={beneficiaryName} onChange={(e) => setBeneficiaryName(e.target.value)} className={inputClass} />
          <input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className={inputClass} />
          <textarea value={paymentDeadline} onChange={(e) => setPaymentDeadline(e.target.value)} rows={2} className={textareaClass} />
          <textarea value={partyAResponsibility} onChange={(e) => setPartyAResponsibility(e.target.value)} rows={5} className={textareaClass} />
          <textarea value={partyBResponsibility} onChange={(e) => setPartyBResponsibility(e.target.value)} rows={5} className={textareaClass} />
          <textarea value={generalTerms} onChange={(e) => setGeneralTerms(e.target.value)} rows={6} className={textareaClass} />

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={exportPdf} disabled={isExporting} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-yellow-400/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"><Download className="h-4 w-4" />Tải PDF</button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"><Printer className="h-4 w-4" />In hợp đồng</button>
          </div>

          {exportError ? <p className="text-sm text-red-300">{exportError}</p> : null}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white p-8 text-slate-900 shadow-[0_24px_120px_rgba(0,0,0,0.28)] print:rounded-none print:border-0 print:p-4 print:shadow-none">
        <div className="mx-auto max-w-4xl space-y-5 text-[14px] leading-7 print:max-w-none print:text-[13.5px] print:leading-6" style={{ fontFamily: '"Times New Roman", "DejaVu Serif", Georgia, serif' }}>
          <div className="text-center">
            <p className="text-[15px] font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="font-semibold">Độc lập - Tự do - Hạnh phúc</p>
            <p className="text-lg">-------------</p>
          </div>
          <div className="text-center">
            <h3 className="text-[30px] font-bold uppercase print:text-[24px]">Hợp đồng khoán việc</h3>
            <p className="mt-1 font-semibold">Số: {contractCode}</p>
          </div>
          <div className="space-y-1">
            <p>- {basisOne}</p>
            <p>- {basisTwo}</p>
            <p>Hôm nay, {formatDateText(signDate)} tại {signPlace} đại diện hai bên chúng tôi gồm có:</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold uppercase">Bên A: Công ty TNHH Tổ chức sự kiện Trọng Thái (Event)</p>
            <p><strong>Đại diện:</strong> {companyRepresentative}</p>
            <p><strong>Chức vụ:</strong> {companyRepresentativeTitle}</p>
            <p><strong>Địa chỉ:</strong> {companyAddress}</p>
            <p><strong>Điện thoại:</strong> {companyPhone}</p>
            <p><strong>Mã số thuế:</strong> {companyTaxCode}</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold uppercase">Bên B:</p>
            <p><strong>Người đại diện:</strong> {employeeRepresentative || "...................."}</p>
            <p><strong>Chức vụ:</strong> {employeeTitle || "...................."}</p>
            <p><strong>Địa chỉ:</strong> {employeeAddress || "...................."}</p>
            <p><strong>Điện thoại:</strong> {employeePhone || "...................."}</p>
            <p><strong>CCCD:</strong> {employeeCitizenId || "...................."}</p>
          </div>
          <p>Sau khi thỏa thuận, cả hai bên đã thống nhất ký kết hợp đồng với các nội dung và điều khoản cụ thể như sau:</p>
          <div className="space-y-2">
            <p className="font-bold uppercase">Điều 1: Nội dung hợp đồng</p>
            <p>- {workSummary}</p>
            <p>- {workLocation}</p>
            <p>- {workTime}</p>
            <p>- {workType}</p>
            <p>- {completionRule}</p>
          </div>
          <div className="overflow-hidden border border-slate-300">
            <table className="min-w-full border-collapse text-left text-[13px] print:text-[12.5px]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-300 px-2 py-2 text-center">STT</th>
                  <th className="border border-slate-300 px-2 py-2">TÊN DỊCH VỤ</th>
                  <th className="border border-slate-300 px-2 py-2 text-center">ĐVT</th>
                  <th className="border border-slate-300 px-2 py-2 text-center">SL</th>
                  <th className="border border-slate-300 px-2 py-2 text-right">ĐƠN GIÁ</th>
                  <th className="border border-slate-300 px-2 py-2 text-right">THÀNH TIỀN</th>
                  <th className="border border-slate-300 px-2 py-2">GHI CHÚ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const rowTotal = toNumber(item.quantity) * toNumber(item.unitPrice);
                  return (
                    <tr key={item.id}>
                      <td className="border border-slate-300 px-2 py-2 text-center">{index + 1}</td>
                      <td className="border border-slate-300 px-2 py-2">{item.name || "Chưa nhập"}</td>
                      <td className="border border-slate-300 px-2 py-2 text-center">{item.unit || "Gói"}</td>
                      <td className="border border-slate-300 px-2 py-2 text-center">{item.quantity || "0"}</td>
                      <td className="border border-slate-300 px-2 py-2 text-right">{formatMoney(toNumber(item.unitPrice))}</td>
                      <td className="border border-slate-300 px-2 py-2 text-right">{formatMoney(rowTotal)}</td>
                      <td className="border border-slate-300 px-2 py-2">{item.note || ""}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="border border-slate-300 px-2 py-2" />
                  <td colSpan={4} className="border border-slate-300 px-2 py-2 text-center font-semibold">Giá trị hợp đồng</td>
                  <td className="border border-slate-300 px-2 py-2 text-right font-semibold">{formatMoney(subtotal)}</td>
                  <td className="border border-slate-300 px-2 py-2" />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="space-y-2">
            <p className="font-bold uppercase">Điều 2: Giá trị hợp đồng và phương thức thanh toán</p>
            <p>- Giá trị hợp đồng: {formatMoney(subtotal)} đồng.</p>
            <p>- {paymentMethod}</p>
            <p>- {beneficiaryName}</p>
            <p>- {bankAccount}</p>
            <p>- {paymentDeadline}</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold uppercase">Điều 3: Quyền hạn và trách nhiệm của các bên</p>
            <div>
              <p className="font-semibold">3.1. Quyền và trách nhiệm của Bên A</p>
              {lines(partyAResponsibility).map((line, index) => <p key={`a-${index}`}>{line}</p>)}
            </div>
            <div>
              <p className="font-semibold">3.2. Quyền và trách nhiệm của Bên B</p>
              {lines(partyBResponsibility).map((line, index) => <p key={`b-${index}`}>{line}</p>)}
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-bold uppercase">Điều 4: Các điều khoản chung</p>
            {lines(generalTerms).map((line, index) => <p key={`g-${index}`}>- {line}</p>)}
          </div>
          <div
            className="grid gap-8 pt-10 text-center md:grid-cols-2 print:grid-cols-2"
            style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
          >
            <div>
              <p className="font-bold uppercase">Đại diện Bên A</p>
              <div className="h-20" />
              <p>(Ký, ghi rõ họ tên)</p>
            </div>
            <div>
              <p className="font-bold uppercase">Đại diện Bên B</p>
              <div className="h-20" />
              <p>(Ký, ghi rõ họ tên)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
