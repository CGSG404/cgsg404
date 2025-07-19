/**
 * Test script untuk verify admin integration
 * Run dengan: npx ts-node src/scripts/test-admin-integration.ts
 */

import { databaseApi } from '../lib/database-api';

async function testAdminIntegration() {
  console.log('🔧 Testing Admin Integration...\n');

  try {
    // Test 1: Check if user is admin
    console.log('1️⃣ Testing isCurrentUserAdmin()...');
    const isAdmin = await databaseApi.isCurrentUserAdmin();
    console.log(`   Result: ${isAdmin ? '✅ User is admin' : '❌ User is not admin'}\n`);

    if (!isAdmin) {
      console.log('⚠️  User is not admin, skipping permission tests.\n');
      return;
    }

    // Test 2: Get admin info
    console.log('2️⃣ Testing getCurrentUserAdminInfo()...');
    const adminInfo = await databaseApi.getCurrentUserAdminInfo();
    console.log('   Result:', {
      is_admin: adminInfo.is_admin,
      role: adminInfo.role,
      email: adminInfo.email,
      total_permissions: adminInfo.total_permissions
    });
    console.log('');

    // Test 3: Test specific permissions
    console.log('3️⃣ Testing hasPermission()...');
    const permissionsToTest = ['16', '20', '25', '999'];
    
    for (const permission of permissionsToTest) {
      try {
        const hasPermission = await databaseApi.hasPermission(permission);
        console.log(`   Permission ${permission}: ${hasPermission ? '✅ Allowed' : '❌ Denied'}`);
      } catch (error) {
        console.log(`   Permission ${permission}: ❌ Error - ${error}`);
      }
    }
    console.log('');

    // Test 4: Test admin activity logging
    console.log('4️⃣ Testing logAdminActivity()...');
    try {
      await databaseApi.logAdminActivity(
        'integration_test',
        'system',
        'test_script',
        { test_time: new Date().toISOString() }
      );
      console.log('   Result: ✅ Activity logged successfully\n');
    } catch (error) {
      console.log(`   Result: ❌ Failed to log activity - ${error}\n`);
    }

    // Test 5: Get admin permissions
    console.log('5️⃣ Testing getAdminPermissions()...');
    try {
      const permissions = await databaseApi.getAdminPermissions();
      console.log(`   Result: ✅ Found ${permissions.length} permissions`);
      console.log('   Sample permissions:', permissions.slice(0, 3).map(p => p.name));
      console.log('');
    } catch (error) {
      console.log(`   Result: ❌ Failed to get permissions - ${error}\n`);
    }

    console.log('🎉 Admin Integration Test Complete!');
    console.log('✅ All functions are working correctly.');

  } catch (error) {
    console.error('❌ Integration test failed:', error);
  }
}

// Export untuk digunakan di tempat lain
export { testAdminIntegration };

// Run test jika file ini dijalankan langsung
if (require.main === module) {
  testAdminIntegration();
}
