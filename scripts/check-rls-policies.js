const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRLSPolicies() {
  console.log('🔍 Checking existing RLS policies...');

  try {
    // Check if banners table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('banners')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('❌ Table banners does not exist:', tableError.message);
      return;
    }

    console.log('✅ Banners table exists');

    // Check RLS status
    const { data: rlsStatus, error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT schemaname, tablename, rowsecurity 
        FROM pg_tables 
        WHERE tablename = 'banners' AND schemaname = 'public';
      `
    });

    if (rlsError) {
      console.warn('⚠️ Could not check RLS status:', rlsError.message);
    } else {
      console.log('📊 RLS Status:', rlsStatus);
    }

    // Check existing policies
    const { data: policies, error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT policyname, permissive, roles, cmd, qual 
        FROM pg_policies 
        WHERE tablename = 'banners' AND schemaname = 'public';
      `
    });

    if (policiesError) {
      console.warn('⚠️ Could not check policies:', policiesError.message);
    } else {
      console.log('📋 Existing Policies:');
      if (policies && policies.length > 0) {
        policies.forEach((policy, index) => {
          console.log(`  ${index + 1}. ${policy.policyname}`);
          console.log(`     Command: ${policy.cmd}`);
          console.log(`     Roles: ${policy.roles}`);
        });
      } else {
        console.log('  No policies found');
      }
    }

    // Test banner access
    console.log('\n🧪 Testing banner access...');
    const { data: banners, error: accessError } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (accessError) {
      console.error('❌ Access error:', accessError.message);
    } else {
      console.log(`✅ Successfully accessed ${banners.length} active banners`);
    }

  } catch (error) {
    console.error('❌ Error checking policies:', error);
  }
}

checkRLSPolicies(); 