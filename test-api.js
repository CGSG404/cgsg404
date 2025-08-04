const fetch = require('node-fetch');

async function testBannersAPI() {
  try {
    console.log('🧪 Testing Banners API...');
    
    const response = await fetch('http://localhost:3000/api/admin/banners?page_type=home');
    const data = await response.json();
    
    console.log('📊 API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.banners && data.banners.length > 0) {
      console.log(`✅ SUCCESS: Found ${data.banners.length} banners`);
      console.log('🎉 Database connection working!');
    } else {
      console.log('⚠️ WARNING: No banners found, using fallback data');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testBannersAPI(); 