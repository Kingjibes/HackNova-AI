import React, { useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ChatInput = ({ input, setInput, handleSendMessage, isLoading, isAiTyping }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && input.trim() !== '' && !isAiTyping) {
        handleSendMessage(event);
      }
    }
  };

  return (
    <footer className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-md">
      <form onSubmit={handleSendMessage} className="container mx-auto flex items-end space-x-3 max-w-3xl">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="flex-1 bg-secondary/30 border-primary/30 focus:ring-primary neumorphic-shadow-inset resize-none overflow-hidden min-h-[40px] max-h-[200px] py-2 leading-tight"
          rows={1}
          disabled={isLoading || isAiTyping}
        />
        <Button
          type="submit"
          variant="default"
          size="icon"
          disabled={isLoading || isAiTyping || input.trim() === ''}
          className="bg-gradient-to-br from-primary to-green-500 hover:from-primary/90 hover:to-green-500/90 text-primary-foreground neumorphic-shadow mb-1"
          aria-label="Send message"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </form>
    </footer>
  );
};

export default ChatInput;