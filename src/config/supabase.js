const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client with anon key (for client-side operations)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create Supabase admin client with service role key (for server-side operations)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database connection test
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('workshop_registrations').select('count').single();
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err.message);
    return false;
  }
};

module.exports = {
  supabase,
  supabaseAdmin,
  testConnection
};
