// Test script untuk API endpoints yang baru
console.log('🧪 Testing new casino reports API...');

async function testAPI() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    // Test 1: Public GET endpoint
    console.log('\n1️⃣ Testing public GET /api/casino-reports...');
    const response1 = await fetch(`${baseUrl}/api/casino-reports`);
    const result1 = await response1.json();
    
    console.log('Status:', response1.status);
    console.log('Response:', result1);
    
    if (response1.ok && result1.success) {
      console.log(`✅ PASS: Public endpoint returned ${result1.data.length} reports`);
    } else {
      console.log('❌ FAIL: Public endpoint failed');
    }
    
    // Test 2: Admin GET endpoint (with development bypass)
    console.log('\n2️⃣ Testing admin GET /api/admin/casino-reports...');
    const response2 = await fetch(`${baseUrl}/api/admin/casino-reports`);
    const result2 = await response2.json();
    
    console.log('Status:', response2.status);
    console.log('Response:', result2);
    
    if (response2.ok && result2.success) {
      console.log(`✅ PASS: Admin endpoint returned ${result2.data.length} reports`);
    } else {
      console.log('❌ FAIL: Admin endpoint failed');
    }
    
    // Test 3: Admin POST endpoint (create new report)
    console.log('\n3️⃣ Testing admin POST /api/admin/casino-reports...');
    const testReport = {
      casino_name: 'Test Casino API',
      status: 'Unlicensed',
      last_reported: '2024-12-30',
      summary: 'This is a test report created via API to verify CRUD functionality.',
      url: 'https://example.com'
    };
    
    const response3 = await fetch(`${baseUrl}/api/admin/casino-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testReport)
    });
    const result3 = await response3.json();
    
    console.log('Status:', response3.status);
    console.log('Response:', result3);
    
    if (response3.ok && result3.success) {
      console.log('✅ PASS: Report created successfully');
      const createdId = result3.data.id;
      
      // Test 4: Admin PUT endpoint (update report)
      console.log('\n4️⃣ Testing admin PUT /api/admin/casino-reports/[id]...');
      const updateData = {
        casino_name: 'Updated Test Casino',
        summary: 'This report has been updated via API test.'
      };
      
      const response4 = await fetch(`${baseUrl}/api/admin/casino-reports/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const result4 = await response4.json();
      
      console.log('Status:', response4.status);
      console.log('Response:', result4);
      
      if (response4.ok && result4.success) {
        console.log('✅ PASS: Report updated successfully');
      } else {
        console.log('❌ FAIL: Update failed');
      }
      
      // Test 5: Admin DELETE endpoint
      console.log('\n5️⃣ Testing admin DELETE /api/admin/casino-reports/[id]...');
      const response5 = await fetch(`${baseUrl}/api/admin/casino-reports/${createdId}`, {
        method: 'DELETE'
      });
      const result5 = await response5.json();
      
      console.log('Status:', response5.status);
      console.log('Response:', result5);
      
      if (response5.ok && result5.success) {
        console.log('✅ PASS: Report deleted successfully');
      } else {
        console.log('❌ FAIL: Delete failed');
      }
      
    } else {
      console.log('❌ FAIL: Create failed, skipping update/delete tests');
    }
    
    console.log('\n🎉 API testing completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run test
testAPI();
