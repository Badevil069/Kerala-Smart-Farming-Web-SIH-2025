

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Mic, Send, X, Sprout, Droplets, Bug, SprayCan, Milestone, Volume2, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useApp } from '@/context/app-context';
import LanguageToggle from './language-toggle';
import { useTranslation } from '@/hooks/use-translation';
import { chat, ChatInput } from '@/ai/flows/chat';

type Message = {
  id: string;
  role: 'farmer' | 'assistant';
  text: string;
  timestamp: string;
  canBeSaved?: boolean;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const { toast } = useToast();
  const { profile } = useApp();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { tStatic } = useTranslation();
  
  const quickReplies = [
      { label: tStatic('chatbot.quickReplies.planted'), icon: Sprout },
      { label: tStatic('chatbot.quickReplies.watered'), icon: Droplets },
      { label: tStatic('chatbot.quickReplies.pest'), icon: Bug },
      { label: tStatic('chatbot.quickReplies.sprayed'), icon: SprayCan },
      { label: tStatic('chatbot.quickReplies.harvest'), icon: Milestone },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: tStatic('chatbot.greeting'),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isResponding]);


  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isResponding) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'farmer',
      text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsResponding(true);

    try {
        const chatHistory = messages.map(msg => ({
            role: msg.role === 'farmer' ? 'user' : 'model',
            content: msg.text
        }));

        const chatInput: ChatInput = {
            history: chatHistory,
            message: text,
        };

        const response = await chat(chatInput);

        const assistantMessage: Message = {
            id: `asst-${Date.now()}`,
            role: 'assistant',
            text: response.message,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            canBeSaved: response.message.toLowerCase().includes("log"), // simple heuristic
        };
        setMessages((prev) => [...prev, assistantMessage]);

    } catch(e) {
        console.error("Chatbot Error:", e);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Sorry, I couldn't get a response. Please check the API key and try again.",
        });
        // Optionally remove the user message if the call fails
        setMessages(prev => prev.slice(0, prev.length -1));
    } finally {
        setIsResponding(false);
    }
  };
  
  const handleQuickReply = (label: string) => {
    handleSendMessage(label);
  };

  const handleMicPress = () => {
    setIsRecording(true);
    toast({ title: tStatic('chatbot.mic.recording.title'), description: tStatic('chatbot.mic.recording.description') });
  };

  const handleMicRelease = () => {
    setIsRecording(false);
    toast({ title: tStatic('chatbot.mic.sent.title'), description: tStatic('chatbot.mic.sent.description') });
    handleSendMessage(tStatic('chatbot.mic.placeholder'));
  };

  const handleSaveAsLog = () => {
    toast({
        title: tStatic('chatbot.log.saved.title'),
        description: tStatic('chatbot.log.saved.description'),
        action: <Button variant="outline" size="sm">{tStatic('chatbot.log.saved.action')}</Button>
    });
  }
  
  const handleTTS = (text: string) => {
     toast({ title: tStatic('chatbot.tts.title'), description: tStatic('chatbot.tts.description') });
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return 'F';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-[9.5rem] right-4 z-50 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[600px] bg-card border rounded-2xl shadow-2xl flex flex-col md:bottom-24"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-3">
                <div className="relative">
                    <Bot className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-full" />
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                </div>
                <div>
                    <h3 className="font-bold font-headline">{tStatic('home.title')}</h3>
                    <p className="text-xs text-muted-foreground">{tStatic('chatbot.online')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Chat Area */}
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex items-end gap-2", msg.role === 'assistant' ? 'justify-start' : 'justify-end')}>
                   {msg.role === 'assistant' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18} /></AvatarFallback>
                        </Avatar>
                   )}
                   <div className={cn(
                       "max-w-[80%] rounded-2xl p-3 text-sm",
                       msg.role === 'assistant' ? "bg-muted rounded-bl-none" : "bg-primary text-primary-foreground rounded-br-none"
                   )}>
                        <p>{msg.text}</p>
                        <div className={cn("text-xs mt-2 flex items-center gap-2", msg.role === 'assistant' ? 'text-muted-foreground' : 'text-primary-foreground/70')}>
                           <span>{msg.timestamp}</span>
                           {msg.role === 'assistant' && <Volume2 className="h-4 w-4 cursor-pointer" onClick={() => handleTTS(msg.text)} />}
                           {msg.canBeSaved && <Button size="xs" variant="secondary" className="h-6 gap-1" onClick={handleSaveAsLog}><Save size={12}/> {tStatic('chatbot.log.saveButton')}</Button>}
                        </div>
                   </div>
                   {msg.role === 'farmer' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(profile?.name)}</AvatarFallback>
                        </Avatar>
                   )}
                </div>
              ))}
               {isResponding && (
                <div className="flex items-end gap-2 justify-start">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18} /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%] rounded-2xl p-3 text-sm bg-muted rounded-bl-none flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                </div>
              )}
            </div>
            
             {/* Quick Replies */}
            <div className="p-2 border-t overflow-x-auto [ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex gap-2 pb-1">
                    {quickReplies.map(({label, icon: Icon}) => (
                        <Button key={label} variant="outline" size="sm" className="h-auto flex-shrink-0" onClick={() => handleQuickReply(label)} disabled={isResponding}>
                           <Icon className="h-4 w-4 mr-2"/> {label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background/80 rounded-b-2xl">
              <div className="relative">
                <Textarea
                  placeholder={tStatic('chatbot.inputPlaceholder')}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputValue);
                    }
                  }}
                  className="pr-24 rounded-full resize-none transition-all duration-200 focus:min-h-[60px]"
                  rows={1}
                  disabled={isResponding}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("rounded-full h-8 w-8 transition-all duration-300", isRecording ? "bg-red-500 text-white scale-125" : "")}
                        onMouseDown={handleMicPress}
                        onMouseUp={handleMicRelease}
                        onTouchStart={handleMicPress}
                        onTouchEnd={handleMicRelease}
                        disabled={isResponding}
                    >
                        <Mic className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="default"
                        size="icon"
                        className="rounded-full h-8 w-8 ml-1"
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim() || isResponding}
                    >
                        {isResponding ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        className="fixed bottom-20 right-6 h-16 w-16 rounded-full shadow-lg z-40 md:bottom-6"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={tStatic('chatbot.toggle')}
      >
        <AnimatePresence mode="wait">
            <motion.div
                key={isOpen ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
                transition={{ duration: 0.2 }}
            >
                {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
            </motion.div>
        </AnimatePresence>
      </Button>
    </>
  );
}
