const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://plhpubcmugqosexcgdhj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaHB1YmNtdWdxb3NleGNnZGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTM1MjQsImV4cCI6MjA2NjI2OTUyNH0.RvL-jUkEiCBrCywqC5dC2c8VxSt6ifjBRekkm82sMH4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAdminStatus() {
  console.log('🔍 Debugging Admin Status...\n');
  
  try {
    // 1. Check users table
    console.log('1️⃣ Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role, is_admin, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
    } else {
      console.log('👥 Recent users:', users);
    }
    
    // 2. Check admin_users table
    console.log('\n2️⃣ Checking admin_users table...');
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(10);
      
    if (adminError) {
      console.error('❌ Error fetching admin_users:', adminError.message);
    } else {
      console.log('👑 Admin users:', adminUsers);
    }
    
    // 3. Check auth.users (if accessible)
    console.log('\n3️⃣ Checking auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message);
    } else {
      console.log('🔐 Auth users:', authUsers.users.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at
      })));
    }
    
    // 4. Test is_admin RPC function
    console.log('\n4️⃣ Testing is_admin RPC function...');
    const { data: isAdminResult, error: rpcError } = await supabase.rpc('is_admin');
    
    if (rpcError) {
      console.error('❌ RPC is_admin error:', rpcError.message);
    } else {
      console.log('🔧 is_admin() result:', isAdminResult);
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

debugAdminStatus();
