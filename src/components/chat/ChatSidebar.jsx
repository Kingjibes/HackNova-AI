import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Trash2, Terminal } from 'lucide-react';

const ChatSidebar = ({ chatSessions, activeSessionId, onSelectSession, onNewChat, onDeleteSession, isOpen, onClose }) => {
  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const getSessionDisplayName = (session) => {
    if (session.name) return session.name;
    if (session.messages && session.messages.length > 1) {
      const firstUserMessage = session.messages.find(msg => msg.sender === 'user');
      return firstUserMessage ? firstUserMessage.content.substring(0, 30) + '...' : `Chat ${session.id.substring(0, 4)}`;
    }
    return `New Chat ${session.id.substring(0, 4)}`;
  };
  
  return (
    <motion.div
      variants={sidebarVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className={`fixed inset-y-0 left-0 z-20 flex flex-col w-64 bg-secondary/70 backdrop-blur-lg border-r border-border/50 p-4 space-y-4 md:relative md:translate-x-0 md:w-72 transform transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div className="flex items-center space-x-2">
          <Terminal className="h-7 w-7 text-primary" />
          <h2 className="text-xl font-bold text-primary-foreground">HackNova AI</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden text-primary-foreground">
          &times;
        </Button>
      </div>

      <Button
        onClick={onNewChat}
        className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground neumorphic-shadow"
      >
        <MessageSquarePlus className="h-5 w-5" />
        <span>New Chat</span>
      </Button>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <h3 className="text-sm font-semibold text-muted-foreground px-2 pt-2">Chat History</h3>
        {chatSessions.length === 0 && (
          <p className="text-xs text-muted-foreground px-2">No chats yet. Start a new one!</p>
        )}
        {chatSessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors group ${
              activeSessionId === session.id ? 'bg-primary/20 text-primary-foreground' : 'hover:bg-primary/10'
            }`}
            onClick={() => onSelectSession(session.id)}
          >
            <span className="truncate text-sm">{getSessionDisplayName(session)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              aria-label="Delete chat session"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-border/30">
        <p className="text-xs text-muted-foreground text-center">Developed by Hackerpro</p>
      </div>
    </motion.div>
  );
};

export default ChatSidebar;