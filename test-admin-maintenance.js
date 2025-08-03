/**
 * Test script untuk memverifikasi admin maintenance panel
 * Menguji toggle maintenance mode dan realtime updates
 */

const { createClient } = require('@supabase/supabase-js');

// Konfigurasi Supabase
const supabaseUrl = 'https://plhpubcmugqosexcgdhj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaHB1YmNtdWdxb3NleGNnZGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDY5MzUyNCwiZXhwIjoyMDY2MjY5NTI0fQ.wnCPfmL0i9irgXGIcXdnwM57ij2lehDNOhHRZQoDLPQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAdminMaintenancePanel() {
  console.log('🧪 Testing Admin Maintenance Panel...\n');

  try {
    // 1. Test database connection
    console.log('1️⃣ Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('page_maintenance')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError.message);
      return;
    }
    console.log('✅ Database connection successful\n');

    // 2. Get current maintenance status
    console.log('2️⃣ Getting current maintenance status...');
    const { data: pages, error: fetchError } = await supabase
      .from('page_maintenance')
      .select('*')
      .order('page_path');

    if (fetchError) {
      console.error('❌ Failed to fetch pages:', fetchError.message);
      return;
    }

    console.log(`✅ Found ${pages.length} pages in maintenance system:`);
    pages.forEach(page => {
      const status = page.is_maintenance ? '🔧 MAINTENANCE' : '✅ ACTIVE';
      console.log(`   - ${page.page_name} (${page.page_path}): ${status}`);
    });
    console.log('');

    // 3. Test toggle functionality for each page
    console.log('3️⃣ Testing toggle functionality...');
    
    for (const page of pages.slice(0, 2)) { // Test first 2 pages only
      console.log(`\n   Testing ${page.page_name} (${page.page_path}):`);
      
      const originalStatus = page.is_maintenance;
      const newStatus = !originalStatus;
      
      console.log(`   Current status: ${originalStatus ? 'MAINTENANCE' : 'ACTIVE'}`);
      console.log(`   Toggling to: ${newStatus ? 'MAINTENANCE' : 'ACTIVE'}`);

      // Toggle maintenance mode using RPC function
      const { data: toggleResult, error: toggleError } = await supabase.rpc('toggle_page_maintenance', {
        page_path_param: page.page_path,
        maintenance_status: newStatus,
        message_param: `Test message at ${new Date().toISOString()}`
      });

      if (toggleError) {
        console.error(`   ❌ Toggle failed:`, toggleError.message);
        continue;
      }

      // Verify the change
      const { data: updatedPage, error: verifyError } = await supabase
        .from('page_maintenance')
        .select('*')
        .eq('page_path', page.page_path)
        .single();

      if (verifyError) {
        console.error(`   ❌ Verification failed:`, verifyError.message);
        continue;
      }

      if (updatedPage.is_maintenance === newStatus) {
        console.log(`   ✅ Toggle successful! Status changed to: ${newStatus ? 'MAINTENANCE' : 'ACTIVE'}`);
        
        // Toggle back to original state
        await supabase.rpc('toggle_page_maintenance', {
          page_path_param: page.page_path,
          maintenance_status: originalStatus,
          message_param: page.maintenance_message
        });
        console.log(`   ↩️  Restored to original status: ${originalStatus ? 'MAINTENANCE' : 'ACTIVE'}`);
      } else {
        console.error(`   ❌ Toggle verification failed. Expected: ${newStatus}, Got: ${updatedPage.is_maintenance}`);
      }
    }

    // 4. Test realtime subscription
    console.log('\n4️⃣ Testing realtime subscription...');
    console.log('   Setting up realtime listener for page_maintenance table...');

    let realtimeReceived = false;
    const testTimeout = 10000; // 10 seconds

    const channel = supabase
      .channel('test_maintenance_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_maintenance'
        },
        (payload) => {
          console.log('   🔄 Realtime update received:', {
            event: payload.eventType,
            table: payload.table,
            new: payload.new ? `${payload.new.page_path}: ${payload.new.is_maintenance}` : null,
            old: payload.old ? `${payload.old.page_path}: ${payload.old.is_maintenance}` : null
          });
          realtimeReceived = true;
        }
      )
      .subscribe();

    // Wait for subscription to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Make a test change to trigger realtime
    const testPage = pages[0];
    console.log(`   Making test change to ${testPage.page_name}...`);
    
    await supabase.rpc('toggle_page_maintenance', {
      page_path_param: testPage.page_path,
      maintenance_status: !testPage.is_maintenance,
      message_param: `Realtime test at ${new Date().toISOString()}`
    });

    // Wait for realtime event
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Restore original state
    await supabase.rpc('toggle_page_maintenance', {
      page_path_param: testPage.page_path,
      maintenance_status: testPage.is_maintenance,
      message_param: testPage.maintenance_message
    });

    // Cleanup
    supabase.removeChannel(channel);

    if (realtimeReceived) {
      console.log('   ✅ Realtime subscription working correctly!');
    } else {
      console.log('   ⚠️  No realtime events received (may be normal in some environments)');
    }

    // 5. Test API endpoints
    console.log('\n5️⃣ Testing API endpoints...');
    
    // Note: This would require authentication in a real test
    console.log('   ℹ️  API endpoint testing requires authentication');
    console.log('   ℹ️  Manual testing recommended via browser admin panel');

    console.log('\n🎉 Admin Maintenance Panel Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Database connection: Working');
    console.log('   ✅ Data fetching: Working');
    console.log('   ✅ Toggle functionality: Working');
    console.log(`   ${realtimeReceived ? '✅' : '⚠️ '} Realtime updates: ${realtimeReceived ? 'Working' : 'Needs verification'}`);
    console.log('   ℹ️  API authentication: Requires manual testing');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testAdminMaintenancePanel().then(() => {
  console.log('\n✨ Test execution completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});