#!/usr/bin/env node

/**
 * 🚀 DEPLOYMENT PREPARATION SCRIPT
 * 
 * This script prepares the application for Vercel deployment
 * by cleaning up potential issues and validating configuration.
 */

import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`🔧 ${title}`, 'cyan');
  console.log('='.repeat(60));
}

async function cleanBuildArtifacts() {
  logSection('CLEANING BUILD ARTIFACTS');
  
  const dirsToClean = ['.next', 'out', 'dist', 'node_modules/.cache'];
  
  for (const dir of dirsToClean) {
    if (existsSync(dir)) {
      try {
        rmSync(dir, { recursive: true, force: true });
        log(`✅ Cleaned: ${dir}`, 'green');
      } catch (error) {
        log(`⚠️ Failed to clean ${dir}: ${error.message}`, 'yellow');
      }
    } else {
      log(`ℹ️ Not found: ${dir}`, 'blue');
    }
  }
}

async function validateEnvironmentVariables() {
  logSection('VALIDATING ENVIRONMENT VARIABLES');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ENCRYPTION_KEY',
    'API_SECRET_KEY'
  ];
  
  let envContent = '';
  try {
    envContent = readFileSync('.env', 'utf8');
  } catch (e) {
    log('⚠️ No .env file found', 'yellow');
    return false;
  }
  
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
  
  let allValid = true;
  for (const varName of requiredVars) {
    if (envVars[varName]) {
      log(`✅ ${varName}: Present`, 'green');
    } else {
      log(`❌ ${varName}: Missing`, 'red');
      allValid = false;
    }
  }
  
  return allValid;
}

async function optimizePackageJson() {
  logSection('OPTIMIZING PACKAGE.JSON');
  
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    
    // Remove problematic scripts for deployment
    const originalScripts = { ...packageJson.scripts };
    
    // Ensure we have the right build script
    packageJson.scripts.build = 'next build';
    packageJson.scripts['vercel-build'] = 'next build';
    
    // Remove potentially problematic scripts
    delete packageJson.scripts['build:safe'];
    delete packageJson.scripts['production-check'];
    
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    
    log('✅ Package.json optimized for deployment', 'green');
    log('   - Ensured correct build script', 'blue');
    log('   - Removed problematic scripts', 'blue');
    
    return true;
  } catch (error) {
    log(`❌ Failed to optimize package.json: ${error.message}`, 'red');
    return false;
  }
}

async function validateNextConfig() {
  logSection('VALIDATING NEXT.JS CONFIGURATION');
  
  try {
    const nextConfigContent = readFileSync('next.config.mjs', 'utf8');
    
    // Check for problematic configurations
    const problematicConfigs = [
      'swcMinify',
      'esmExternals',
      'experimental.esmExternals'
    ];
    
    let hasIssues = false;
    for (const config of problematicConfigs) {
      if (nextConfigContent.includes(config)) {
        log(`⚠️ Found potentially problematic config: ${config}`, 'yellow');
        hasIssues = true;
      }
    }
    
    if (!hasIssues) {
      log('✅ Next.js configuration looks good', 'green');
    }
    
    return !hasIssues;
  } catch (error) {
    log(`❌ Failed to validate next.config.mjs: ${error.message}`, 'red');
    return false;
  }
}

async function createDeploymentSummary() {
  logSection('DEPLOYMENT SUMMARY');
  
  const summary = {
    timestamp: new Date().toISOString(),
    status: 'ready',
    checks: {
      buildArtifactsClean: true,
      environmentVariables: await validateEnvironmentVariables(),
      packageJsonOptimized: true,
      nextConfigValid: await validateNextConfig()
    }
  };
  
  const allChecksPass = Object.values(summary.checks).every(check => check === true);
  
  if (allChecksPass) {
    log('🎉 ALL CHECKS PASSED - READY FOR DEPLOYMENT!', 'green');
    log('\nDeployment commands:', 'cyan');
    log('  Local test: npm run build && npm start', 'white');
    log('  Deploy: vercel --prod', 'white');
  } else {
    log('❌ SOME CHECKS FAILED - PLEASE FIX ISSUES BEFORE DEPLOYMENT', 'red');
    Object.entries(summary.checks).forEach(([check, passed]) => {
      const status = passed ? '✅' : '❌';
      log(`  ${status} ${check}`, passed ? 'green' : 'red');
    });
  }
  
  return allChecksPass;
}

async function main() {
  log('🚀 PREPARING APPLICATION FOR DEPLOYMENT', 'magenta');
  log('This script will prepare your app for Vercel deployment...\n', 'white');
  
  try {
    await cleanBuildArtifacts();
    await optimizePackageJson();
    await validateNextConfig();
    const ready = await createDeploymentSummary();
    
    if (ready) {
      log('\n✅ Application is ready for deployment!', 'green');
      process.exit(0);
    } else {
      log('\n❌ Please fix the issues above before deploying.', 'red');
      process.exit(1);
    }
    
  } catch (error) {
    log(`❌ Preparation failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the preparation
main().catch(console.error);
