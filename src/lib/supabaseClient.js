import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://adfqtofxomlnrkdkzjjb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZnF0b2Z4b21sbnJrZGt6ampiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDc3ODMsImV4cCI6MjA2MzUyMzc4M30.Qp3fMAg9dssesh2MzomfX9rpwE_MOBIOavvP4b2EMGI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);