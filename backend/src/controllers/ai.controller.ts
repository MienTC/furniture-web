import { Request, Response } from 'express';
import axios from 'axios';
import { ProductModel } from '../models/Product.model.js';
import { ProductImageModel } from '../models/ProductImage.model.js';
import { LeadModel } from '../models/Lead.model.js';
import { NotificationService } from '../services/notification.service.js';
import { generateId } from '../utils/generateId.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class AIController {
  /**
   * POST /api/v1/ai/chat
   * Concise AI Consultant: Only recommends product cards on explicit demand,
   * captures phone/Zalo leads and notifies admin.
   */
  static async chat(req: Request, res: Response): Promise<any> {
    try {
      const { message, history = [] } = req.body;

      if (!message || typeof message !== 'string') {
        return sendError(res, 'Nội dung tin nhắn không hợp lệ', 400);
      }

      const q = message.trim();

      // 1. Phone / Zalo Lead Detection
      const phoneRegex = /(?:0|\+84)(?:[\s.-]?\d){8,9}\b/g;
      const matchedPhones = q.match(phoneRegex);
      let capturedPhone: string | null = null;

      if (matchedPhones && matchedPhones.length > 0) {
        // Clean phone number
        capturedPhone = matchedPhones[0].replace(/[\s.-]/g, '');
        try {
          await LeadModel.create({
            s_ID: generateId('lead'),
            phone: capturedPhone,
            source: 'ai_chatbot',
            customer_message: q,
            status: 'new',
            dt_create: new Date(),
            dt_edit: new Date(),
          });

          // Trigger email / console alert
          NotificationService.notifyNewLead(capturedPhone, q).catch((err) =>
            console.warn('[Notification Error]', err.message)
          );
        } catch (leadErr: any) {
          console.warn('[Lead Save Error]', leadErr.message);
        }
      }

      // 2. Determine if customer is explicitly asking for product models / recommendations
      const wantsProductCards = /(gợi ý|giới thiệu|mẫu|sản phẩm|cho xem|xem mẫu|mẫu nào|gửi ảnh|báo giá|catalog|loại nào|có những|bộ nào|chiếc nào|cái nào|mấy mẫu|tham khảo mẫu|tìm giúp|mua)/i.test(q);

      let formattedProducts: any[] = [];

      if (wantsProductCards) {
        const stopWords = new Set(['tôi', 'mình', 'cho', 'có', 'của', 'là', 'các', 'những', 'với', 'và', 'thì', 'ở', 'được', 'gì', 'nào', 'sao', 'muốn', 'cần', 'hỏi', 'nhà']);
        const tokens = q
          .toLowerCase()
          .replace(/[.,?!:;]/g, ' ')
          .split(/\s+/)
          .filter(w => w.length >= 2 && !stopWords.has(w));

        let dbQuery: any = { is_active: true, price: { $gt: 0 } };

        if (tokens.length > 0) {
          const tokenRegexes = tokens.map(t => new RegExp(t, 'i'));
          dbQuery.$or = [
            { s_Name: { $in: tokenRegexes } },
            { category_name: { $in: tokenRegexes } },
            { material: { $in: tokenRegexes } },
          ];
        }

        if (/sofa\s*giường/i.test(q)) {
          dbQuery = {
            is_active: true,
            price: { $gt: 0 },
            s_Name: { $regex: 'sofa giường', $options: 'i' },
          };
        }

        const matchedProducts = await ProductModel.find(dbQuery)
          .sort({ is_featured: -1, is_best_seller: -1, price: -1 })
          .limit(2) // Only 2 concise recommendations
          .lean();

        if (matchedProducts.length > 0) {
          const productIds = matchedProducts.map(p => p.s_ID);
          const images = await ProductImageModel.find({
            s_product_ID: { $in: productIds },
            is_primary: true,
          }).lean();

          const imageMap = new Map<string, string>();
          images.forEach(img => {
            imageMap.set(img.s_product_ID, img.image_url);
          });

          formattedProducts = matchedProducts.map(p => ({
            id: p.s_ID,
            name: p.s_Name,
            slug: p.slug,
            price: p.price,
            originalPrice: p.original_price,
            imageUrl: imageMap.get(p.s_ID) || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
            dimensions: p.dimensions || '',
            material: p.material || '',
          }));
        }
      }

      // 3. Format Context for Gemini
      const dbProductContext = formattedProducts.length > 0
        ? formattedProducts
            .map(
              (p, i) =>
                `[Mẫu ${i + 1}]: ${p.name} - Giá: ${p.price.toLocaleString('vi-VN')}đ - Kích thước: ${p.dimensions || 'Tiêu chuẩn'} - Chất liệu: ${p.material || 'Gỗ/vải cao cấp'}`
            )
            .join('\n')
        : 'Không đính kèm danh sách sản phẩm.';

      const chatHistoryText = history
        .slice(-3)
        .map((h: any) => `${h.sender === 'user' ? 'Khách' : 'LuxBot'}: ${h.text}`)
        .join('\n');

      const leadNotice = capturedPhone
        ? `LƯU Ý: Khách hàng vừa gửi số điện thoại/Zalo là "${capturedPhone}". Hãy xác nhận lịch sự rằng LuxDecor đã ghi nhận và chuyên viên sẽ liên hệ lại ngay.`
        : '';

      const prompt = `Bạn là LuxBot - Trợ lý AI tư vấn nội thất cao cấp LuxDecor (Việt Nam).

YÊU CẦU ĐỘ DÀI & ĐỊNH DẠNG (BẮT BUỘC):
- Viết CỰC KỲ NGẮN GỌN VÀ ĐÚC KẾT: TỐI ĐA 2 ĐẾN 3 CÂU (dưới 50 từ). Khung chat rất nhỏ, tuyệt đối KHÔNG viết bài luận dài, KHÔNG đánh số 1 2 3 dài dòng.
- Đi thẳng vào trọng tâm câu hỏi của khách hàng, xưng hô 'em' và 'Quý khách'.
${leadNotice}

DỮ LIỆU SẢN PHẨM TRONG KHO (CHỈ NHẮC ĐẾN NẾU PHÙ HỢP):
${dbProductContext}

LỊCH SỬ CHAT:
${chatHistoryText || '(Bắt đầu trò chuyện)'}

CÂU HỎI MỚI CỦA KHÁCH: "${q}"

Cuối câu trả lời, nếu có thể, hãy gợi ý 2 câu hỏi tiếp theo thật ngắn (bắt đầu bằng ">> ").`;

      let reply = '';
      let suggestedQuestions: string[] = [];

      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return sendError(res, 'Chưa cấu hình GEMINI_API_KEY trong file .env', 500);
      }

      const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          const geminiRes = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
            {
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 250, // Strict limit for concise response
              },
            },
            { timeout: 12000 }
          );

          const rawText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const lines = rawText.split('\n');
            const cleanLines: string[] = [];
            const suggestions: string[] = [];

            lines.forEach((line: string) => {
              const trimmed = line.trim();
              if (trimmed.startsWith('>>') || trimmed.toLowerCase().startsWith('gợi ý:')) {
                const suggestion = trimmed.replace(/^(>>|gợi ý:)\s*/i, '').trim();
                if (suggestion) suggestions.push(suggestion);
              } else {
                cleanLines.push(line);
              }
            });

            reply = cleanLines.join('\n').trim();
            suggestedQuestions = suggestions.slice(0, 2);
            break;
          }
        } catch (modelErr: any) {
          lastError = modelErr?.response?.data?.error || modelErr;
        }
      }

      if (!reply) {
        throw new Error(lastError?.message || 'Không thể tạo phản hồi từ AI');
      }

      return sendSuccess(res, 'Tư vấn thành công', {
        reply,
        products: formattedProducts, // Will be empty unless customer explicitly asks for products/recommendations
        suggestedQuestions,
      });
    } catch (error: any) {
      console.error('AI chat error:', error.message);
      return sendError(res, error.message || 'Lỗi khi xử lý hội thoại AI', 500);
    }
  }
}
