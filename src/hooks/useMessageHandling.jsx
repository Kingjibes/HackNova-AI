import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AlertTriangle } from 'lucide-react';
import { fetchAIResponse } from '@/lib/aiService';
import { addMessageToSupabase } from '@/lib/supabaseChatApi';


export const useMessageHandling = (
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
  refreshSessionsCallback
) => {

  const saveMessage = async (message) => {
    const success = await addMessageToSupabase(message);
    if (!success) {
      toast({
        title: 'Storage Error',
        description: 'Could not save message to cloud.',
        variant: 'destructive',
      });
    } else {
      if(refreshSessionsCallback) refreshSessionsCallback();
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (input.trim() === '' || isLoading || !activeSessionId || isAiTyping) return;

    const currentInput = input.trim();
    setInput('');

    const userMessage = {
      id: uuidv4(),
      sender: 'user',
      content: currentInput,
      timestamp: new Date().toISOString(),
      session_id: activeSessionId,
    };
    setMessages(prev => [...prev, userMessage]);
    await saveMessage(userMessage);
    
    setIsLoading(true);
    setIsAiTyping(true);

    const aiTypingMessage = {
      id: uuidv4(),
      sender: 'ai',
      content: '...', 
      timestamp: new Date().toISOString(),
      session_id: activeSessionId,
      isLoading: true,
    };
    setMessages(prev => [...prev, aiTypingMessage]);


    try {
      const aiResponseContent = await fetchAIResponse(currentInput);

      const aiMessage = {
        id: aiTypingMessage.id, 
        sender: 'ai',
        content: aiResponseContent,
        timestamp: new Date().toISOString(),
        session_id: activeSessionId,
        isLoading: false,
      };
      
      setMessages(prev => prev.map(msg => msg.id === aiTypingMessage.id ? aiMessage : msg));
      await addMessageToSupabase(aiMessage);

    } catch (error) {
      console.error('API Error:', error);
      const errorMessageContent = error.message || 'Failed to fetch response from AI.';
      const errorMessage = {
        id: aiTypingMessage.id, 
        sender: 'ai',
        content: `Error: ${errorMessageContent}`,
        timestamp: new Date().toISOString(),
        isError: true,
        session_id: activeSessionId,
        isLoading: false,
      };
      setMessages(prev => prev.map(msg => msg.id === aiTypingMessage.id ? errorMessage : msg));
      await addMessageToSupabase(errorMessage);
      toast({
        title: 'API Error',
        description: errorMessageContent,
        variant: 'destructive',
        duration: 5000,
        action: <AlertTriangle className="h-5 w-5 text-destructive-foreground" />,
      });
    } finally {
      setIsLoading(false);
      setIsAiTyping(false);
    }
  };

  const handleCopyText = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to clipboard!',
        description: 'The text has been copied.',
        variant: 'default',
        duration: 2000,
      });
    }).catch(err => {
      toast({
        title: 'Copy failed',
        description: 'Could not copy text to clipboard.',
        variant: 'destructive',
        duration: 3000,
      });
      console.error('Failed to copy text: ', err);
    });
  }, [toast]);
  
  const handleCopyCode = useCallback((code) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: 'Code Copied!',
        description: 'The code block has been copied.',
        variant: 'default',
        duration: 2000,
      });
    }).catch(err => {
      toast({
        title: 'Copy failed',
        description: 'Could not copy code to clipboard.',
        variant: 'destructive',
        duration: 3000,
      });
      console.error('Failed to copy code: ', err);
    });
  }, [toast]);

  return {
    handleSendMessage,
    handleCopyText,
    handleCopyCode,
  };
};