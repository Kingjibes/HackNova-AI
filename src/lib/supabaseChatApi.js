import { supabase } from './supabaseClient';

export const loadChatSessionsFromSupabase = async () => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('session_id, content, sender, timestamp')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }

  const sessionsMap = new Map();
  data.forEach(msg => {
    if (!sessionsMap.has(msg.session_id)) {
      sessionsMap.set(msg.session_id, { id: msg.session_id, messages: [], lastActivity: new Date(0) });
    }
    const session = sessionsMap.get(msg.session_id);
    session.messages.push(msg);
    if (new Date(msg.timestamp) > session.lastActivity) {
      session.lastActivity = new Date(msg.timestamp);
    }
  });
  
  return Array.from(sessionsMap.values())
    .sort((a, b) => b.lastActivity - a.lastActivity);
};

export const fetchChatHistoryFromSupabase = async (sessionId) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching chat history:', error);
    return null;
  }
  return data.map(msg => ({...msg, timestamp: new Date(msg.timestamp).toISOString()}));
};

export const addMessageToSupabase = async (message) => {
  const { error } = await supabase.from('chat_messages').insert([message]);
  if (error) {
    console.error('Error saving message to Supabase:', error);
    return false;
  }
  return true;
};

export const deleteSessionFromSupabase = async (sessionId) => {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error deleting session:', error);
    return false;
  }
  return true;
};