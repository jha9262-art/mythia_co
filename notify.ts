import type { ContactMessage } from "./types";
import type { Visitor } from "./types";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

async function sendTelegram(text: string): Promise<void> {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}

async function sendEmail(subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY || !NOTIFY_EMAIL) return;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: "Mythia & Co Website <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email notification failed:", err);
  }
}

export async function notifyNewVisitor(visitor: Visitor): Promise<void> {
  const time = new Date(visitor.createdAt).toLocaleString();
  await sendTelegram(
    `👀 New visitor on Mythia & Co\n\nPage: ${visitor.path}\nTime: ${time}\nIP: ${visitor.ip ?? "unknown"}\nReferrer: ${visitor.referrer ?? "direct"}`
  );
}

export async function notifyNewMessage(message: ContactMessage): Promise<void> {
  const time = new Date(message.createdAt).toLocaleString();
  await sendTelegram(
    `✉️ New contact form message\n\nFrom: ${message.name} <${message.email}>\nTime: ${time}\n\n${message.message}`
  );
  await sendEmail(
    `New message from ${message.name} — Mythia & Co`,
    `<h2>New contact form message</h2>
     <p><strong>From:</strong> ${escapeHtml(message.name)} &lt;${escapeHtml(message.email)}&gt;</p>
     <p><strong>Time:</strong> ${time}</p>
     <p><strong>Message:</strong></p>
     <p>${escapeHtml(message.message).replace(/\n/g, "<br>")}</p>`
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
