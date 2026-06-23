import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chatAPI } from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";
import ChatWindow from "../../../components/chat/ChatWindow";
import { toast } from "react-hot-toast";

const VendorMessagingHub = () => {
  const { id: chatRoomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeChatId, setActiveChatId] = useState(chatRoomId || null);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChatRooms = async () => {
    setLoading(true);
    try {
      const { data } = await chatAPI.getCustomerChats();
      setChatRooms(data.chatRooms || []);
      if (!chatRoomId && data.chatRooms?.length > 0) {
        setActiveChatId(data.chatRooms[0]._id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load chat rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [chatRoomId]);

  useEffect(() => {
    if (chatRoomId) {
      setActiveChatId(chatRoomId);
    }
  }, [chatRoomId]);

  const handleSelectChat = (roomId) => {
    setActiveChatId(roomId);
    navigate(`/vendor-chat/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 px-6 py-12 md:px-12 max-w-7xl mx-auto">
      <div className="border-b border-slate-200 pb-8 mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Vendor Messaging Hub</h1>
        <p className="text-slate-500 text-sm">Access your order-linked chat rooms and communicate directly with vendors in real time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 bg-slate-50 text-sm font-semibold text-slate-700">Active Conversations</div>
          <div className="p-4">
            <button
              onClick={fetchChatRooms}
              className="mb-4 w-full rounded-xl bg-slate-900 text-white py-3 text-xs font-bold hover:bg-slate-800 transition"
            >
              Refresh Conversations
            </button>
            {loading ? (
              <p className="text-sm text-slate-500">Loading conversations...</p>
            ) : chatRooms.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 text-sm text-slate-500">
                No chat rooms found yet. Open a chat from your order history to begin.
              </div>
            ) : (
              <div className="space-y-3">
                {chatRooms.map((room) => (
                  <button
                    key={room._id}
                    onClick={() => handleSelectChat(room._id)}
                    className={`w-full text-left rounded-2xl p-4 transition ${room._id === activeChatId ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}
                  >
                    <div className="text-xs font-bold">{room.vendor?.name || room.customer?.name || 'Vendor Chat'}</div>
                    <div className="text-[11px] text-slate-500 mt-1 truncate">{room.lastMessage || 'No messages yet'}</div>
                    <div className="text-[10px] text-slate-400 mt-2">Order: {room.order?.id || room.order?._id || 'Unknown'}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-xs min-h-140">
          {activeChatId ? (
            <ChatWindow chatRoomId={activeChatId} vendorName={chatRooms.find((room) => room._id === activeChatId)?.vendor?.name || 'Vendor Support'} />
          ) : (
            <div className="p-20 text-center text-slate-500">
              Select a chat room to begin messaging your vendor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorMessagingHub;
