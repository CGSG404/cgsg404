// Simple test to check middleware behavior
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ixqjqjqjqjqjqjqjqjqj.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

async function testMiddleware() {
  console.log('🔍 Testing middleware behavior...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test 1: Check if is_admin function exists
    console.log('\n1️⃣ Testing is_admin RPC function...');
    const { data: isAdminResult, error: rpcError } = await supabase.rpc('is_admin');
    
    if (rpcError) {
      console.error('❌ RPC Error:', rpcError.message);
    } else {
      console.log('✅ is_admin() result:', isAdminResult);
    }
    
    // Test 2: Check session
    console.log('\n2️⃣ Testing session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session Error:', sessionError.message);
    } else {
      console.log('📋 Session:', {
        exists: !!session,
        userId: session?.user?.id,
        email: session?.user?.email
      });
    }
    
    // Test 3: Check admin_users table
    if (session) {
      console.log('\n3️⃣ Testing admin_users table...');
      const { data: adminRecord, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (adminError) {
        console.error('❌ Admin Record Error:', adminError.message);
      } else {
        console.log('👤 Admin Record:', adminRecord);
      }
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testMiddleware();
