import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Menu } from 'lucide-react';

const ChatHeader = ({ onNewChat, onToggleSidebar, currentChatName }) => {
  return (
    <header className="p-4 border-b border-border/50 shadow-md bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
        <Menu className="h-6 w-6 text-primary" />
      </Button>
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-lg font-semibold text-foreground truncate" title={currentChatName}>
          {currentChatName || "New Chat"}
        </h2>
      </div>
      <Button variant="ghost" size="icon" onClick={onNewChat} className="text-primary hover:text-primary/80 transition-colors">
        <MessageSquarePlus className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default ChatHeader;