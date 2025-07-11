import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import travelBuddyKoala from '@/assets/travel-buddy-koala.png';

interface DragonBuddyProps {
  onLocationRequest?: () => void;
  userLocation?: string;
}

interface Message {
  id: number;
  type: 'dragon' | 'user';
  text: string;
}

export function DragonBuddy({ onLocationRequest, userLocation }: DragonBuddyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'dragon',
      text: "Hi there! I'm Travel Buddy ✈️🐨 I'm here to help you discover amazing places around you! What would you like to find today?"
    }
  ]);
  const [input, setInput] = useState('');

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          location: userLocation,
          context: 'travel assistance'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'dragon' as const,
        text: data.text
      }]);
    },
    onError: () => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'dragon' as const,
        text: "Sorry, I'm having some technical difficulties. Please try again later! 🐉"
      }]);
    }
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 dragon-button-primary rounded-full p-4 shadow-xl"
      >
        <img 
          src={travelBuddyKoala} 
          alt="Travel Buddy"
          className="w-8 h-8 animate-dragon-float"
        />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-2rem)] bg-card dragon-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <img 
            src={travelBuddyKoala}
            alt="Travel Buddy" 
            className="w-8 h-8 animate-dragon-pulse"
          />
          <div>
            <h3 className="font-semibold text-foreground">Travel Buddy</h3>
            <p className="text-sm text-muted-foreground">Your AI guide</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-muted rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-xl ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-3 py-2 rounded-xl bg-accent text-accent-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Travel Buddy anything..."
            disabled={chatMutation.isPending}
            className="flex-1 px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={chatMutation.isPending || !input.trim()}
            className="dragon-button-primary px-4 py-2 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}