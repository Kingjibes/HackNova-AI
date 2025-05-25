export const getSessionDisplayName = (session) => {
  if (!session) return "New Chat";
  if (session.name) return session.name;
  
  if (session.messages && session.messages.length > 0) {
    const firstUserMessage = session.messages.find(msg => msg.sender === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
    }
    const firstMessage = session.messages[0];
    if (firstMessage) {
        return firstMessage.content.substring(0, 30) + (firstMessage.content.length > 30 ? '...' : '');
    }
  }
  return `Chat ${session.id ? session.id.substring(0, 4) : 'New'}`;
};