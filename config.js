// Supabase Configuration
// Replace these values with your actual Supabase project credentials
const SUPABASE_URL = 'https://vpzhhfpfgjzpanihbfqn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwemhoZnBmZ2p6cGFuaWhiZnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzUyNzAsImV4cCI6MjA4NDY1MTI3MH0.GmnjdUF1bEtfJJPCTbv2AiuuCG3seub-4-zd-1HPpAg';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Make it globally available
window.supabaseClient = supabaseClient;