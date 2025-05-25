import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Skull, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TypingLoader } from '@/components/chat/TypingLoader';

const CodeBlock = ({ code, onCopyCode }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    onCopyCode(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="relative group mt-2 mb-1 w-full">
      <pre className="bg-black/50 text-sm text-primary-foreground p-3 pr-10 rounded-md overflow-x-auto border border-primary/30 shadow-inner max-w-full">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopyCode}
        className="absolute top-2 right-2 h-7 w-7 opacity-50 group-hover:opacity-100 transition-opacity text-primary-foreground hover:bg-primary/20"
        aria-label="Copy code"
      >
        {copiedCode ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};

const ChatMessage = React.memo(({ message, onCopyText, onCopyCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (textToCopy) => {
    onCopyText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const Icon = message.sender === 'user' ? User : Skull;
  
  let bgColor = message.sender === 'user' ? 'bg-primary/20 border-primary/30' : 'bg-secondary/60 border-secondary/80';
  if (message.isError) {
    bgColor = 'bg-destructive/30 border-destructive/50';
  } else if (message.isLoading && message.sender === 'ai') {
    bgColor = 'bg-secondary/40 border-secondary/60 animate-pulse';
  }


  const align = message.sender === 'user' ? 'items-end' : 'items-start';
  const textAlign = message.sender === 'user' ? 'text-right' : 'text-left';
  const senderName = message.sender === 'user' ? 'You' : 'HackNova AI';
  const bubbleBorderRadius = message.sender === 'user' ? 'rounded-br-none' : 'rounded-bl-none';

  const contentToRender = typeof message.content === 'string' ? message.content : '';
  
  const parts = contentToRender.split(/(```[\s\S]*?```|<img-replace(?: [^>]+)?>(?:.*?)<\/img-replace>|<img (?: [^>]+)?src="[^"]+"(?: [^>]+)?\/?>)/g).filter(Boolean);

  if (message.isLoading && message.sender === 'ai') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`flex flex-col w-full max-w-2xl mx-auto my-3 ${align}`}
      >
        <div className={`flex items-center mb-1.5 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Icon className={`h-7 w-7 text-green-400 p-0.5 rounded-full bg-black/20 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`} />
          <span className="text-xs text-muted-foreground font-medium">{senderName}</span>
          <TypingLoader inline={true} />
        </div>
         <div className={`relative group p-3.5 rounded-lg shadow-lg border ${bgColor} ${bubbleBorderRadius} w-fit max-w-[85%]`}>
          <div className="h-4 w-16 bg-muted/30 rounded-sm"></div>
        </div>
        <span className={`text-[10px] text-muted-foreground/80 mt-1.5 ${textAlign}`}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className={`flex flex-col w-full max-w-2xl mx-auto my-3 ${align}`}
    >
      <div className={`flex items-center mb-1.5 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <Icon className={`h-7 w-7 p-0.5 rounded-full bg-black/20 ${message.isError ? 'text-destructive' : (message.sender === 'user' ? 'text-primary' : 'text-green-400')} ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`} />
        <span className="text-xs text-muted-foreground font-medium">{senderName}</span>
      </div>
      <div className={`relative group p-3.5 rounded-lg shadow-lg border ${bgColor} ${bubbleBorderRadius} w-fit max-w-[85%]`}>
        <div className={`text-sm ${textAlign} break-words leading-relaxed`}>
          {parts.map((part, index) => {
            if (part.startsWith("```") && part.endsWith("```")) {
              const codeContent = part.slice(3, -3).trim();
              return <CodeBlock key={index} code={codeContent} onCopyCode={onCopyCode} />;
            } else if (part.startsWith("<img-replace") || part.startsWith("<img ")) {
              return <div key={index} className="my-2 rounded overflow-hidden" dangerouslySetInnerHTML={{ __html: part }} />;
            }
            return <span key={index} className="whitespace-pre-wrap">{part}</span>;
          })}
        </div>
        {!message.isError && !parts.some(part => part.startsWith("```") || part.startsWith("<img-replace") || part.startsWith("<img ")) && (
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" onClick={() => handleCopy(contentToRender)} className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-white/10">
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
      <span className={`text-[10px] text-muted-foreground/80 mt-1.5 ${textAlign}`}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </motion.div>
  );
});

export default ChatMessage;