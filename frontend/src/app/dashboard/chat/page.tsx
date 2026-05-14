"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Loader2, Trash2, Bot, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { sendChatMessage, getChatHistory, clearChatHistory } from "@/lib/api";
import type { ChatMessage } from "@/types";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMentorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getChatHistory()
      .then((res) => setMessages(res.data))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage(trimmed);
      const assistantMsg: ChatMessage = { role: "assistant", content: res.data.response };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      toast.error("Message failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    await clearChatHistory();
    setMessages([]);
    toast.success("Chat history cleared");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-pink-400" />
            AI Career Mentor
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">RAG-powered · Context-aware · Always available</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleClear} className="gap-2 border-border/60">
          <Trash2 className="w-4 h-4" /> Clear History
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-6">
          {loadingHistory && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {!loadingHistory && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="font-semibold mb-2">Hi! I'm your CareerGPT Mentor</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Ask me anything about careers, skills, interview prep, salary insights, or your learning roadmap.
              </p>
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {["What career suits me?", "How to become a ML engineer?", "Review my skills"].map((q) => (
                  <Button key={q} variant="outline" size="sm" className="text-xs border-border/60"
                    onClick={() => { setInput(q); }}>
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    msg.role === "user" ? "bg-primary/20" : "bg-pink-500/20"
                  }`}>
                    {msg.role === "user"
                      ? <User className="w-4 h-4 text-primary" />
                      : <Bot className="w-4 h-4 text-pink-400" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary/15 text-foreground rounded-tr-sm"
                      : "bg-card border border-border/50 rounded-tl-sm"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-pink-400" />
                </div>
                <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-3 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your career mentor anything… (Enter to send)"
              className="flex-1 resize-none bg-background/50 border-border/60 max-h-32"
              rows={1}
            />
            <Button
              onClick={send}
              disabled={loading || !input.trim()}
              size="icon"
              className="bg-gradient-to-br from-pink-600 to-violet-600 text-white border-0 h-10 w-10 flex-shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <Zap className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Powered by RAG + LangChain · Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
