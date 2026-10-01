import axios from 'axios';

export class NotificationService {
  /**
   * Send notification to Admin Telegram when a new customer phone number is captured by AI Chatbot
   */
  static async notifyNewLead(phone: string, customerMessage: string) {
    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    // Server console log without icons
    console.log('\n======================================================');
    console.log('[LEAD MỚI TỪ AI CHATBOT] Khách hàng để lại thông tin:');
    console.log(`Số điện thoại / Zalo: ${phone}`);
    console.log(`Lời nhắn của khách: "${customerMessage}"`);
    console.log(`Thời gian: ${timeStr}`);
    console.log('======================================================\n');

    // Send Telegram Notification (Clean text without emojis)
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    if (tgToken && tgChatId) {
      try {
        const text = `[LUXDECOR] KHÁCH HÀNG MỚI ĐỂ LẠI SỐ ĐIỆN THOẠI\n\n` +
          `Số điện thoại / Zalo: ${phone}\n` +
          `Nội dung khách nhắn: "${customerMessage}"\n` +
          `Thời gian: ${timeStr}\n\n` +
          `Vui lòng liên hệ lại khách hàng sớm nhất!`;

        await axios.post(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          chat_id: tgChatId,
          text: text,
        });
        console.log(`[Telegram] Đã gửi thông báo thành công tới Chat ID: ${tgChatId}`);
      } catch (tgErr: any) {
        console.warn('[Telegram Error] Không thể gửi thông báo Telegram:', tgErr.response?.data || tgErr.message);
      }
    }
  }
}
