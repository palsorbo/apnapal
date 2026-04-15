"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { Conversation, Message, MessagesResponse, Credits, SendMessageResponse } from "@apnapal/types";

export default function ChatScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationId = searchParams.get('id');

  // State
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRechargeSheet, setShowRechargeSheet] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load conversation and initial data
  useEffect(() => {
    if (conversationId) {
      loadConversationData();
    }
  }, [conversationId]);

  const loadConversationData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load conversation with character details
      const conversations = await api.getConversations?.() || [];
      const conv = conversations.find(c => c.id === conversationId);

      if (!conv) {
        setError("Conversation not found");
        return;
      }

      setConversation(conv);

      // Load messages
      await loadMessages();

      // Load credits
      const creditsData = await api.getCredits();
      setCredits(creditsData);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (cursor?: string) => {
    try {
      setLoadingMessages(true);
      const response: MessagesResponse = await api.getConversationMessages(conversationId!, cursor, 50);

      if (cursor) {
        // Prepend older messages
        setMessages(prev => [...response.messages, ...prev]);
      } else {
        // Initial load
        setMessages(response.messages);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || sending) return;

    const content = messageInput.trim();
    setMessageInput("");

    // Add user message immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId!,
      role: 'user',
      type: 'text',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setSending(true);
    setTyping(true);

    try {
      const response: SendMessageResponse = await api.sendMessage(conversationId!, content);

      // Add assistant message
      const assistantMessage: Message = {
        id: `temp-assistant-${Date.now()}`,
        conversation_id: conversationId!,
        role: 'assistant',
        type: 'text',
        content: response.reply,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Refresh credits
      const creditsData = await api.getCredits();
      setCredits(creditsData);

    } catch (err: any) {
      console.error("Failed to send message:", err);

      if (err.message?.includes('insufficient_credits') || err.message?.includes('403')) {
        setShowRechargeSheet(true);
      } else {
        setError("Failed to send message. Please try again.");
      }

      // Remove the temporary user message on error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setSending(false);
      setTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--color-ink-soft)" }}>Loading chat...</p>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-cream)",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--color-rose)", marginBottom: "16px" }}>
          {error || "Chat not found"}
        </p>
        <button
          onClick={() => router.back()}
          style={{
            background: "var(--color-saffron)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "14px",
            padding: "12px 24px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-cream)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "16px",
          background: "var(--color-surface)",
          borderBottom: "0.5px solid var(--color-ink-faint)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => router.back()}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ←
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={conversation.characters.avatar_url || "/default-avatar.png"}
              alt={conversation.characters.name}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "var(--text-body)",
                  fontWeight: 600,
                  color: "var(--color-ink)",
                }}
              >
                {conversation.characters.name}
              </div>
              <div
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-ink-soft)",
                }}
              >
                {conversation.characters.persona_type}
              </div>
            </div>
          </div>
        </div>

        {/* Credit balance */}
        <button
          onClick={() => router.push("/credits")}
          style={{
            background: "var(--color-marigold-light)",
            border: "1px solid var(--color-marigold)",
            borderRadius: "100px",
            padding: "6px 12px",
            fontSize: "var(--text-caption)",
            fontWeight: 600,
            color: "#7A5200",
            cursor: "pointer",
          }}
        >
          💰 {credits?.balance || 0}
        </button>
      </header>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: "flex",
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
              alignItems: "flex-end",
              gap: "8px",
            }}
          >
            {message.role === 'assistant' && (
              <img
                src={conversation.characters.avatar_url || "/default-avatar.png"}
                alt={conversation.characters.name}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            )}

            <div
              style={{
                maxWidth: message.role === 'user' ? "78%" : "82%",
                padding: "12px 16px",
                borderRadius: message.role === 'user' ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                background: message.role === 'user' ? "var(--color-saffron)" : "var(--color-surface)",
                color: message.role === 'user' ? "#FFFFFF" : "var(--color-ink)",
                fontSize: message.role === 'user' ? "var(--text-body)" : "var(--text-body-lg)",
                border: message.role === 'assistant' ? "0.5px solid var(--color-ink-faint)" : "none",
                wordWrap: "break-word",
              }}
            >
              {message.content}
            </div>

            <div
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-ink-soft)",
                alignSelf: "flex-end",
                marginBottom: "4px",
              }}
            >
              {formatTime(message.created_at)}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
            }}
          >
            <img
              src={conversation.characters.avatar_url || "/default-avatar.png"}
              alt={conversation.characters.name}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />

            <div
              style={{
                padding: "12px 16px",
                borderRadius: "4px 18px 18px 18px",
                background: "var(--color-surface)",
                border: "0.5px solid var(--color-ink-faint)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "8px 16px 8px 16px",
          paddingBottom: "calc(8px + env(safe-area-inset-bottom))",
          background: "var(--color-surface)",
          borderTop: "0.5px solid var(--color-ink-faint)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "8px",
          }}
        >
          <textarea
            ref={inputRef}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={sending}
            style={{
              flex: 1,
              minHeight: "40px",
              maxHeight: "120px",
              padding: "12px 16px",
              border: "1.5px solid var(--color-ink-faint)",
              borderRadius: "20px",
              fontSize: "15px",
              fontFamily: "var(--font-sora)",
              color: "var(--color-ink)",
              background: "var(--color-cream-dark)",
              resize: "none",
              outline: "none",
            }}
            rows={1}
          />

          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sending}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: messageInput.trim() && !sending ? "var(--color-saffron)" : "var(--color-ink-faint)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: messageInput.trim() && !sending ? "pointer" : "not-allowed",
              color: "#FFFFFF",
            }}
          >
            {sending ? "..." : "↑"}
          </button>
        </div>
      </div>

      {/* Recharge Bottom Sheet */}
      {showRechargeSheet && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--color-overlay)",
            display: "flex",
            alignItems: "flex-end",
            zIndex: 1000,
          }}
          onClick={() => setShowRechargeSheet(false)}
        >
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "24px 24px 0 0",
              padding: "20px 24px",
              paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div
              style={{
                width: "40px",
                height: "4px",
                borderRadius: "2px",
                background: "var(--color-ink-faint)",
                margin: "0 auto 20px",
              }}
            />

            <h2
              className="font-fraunces"
              style={{
                fontSize: "var(--text-title-lg)",
                fontWeight: 400,
                margin: "0 0 20px 0",
                textAlign: "center",
              }}
            >
              Recharge Credits
            </h2>

            <p
              style={{
                fontSize: "var(--text-body)",
                color: "var(--color-ink-mid)",
                textAlign: "center",
                margin: "0 0 24px 0",
              }}
            >
              You need credits to continue chatting. Choose a plan below:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { id: 'basic', name: 'Basic', credits: 50, price: '₹49' },
                { id: 'pro', name: 'Pro', credits: 150, price: '₹99' },
                { id: 'ultra', name: 'Ultra', credits: 400, price: '₹199' }
              ].map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    background: "var(--color-cream-dark)",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid var(--color-ink-faint)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div
                        style={{
                          fontSize: "var(--text-title)",
                          fontWeight: 500,
                          color: "var(--color-ink)",
                          marginBottom: "4px",
                        }}
                      >
                        {plan.name}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-body)",
                          color: "var(--color-ink-mid)",
                        }}
                      >
                        {plan.credits} credits
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "var(--text-title)",
                          fontWeight: 600,
                          color: "var(--color-saffron)",
                          marginBottom: "4px",
                        }}
                      >
                        {plan.price}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-micro)",
                          color: "var(--color-ink-soft)",
                        }}
                      >
                        One-time payment
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowRechargeSheet(false);
                      router.push("/credits");
                    }}
                    style={{
                      width: "100%",
                      background: "var(--color-saffron)",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "15px",
                      fontWeight: 600,
                      marginTop: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Recharge Now
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRechargeSheet(false)}
              style={{
                width: "100%",
                background: "transparent",
                color: "var(--color-ink-mid)",
                border: "1px solid var(--color-ink-faint)",
                borderRadius: "14px",
                padding: "12px 16px",
                fontSize: "15px",
                fontWeight: 500,
                marginTop: "16px",
                cursor: "pointer",
              }}
            >
              Continue Chat
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-ink-soft);
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
