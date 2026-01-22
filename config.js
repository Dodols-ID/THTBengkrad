// Supabase Configuration
// Replace these values with your actual Supabase project credentials
const SUPABASE_URL = 'https://vpzhhfpfgjzpanihbfqn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZnN1Z3RlcXZsa2NyeWp4c3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzQ1NDYsImV4cCI6MjA4NDY1MDU0Nn0.YYjlocc-c4CgaS9QTqDBVGBZ7WbLhWJtzlGXHiT8Fqo';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Make it globally available
window.supabaseClient = supabaseClient;