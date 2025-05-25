import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  loadChatSessionsFromSupabase, 
  fetchChatHistoryFromSupabase, 
  addMessageToSupabase,
  deleteSessionFromSupabase
} from '@/lib/supabaseChatApi';

export const useChatSessions = (setMessages, setIsLoading, toast, scrollToBottom, setIsSidebarOpen) => {
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  const saveMessageToDb = async (message) => {
    const success = await addMessageToSupabase(message);
    if (!success) {
      toast({
        title: 'Storage Error',
        description: 'Could not save message to cloud.',
        variant: 'destructive',
      });
    }
    return success;
  };

  const startNewChatSession = useCallback(async (closeSidebar = true) => {
    const newSessionId = uuidv4();
    setActiveSessionId(newSessionId);
    
    const initialMessage = {
      id: uuidv4(),
      sender: 'ai',
      content: "Hi, I'm HackNova AI developed by Hackerpro. How can I assist you today?",
      timestamp: new Date().toISOString(),
      session_id: newSessionId,
    };
    setMessages([initialMessage]);
    await saveMessageToDb(initialMessage);
    await loadSessions(); 
    if(closeSidebar && setIsSidebarOpen) setIsSidebarOpen(false);
  }, [setMessages, saveMessageToDb, setIsSidebarOpen]);


  const loadSessions = useCallback(async () => {
    const loadedSessions = await loadChatSessionsFromSupabase();
    setChatSessions(loadedSessions);

    if (loadedSessions.length > 0 && !activeSessionId) {
      setActiveSessionId(loadedSessions[0].id);
    } else if (loadedSessions.length === 0 && !activeSessionId) {
       await startNewChatSession(false);
    }
  }, [activeSessionId, startNewChatSession]);


  const fetchHistoryForSession = useCallback(async (sessionIdToLoad) => {
    if (!sessionIdToLoad) {
      setMessages([]);
      return;
    }
    setIsLoading(true);
    const history = await fetchChatHistoryFromSupabase(sessionIdToLoad);
    if (history) {
      setMessages(history);
    } else {
      setMessages([]);
      toast({
        title: 'Error',
        description: 'Could not load chat history.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
    scrollToBottom();
  }, [setMessages, setIsLoading, toast, scrollToBottom]);

  const handleDeleteSession = async (sessionIdToDelete) => {
    const success = await deleteSessionFromSupabase(sessionIdToDelete);

    if (!success) {
      toast({
        title: 'Error',
        description: 'Could not delete chat session.',
        variant: 'destructive',
      });
    } else {
      const updatedSessions = chatSessions.filter(s => s.id !== sessionIdToDelete);
      setChatSessions(updatedSessions);
      if (activeSessionId === sessionIdToDelete) {
        if (updatedSessions.length > 0) {
          setActiveSessionId(updatedSessions[0].id);
        } else {
          await startNewChatSession(false);
        }
      }
      toast({
        title: 'Session Deleted',
        description: 'Chat session has been successfully deleted.',
        variant: 'default',
      });
    }
  };

  return {
    chatSessions,
    activeSessionId,
    setActiveSessionId,
    loadSessions,
    startNewChatSession,
    handleDeleteSession,
    fetchHistoryForSession,
    saveMessageToDb
  };
};