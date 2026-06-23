import { useState, useEffect, useCallback } from 'react';
import { chatAPI, chatSocketEvents, socket } from '../services/api';
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
      // Save to database
      const { data } = await chatAPI.sendMessage(chatRoomId, content);
      setMessages(data.chatRoom?.messages || []);

      // Emit via WebSocket for real-time delivery
      chatSocketEvents.sendMessage(chatRoomId, userId, role, content);

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
    if (!socket) return;

    const handleReceiveMessage = (messageData) => {
      if (messageData.chatRoomId === chatRoomId) {
        setMessages(prev => [...prev, messageData]);
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
  }, [chatRoomId, userId, socket]);

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
