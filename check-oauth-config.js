// Script to check OAuth configuration
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://plhpubcmugqosexcgdhj.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

async function checkOAuthConfig() {
  console.log('🔍 Checking OAuth Configuration...\n');
  
  console.log('📋 Current Environment:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`- NEXT_PUBLIC_SITE_URL: ${process.env.NEXT_PUBLIC_SITE_URL || 'not set'}`);
  console.log(`- Supabase URL: ${supabaseUrl}`);
  console.log(`- Current working directory: ${process.cwd()}`);
  
  console.log('\n🔧 Expected OAuth Configuration:');
  console.log('');
  console.log('📍 Supabase Dashboard → Authentication → Settings:');
  console.log('   Site URL: http://localhost:3000 (for development)');
  console.log('   Additional redirect URLs:');
  console.log('   - http://localhost:3000/auth/callback');
  console.log('   - https://www.gurusingapore.com/auth/callback');
  console.log('');
  console.log('📍 Google Cloud Console → APIs & Services → Credentials:');
  console.log('   OAuth 2.0 Client → Authorized redirect URIs:');
  console.log(`   - ${supabaseUrl}/auth/v1/callback`);
  console.log('');
  
  console.log('🚀 Testing OAuth Flow:');
  console.log('1. Make sure Supabase allows localhost redirects');
  console.log('2. Try signing in from http://localhost:3000/signin');
  console.log('3. Should redirect back to localhost after Google auth');
  console.log('');
  
  console.log('🔧 If still redirecting to production:');
  console.log('1. Check Supabase Dashboard → Authentication → Settings');
  console.log('2. Make sure Site URL includes localhost for development');
  console.log('3. Clear browser cache and cookies');
  console.log('4. Try incognito/private browsing mode');
  
  // Test basic Supabase connection
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('\n❌ Supabase connection test failed:', error.message);
    } else {
      console.log('\n✅ Supabase connection test successful');
    }
  } catch (error) {
    console.log('\n❌ Supabase connection error:', error.message);
  }
}

checkOAuthConfig();
