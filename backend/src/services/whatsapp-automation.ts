import qrcode from 'qrcode-terminal';
import qrcodeBase64 from 'qrcode';
import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';

let whatsappClient: ReturnType<typeof makeWASocket> | null = null;
let isReady = false;
let latestQRBase64: string | null = null;

export function getWhatsAppStatus() {
  return {
    isReady,
    qrBase64: latestQRBase64
  };
}

export async function initWhatsAppAutomation() {
  console.log('[WhatsApp Automation] Initializing Baileys client...');
  
  const { state, saveCreds } = await useMultiFileAuthState('.baileys_auth');
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`[WhatsApp Automation] using WA v${version.join('.')}, isLatest: ${isLatest}`);

  whatsappClient = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false, // We'll handle QR generation ourselves to match the old format
    logger: pino({ level: 'silent' }), // Suppress verbose logging from Baileys
    browser: ['TaskSpring', 'Chrome', '1.0.0']
  });

  whatsappClient.ev.on('creds.update', saveCreds);

  whatsappClient.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
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
    }

    if (connection === 'close') {
      isReady = false;
      const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('[WhatsApp Automation] Connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect);
      
      if (shouldReconnect) {
        initWhatsAppAutomation();
      } else {
        console.log('[WhatsApp Automation] Logged out. Deleting session...');
        latestQRBase64 = null;
        fs.rmSync('.baileys_auth', { recursive: true, force: true });
        initWhatsAppAutomation(); // Restart to get a new QR code
      }
    } else if (connection === 'open') {
      isReady = true;
      latestQRBase64 = null;
      console.log('[WhatsApp Automation] Client is READY and linked!');
    }
  });
}

/**
 * Sends a free-form WhatsApp message using the linked phone via Baileys.
 * Retries up to 3 times with a 3-second delay if the client is not yet ready.
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
    // Baileys requires the @s.whatsapp.net suffix for regular contacts
    const jid = `${formattedTo}@s.whatsapp.net`;
    await whatsappClient.sendMessage(jid, { text: message });
    console.log(`[WhatsApp Automation] ✅ Successfully sent message to ${formattedTo}`);
    return true;
  } catch (error: any) {
    const isRetryable = error?.message?.includes('Connection Closed') || error?.message?.includes('timeout');

    if (isRetryable && attempt < MAX_ATTEMPTS) {
      console.warn(`[WhatsApp Automation] Send failed due to connection issue (attempt ${attempt}/${MAX_ATTEMPTS}). Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return sendWhatsAppAutomationMessage(to, message, attempt + 1);
    }

    console.error(`[WhatsApp Automation] Failed to send message after ${attempt} attempt(s):`, error?.message ?? error);
    return false;
  }
}

