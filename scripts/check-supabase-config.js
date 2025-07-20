#!/usr/bin/env node

/**
 * Supabase Configuration Checker
 * Verifies that Supabase is properly configured for authentication
 */

const https = require('https');
const url = require('url');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvironmentVariables() {
  log('\n🔍 Checking Environment Variables...', 'blue');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    log('❌ NEXT_PUBLIC_SUPABASE_URL is missing', 'red');
    return false;
  }
  
  if (!supabaseKey) {
    log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', 'red');
    return false;
  }
  
  log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`, 'green');
  log(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey.length} characters`, 'green');
  
  return { supabaseUrl, supabaseKey };
}

function checkSupabaseConnection(supabaseUrl, supabaseKey) {
  return new Promise((resolve) => {
    log('\n🌐 Testing Supabase Connection...', 'blue');
    
    const testUrl = `${supabaseUrl}/rest/v1/`;
    const parsedUrl = url.parse(testUrl);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.path,
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      if (res.statusCode === 200 || res.statusCode === 404) {
        log('✅ Supabase connection successful', 'green');
        resolve(true);
      } else {
        log(`❌ Supabase connection failed: HTTP ${res.statusCode}`, 'red');
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      log(`❌ Supabase connection error: ${error.message}`, 'red');
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      log('❌ Supabase connection timeout', 'red');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

function printRecommendations() {
  log('\n📋 Supabase Configuration Checklist:', 'yellow');
  log('');
  log('1. 🔐 Authentication Settings:', 'bold');
  log('   - Go to Supabase Dashboard → Authentication → Settings');
  log('   - Site URL: https://your-domain.vercel.app');
  log('   - Additional redirect URLs: https://your-domain.vercel.app/auth/callback');
  log('');
  log('2. 🔑 Google OAuth Provider:', 'bold');
  log('   - Go to Authentication → Providers → Google');
  log('   - Enable Google provider');
  log('   - Add your Google Client ID and Client Secret');
  log('   - Authorized redirect URIs in Google Console:');
  log('     https://your-supabase-project.supabase.co/auth/v1/callback');
  log('');
  log('3. 🌐 CORS Settings:', 'bold');
  log('   - Ensure your domain is in allowed origins');
  log('   - Check API settings for CORS configuration');
  log('');
  log('4. 🔧 Environment Variables (Vercel):', 'bold');
  log('   - NEXT_PUBLIC_SUPABASE_URL');
  log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  log('');
  log('5. 🐛 Debugging:', 'bold');
  log('   - Visit /debug-auth on your deployed site');
  log('   - Check browser console for detailed logs');
  log('   - Monitor Supabase logs in dashboard');
}

async function main() {
  log('🚀 Supabase Configuration Checker', 'bold');
  log('=====================================', 'blue');
  
  const envCheck = checkEnvironmentVariables();
  
  if (!envCheck) {
    log('\n❌ Environment variables check failed', 'red');
    printRecommendations();
    process.exit(1);
  }
  
  const connectionCheck = await checkSupabaseConnection(envCheck.supabaseUrl, envCheck.supabaseKey);
  
  if (connectionCheck) {
    log('\n🎉 All checks passed! Supabase is properly configured.', 'green');
  } else {
    log('\n⚠️  Connection check failed. Please verify your configuration.', 'yellow');
  }
  
  printRecommendations();
}

// Run the checker
main().catch(console.error);
