import React, { useState, useRef, useEffect } from "react";
import { 
  MessageOutlined, 
  PhoneOutlined, 
  CloseOutlined, 
  SendOutlined, 
  ThunderboltOutlined, 
  UserOutlined, 
  RobotOutlined, 
  RightOutlined, 
  ReloadOutlined, 
  ShoppingOutlined 
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAIChat } from "~/common/hooks/useAIChat";
import { usePublicContactSettings } from "~/features/admin/hooks";

const qrCodeUrl = (value: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(value)}`;

export const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'contact'>('ai');
  const [inputMessage, setInputMessage] = useState('');
  const { data: contactSettings } = usePublicContactSettings();

  const { messages, isLoading, sendMessage, resetChat } = useAIChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'ai') {
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;
    if (!textToSend) setInputMessage('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 font-sans pointer-events-none">
      {/* Chat Window Panel */}
      {isOpen && (
        <div className="pointer-events-auto w-[380px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_20px_60px_rgba(28,25,23,0.22)] transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between bg-brand-coral px-4 py-3 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30">
              <ThunderboltOutlined style={{ fontSize: 16 }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">LuxBot AI</h3>
                <span className="inline-flex items-center gap-1 text-brand-mint font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-mint animate-pulse" /> Trực tuyến
                </span>
              </div>
              <p className="text-[11px] text-white/80">Tư vấn nội thất thông minh 24/7</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={resetChat}
              title="Bắt đầu cuộc trò chuyện mới"
              className="rounded-full p-1.5 text-white/80 hover:text-white transition hover:bg-white/10 cursor-pointer"
              aria-label="Làm mới chat"
            >
              <ReloadOutlined style={{ fontSize: 14 }} />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-white/80 hover:text-white transition hover:bg-white/10 cursor-pointer"
              aria-label="Đóng chat"
            >
              <CloseOutlined style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-stone-200 bg-stone-100/80 p-1 text-xs">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-1.5 font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-white text-stone-900 font-bold shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ThunderboltOutlined className="text-brand-coral" style={{ fontSize: 13 }} />
            AI Trợ Lý
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-1.5 font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-white text-stone-900 font-bold shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <PhoneOutlined className="text-brand-coral" style={{ fontSize: 13 }} />
            Hotline & Zalo
          </button>
        </div>

        {/* Content Body */}
        {activeTab === 'ai' ? (
          <div className="flex-1 flex flex-col min-h-0 bg-stone-50 overflow-x-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-3.5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col w-full ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start gap-2 max-w-[92%] min-w-0">
                    {msg.sender === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-brand-coral text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-xs">
                        <RobotOutlined style={{ fontSize: 13 }} />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed min-w-0 break-words ${
                        msg.sender === 'user'
                          ? 'bg-brand-coral text-white rounded-tr-none'
                          : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-none shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line break-words">{msg.text}</div>

                      {/* Product Recommendations */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="mt-2.5 pt-2.5 border-t border-stone-100 space-y-2 min-w-0">
                          <p className="text-[11px] font-bold text-stone-900 flex items-center gap-1">
                            <ShoppingOutlined className="text-brand-coral shrink-0" style={{ fontSize: 12 }} /> Sản phẩm gợi ý:
                          </p>
                          <div className="space-y-1.5 min-w-0">
                            {msg.products.map((p) => (
                              <Link
                                key={p.id}
                                to={`/products/${p.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 p-1.5 rounded-xl bg-stone-50 hover:bg-brand-peach/15 border border-stone-200/80 transition-all text-stone-800 group min-w-0"
                              >
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-lg object-contain bg-white border border-stone-200 shrink-0"
                                />
                                <div className="min-w-0 flex-1 overflow-hidden">
                                  <p className="font-semibold text-[11px] text-stone-900 truncate group-hover:text-brand-coral">
                                    {p.name}
                                  </p>
                                  <p className="text-[11px] font-bold text-brand-coral truncate">
                                    {p.price.toLocaleString('vi-VN')} đ
                                  </p>
                                </div>
                                <RightOutlined style={{ fontSize: 11 }} className="text-stone-400 group-hover:text-brand-coral transition shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggested Question Chips */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pl-8 max-w-full">
                      {msg.suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="text-[11px] bg-white text-stone-700 border border-stone-200 hover:border-brand-coral hover:text-brand-coral px-2.5 py-1 rounded-full transition-all text-left shadow-2xs hover:bg-brand-peach/15 break-words cursor-pointer"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-stone-400 text-xs pl-8">
                  <div className="w-5 h-5 rounded-full bg-brand-peach/30 flex items-center justify-center text-brand-coral animate-spin">
                    <ReloadOutlined style={{ fontSize: 11 }} />
                  </div>
                  <span>LuxBot đang tìm kiếm thông tin...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-2.5 bg-white border-t border-stone-200">
              <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 focus-within:border-brand-coral focus-within:ring-1 focus-within:ring-brand-coral/30 transition-all">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập câu hỏi (VD: sofa giường 1m8...)"
                  className="flex-1 bg-transparent text-xs text-stone-800 placeholder-stone-400 outline-none"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-7 h-7 rounded-lg bg-[#2B5A50] text-white flex items-center justify-center hover:bg-[#20453D] disabled:opacity-40 transition shrink-0 cursor-pointer"
                  aria-label="Gửi tin nhắn"
                >
                  <SendOutlined style={{ fontSize: 13 }} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Human Contact Tab */
          <div className="flex-1 overflow-y-auto bg-stone-50 p-3 space-y-3">
            {contactSettings?.hotline && (
              <div className="rounded-2xl border border-brand-coral/30 bg-gradient-to-r from-brand-peach/10 to-transparent p-3 shadow-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-coral">
                  Hotline Hỗ Trợ 24/7
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <a
                    href={`tel:${contactSettings.hotline}`}
                    className="flex items-center gap-2 text-base font-black text-stone-900 hover:text-brand-coral"
                  >
                    <PhoneOutlined className="text-brand-coral" style={{ fontSize: 16 }} />
                    {contactSettings.hotline}
                  </a>
                  {contactSettings.hotline2 && (
                    <a
                      href={`tel:${contactSettings.hotline2}`}
                      className="text-xs font-semibold text-stone-600 hover:text-brand-coral"
                    >
                      (Phụ: {contactSettings.hotline2})
                    </a>
                  )}
                </div>
              </div>
            )}

            {contactSettings?.contacts && contactSettings.contacts.length > 0 ? (
              contactSettings.contacts.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 bg-white p-3 shadow-xs"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-500">
                        {item.name}
                      </p>
                      {item.phone && (
                        <a
                          href={`tel:${item.phone}`}
                          className="mt-1 flex items-center gap-1.5 text-sm font-bold text-stone-900 hover:text-brand-coral"
                        >
                          <PhoneOutlined className="text-brand-coral" style={{ fontSize: 13 }} />
                          {item.phone}
                        </a>
                      )}
                    </div>
                    {item.zaloUrl && (
                      <a
                        href={item.zaloUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-brand-peach/30 px-2.5 py-1 text-[11px] font-bold text-brand-coral hover:bg-brand-peach/50 transition cursor-pointer"
                      >
                        <MessageOutlined style={{ fontSize: 12 }} /> Zalo
                      </a>
                    )}
                  </div>

                  {item.zaloUrl && (
                    <div className="flex items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50 p-2">
                      <img
                        src={qrCodeUrl(item.zaloUrl)}
                        alt={`QR Zalo ${item.name}`}
                        className="h-24 w-24 rounded-xl object-cover shadow-sm"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : !contactSettings?.hotline ? (
              <div className="py-8 text-center text-xs text-stone-400">
                Chưa có thông tin nhân viên hỗ trợ. Quý khách vui lòng chat với LuxBot AI!
              </div>
            ) : null}
          </div>
        )}
      </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="pointer-events-auto group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2B5A50] via-[#244C44] to-[#1E3E37] px-4 py-3 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
        aria-label="Mở trợ lý AI tư vấn"
      >
        <div className="relative flex items-center justify-center">
          <ThunderboltOutlined className="text-brand-cream text-base group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-mint opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-mint"></span>
          </span>
        </div>
        <span className="text-xs font-bold tracking-wide">Trợ Lý AI LuxBot</span>
      </button>
    </div>
  );
};
