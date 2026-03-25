export const runtime = "nodejs";

import * as nodemailer from "nodemailer";

import { trackLeadEvent } from "@/lib/analytics-store";
import { saveLead } from "@/lib/lead-store";
import { getSiteSettings } from "@/lib/site-settings";

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
  eventType?: string;
  date?: string;
  location?: string;
  guests?: string;
  budget?: string;
  message?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;

    const name = (body.name || "").trim();
    const phone = (body.phone || "").trim();
    const email = (body.email || "").trim();
    const eventType = (body.eventType || "").trim();
    const date = (body.date || "").trim();
    const location = (body.location || "").trim();
    const guests = (body.guests || "").trim();
    const budget = (body.budget || "").trim();
    const message = (body.message || "").trim();

    if (!name || !phone || !eventType) {
      return new Response(
        JSON.stringify({ ok: false, error: "Thiếu thông tin bắt buộc." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    const settings = await getSiteSettings();

    await saveLead({
      name,
      phone,
      email,
      eventType,
      date,
      location,
      guests,
      budget,
      message,
    });

    await trackLeadEvent();

    if (!user || !pass) {
      return new Response(
        JSON.stringify({ ok: false, error: "Thiếu cấu hình email server." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const subject = `Liên hệ mới: ${eventType} - ${name} (${phone})`;

    const text = [
      "Bạn có yêu cầu liên hệ mới từ website:",
      "",
      `Họ tên: ${name}`,
      `SĐT: ${phone}`,
      `Email: ${email || "(không có)"}`,
      `Loại sự kiện: ${eventType}`,
      `Thời gian dự kiến: ${date || "(không có)"}`,
      `Địa điểm: ${location || "(không có)"}`,
      `Số lượng khách: ${guests || "(không có)"}`,
      `Ngân sách dự kiến: ${budget || "(không có)"}`,
      "",
      "Nội dung:",
      message || "(không có)",
      "",
      `Thời gian gửi: ${new Date().toLocaleString("vi-VN")}`,
    ].join("\n");

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 10px">Yêu cầu liên hệ mới</h2>
        <table cellpadding="6" style="border-collapse:collapse">
          <tr><td><b>Họ tên</b></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><b>SĐT</b></td><td>${escapeHtml(phone)}</td></tr>
          <tr><td><b>Email</b></td><td>${escapeHtml(email || "(không có)")}</td></tr>
          <tr><td><b>Loại sự kiện</b></td><td>${escapeHtml(eventType)}</td></tr>
          <tr><td><b>Thời gian dự kiến</b></td><td>${escapeHtml(date || "(không có)")}</td></tr>
          <tr><td><b>Địa điểm</b></td><td>${escapeHtml(location || "(không có)")}</td></tr>
          <tr><td><b>Số lượng khách</b></td><td>${escapeHtml(guests || "(không có)")}</td></tr>
          <tr><td><b>Ngân sách dự kiến</b></td><td>${escapeHtml(budget || "(không có)")}</td></tr>
        </table>
        <p><b>Nội dung:</b></p>
        <div style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:10px">
          ${escapeHtml(message || "(không có)")}
        </div>
        <p style="color:#666;font-size:12px;margin-top:14px">
          Thời gian gửi: ${new Date().toLocaleString("vi-VN")}
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${settings.siteName} Website" <${user}>`,
      to: settings.contactEmail,
      replyTo: email || undefined,
      subject,
      text,
      html,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Lỗi server khi gửi email." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
