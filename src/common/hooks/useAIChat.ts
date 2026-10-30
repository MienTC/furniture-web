import { useState, useCallback } from 'react';
import { aiService } from '~/services/v1/ai.service';
import type { AIMessage } from '~/types';

const INITIAL_MESSAGE: AIMessage = {
  id: 'welcome',
  sender: 'assistant',
  text: 'Dạ xin kính chào Quý khách! Em là **LuxBot** - Chuyên viên AI tư vấn nội thất của LuxDecor.\n\nEm có thể hỗ trợ Quý khách chọn mẫu sofa, giường ngủ, bàn ăn thông minh theo diện tích phòng, tư vấn chất liệu và chính sách bảo hành 5 năm. Quý khách đang quan tâm sản phẩm nào ạ?',
  suggestedQuestions: [
    'Tư vấn sofa giường cho phòng khách nhỏ',
    'Bàn ăn thông minh kéo dài 4-8 người',
    'Chính sách bảo hành và lắp đặt',
    'Bộ sưu tập phòng ngủ hiện đại',
  ],
  time: 'Vừa xong',
};

export const useAIChat = () => {
  const [messages, setMessages] = useState<AIMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await aiService.chat(text.trim(), history);

      const botMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.reply,
        products: res.products,
        suggestedQuestions: res.suggestedQuestions,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Xin lỗi, hệ thống tư vấn đang bận. Quý khách vui lòng để lại số điện thoại hoặc gọi hotline để được hỗ trợ ngay ạ!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const resetChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    resetChat,
  };
};
