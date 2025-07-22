#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== 'node_modules' && file !== '.next' && file !== 'dist' && file !== 'out') {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to fix import paths in a file
function fixImportsInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix import patterns
    const fixes = [
      // Fix @/contexts/ to @/src/contexts/
      {
        pattern: /from ['"]@\/contexts\//g,
        replacement: "from '@/src/contexts/"
      },
      // Fix @/lib/ to @/src/lib/ (but keep some exceptions)
      {
        pattern: /from ['"]@\/lib\/(?!supabaseClient|database-api)/g,
        replacement: "from '@/src/lib/"
      },
      // Fix @/components/ to @/src/components/
      {
        pattern: /from ['"]@\/components\//g,
        replacement: "from '@/src/components/"
      },
      // Fix @/hooks/ to @/src/hooks/
      {
        pattern: /from ['"]@\/hooks\//g,
        replacement: "from '@/src/hooks/"
      },
      // Fix @/utils/ to @/src/utils/
      {
        pattern: /from ['"]@\/utils\//g,
        replacement: "from '@/src/utils/"
      }
    ];
    
    let newContent = content;
    
    fixes.forEach(fix => {
      const before = newContent;
      newContent = newContent.replace(fix.pattern, fix.replacement);
      if (before !== newContent) {
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed imports in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  console.log('🔧 Fixing import paths for production build...\n');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  
  let fixedCount = 0;
  let totalFiles = 0;
  
  files.forEach(file => {
    totalFiles++;
    if (fixImportsInFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total files processed: ${totalFiles}`);
  console.log(`   Files with fixes: ${fixedCount}`);
  console.log(`   Files unchanged: ${totalFiles - fixedCount}`);
  
  if (fixedCount > 0) {
    console.log('\n✅ Import paths fixed! Ready for production build.');
  } else {
    console.log('\n✅ All import paths are already correct.');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { fixImportsInFile, findFiles };
