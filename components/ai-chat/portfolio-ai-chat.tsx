"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  SquarePen,
  AudioLines,
  Send,
  X,
  Trash2,
  Mic,
  MicOff,
  VolumeX,
  User,
} from "lucide-react";
import {
  type ChatMessage,
  QUICK_PROMPTS,
  streamAIResponse,
} from "./ai-knowledge-engine";
import { AnimatedRobotAvatar } from "./animated-robot";

export function PortfolioAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "voice">("text");

  // Voice Interaction States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      sender: "ai",
      text: "Hi! I'm **Abedin AI**, Abedin's portfolio assistant. 👋\n\nAsk me anything by typing or using voice speech!",
      timestamp: "Just now",
    },
  ]);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setVoiceSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputQuery(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Speak AI response if voice mode is active
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // Stop any previous speech

    const cleanText = text.replace(/[*_#•]/g, ""); // Strip markdown tags for speech
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleVoiceRecord = () => {
    if (!voiceSupported) {
      alert(
        "Voice speech recognition is not supported in your current browser."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInputQuery("");
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setActiveTab("voice");
        setIsOpen(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isGenerating) return;

    // Stop listening if recording
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputQuery("");
    setIsGenerating(true);

    const aiMsgId = `ai-${Date.now()}`;
    const initialAiMessage: ChatMessage = {
      id: aiMsgId,
      sender: "ai",
      text: "...",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, initialAiMessage]);

    try {
      const responseStream = streamAIResponse(textToSend, messages);
      let finalResponse = "";

      for await (const chunk of responseStream) {
        finalResponse = chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, text: chunk } : msg
          )
        );
      }

      // If voice mode or user spoke, speak final response
      if (activeTab === "voice") {
        speakText(finalResponse);
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                text: "Sorry, I encountered an issue processing your query. Please try asking again!",
              }
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Widget (Bottom Right) */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col items-center gap-3">
        {/* Floating Robot Avatar Character */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <AnimatedRobotAvatar
            size="md"
            isListening={isListening}
            isSpeaking={isSpeaking}
          />
        </div>

        {/* Dual Control Bar Matching User Reference Screenshot (Edit/Type | Voice) */}
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-neutral-950/90 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
          {/* Type / Text Mode Trigger (Edit SquarePen Icon) */}
          <button
            onClick={() => {
              setActiveTab("text");
              setIsOpen(true);
            }}
            title="Type a message"
            className={`flex items-center justify-center transition-transform hover:scale-110 ${
              isOpen && activeTab === "text"
                ? "text-blue-400"
                : "text-white/80 hover:text-white"
            }`}
          >
            <SquarePen size={20} />
          </button>

          {/* Vertical Divider Line */}
          <div className="h-4 w-px bg-white/20" />

          {/* Voice Mode Trigger (Audio Waveform Icon) */}
          <button
            onClick={handleToggleVoiceRecord}
            title={
              isListening ? "Listening... Click to stop" : "Speak with voice"
            }
            className={`flex items-center justify-center transition-transform hover:scale-110 ${
              isListening
                ? "animate-pulse text-rose-400"
                : isOpen && activeTab === "voice"
                  ? "text-cyan-400"
                  : "text-white/80 hover:text-white"
            }`}
          >
            <AudioLines size={20} />
          </button>
        </div>
      </div>

      {/* Main AI Chat Drawer / Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed right-6 bottom-24 z-50 flex h-[540px] max-h-[80vh] w-[92vw] max-w-[400px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/95 shadow-2xl backdrop-blur-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-neutral-900/90 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <AnimatedRobotAvatar
                  size="sm"
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                />
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    <span>Abedin AI</span>
                    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 font-mono text-[9px] text-blue-300">
                      ASSISTANT
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400">
                    {isListening
                      ? "● LISTENING TO SPEECH..."
                      : isSpeaking
                        ? "● SPEAKING RESPONSE..."
                        : "● ONLINE &bull; READY"}
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1">
                {isSpeaking && (
                  <button
                    onClick={() => window.speechSynthesis.cancel()}
                    title="Mute voice"
                    className="rounded-lg p-1.5 text-blue-400 hover:bg-white/10"
                  >
                    <VolumeX size={16} />
                  </button>
                )}

                <button
                  onClick={() => setMessages([])}
                  title="Clear chat"
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <Trash2 size={15} />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  title="Close window"
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Message List */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 font-sans text-xs sm:text-sm">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-600/30 text-blue-300">
                        <AnimatedRobotAvatar size="sm" className="h-6 w-5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                        isUser
                          ? "rounded-tr-xs bg-blue-600 text-white"
                          : "rounded-tl-xs border border-white/10 bg-white/[0.06] text-white/90 backdrop-blur-md"
                      }`}
                    >
                      <div className="font-sans whitespace-pre-wrap">
                        {msg.text}
                      </div>
                      <span className="mt-1 block text-right font-mono text-[9px] opacity-40">
                        {msg.timestamp}
                      </span>
                    </div>

                    {isUser && (
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80">
                        <User size={14} />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Questions */}
            <div className="border-t border-white/10 bg-black/40 p-2.5 backdrop-blur-md">
              <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isGenerating}
                    className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/80 transition hover:border-blue-500/40 hover:bg-blue-500/20 hover:text-white disabled:opacity-40"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 border-t border-white/10 bg-neutral-900/90 p-3 backdrop-blur-md"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening to your voice..."
                    : "Type or speak your question..."
                }
                disabled={isGenerating}
                className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-xs text-white outline-none placeholder:text-white/40 focus:border-blue-500/50"
              />

              <button
                type="button"
                onClick={handleToggleVoiceRecord}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 transition ${
                  isListening
                    ? "animate-pulse bg-rose-600 text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
              </button>

              <button
                type="submit"
                disabled={!inputQuery.trim() || isGenerating}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition hover:bg-blue-500 disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
