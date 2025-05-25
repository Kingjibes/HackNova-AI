import React from 'react';
import ChatPage from '@/pages/ChatPage';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ChatPage />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;