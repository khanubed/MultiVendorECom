import React, { useState, useMemo, useRef, useEffect } from "react";
import { Send, Loader2, MessageSquare } from "lucide-react";
import {
  initializeSocket,
  chatSocketEvents,
  chatAPI,
} from "../../services/api"; // Adjust path to your socket file

const SupportChatPage = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Retrieve auth data from your state management or storage setup
  const token = localStorage.getItem("authToken");
  const vendorData = JSON.parse(localStorage.getItem("user") || "{}");
  const vendorId = vendorData?.id || vendorData?._id;

  // 1. Initial REST API Load: Fetch all chat rooms belonging to this vendor
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const {data} = await chatAPI.getVendorChats()
        if (data.success) {
          setChats(data.chatRooms);
          if (data.chatRooms.length > 0) {
            setActiveChatId(data.chatRooms[0]._id);
          }
        }
      } catch (error) {
        console.error("Failed to load vendor chat rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchChatRooms();
  }, [token]);

  // 2. Socket.io Connection & Global Live Listeners Lifecycle
  useEffect(() => {
    if (!token || !vendorId) return;

    const socket = initializeSocket(token);

    // Announce presence online to the network gateway
    chatSocketEvents.userOnline(vendorId, "vendor");

    // Listen for real-time incoming messages broadcasted by the server
    const handleReceiveMessage = (data) => {
      const { chatRoomId, message } = data;

      setChats((prevChats) =>
        prevChats.map((room) => {
          if (room._id === chatRoomId) {
            return {
              ...room,
              lastMessage: message.content,
              lastMessageTime: message.createdAt,
              messages: [...(room.messages || []), message],
            };
          }
          return room;
        }),
      );
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      // Only remove this listener, don't destroy the global socket
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [token, vendorId]);

  // 3. Room Management Lifecycle: Joining/Leaving room channels
  useEffect(() => {
    if (!activeChatId || !vendorId) return;

    // Join the newly selected room channel room string
    chatSocketEvents.joinChatRoom(activeChatId, vendorId, "vendor");

    // Clear unread indicator status locally
    chatAPI.markAsRead(activeChatId)
      .catch((err) => console.error("Error marking messages read:", err));

    // Smooth scroll down layout matrix window
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    return () => {
      chatSocketEvents.leaveChatRoom(activeChatId, vendorId);
    };
  }, [activeChatId, vendorId, token]);

  // Auto-scroll anchor evaluation pipeline
  const activeChat = useMemo(
    () => chats.find((c) => c._id === activeChatId),
    [chats, activeChatId],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages?.length]);

  // 4. Message Transmission Operations
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatId) return;

    const currentInput = chatInput.trim();
    setChatInput(""); // Optimistic layout field reset

    try {
      // Step A: Send message via REST API
      const { data } = await chatAPI.sendMessage(activeChatId, currentInput);

      if (data.success) {
        // Step B: Dispatch via WebSocket to deliver immediate transmission sync
        chatSocketEvents.sendMessage(
          activeChatId,
          vendorId,
          "vendor",
          currentInput,
        );

        // Step C: Update local component collection states
        setChats((prevChats) =>
          prevChats.map((room) =>
            room._id === activeChatId ? data.chatRoom : room,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to transmit support payload data packet:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[550px] bg-white border border-slate-200/60 rounded-[24px] flex items-center justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Syncing Support Desk...
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-slate-200/60 rounded-[24px] overflow-hidden shadow-xs h-[550px]">
      {/* SIDEBAR ACTIVE USER CONVERSATION QUEUE */}
      <div className="md:col-span-1 border-r border-slate-200/80 flex flex-col bg-slate-50/40">
        <div className="p-4 border-b border-slate-100 bg-white font-bold text-xs tracking-wider uppercase text-slate-400">
          Active Customer Inquiries
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60">
          {chats.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-medium">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-40" />
              No customer logs found.
            </div>
          ) : (
            chats.map((c) => (
              <button
                key={c._id}
                onClick={() => setActiveChatId(c._id)}
                className={`w-full p-4 text-left flex flex-col transition-all cursor-pointer ${
                  c._id === activeChatId
                    ? "bg-white border-l-4 border-l-slate-900 shadow-2xs"
                    : "hover:bg-slate-50/80"
                }`}
              >
                <div className="flex justify-between items-center mb-1 w-full">
                  <span className="text-xs font-bold text-slate-900">
                    {c.customer?.name || "Client User"}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold">
                    {c.order?.orderId
                      ? `#${c.order.orderId.slice(-6)}`
                      : "Order Details"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate font-medium w-full">
                  {c.lastMessage || "Room opened..."}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* SUPPORT MESSENGER INTERCOM STREAM */}
      <div className="md:col-span-2 flex flex-col bg-white">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-slate-100 bg-white shadow-2xs flex justify-between items-center">
              <div className="text-xs text-slate-800 font-extrabold">
                Chatting with:{" "}
                <span className="text-slate-900 underline font-black">
                  {activeChat.customer?.name}
                </span>
              </div>
              <div className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-bold">
                Email: {activeChat.customer?.email}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
              {activeChat.messages?.map((m, index) => {
                // Evaluates if structural item is matched to vendor source matrix tags
                const isVendor =
                  m.senderType === "vendor" || m.sender === vendorId;
                return (
                  <div
                    key={m._id || index}
                    className={`flex max-w-[80%] flex-col ${isVendor ? "ml-auto items-end" : "mr-auto items-start"}`}
                  >
                    <div
                      className={`p-3 rounded-xl text-xs font-medium ${
                        isVendor
                          ? "bg-slate-950 text-white rounded-tr-none shadow-sm"
                          : "bg-white text-slate-800 border border-slate-200/60 rounded-tl-none shadow-2xs"
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1 block px-1">
                      {m.createdAt
                        ? new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just Now"}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-slate-100 flex gap-2 bg-white"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a support reply response here..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
              />
              <button
                type="submit"
                className="h-9 w-9 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 cursor-pointer active:scale-95 transition-all flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <MessageSquare className="w-8 h-8 opacity-30 mb-2" />
            <p className="text-xs font-bold uppercase tracking-wider">
              No Active Conversation Selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChatPage;
