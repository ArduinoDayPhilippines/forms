import { readFile } from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";

export type OrderItemRecord = {
  name?: string | null;
  size?: string | null;
  quantity?: number | null;
  unit_price?: number | null;
  unitPrice?: number | null;
  line_total?: number | null;
  lineTotal?: number | null;
};

export type OrderEmailRecord = {
  id: string;
  email: string;
  full_name: string | null;
  items: OrderItemRecord[] | null;
  status: string;
};

const buildItemsSummary = (items: OrderItemRecord[] | null) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "No items";
  }

  const summary = items
    .map((item) => {
      const name = String(item?.name ?? "").trim();
      const size = String(item?.size ?? "").trim();
      const qty = Number(item?.quantity ?? 0);
      if (!name || !size || !Number.isFinite(qty) || qty <= 0) {
        return null;
      }
      return `${name} (${size}) x${qty}`;
    })
    .filter(Boolean)
    .join(" · ");

  return summary || "No items";
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildItemsListHtml = (items: OrderItemRecord[] | null) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "<li>No items</li>";
  }

  const listItems = items
    .map((item) => {
      const name = String(item?.name ?? "").trim();
      const size = String(item?.size ?? "").trim();
      const qty = Number(item?.quantity ?? 0);
      if (!name || !size || !Number.isFinite(qty) || qty <= 0) {
        return null;
      }
      const text = `${name} (${size}) x${qty}`;
      return `<li>${escapeHtml(text)}</li>`;
    })
    .filter(Boolean)
    .join("");

  return listItems || "<li>No items</li>";
};

const getStatusTemplateFilename = (status: string) => {
  const statusKey = status.trim().toLowerCase();
  switch (statusKey) {
    case "confirmed":
      return "adph_confirmed.html";
    case "ready":
      return "adph_ready.html";
    case "shipped":
      return "adph_shipped.html";
    case "delivered":
      return "adph_delivered.html";
    case "cancelled":
      return "adph_cancelled.html";
    case "pending":
    default:
      return "adph.html";
  }
};

const loadEmailTemplate = async (status: string) => {
  const templatePath = path.join(
    process.cwd(),
    "public",
    getStatusTemplateFilename(status),
  );
  return readFile(templatePath, "utf8");
};

const loadTrackingTemplate = async () => {
  const templatePath = path.join(
    process.cwd(),
    "public",
    "adph_trackingid.html",
  );
  return readFile(templatePath, "utf8");
};

export const sendOrderStatusEmail = async ({
  order,
  status,
  includeStatusLine = true,
  fulfillmentNote,
}: {
  order: OrderEmailRecord;
  status: string;
  includeStatusLine?: boolean;
  fulfillmentNote?: string;
}) => {
  const senderEmail = process.env.ARDUINODAYPH_SENDER_EMAIL;
  const senderPassword = process.env.ARDUINODAYPH_SENDER_PASSWORD;
  const senderName =
    process.env.ARDUINODAYPH_SENDER_NAME ?? "Arduino Day Philippines";

  if (!senderEmail || !senderPassword) {
    return { ok: false, error: "Missing SMTP sender credentials." };
  }

  const smtpHost = process.env.ARDUINODAYPH_SMTP_HOST ?? "smtp.gmail.com";
  const smtpPort = Number(process.env.ARDUINODAYPH_SMTP_PORT ?? 465);
  const smtpSecure =
    (process.env.ARDUINODAYPH_SMTP_SECURE ?? "true").toLowerCase() ===
    "true";

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });

  const itemsSummary = buildItemsSummary(order.items);
  const statusLabel = status.toUpperCase();
  const statusMessages: Record<
    string,
    { introLine: string; detailLine?: string }
  > = {
    pending: {
      introLine:
        "We are delighted to confirm that your Arduino Day Official Merchandise order has been successfully placed.",
      detailLine: "Our team is currently preparing your items with the utmost care.",
    },
    confirmed: {
      introLine:
        "Your Arduino Day Official Merchandise order is confirmed and in our system.",
      detailLine: "We are now preparing everything for fulfillment.",
    },
    ready: {
      introLine:
        "Good news! Your Arduino Day Official Merchandise order is ready.",
      detailLine:
        "If you selected pickup, you can now collect it. If delivery is needed, we will send shipping details once dispatched.",
    },
    shipped: {
      introLine:
        "Your Arduino Day Official Merchandise order has been shipped and is on its way.",
      detailLine:
        "We will share tracking details if available. Delivery times may vary by location.",
    },
    delivered: {
      introLine:
        "Your Arduino Day Official Merchandise order has been delivered.",
      detailLine:
        "We hope you enjoy your items. If anything is missing or incorrect, please reply to this email so we can help.",
    },
    cancelled: {
      introLine: "Your Arduino Day Official Merchandise order has been cancelled.",
      detailLine:
        "If this was unexpected or you need help, please reply to this email and we will assist you.",
    },
  };
  const statusKey = status.trim().toLowerCase();
  const statusMessage = statusMessages[statusKey] ?? statusMessages.pending;
  const textLines = [statusMessage.introLine];
  if (statusMessage.detailLine) {
    textLines.push("", statusMessage.detailLine);
  }
  textLines.push(
    "",
    `Order Reference: ${order.id}`,
    `Items: ${itemsSummary}`,
  );
  if (includeStatusLine) {
    textLines.push(`Status: ${statusLabel}`);
  }
  if (fulfillmentNote) {
    textLines.push("", fulfillmentNote);
  }
  const textBody = textLines.join("\n");
  const template = await loadEmailTemplate(status);
  const statusBlock = includeStatusLine
    ? `
      <div
        style="
          margin-top: 14px;
          padding: 10px 12px;
          border-radius: 10px;
          background: #e6f4f2;
          border: 1px solid #c9e7e2;
        "
      >
        <span style="font-size: 12px; color: #285e5a; letter-spacing: 0.6px;">
          STATUS
        </span>
        <div
          style="
            margin-top: 4px;
            font-size: 14px;
            font-weight: 700;
            color: #003333;
            letter-spacing: 1px;
          "
        >
          ${escapeHtml(statusLabel)}
        </div>
      </div>
    `
    : "";
  const fulfillmentBlock = fulfillmentNote
    ? `
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="
          border-collapse: collapse;
          margin: 0 0 24px 0;
          border: 1px solid #e7eceb;
          border-radius: 12px;
          overflow: hidden;
          background: #fdf7ef;
        "
      >
        <tr>
          <td
            style="
              padding: 14px 16px;
              font-family: &quot;IBM Plex Sans&quot;, sans-serif;
              color: #6a4a1f;
              font-size: 14px;
              line-height: 1.7;
            "
          >
            ${escapeHtml(fulfillmentNote)}
          </td>
        </tr>
      </table>
    `
    : "";
  const htmlBody = template
    .replace("{recipient}", escapeHtml(order.full_name ?? "Customer"))
    .replace("{order_id}", escapeHtml(order.id))
    .replace("{order_items}", escapeHtml(itemsSummary))
    .replace("{status_block}", statusBlock)
    .replace("{fulfillment_note}", fulfillmentBlock);

  await transporter.sendMail({
    from: `${senderName} <${senderEmail}>`,
    to: order.email,
    subject: `Order ${order.id} status update`,
    text: textBody,
    html: htmlBody,
  });

  return { ok: true };
};

export const sendTrackingIdEmail = async ({
  order,
  trackingId,
}: {
  order: OrderEmailRecord;
  trackingId: string;
}) => {
  const senderEmail = process.env.ARDUINODAYPH_SENDER_EMAIL;
  const senderPassword = process.env.ARDUINODAYPH_SENDER_PASSWORD;
  const senderName =
    process.env.ARDUINODAYPH_SENDER_NAME ?? "Arduino Day Philippines";

  if (!senderEmail || !senderPassword) {
    return { ok: false, error: "Missing SMTP sender credentials." };
  }

  const smtpHost = process.env.ARDUINODAYPH_SMTP_HOST ?? "smtp.gmail.com";
  const smtpPort = Number(process.env.ARDUINODAYPH_SMTP_PORT ?? 465);
  const smtpSecure =
    (process.env.ARDUINODAYPH_SMTP_SECURE ?? "true").toLowerCase() ===
    "true";

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });

  const itemsSummary = buildItemsSummary(order.items);
  const trackingLabel = trackingId.trim();
  const textLines = [
    "Your delivery order is on the way.",
    "",
    `Order Reference: ${order.id}`,
    `Items: ${itemsSummary}`,
    `Tracking ID: ${trackingLabel}`,
  ];
  const textBody = textLines.join("\n");
  const template = await loadTrackingTemplate();
  const htmlBody = template
    .replace("{recipient}", escapeHtml(order.full_name ?? "Customer"))
    .replace("{order_id}", escapeHtml(order.id))
    .replace("{order_items}", escapeHtml(itemsSummary))
    .replace("{tracking_id}", escapeHtml(trackingLabel))
    .replace("{status_block}", "")
    .replace("{fulfillment_note}", "");

  await transporter.sendMail({
    from: `${senderName} <${senderEmail}>`,
    to: order.email,
    subject: `Tracking ID for order ${order.id}`,
    text: textBody,
    html: htmlBody,
  });

  return { ok: true };
};
