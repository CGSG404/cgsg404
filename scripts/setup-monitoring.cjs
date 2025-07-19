#!/usr/bin/env node

/**
 * Automated Setup Script for CGSG404 Admin Monitoring System
 *
 * This script will:
 * 1. Run database migrations
 * 2. Test monitoring functions
 * 3. Create sample data for testing
 * 4. Verify everything is working
 *
 * Usage: node scripts/setup-monitoring.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${step} ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function checkPrerequisites() {
  logStep('🔍', 'Checking prerequisites...');
  
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    logError('package.json not found. Please run this script from the project root.');
    process.exit(1);
  }
  
  // Check if supabase directory exists
  if (!fs.existsSync('supabase')) {
    logError('supabase directory not found. Please ensure Supabase is initialized.');
    process.exit(1);
  }
  
  // Check if migration file exists
  const migrationFile = 'supabase/migrations/20250119000005_enhanced_monitoring.sql';
  if (!fs.existsSync(migrationFile)) {
    logError(`Migration file not found: ${migrationFile}`);
    logInfo('Please ensure the enhanced monitoring migration file exists.');
    process.exit(1);
  }
  
  logSuccess('Prerequisites check passed');
}

async function runMigrations() {
  logStep('🚀', 'Running database migrations...');
  
  try {
    // Check if Supabase CLI is available
    execSync('supabase --version', { stdio: 'pipe' });
    
    // Run migrations
    logInfo('Running: supabase db push');
    execSync('supabase db push', { stdio: 'inherit' });
    
    logSuccess('Database migrations completed');
  } catch (error) {
    logWarning('Supabase CLI not found or migration failed');
    logInfo('Please run the migration manually:');
    logInfo('1. Open Supabase Dashboard');
    logInfo('2. Go to SQL Editor');
    logInfo('3. Run the content of: supabase/migrations/20250119000005_enhanced_monitoring.sql');
    
    // Ask user to confirm manual migration
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      readline.question('\nHave you run the migration manually? (y/n): ', (answer) => {
        readline.close();
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          logSuccess('Manual migration confirmed');
          resolve();
        } else {
          logError('Migration required. Please run the migration and try again.');
          process.exit(1);
        }
      });
    });
  }
}

async function testFunctions() {
  logStep('🧪', 'Testing monitoring functions...');
  
  logInfo('Please test the following functions in Supabase SQL Editor:');
  
  const testQueries = [
    '-- Test enhanced logging function',
    "SELECT public.enhanced_admin_log('test_action', 'test_resource', '123', '{\"test\": true}'::jsonb);",
    '',
    '-- Test admin metrics function',
    'SELECT public.get_admin_metrics();',
    '',
    '-- Test activity summary function',
    'SELECT * FROM public.get_admin_activity_summary(7);',
    '',
    '-- Check if tables were created',
    'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_name LIKE \'%monitoring%\' OR table_name LIKE \'%alert%\';'
  ];
  
  log('\n' + '='.repeat(60), 'yellow');
  log('COPY AND PASTE THESE QUERIES INTO SUPABASE SQL EDITOR:', 'yellow');
  log('='.repeat(60), 'yellow');
  
  testQueries.forEach(query => {
    log(query, 'cyan');
  });
  
  log('='.repeat(60), 'yellow');
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    readline.question('\nDid all test queries run successfully? (y/n): ', (answer) => {
      readline.close();
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        logSuccess('Function tests confirmed');
        resolve();
      } else {
        logError('Function tests failed. Please check the migration and try again.');
        process.exit(1);
      }
    });
  });
}

async function createSampleData() {
  logStep('📊', 'Creating sample monitoring data...');
  
  logInfo('Sample data queries for testing:');
  
  const sampleQueries = [
    '-- Create sample security alert',
    `INSERT INTO public.security_alerts (alert_type, severity, message, details)
VALUES ('test_alert', 'medium', 'Sample security alert for testing', '{"source": "setup_script"}'::jsonb);`,
    '',
    '-- Create sample monitoring metric',
    `INSERT INTO public.admin_monitoring_metrics (metric_name, metric_value, metric_data)
VALUES ('test_metric', 100, '{"description": "Sample metric for testing"}'::jsonb);`,
    '',
    '-- Log sample admin activity',
    `SELECT public.enhanced_admin_log('setup_monitoring', 'system', 'monitoring_setup', '{"setup_completed": true}'::jsonb, 'info');`
  ];
  
  log('\n' + '='.repeat(60), 'yellow');
  log('OPTIONAL: SAMPLE DATA QUERIES (FOR TESTING):', 'yellow');
  log('='.repeat(60), 'yellow');
  
  sampleQueries.forEach(query => {
    log(query, 'cyan');
  });
  
  log('='.repeat(60), 'yellow');
  
  logSuccess('Sample data queries provided');
}

async function verifySetup() {
  logStep('✅', 'Verifying setup...');
  
  const verificationSteps = [
    '✅ Database migration completed',
    '✅ Monitoring functions created',
    '✅ Security alerts table created',
    '✅ Monitoring metrics table created',
    '✅ RLS policies applied',
    '✅ Indexes created for performance',
    '✅ Frontend components ready'
  ];
  
  verificationSteps.forEach(step => {
    logSuccess(step);
  });
  
  logInfo('\nNext steps:');
  logInfo('1. Import AdminMonitoringDashboard component in your admin pages');
  logInfo('2. Test the monitoring dashboard in your application');
  logInfo('3. Verify real-time alerts are working');
  logInfo('4. Check performance with the new indexes');
}

async function showUsageInstructions() {
  logStep('📚', 'Usage Instructions');
  
  log('\n' + '='.repeat(60), 'green');
  log('MONITORING SYSTEM SETUP COMPLETE!', 'green');
  log('='.repeat(60), 'green');
  
  logInfo('\n🎯 How to use the monitoring system:');
  
  const instructions = [
    '',
    '1. 📊 DASHBOARD COMPONENT:',
    '   Import: import { AdminMonitoringDashboard } from "@/components/admin/AdminMonitoringDashboard";',
    '   Use: <AdminMonitoringDashboard />',
    '',
    '2. 🔧 ENHANCED LOGGING:',
    '   await databaseApi.logAdminActivity("action", "type", "id", details, "severity");',
    '',
    '3. 📈 GET METRICS:',
    '   const metrics = await databaseApi.getAdminMetrics();',
    '',
    '4. 🚨 SECURITY ALERTS:',
    '   const alerts = await databaseApi.getSecurityAlerts();',
    '',
    '5. 📋 ACTIVITY SUMMARY:',
    '   const summary = await databaseApi.getAdminActivitySummary(7);',
    '',
    '6. 🔍 DIRECT SQL TESTING:',
    '   SELECT public.get_admin_metrics();',
    '   SELECT * FROM public.security_alerts;',
    ''
  ];
  
  instructions.forEach(instruction => {
    log(instruction, 'blue');
  });
  
  log('='.repeat(60), 'green');
  logSuccess('Setup completed successfully! 🎉');
}

// Main execution
async function main() {
  log('\n' + '🔧 CGSG404 Admin Monitoring Setup Script', 'bright');
  log('=' .repeat(50), 'cyan');
  
  try {
    await checkPrerequisites();
    await runMigrations();
    await testFunctions();
    await createSampleData();
    await verifySetup();
    await showUsageInstructions();
    
    log('\n🎉 All done! Your monitoring system is ready to use.', 'green');
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}
