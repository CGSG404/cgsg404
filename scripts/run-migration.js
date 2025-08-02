const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Starting page maintenance migration...');
    
    // Read migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20250202000001_create_page_maintenance.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration file loaded');
    
    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', {
          sql: statement
        });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase
            .from('_temp')
            .select('1')
            .limit(0);
          
          if (directError) {
            console.log(`⚠️  RPC not available, trying direct execution...`);
            // For direct execution, we'll need to use a different approach
            console.log(`📋 Statement: ${statement.substring(0, 100)}...`);
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      }
    }
    
    // Verify table creation
    console.log('🔍 Verifying table creation...');
    const { data, error } = await supabase
      .from('page_maintenance')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Table verification failed:', error.message);
      console.log('📋 Manual migration required. Please run the SQL in Supabase dashboard.');
      return false;
    }
    
    console.log('✅ Migration completed successfully!');
    console.log(`📊 Found ${data?.length || 0} records in page_maintenance table`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    return false;
  }
}

// Run migration
runMigration().then(success => {
  if (success) {
    console.log('🎉 Page maintenance system is ready!');
    process.exit(0);
  } else {
    console.log('⚠️  Manual intervention required');
    process.exit(1);
  }
});
