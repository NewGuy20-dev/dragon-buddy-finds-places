import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import dragonBuddy from '@/assets/dragon-buddy.png';

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
      text: "Hi there! I'm Travel Buddy 🐉 I'm here to help you discover amazing places around you! What would you like to find today?"
    }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      text: input
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Let me help you find the perfect place! 🌟 What type of place are you looking for?",
        "Great question! Based on your location, I can suggest some amazing options. 🗺️",
        "I'd love to help! Are you looking for restaurants, hotels, or landmarks? 🏨🍽️🏛️",
        "Exciting! Let me search for the best options near you. ✨"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'dragon' as const,
        text: randomResponse
      }]);
    }, 1000);

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
          src={dragonBuddy} 
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
            src={dragonBuddy} 
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
            className="flex-1 px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSendMessage}
            className="dragon-button-primary px-4 py-2"
          >
            <MessageCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}