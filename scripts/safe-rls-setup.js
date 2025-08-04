const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function safeRLSSetup() {
  console.log('🛡️ Setting up RLS policies safely...');

  try {
    // 1. Enable RLS (safe - won't error if already enabled)
    console.log('🔒 Enabling RLS...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;'
    });

    if (rlsError) {
      console.warn('⚠️ RLS warning (might already be enabled):', rlsError.message);
    } else {
      console.log('✅ RLS enabled successfully');
    }

    // 2. Drop existing policies if they exist (to avoid conflicts)
    console.log('🗑️ Cleaning up existing policies...');
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Allow public read access for active banners" ON public.banners;',
      'DROP POLICY IF EXISTS "Allow authenticated users to manage banners" ON public.banners;'
    ];

    for (const dropPolicy of dropPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: dropPolicy });
      if (error) {
        console.warn('⚠️ Warning dropping policy:', error.message);
      }
    }

    console.log('✅ Existing policies cleaned up');

    // 3. Create new policies
    console.log('🛡️ Creating new RLS policies...');
    const policies = [
      `CREATE POLICY "Allow public read access for active banners" ON public.banners
       FOR SELECT USING (is_active = true);`,
      `CREATE POLICY "Allow authenticated users to manage banners" ON public.banners
       FOR ALL USING (auth.role() = 'authenticated');`
    ];

    for (const policy of policies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.error('❌ Error creating policy:', error.message);
      } else {
        console.log('✅ Policy created successfully');
      }
    }

    // 4. Verify policies
    console.log('🔍 Verifying policies...');
    const { data: policies, error: verifyError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT policyname, cmd, qual 
        FROM pg_policies 
        WHERE tablename = 'banners' AND schemaname = 'public';
      `
    });

    if (verifyError) {
      console.warn('⚠️ Could not verify policies:', verifyError.message);
    } else {
      console.log('📋 Current Policies:');
      if (policies && policies.length > 0) {
        policies.forEach((policy, index) => {
          console.log(`  ${index + 1}. ${policy.policyname} (${policy.cmd})`);
        });
      } else {
        console.log('  No policies found');
      }
    }

    // 5. Test access
    console.log('🧪 Testing banner access...');
    const { data: banners, error: accessError } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (accessError) {
      console.error('❌ Access error:', accessError.message);
    } else {
      console.log(`✅ Successfully accessed ${banners.length} active banners`);
      console.log('🎉 RLS setup completed successfully!');
    }

  } catch (error) {
    console.error('❌ RLS setup failed:', error);
  }
}

safeRLSSetup(); 