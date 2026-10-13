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

  /**
   * Send notification to Admin Telegram when a new order is placed
   */
  static async notifyNewOrder(orderData: {
    orderId: string;
    customerName: string;
    phone: string;
    totalAmount: number;
    paymentMethod: string;
    address: string;
  }) {
    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    if (tgToken && tgChatId) {
      try {
        const formattedAmount = orderData.totalAmount.toLocaleString('vi-VN') + ' đ';
        const text =
          `[LUXDECOR] ĐƠN HÀNG MỚI #${orderData.orderId}\n\n` +
          `Khách hàng: ${orderData.customerName}\n` +
          `Số điện thoại: ${orderData.phone}\n` +
          `Địa chỉ: ${orderData.address}\n` +
          `Hình thức: ${orderData.paymentMethod.toUpperCase()}\n` +
          `Tổng tiền: ${formattedAmount}\n` +
          `Thời gian: ${timeStr}\n\n` +
          `Vui lòng kiểm tra và xử lý đơn hàng trong trang Quản trị!`;

        await axios.post(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          chat_id: tgChatId,
          text: text,
        });
        console.log(`[Telegram Order] Đã gửi thông báo đơn #${orderData.orderId} tới Admin`);
      } catch (tgErr: any) {
        console.warn('[Telegram Error] Không thể gửi thông báo đơn hàng Telegram:', tgErr.response?.data || tgErr.message);
      }
    }
  }
}

