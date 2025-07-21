#!/usr/bin/env node

/**
 * Production Safety Check Script
 * Ensures no debug/development code makes it to production
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DANGEROUS_PATTERNS = [
  /console\.log\(/g,
  /console\.debug\(/g,
  /debugger;/g,
  /\.only\(/g, // Jest/test only
  /\.skip\(/g, // Jest/test skip
  /debug-/i, // debug routes
  /AuthDebugPanel/g,
  /getAuthDebugInfo/g,
  /clearAuthData/g,
];

const ALLOWED_CONSOLE_PATTERNS = [
  /console\.error\(/g,
  /console\.warn\(/g,
  /process\.env\.NODE_ENV === ['"]development['"]/g,
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  DANGEROUS_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      // Check if it's wrapped in development check
      const lines = content.split('\n');
      matches.forEach(match => {
        const lineIndex = content.indexOf(match);
        const lineNumber = content.substring(0, lineIndex).split('\n').length;
        const line = lines[lineNumber - 1];
        
        // Skip if it's in a development-only block
        const isDevelopmentOnly = line.includes('NODE_ENV') || 
                                 lines[lineNumber - 2]?.includes('NODE_ENV') ||
                                 lines[lineNumber - 3]?.includes('NODE_ENV');
        
        if (!isDevelopmentOnly) {
          issues.push({
            file: filePath,
            line: lineNumber,
            pattern: pattern.toString(),
            content: line.trim()
          });
        }
      });
    }
  });

  return issues;
}

function scanDirectory(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const issues = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .next, etc.
        if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
          scan(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        const fileIssues = checkFile(fullPath);
        issues.push(...fileIssues);
      }
    }
  }
  
  scan(dir);
  return issues;
}

function main() {
  console.log('🔍 Running production safety check...\n');
  
  const projectRoot = path.join(__dirname, '..');
  const issues = scanDirectory(projectRoot);
  
  if (issues.length === 0) {
    console.log('✅ No production safety issues found!');
    console.log('🚀 Safe to deploy to production.\n');
    process.exit(0);
  } else {
    console.log('❌ Production safety issues found:\n');
    
    issues.forEach(issue => {
      console.log(`📁 ${issue.file}:${issue.line}`);
      console.log(`🔍 Pattern: ${issue.pattern}`);
      console.log(`📝 Content: ${issue.content}`);
      console.log('');
    });
    
    console.log(`\n⚠️  Found ${issues.length} issues that need to be fixed before production deployment.`);
    console.log('💡 Wrap debug code in: if (process.env.NODE_ENV === "development") { ... }');
    process.exit(1);
  }
}

// Run if this is the main module
main();

export { checkFile, scanDirectory };
