import fetch from 'node-fetch';

/**
 * Sends a WhatsApp message using the direct Meta Graph API.
 * Ensure META_WHATSAPP_PHONE_NUMBER_ID and META_WHATSAPP_ACCESS_TOKEN are in .env
 */
export async function sendWhatsAppMessage(to: string, message: string) {
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.warn('[WhatsApp] Skipping message: Missing Meta Graph API credentials in .env');
    return false;
  }

  // Ensure the phone number is correctly formatted (no +, numbers only)
  const formattedTo = to.replace(/\D/g, '');

  if (!formattedTo) {
    console.warn('[WhatsApp] Invalid phone number provided');
    return false;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedTo,
        type: 'text',
        text: {
          preview_url: false,
          body: message
        }
      })
    });

    const data = await response.json() as any;

    if (!response.ok) {
      console.error('[WhatsApp] Meta API Error:', JSON.stringify(data, null, 2));
      return false;
    }

    console.log(`[WhatsApp] Successfully sent message to ${formattedTo}`);
    return true;
  } catch (error) {
    console.error('[WhatsApp] Network Error:', error);
    return false;
  }
}
