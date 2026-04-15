export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Character {
  id: string;
  name: string;
  persona_type: string;
  description: string;
  avatar_url: string;
  voice_id?: string;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name?: string;
  preferred_language?: string;
  created_at: string;
}

export interface Credits {
  balance: number;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  reference_id?: string;
  metadata?: any;
  created_at: string;
}

export interface RechargePlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceDisplay: string;
}

export interface RazorpayOrder {
  order_id: string;
  amount: number;
  credits: number;
}

export interface Conversation {
  id: string;
  user_id: string;
  character_id: string;
  memory: any;
  started_at: string;
  last_message_at: string;
  characters: Character;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  type: 'text' | 'voice';
  content: string;
  audio_url?: string;
  created_at: string;
}

export interface MessagesResponse {
  messages: Message[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface SendMessageRequest {
  content: string;
}

export interface SendMessageResponse {
  reply: string;
}
