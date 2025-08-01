// Test script untuk memverifikasi DELETE authentication
console.log('🧪 Testing DELETE authentication...');

async function testDeleteAuth() {
  try {
    // Test 1: DELETE tanpa authentication (should fail)
    console.log('\n1️⃣ Testing DELETE without authentication...');
    const response1 = await fetch('http://localhost:3000/api/admin/reports/1', {
      method: 'DELETE',
    });
    
    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', result1);
    
    if (response1.status === 401 || response1.status === 403) {
      console.log('✅ PASS: DELETE properly blocked without authentication');
    } else {
      console.log('❌ FAIL: DELETE should be blocked without authentication');
    }
    
    // Test 2: Check if old endpoint is disabled
    console.log('\n2️⃣ Testing old DELETE endpoint...');
    const response2 = await fetch('http://localhost:3000/api/admin/reports?id=1', {
      method: 'DELETE',
    });
    
    const result2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Response:', result2);
    
    if (response2.status === 400 && result2.error?.includes('Use /api/admin/reports/[id]')) {
      console.log('✅ PASS: Old endpoint properly redirects');
    } else {
      console.log('❌ FAIL: Old endpoint should redirect to new endpoint');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run test if this is executed directly
if (typeof window === 'undefined') {
  testDeleteAuth();
}
