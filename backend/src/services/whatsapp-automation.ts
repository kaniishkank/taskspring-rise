import qrcode from 'qrcode-terminal';
import qrcodeBase64 from 'qrcode';
import pkg from 'whatsapp-web.js';
import fs from 'fs';
import path from 'path';
const { Client, LocalAuth } = pkg;

let whatsappClient: any = null;
let isReady = false;
let latestQRBase64: string | null = null;

export function getWhatsAppStatus() {
  return {
    isReady,
    qrBase64: latestQRBase64
  };
}

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

  whatsappClient.on('qr', async (qr: string) => {
    console.log('\n=========================================');
    console.log('📱 SCAN THIS QR CODE IN WHATSAPP TO LINK');
    console.log('=========================================\n');
    qrcode.generate(qr, { small: true });
    
    try {
      latestQRBase64 = await qrcodeBase64.toDataURL(qr);
    } catch (e) {
      console.error('Failed to generate base64 QR', e);
    }
    console.log('\n👉 QR Code printed to terminal! Scan it with your phone.');
  });

  whatsappClient.on('ready', () => {
    isReady = true;
    latestQRBase64 = null;
    console.log('[WhatsApp Automation] Client is READY and linked!');
  });

  whatsappClient.on('disconnected', () => {
    isReady = false;
    latestQRBase64 = null;
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
 * Retries up to 3 times with a 3-second delay if the client is not yet ready
 * or if the WhatsApp Web execution context is refreshing mid-send.
 */
export async function sendWhatsAppAutomationMessage(to: string, message: string, attempt = 1): Promise<boolean> {
  const MAX_ATTEMPTS = 3;
  const RETRY_DELAY_MS = 3000;

  // Format to standard international number without +
  const formattedTo = to.replace(/\D/g, '');
  if (!formattedTo) return false;

  // If client is not ready yet, wait and retry
  if (!whatsappClient || !isReady) {
    if (attempt >= MAX_ATTEMPTS) {
      console.warn(`[WhatsApp Automation] Client not ready after ${MAX_ATTEMPTS} attempts. Giving up on message to ${formattedTo}.`);
      return false;
    }
    console.warn(`[WhatsApp Automation] Client not ready (attempt ${attempt}/${MAX_ATTEMPTS}). Retrying in ${RETRY_DELAY_MS / 1000}s...`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    return sendWhatsAppAutomationMessage(to, message, attempt + 1);
  }

  try {
    // whatsapp-web.js requires the @c.us suffix for regular contacts
    const chatId = `${formattedTo}@c.us`;
    await whatsappClient.sendMessage(chatId, message);
    console.log(`[WhatsApp Automation] ✅ Successfully sent message to ${formattedTo}`);
    return true;
  } catch (error: any) {
    // "Execution context was destroyed" means WhatsApp Web refreshed mid-send. Retry.
    const isRetryable = error?.message?.includes('Execution context was destroyed') ||
                        error?.message?.includes('getChat') ||
                        error?.message?.includes('detached');

    if (isRetryable && attempt < MAX_ATTEMPTS) {
      console.warn(`[WhatsApp Automation] Send failed due to page refresh (attempt ${attempt}/${MAX_ATTEMPTS}). Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return sendWhatsAppAutomationMessage(to, message, attempt + 1);
    }

    console.error(`[WhatsApp Automation] Failed to send message after ${attempt} attempt(s):`, error?.message ?? error);
    return false;
  }
}
