// Toggle Maintenance Mode Test
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function toggleMaintenanceMode(pagePath, isMaintenanceMode, message = null) {
  console.log(`🔧 Toggling maintenance mode for ${pagePath}...`);
  console.log(`   Setting to: ${isMaintenanceMode ? 'ON' : 'OFF'}`);
  
  try {
    // Use the toggle_page_maintenance RPC function
    const { data, error } = await supabase.rpc('toggle_page_maintenance', {
      page_path_param: pagePath,
      maintenance_status: isMaintenanceMode,
      message_param: message
    });

    if (error) {
      console.error('❌ Toggle failed:', error.message);
      return false;
    }

    console.log('✅ Toggle successful:', data);
    
    // Verify the change
    const { data: verifyData, error: verifyError } = await supabase.rpc('get_page_maintenance_status', {
      page_path_param: pagePath
    });
    
    if (!verifyError && verifyData && verifyData.length > 0) {
      console.log('🔍 Verification:');
      console.log('   Is maintenance:', verifyData[0].is_maintenance);
      console.log('   Message:', verifyData[0].maintenance_message);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const action = args[0] || 'on';
  const pagePath = args[1] || '/';
  const message = args[2] || 'This page is currently under maintenance. Please check back soon.';

  console.log('🔧 Maintenance Toggle Tool\n');

  if (action === 'on') {
    await toggleMaintenanceMode(pagePath, true, message);
  } else if (action === 'off') {
    await toggleMaintenanceMode(pagePath, false);
  } else if (action === 'status') {
    console.log(`🔍 Checking maintenance status for ${pagePath}...`);
    const { data, error } = await supabase.rpc('get_page_maintenance_status', {
      page_path_param: pagePath
    });
    
    if (error) {
      console.error('❌ Status check failed:', error.message);
    } else if (data && data.length > 0) {
      console.log('📊 Current Status:');
      console.log('   Page:', pagePath);
      console.log('   Is maintenance:', data[0].is_maintenance);
      console.log('   Message:', data[0].maintenance_message || 'None');
    } else {
      console.log('❌ No maintenance data found for this page');
    }
  } else {
    console.log('Usage:');
    console.log('  node toggle-maintenance.js on [page] [message]   - Turn maintenance ON');
    console.log('  node toggle-maintenance.js off [page]            - Turn maintenance OFF');
    console.log('  node toggle-maintenance.js status [page]         - Check status');
    console.log('');
    console.log('Examples:');
    console.log('  node toggle-maintenance.js on / "Homepage under maintenance"');
    console.log('  node toggle-maintenance.js off /');
    console.log('  node toggle-maintenance.js status /');
  }
}

main().catch(console.error);