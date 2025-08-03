// Direct Maintenance Toggle (bypass RPC)
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

async function directToggleMaintenance(pagePath, isMaintenanceMode, message = null) {
  console.log(`🔧 Direct toggle maintenance for ${pagePath}...`);
  console.log(`   Setting to: ${isMaintenanceMode ? 'ON' : 'OFF'}`);
  
  try {
    // Update directly in the table
    const updateData = {
      is_maintenance: isMaintenanceMode,
      updated_at: new Date().toISOString()
    };
    
    if (message) {
      updateData.maintenance_message = message;
    }
    
    const { data, error } = await supabase
      .from('page_maintenance')
      .update(updateData)
      .eq('page_path', pagePath)
      .select();

    if (error) {
      console.error('❌ Direct update failed:', error.message);
      return false;
    }

    if (!data || data.length === 0) {
      console.log('❌ No records updated. Page path might not exist in database.');
      return false;
    }

    console.log('✅ Direct update successful:');
    console.log('   Page:', data[0].page_path);
    console.log('   Is maintenance:', data[0].is_maintenance);
    console.log('   Message:', data[0].maintenance_message);
    console.log('   Updated at:', data[0].updated_at);
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function listAllPages() {
  console.log('📋 All maintenance pages:');
  
  const { data, error } = await supabase
    .from('page_maintenance')
    .select('*')
    .order('page_path');
    
  if (error) {
    console.error('❌ Failed to fetch pages:', error.message);
    return;
  }
  
  data.forEach((page, index) => {
    console.log(`   ${index + 1}. ${page.page_path} (${page.page_name})`);
    console.log(`      Maintenance: ${page.is_maintenance ? 'ON' : 'OFF'}`);
    console.log(`      Message: ${page.maintenance_message || 'None'}`);
    console.log('');
  });
}

async function main() {
  const args = process.argv.slice(2);
  const action = args[0] || 'list';
  const pagePath = args[1] || '/';
  const message = args[2] || 'This page is currently under maintenance. Please check back soon.';

  console.log('🔧 Direct Maintenance Toggle Tool\n');

  if (action === 'on') {
    await directToggleMaintenance(pagePath, true, message);
  } else if (action === 'off') {
    await directToggleMaintenance(pagePath, false);
  } else if (action === 'list') {
    await listAllPages();
  } else {
    console.log('Usage:');
    console.log('  node direct-maintenance-toggle.js on [page] [message]   - Turn maintenance ON');
    console.log('  node direct-maintenance-toggle.js off [page]            - Turn maintenance OFF');
    console.log('  node direct-maintenance-toggle.js list                  - List all pages');
    console.log('');
    console.log('Examples:');
    console.log('  node direct-maintenance-toggle.js on / "Homepage under maintenance"');
    console.log('  node direct-maintenance-toggle.js off /');
    console.log('  node direct-maintenance-toggle.js list');
  }
}

main().catch(console.error);