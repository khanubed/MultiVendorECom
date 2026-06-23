import { useState } from 'react';
import { MessageCircle, Loader } from 'lucide-react';
import { chatAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MessageVendorButton = ({ orderId, onChatCreated }) => {
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    setLoading(true);
    try {
      const { data } = await chatAPI.createOrGetChatRoom(orderId);
      toast.success('Chat room opened!');
      
      if (onChatCreated) {
        onChatCreated(data.chatRoom);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to open chat';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
    >
      {loading ? (
        <>
          <Loader size={18} className="animate-spin" />
          Opening...
        </>
      ) : (
        <>
          <MessageCircle size={18} />
          Message Vendor
        </>
      )}
    </button>
  );
};

export default MessageVendorButton;
