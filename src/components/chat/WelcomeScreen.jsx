import React from 'react';
import { motion } from 'framer-motion';
import { Skull } from 'lucide-react';

const WelcomeScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Skull className="h-20 w-20 md:h-28 md:w-28 text-primary animate-pulse mb-6" />
      </motion.div>
      <motion.h1
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-green-400 to-teal-400 mb-3"
      >
        Hi, I'm HackNova AI
      </motion.h1>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-lg md:text-xl text-muted-foreground"
      >
        Developed by Hackerpro. How can I assist you today?
      </motion.p>
    </motion.div>
  );
};

export default WelcomeScreen;