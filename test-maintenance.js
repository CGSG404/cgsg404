// Test Maintenance System
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testMaintenanceSystem() {
  console.log('🔍 Testing Maintenance System...\n');

  try {
    // 1. Test get_page_maintenance_status RPC
    console.log('1. Testing get_page_maintenance_status RPC:');
    const { data: maintenanceData, error: maintenanceError } = await supabase.rpc('get_page_maintenance_status', {
      page_path_param: '/'
    });
    
    console.log('   Result:', maintenanceData);
    console.log('   Error:', maintenanceError?.message || 'None');
    console.log('');

    // 2. Test page_maintenance table direct access
    console.log('2. Testing page_maintenance table:');
    const { data: tableData, error: tableError } = await supabase
      .from('page_maintenance')
      .select('*')
      .limit(5);
    
    console.log('   Records found:', tableData?.length || 0);
    console.log('   Sample data:', tableData?.[0] || 'None');
    console.log('   Error:', tableError?.message || 'None');
    console.log('');

    // 3. Test is_admin RPC (without auth)
    console.log('3. Testing is_admin RPC (should fail without auth):');
    const { data: adminData, error: adminError } = await supabase.rpc('is_admin');
    console.log('   Result:', adminData);
    console.log('   Error:', adminError?.message || 'None');
    console.log('');

    // 4. Summary
    console.log('📊 SUMMARY:');
    console.log('   ✅ Maintenance RPC:', !maintenanceError ? 'Working' : 'Failed');
    console.log('   ✅ Maintenance Table:', !tableError ? 'Working' : 'Failed');
    console.log('   ⚠️ Admin RPC:', adminError ? 'Requires Auth (Expected)' : 'Working');
    
    if (maintenanceData && maintenanceData.length > 0) {
      console.log('\n🎯 CURRENT MAINTENANCE STATUS:');
      console.log('   Homepage (/) is in maintenance:', maintenanceData[0].is_maintenance);
      console.log('   Message:', maintenanceData[0].maintenance_message || 'None');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMaintenanceSystem();