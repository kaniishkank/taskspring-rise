import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

let whatsappClient: any = null;
let isReady = false;

export function initWhatsAppAutomation() {
  console.log('[WhatsApp Automation] Initializing client...');
  
  whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
  });

  whatsappClient.on('qr', (qr: string) => {
    console.log('\n=========================================');
    console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP');
    console.log('=========================================\n');
    qrcode.generate(qr, { small: true });
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
