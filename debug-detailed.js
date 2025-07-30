// Detailed debug script untuk casino reports
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function debugDetailed() {
  console.log('🔍 DETAILED DEBUG CASINO REPORTS');
  console.log('================================');

  // Test 1: Direct Supabase connection with anon key
  console.log('\n1️⃣ Testing direct Supabase with ANON key...');
  const supabaseAnon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('casino_reports')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('ANON Result:', {
      success: !anonError,
      error: anonError?.message,
      count: anonData?.length || 0,
      data: anonData?.slice(0, 2) // Show first 2 records
    });
  } catch (err) {
    console.log('ANON Error:', err.message);
  }

  // Test 2: Direct Supabase connection with service role key
  console.log('\n2️⃣ Testing direct Supabase with SERVICE ROLE key...');
  const supabaseService = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data: serviceData, error: serviceError } = await supabaseService
      .from('casino_reports')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('SERVICE Result:', {
      success: !serviceError,
      error: serviceError?.message,
      count: serviceData?.length || 0,
      data: serviceData?.slice(0, 2) // Show first 2 records
    });
  } catch (err) {
    console.log('SERVICE Error:', err.message);
  }

  // Test 3: Create a test record with service role
  console.log('\n3️⃣ Creating test record with SERVICE ROLE...');
  try {
    const testData = {
      casino_name: 'Debug Test Casino',
      status: 'Unlicensed',
      last_reported: '2024-12-30',
      summary: 'This is a debug test record to verify database operations.',
      url: 'https://debug-test.com'
    };

    const { data: createData, error: createError } = await supabaseService
      .from('casino_reports')
      .insert(testData)
      .select()
      .single();

    console.log('CREATE Result:', {
      success: !createError,
      error: createError?.message,
      data: createData
    });

    if (createData) {
      // Test 4: Verify the record can be read with anon key
      console.log('\n4️⃣ Verifying record can be read with ANON key...');
      
      const { data: verifyData, error: verifyError } = await supabaseAnon
        .from('casino_reports')
        .select('*')
        .eq('id', createData.id)
        .single();

      console.log('VERIFY Result:', {
        success: !verifyError,
        error: verifyError?.message,
        data: verifyData
      });

      // Test 5: Fetch all records again with anon key
      console.log('\n5️⃣ Fetching all records with ANON key after create...');
      
      const { data: allData, error: allError } = await supabaseAnon
        .from('casino_reports')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('ALL RECORDS Result:', {
        success: !allError,
        error: allError?.message,
        count: allData?.length || 0,
        latestRecord: allData?.[0]
      });
    }
  } catch (err) {
    console.log('CREATE Error:', err.message);
  }

  console.log('\n🎯 DEBUG COMPLETED');
}

// Run debug
debugDetailed().catch(console.error);
