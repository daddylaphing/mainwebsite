/**
 * Test script — sends a test email via Resend
 * Usage: node scripts/test-email.mjs your@email.com
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");

// Load .env.local
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  if (key) process.env[key] = val;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";
const to = process.argv[2] || process.env.EMAIL_TO || "laphingdaddy@gmail.com";

if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY not found in .env.local");
  process.exit(1);
}

console.log(`\nSending test email via Resend`);
console.log(`  From: Laphing Daddy <${EMAIL_FROM}>`);
console.log(`  To:   ${to}`);
console.log(`  Key:  ${RESEND_API_KEY.slice(0, 10)}...`);

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${RESEND_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: `Laphing Daddy <${EMAIL_FROM}>`,
    to: [to],
    subject: "Resend Test — Laphing Daddy",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#FAFAF8;border:1px solid #E6DFD5;">
        <h2 style="color:#1A1A1A;margin:0 0 16px;">Laphing <span style="color:#D4A843;font-style:italic;">Daddy</span></h2>
        <p style="color:#4A4540;margin:0 0 12px;">Test email sent at <strong>${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</strong>.</p>
        <p style="color:#4A4540;margin:0;">Resend is working correctly from <code>${EMAIL_FROM}</code>.</p>
      </div>
    `,
  }),
});

const data = await res.json();

if (!res.ok) {
  console.error("\nFailed:", JSON.stringify(data, null, 2));
  process.exit(1);
}

console.log(`\nEmail sent! ID: ${data.id}`);
console.log(`Check: https://resend.com/emails\n`);
