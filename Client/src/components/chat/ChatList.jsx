import { useState, useEffect } from 'react';
import { MessageCircle, Loader } from 'lucide-react';
import { chatAPI } from '../../services/api';
import ChatWindow from './ChatWindow';

const ChatList = ({ userRole }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedVendorName, setSelectedVendorName] = useState('');

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    setLoading(true);
    try {
      const { data } = userRole === 'customer'
        ? await chatAPI.getCustomerChats()
        : await chatAPI.getVendorChats();

      setChatRooms(data.chatRooms || []);
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chatRoom) => {
    setSelectedChatId(chatRoom._id);
    const vendorName = userRole === 'customer'
      ? chatRoom.vendor?.name
      : chatRoom.customer?.name;
    setSelectedVendorName(vendorName);
  };

  if (selectedChatId) {
    return (
      <div className="flex h-screen">
        {/* Chat List Sidebar */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b">
            <button
              onClick={() => {
                setSelectedChatId(null);
                setSelectedVendorName('');
              }}
              className="text-blue-500 hover:text-blue-600 font-semibold"
            >
              ← Back to Chats
            </button>
          </div>
          {chatRooms.map((chatRoom) => (
            <button
              key={chatRoom._id}
              onClick={() => handleSelectChat(chatRoom)}
              className={`w-full p-4 border-b text-left hover:bg-gray-100 ${
                selectedChatId === chatRoom._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <p className="font-semibold">
                {userRole === 'customer' ? chatRoom.vendor?.name : chatRoom.customer?.name}
              </p>
              <p className="text-sm text-gray-500 truncate">{chatRoom.lastMessage}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(chatRoom.lastMessageTime).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          <ChatWindow chatRoomId={selectedChatId} vendorName={selectedVendorName} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-blue-500" />
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
      </div>

      <div className="overflow-y-auto max-h-96">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader className="animate-spin text-blue-500" />
          </div>
        ) : chatRooms.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="mx-auto mb-2 opacity-50" />
            <p>No active conversations yet</p>
          </div>
        ) : (
          chatRooms.map((chatRoom) => (
            <button
              key={chatRoom._id}
              onClick={() => handleSelectChat(chatRoom)}
              className="w-full p-4 border-b text-left hover:bg-gray-50 transition"
            >
              <p className="font-semibold">
                {userRole === 'customer' ? chatRoom.vendor?.name : chatRoom.customer?.name}
              </p>
              <p className="text-sm text-gray-500 truncate">{chatRoom.lastMessage}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(chatRoom.lastMessageTime).toLocaleDateString()}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
