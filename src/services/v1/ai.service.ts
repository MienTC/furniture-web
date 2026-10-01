import instanceBE from './instance';

export interface AIChatProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  dimensions?: string;
  material?: string;
}

export interface AIChatResponse {
  reply: string;
  suggestedQuestions: string[];
  products: AIChatProduct[];
}

export const aiService = {
  chat: async (message: string, history: { sender: 'user' | 'assistant'; text: string }[] = []): Promise<AIChatResponse> => {
    const res: any = await instanceBE.post('/ai/chat', { message, history });
    return res.data;
  },
};
