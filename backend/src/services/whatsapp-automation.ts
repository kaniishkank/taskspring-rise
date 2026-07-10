import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
import fs from 'fs';
import path from 'path';
const { Client, LocalAuth } = pkg;

let whatsappClient: any = null;
let isReady = false;

export function initWhatsAppAutomation() {
  console.log('[WhatsApp Automation] Initializing client...');
  
  whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-extensions',
        '--use-gl=desktop'
      ]
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  whatsappClient.on('qr', (qr: string) => {
    console.log('\n=========================================');
    console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP');
    console.log('=========================================\n');
    qrcode.generate(qr, { small: true });

    // HTML fallback output
    const htmlContent = `
      <html>
        <body style="display:flex; justify-content:center; align-items:center; height:100vh; background:#111;">
          <div style="background:white; padding:20px; border-radius:8px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}" />
            <p style="font-family:sans-serif; text-align:center; margin-top:10px; color:#333; font-weight:bold;">Scan to link TaskFlow</p>
          </div>
        </body>
      </html>
    `;
    const backupPath = path.resolve(process.cwd(), '../whatsapp-qr.html');
    fs.writeFileSync(backupPath, htmlContent);
    console.log(`\n👉 Backup QR Code saved! Open '${backupPath}' directly in your browser to scan.\n`);
  });

  whatsappClient.on('ready', () => {
    isReady = true;
    console.log('[WhatsApp Automation] Client is READY and linked!');
  });

  whatsappClient.on('auth_failure', (msg: string) => {
    console.error('[WhatsApp Automation] Authentication failed:', msg);
  });

  whatsappClient.initialize().catch((err: any) => {
    console.error('[WhatsApp Automation] Failed to initialize:', err);
  });
}

/**
 * Sends a free-form WhatsApp message using the linked phone via puppeteer automation.
 */
export async function sendWhatsAppAutomationMessage(to: string, message: string) {
  if (!whatsappClient || !isReady) {
    console.warn('[WhatsApp Automation] Client not ready. Cannot send message to', to);
    return false;
  }

  // Format to standard international number without +
  const formattedTo = to.replace(/\D/g, '');
  if (!formattedTo) return false;

  try {
    // whatsapp-web.js requires the @c.us suffix for regular contacts
    const chatId = `${formattedTo}@c.us`;
    await whatsappClient.sendMessage(chatId, message);
    console.log(`[WhatsApp Automation] Successfully sent message to ${formattedTo}`);
    return true;
  } catch (error) {
    console.error('[WhatsApp Automation] Failed to send message:', error);
    return false;
  }
}
