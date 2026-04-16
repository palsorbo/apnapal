import { supabase } from './supabase';
import { Character, Profile, Credits, CreditTransaction, RazorpayOrder, Conversation, MessagesResponse, SendMessageResponse, SendMessageRequest } from '@apnapal/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('No authentication token available');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  getCharacters: (lang?: string): Promise<Character[]> => {
    const query = lang ? `?lang=${encodeURIComponent(lang)}` : '';
    return apiRequest(`/characters${query}`);
  },

  getCharacter: (id: string): Promise<Character> => {
    return apiRequest(`/characters/${id}`);
  },

  getProfile: (): Promise<Profile> => {
    return apiRequest('/profile');
  },

  updateProfile: (updates: { name?: string; preferred_language?: string }): Promise<Profile> => {
    return apiRequest('/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  getCredits: (): Promise<Credits> => {
    return apiRequest('/credits');
  },

  getCreditTransactions: (limit?: number): Promise<CreditTransaction[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return apiRequest(`/credits/transactions${query}`);
  },

  createRechargeOrder: (planId: string): Promise<RazorpayOrder> => {
    return apiRequest('/credits/recharge', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  },

  verifyRecharge: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    credits: number;
  }): Promise<{ success: boolean; message: string }> => {
    return apiRequest('/credits/recharge/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createConversation: (characterId: string): Promise<Conversation> => {
    return apiRequest('/conversations', {
      method: 'POST',
      body: JSON.stringify({ character_id: characterId }),
    });
  },

  getConversationMessages: (conversationId: string, cursor?: string, limit?: number): Promise<MessagesResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.set('cursor', cursor);
    if (limit) params.set('limit', limit.toString());
    const query = params.toString();
    return apiRequest(`/conversations/${conversationId}/messages${query ? `?${query}` : ''}`);
  },

  sendMessage: (conversationId: string, content: string): Promise<SendMessageResponse> => {
    return apiRequest(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  getConversations: (limit?: number): Promise<Conversation[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return apiRequest(`/conversations${query}`);
  },
  
  getConversation: (id: string): Promise<Conversation> => {
    return apiRequest(`/conversations/${id}`);
  },

  // Add more API methods as needed
};