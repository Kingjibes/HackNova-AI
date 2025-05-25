import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatSidebar from '@/components/chat/ChatSidebar';
import WelcomeScreen from '@/components/chat/WelcomeScreen';
import { useChatLogic } from '@/hooks/useChatLogic';

const ChatPage = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    isAiTyping,
    handleSendMessage,
    handleCopyText,
    handleCopyCode,
    messagesEndRef,
    chatSessions,
    activeSessionId,
    handleSelectSession,
    startNewChat,
    handleDeleteSession,
    isSidebarOpen,
    toggleSidebar,
    currentChatName
  } = useChatLogic();

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-secondary/30 to-background text-foreground overflow-hidden">
      <ChatSidebar
        chatSessions={chatSessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={startNewChat}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        onClose={() => toggleSidebar(false)}
      />
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          onNewChat={startNewChat} 
          onToggleSidebar={toggleSidebar}
          currentChatName={currentChatName}
        />

        <main className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.length === 0 && !activeSessionId ? ( 
            <WelcomeScreen />
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                  const messageContent = typeof msg.content === 'string' ? msg.content : '';
                  const enrichedMessage = {...msg, content: messageContent};
                  
                  return (
                    <ChatMessage 
                      key={msg.id} 
                      message={enrichedMessage} 
                      onCopyText={(text) => {
                        if (typeof text === 'string') handleCopyText(text);
                        else handleCopyText(messageContent); 
                      }}
                      onCopyCode={handleCopyCode}
                    />
                  );
                }
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </main>

        {activeSessionId && (
          <ChatInput
            input={input}
            setInput={setInput}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            isAiTyping={isAiTyping}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPage;