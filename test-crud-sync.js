// Test script untuk verifikasi CRUD synchronization
// Run dengan: node test-crud-sync.js

const BASE_URL = 'http://localhost:3000';

async function testCRUDSync() {
  console.log('🧪 Testing CRUD Synchronization...\n');

  try {
    // Test 1: Fetch public reports
    console.log('📊 Test 1: Fetching public reports...');
    const publicResponse = await fetch(`${BASE_URL}/api/reports`);
    const publicData = await publicResponse.json();
    console.log('✅ Public API Response:', publicData.reports?.length || 0, 'reports');
    
    // Test 2: Fetch admin reports
    console.log('\n📊 Test 2: Fetching admin reports...');
    const adminResponse = await fetch(`${BASE_URL}/api/admin/reports`);
    const adminData = await adminResponse.json();
    console.log('✅ Admin API Response:', adminData.reports?.length || 0, 'reports');
    
    // Test 3: Compare data consistency
    console.log('\n🔍 Test 3: Comparing data consistency...');
    if (publicData.reports && adminData.reports) {
      const publicCount = publicData.reports.length;
      const adminCount = adminData.reports.length;
      
      if (publicCount === adminCount) {
        console.log('✅ Data count matches:', publicCount, '=', adminCount);
      } else {
        console.log('❌ Data count mismatch:', publicCount, '≠', adminCount);
      }
      
      // Check first report structure
      if (publicData.reports[0] && adminData.reports[0]) {
        const publicReport = publicData.reports[0];
        const adminReport = adminData.reports[0];
        
        console.log('\n📋 Sample Report Structure:');
        console.log('Public API fields:', Object.keys(publicReport));
        console.log('Admin API fields:', Object.keys(adminReport));
        
        // Check if issue/summary field exists
        const hasIssueField = publicReport.issue || publicReport.summary;
        const hasAdminIssueField = adminReport.issue || adminReport.summary;
        
        console.log('Public has issue/summary:', !!hasIssueField);
        console.log('Admin has issue/summary:', !!hasAdminIssueField);
      }
    }
    
    // Test 4: Create new report (admin only)
    console.log('\n📝 Test 4: Testing CREATE operation...');
    const testReport = {
      casino_name: 'Test Casino CRUD',
      status: 'Scam Indicated',
      last_reported: new Date().toISOString().split('T')[0],
      issue: 'Test CRUD synchronization - ' + Date.now(),
      reporter_email: 'test@example.com',
      url: 'https://example.com'
    };
    
    const createResponse = await fetch(`${BASE_URL}/api/admin/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testReport),
    });
    
    if (createResponse.ok) {
      const createResult = await createResponse.json();
      console.log('✅ CREATE successful:', createResult.report?.id);
      
      // Test 5: Verify synchronization
      console.log('\n🔄 Test 5: Verifying synchronization...');
      
      // Wait a moment for database to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch both APIs again
      const newPublicResponse = await fetch(`${BASE_URL}/api/reports`);
      const newPublicData = await newPublicResponse.json();
      
      const newAdminResponse = await fetch(`${BASE_URL}/api/admin/reports`);
      const newAdminData = await newAdminResponse.json();
      
      const newPublicCount = newPublicData.reports?.length || 0;
      const newAdminCount = newAdminData.reports?.length || 0;
      
      console.log('New public count:', newPublicCount);
      console.log('New admin count:', newAdminCount);
      
      if (newPublicCount === newAdminCount) {
        console.log('✅ CRUD Synchronization working correctly!');
      } else {
        console.log('❌ CRUD Synchronization issue detected!');
      }
      
      // Clean up - delete test report
      if (createResult.report?.id) {
        console.log('\n🗑️ Cleaning up test data...');
        const deleteResponse = await fetch(`${BASE_URL}/api/admin/reports/${createResult.report.id}`, {
          method: 'DELETE',
        });
        
        if (deleteResponse.ok) {
          console.log('✅ Test data cleaned up successfully');
        } else {
          console.log('⚠️ Failed to clean up test data');
        }
      }
      
    } else {
      const error = await createResponse.json();
      console.log('❌ CREATE failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCRUDSync();
