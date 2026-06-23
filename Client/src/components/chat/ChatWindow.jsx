import { useState, useEffect, useRef } from 'react';
import { Send, Loader } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';

const ChatWindow = ({ chatRoomId, vendorName }) => {
  const { user } = useAuth();
  const { messages, loading, sendMessage, handleTyping, handleStopTyping, userTyping, fetchChatRoom } = useChat(
    chatRoomId,
    user?.id,
    user?.role
  );

  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatRoomId) {
      fetchChatRoom();
    }
  }, [chatRoomId, fetchChatRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (chatRoomId) {
      fetchChatRoom();
    }
  }, [chatRoomId, fetchChatRoom]);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);
    const result = await sendMessage(messageText);
    
    if (result.success) {
      setMessageText('');
      handleStopTyping();
    }
    setIsSending(false);
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    handleTyping();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b p-4 shadow-sm">
        <h3 className="font-semibold text-lg">{vendorName}</h3>
        <p className="text-sm text-gray-500">Order assistance chat</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${((msg.sender && msg.sender._id) || msg.sender) === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                  ((msg.sender && msg.sender._id) || msg.sender) === user?.id
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-300 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="wrap-break-word">{msg.content}</p>
                <p className={`text-xs mt-1 ${((msg.sender && msg.sender._id) || msg.sender) === user?.id ? 'text-blue-100' : 'text-gray-600'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {userTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white border-t p-4 shadow-lg flex gap-2"
      >
        <input
          type="text"
          value={messageText}
          onChange={handleInputChange}
          onBlur={handleStopTyping}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !messageText.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
        >
          <Send size={18} />
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
