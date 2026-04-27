import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendMessage, getMessages } from '../services/api';

const ChatPage = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: `Hi ${user?.name || 'there'}! Welcome to Sakina Support. How are you feeling today?`,
            isSent: false,
            options: [
                { emoji: "😊", label: "Happy" },
                { emoji: "😢", label: "Sad" },
                { emoji: "😰", label: "Anxious" },
                { emoji: "😴", label: "Tired" }
            ]
        },
    ]);

    const [inputValue, setInputValue] = useState("");
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            recognition.onstart = () => setIsListening(true);
            recognition.onresult = (event) => {
                let currentTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setInputValue(currentTranscript);
            };
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    }, []);

    const toggleVoiceRecording = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setInputValue("");
            recognitionRef.current.start();
        }
    };

    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getMessages();
                if (data.success && data.data.length > 0) {
                    const formatted = data.data.map(m => ({
                        id: m._id,
                        text: m.content,
                        isSent: m.sender === 'user',
                        emotionTag: m.emotionTag
                    }));
                    setMessages(formatted);
                }
            } catch (err) {
                console.error("Failed to fetch messages:", err);
            }
        };
        fetchMessages();
    }, []);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        const newUserMsg = { id: Date.now(), text: trimmedInput, isSent: true };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);

        try {
            const data = await sendMessage(trimmedInput);
            if (data.success) {
                const aiMsg = data.data.aiMessage;
                setMessages(prev => [
                    ...prev,
                    { id: aiMsg._id, text: aiMsg.content, isSent: false }
                ]);
            }
        } catch (error) {
            console.error("Send failed:", error);
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, text: "I'm having a bit of trouble connecting to my brain. Please try again in a moment.", isSent: false }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleOptionClick = async (option) => {
        const text = `I am feeling ${option.label.toLowerCase()} ${option.emoji}`;
        setMessages(prev => [...prev, { id: Date.now(), text, isSent: true }]);
        setIsTyping(true);

        try {
            const data = await sendMessage(text);
            if (data.success) {
                const aiMsg = data.data.aiMessage;
                setMessages(prev => [
                    ...prev,
                    { id: aiMsg._id, text: aiMsg.content, isSent: false }
                ]);
            }
        } catch (error) {
            console.error("Option click failed:", error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen bg-gray-50 overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-[#71BCFF]/10 flex items-center justify-center text-2xl shadow-sm">
                    🪴
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-none mb-1">Sakina Support</h1>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Always here</p>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 space-y-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'} items-end gap-3`}>
                            {!msg.isSent && (
                                <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-sm shadow-sm shrink-0">
                                    🪴
                                </div>
                            )}
                            <div className={`max-w-[85%] md:max-w-[70%] space-y-4`}>
                                <div className={`px-5 py-4 rounded-[24px] shadow-sm text-sm md:text-base leading-relaxed font-medium ${
                                    msg.isSent 
                                        ? 'bg-[#71BCFF] text-white rounded-br-none shadow-blue-100' 
                                        : 'bg-white text-gray-700 rounded-bl-none border border-gray-50'
                                }`}>
                                    {msg.text}
                                    
                                    {msg.options && (
                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            {msg.options.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionClick(opt)}
                                                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 font-bold text-xs"
                                                >
                                                    <span>{opt.emoji}</span>
                                                    <span>{opt.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start items-end gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-sm shadow-sm shrink-0">
                                🪴
                            </div>
                            <div className="bg-white text-gray-400 px-5 py-3 rounded-[24px] rounded-bl-none border border-gray-50 flex gap-1 items-center shadow-sm">
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-100 p-4 shrink-0">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSend} className="flex items-center gap-3">
                        <div className="flex-1 flex items-center bg-gray-50 rounded-[24px] border border-gray-100 px-4 focus-within:border-[#71BCFF] focus-within:bg-white transition-all shadow-sm">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={isListening ? "Listening..." : "How can I support you today?"}
                                className="flex-1 bg-transparent border-none py-4 px-2 text-gray-700 outline-none font-medium placeholder:text-gray-400"
                            />
                            <button
                                type="button"
                                onClick={toggleVoiceRecording}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                    isListening ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'text-[#71BCFF] hover:bg-blue-50'
                                }`}
                            >
                                {isListening ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <rect x="6" y="6" width="12" height="12" rx="2" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-300 shadow-lg ${
                                inputValue.trim() 
                                    ? 'bg-[#71BCFF] text-white shadow-blue-100 hover:scale-105 hover:shadow-blue-200' 
                                    : 'bg-gray-100 text-gray-300'
                            }`}
                        >
                            <svg className="w-6 h-6 rotate-45 -translate-x-0.5 translate-y-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;