import React from 'react';
import { motion } from 'framer-motion';

export const TypingLoader = ({ inline = false }) => {
  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -3, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const containerClass = inline 
    ? "flex items-center space-x-1 ml-2" 
    : "flex items-center space-x-1 p-2 pl-4";

  return (
    <div className={containerClass}>
      {!inline && <span className="text-xs text-muted-foreground">HackNova AI is typing</span>}
      <motion.div variants={dotVariants} initial="initial" animate="animate" className="w-1.5 h-1.5 bg-primary rounded-full" style={{ animationDelay: '0.1s' }} />
      <motion.div variants={dotVariants} initial="initial" animate="animate" className="w-1.5 h-1.5 bg-primary rounded-full" style={{ animationDelay: '0.2s' }} />
      <motion.div variants={dotVariants} initial="initial" animate="animate" className="w-1.5 h-1.5 bg-primary rounded-full" style={{ animationDelay: '0.3s' }} />
    </div>
  );
};