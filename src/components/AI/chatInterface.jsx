import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Clock, TrendingUp, BarChart3, Lightbulb, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI assistant. I can help you analyze your tasks, provide productivity insights, or answer questions about your work patterns. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [suggestions] = useState([
    "How much time did I spend on work tasks this week?",
    "What are my overdue tasks?",
    "Show me my productivity trends",
    "Which tasks took the longest to complete?",
    "What's my task completion rate?",
    "How can I improve my productivity?"
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await api('/api/ai/chat/query', {
        method: 'POST',
        body: JSON.stringify({ query: inputValue })
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.response,
        data: response.relevantTasks,
        statistics: response.statistics,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <div key={message.id} className="flex justify-end mb-4">
          <div className="flex items-start gap-3 max-w-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg">
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={message.id} className="flex justify-start mb-4">
        <div className="flex items-start gap-3 max-w-4xl">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className={`bg-slate-700 text-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg ${message.isError ? 'border border-red-500/30' : ''}`}>
            <p className="text-sm leading-relaxed mb-2">{message.content}</p>
            
            {/* Statistics Display */}
            {message.statistics && (
              <div className="mt-3 p-3 bg-slate-600 rounded-lg">
                <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Statistics
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(message.statistics).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="text-white font-medium">
                        {typeof value === 'number' && key.includes('Time') ? formatTime(value) : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Relevant Tasks Display */}
            {message.data && message.data.length > 0 && (
              <div className="mt-3 p-3 bg-slate-600 rounded-lg">
                <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Relevant Tasks
                </h4>
                <div className="space-y-2">
                  {message.data.slice(0, 3).map((task, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-2 bg-slate-700 rounded">
                      <span className="text-white truncate">{task.title}</span>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                          task.status === 'in_progress' ? 'bg-blue-600/20 text-blue-400' :
                          'bg-yellow-600/20 text-yellow-400'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        {task.timeSpentMinutes > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(task.timeSpentMinutes)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {message.data.length > 3 && (
                    <p className="text-xs text-slate-400 text-center">
                      +{message.data.length - 3} more tasks
                    </p>
                  )}
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400 mt-2">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-800 rounded-lg h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-700">
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
          <p className="text-sm text-slate-400">Ask me about your tasks and productivity</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(renderMessage)}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-700 text-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions (show when no messages or just initial message) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-1 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-slate-300">Try asking:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white px-3 py-1 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your tasks, productivity, or get insights..."
              className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white p-3 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;