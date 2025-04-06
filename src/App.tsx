import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, UserCircle } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent?key=AIzaSyBN9uyid9sGGQtWsOGH9PIJAyp0l30eJw0',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: input
              }]
            }]
          }),
        }
      );

      const data = await response.json();
      const botMessage = {
        id: Date.now().toString(),
        text: data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that request.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <header className="flex items-center justify-between mb-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="h-8 w-8 text-pink-300" />
              <div className="absolute -inset-2 rounded-full bg-pink-400 opacity-20 animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-indigo-300">
              Lynx AI
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="bg-white/10 px-2 py-1 rounded-md">Gemini 2.0</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="relative mb-6">
                <div className="absolute -inset-4 rounded-full bg-indigo-400 opacity-20 animate-pulse blur-xl"></div>
                <Bot className="h-16 w-16 text-white relative" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Hello! I'm Lynx</h2>
              <p className="text-white/70 max-w-md">
                Ask me anything and I'll do my best to help. I can answer questions, provide suggestions, and more!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-4 relative overflow-hidden 
                  ${message.sender === 'user' 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                    : 'bg-white/10 backdrop-blur-md border border-white/20'}`}
                >
                  <div className="flex items-start space-x-3">
                    {message.sender === 'user' ? (
                      <UserCircle className="h-6 w-6 text-purple-200 flex-shrink-0" />
                    ) : (
                      <Bot className="h-6 w-6 text-pink-300 flex-shrink-0" />
                    )}
                    <p className="flex-1">{message.text}</p>
                  </div>
                  {message.sender === 'bot' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-30 animate-pulse"></div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 max-w-xs md:max-w-md">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-pink-400 animate-bubble1"></div>
                  <div className="h-3 w-3 rounded-full bg-purple-400 animate-bubble2"></div>
                  <div className="h-3 w-3 rounded-full bg-indigo-400 animate-bubble3"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-20 blur-sm"></div>
          <div className="relative bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Lynx..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/50 p-4 pr-12 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 p-2 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 transition-all disabled:opacity-50"
            >
              <Send className="h-5 w-5 text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}