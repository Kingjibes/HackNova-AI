import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useMessageHandling } from '@/hooks/useMessageHandling';
import { getSessionDisplayName } from '@/lib/chatUtils';

export const useChatLogic = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef(null);
  const fileInputRefImage = useRef(null);
  const fileInputRefGeneric = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const {
    chatSessions,
    activeSessionId,
    setActiveSessionId,
    loadSessions,
    startNewChatSession,
    handleDeleteSession,
    fetchHistoryForSession,
  } = useChatSessions(setMessages, setIsLoading, toast, scrollToBottom, setIsSidebarOpen);
  
  const {
    handleSendMessage,
    handleFileImport,
    handleCopyText,
    handleCopyCode,
  } = useMessageHandling(
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    isAiTyping,
    setIsAiTyping,
    activeSessionId,
    toast,
    loadSessions 
  );

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (activeSessionId) {
      fetchHistoryForSession(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId, fetchHistoryForSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  const handleSelectSession = (sessionIdToSelect) => {
    setActiveSessionId(sessionIdToSelect);
    setIsSidebarOpen(false);
  };

  const startNewChat = useCallback(() => {
    startNewChatSession(true);
  }, [startNewChatSession]);
  
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const currentChatName = getSessionDisplayName(chatSessions.find(s => s.id === activeSessionId));

  return {
    messages,
    input,
    setInput,
    isLoading,
    isAiTyping,
    handleSendMessage,
    handleFileImport,
    handleCopyText,
    handleCopyCode,
    messagesEndRef,
    fileInputRefImage,
    fileInputRefGeneric,
    chatSessions,
    activeSessionId,
    handleSelectSession,
    startNewChat,
    handleDeleteSession,
    isSidebarOpen,
    toggleSidebar,
    currentChatName,
  };
};