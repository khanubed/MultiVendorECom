import { useState, useEffect, useCallback } from 'react';
import { chatAPI, chatSocketEvents, getSocket } from '../services/api';
import toast from 'react-hot-toast';

export const useChat = (chatRoomId, userId, role) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(null);

  // Fetch chat room messages
  const fetchChatRoom = useCallback(async () => {
    if (!chatRoomId) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await chatAPI.getChatRoom(chatRoomId);
      setMessages(data.chatRoom?.messages || []);

      // Join chat room
      chatSocketEvents.joinChatRoom(chatRoomId, userId, role);

      // Mark messages as read
      await chatAPI.markAsRead(chatRoomId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load chat');
    } finally {
      setLoading(false);
    }
  }, [chatRoomId, userId, role]);

  // Send message
  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || !chatRoomId) return;

    try {
      // Save to database (server also emits via socket to the chat room)
      const { data } = await chatAPI.sendMessage(chatRoomId, content);
      setMessages(data.chatRoom?.messages || []);

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send message';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [chatRoomId, userId, role]);

  // Handle typing
  const handleTyping = useCallback(() => {
    chatSocketEvents.userTyping(chatRoomId, userId, role);
  }, [chatRoomId, userId, role]);

  const handleStopTyping = useCallback(() => {
    chatSocketEvents.stopTyping(chatRoomId, userId);
  }, [chatRoomId, userId]);

  // Listen to WebSocket events
  useEffect(() => {
    // Access the current socket instance dynamically via getter
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (messageData) => {
      if (messageData.chatRoomId === chatRoomId) {
        // Server emits { chatRoomId, message: {...} } — extract the message
        const msg = messageData.message || messageData;
        setMessages(prev => {
          // Avoid duplicates — if we already have this message from the REST response, skip
          const isDuplicate = prev.some(m => 
            m.content === msg.content && 
            m.sender === msg.sender && 
            Math.abs(new Date(m.createdAt) - new Date(msg.createdAt)) < 2000
          );
          if (isDuplicate) return prev;
          return [...prev, msg];
        });
      }
    };

    const handleUserTyping = (typingData) => {
      if (typingData.chatRoomId === chatRoomId && typingData.userId !== userId) {
        setUserTyping(typingData);
        setIsTyping(true);
      }
    };

    const handleUserStoppedTyping = (data) => {
      if (data.chatRoomId === chatRoomId) {
        setIsTyping(false);
        setUserTyping(null);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
    };
  }, [chatRoomId, userId]);

  // Leave chat room on unmount
  useEffect(() => {
    return () => {
      if (chatRoomId) {
        chatSocketEvents.leaveChatRoom(chatRoomId, userId);
      }
    };
  }, [chatRoomId, userId]);

  return {
    messages,
    loading,
    error,
    isTyping,
    userTyping,
    fetchChatRoom,
    sendMessage,
    handleTyping,
    handleStopTyping
  };
};
