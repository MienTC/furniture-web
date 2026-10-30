export interface AIChatProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image?: string;
  imageUrl?: string;
  categoryName?: string;
}

export interface AIChatResponse {
  reply: string;
  products?: AIChatProduct[];
  suggestedQuestions?: string[];
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  products?: AIChatProduct[];
  suggestedQuestions?: string[];
  time: string;
}
