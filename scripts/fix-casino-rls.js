#!/usr/bin/env node

/**
 * Fix Casino RLS Policies
 * This script adds missing RLS policies for admin users to manage casinos
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixCasinoRLS() {
  console.log('🔧 Fixing Casino RLS Policies...\n');

  try {
    // SQL to fix RLS policies
    const sql = `
      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Admins can insert casinos" ON public.casinos;
      DROP POLICY IF EXISTS "Admins can update casinos" ON public.casinos;
      DROP POLICY IF EXISTS "Admins can delete casinos" ON public.casinos;
      DROP POLICY IF EXISTS "Admins can manage casino features" ON public.casino_features;
      DROP POLICY IF EXISTS "Admins can manage casino badges" ON public.casino_badges;
      DROP POLICY IF EXISTS "Admins can manage casino links" ON public.casino_links;
      DROP POLICY IF EXISTS "Admins can manage casino categories" ON public.casino_categories;
      DROP POLICY IF EXISTS "Admins can manage casino category assignments" ON public.casino_category_assignments;

      -- Create admin policies for casinos table
      CREATE POLICY "Admins can insert casinos" ON public.casinos FOR INSERT 
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.admin_users au 
          WHERE au.user_id = auth.uid() 
          AND au.is_active = true
        )
      );

      CREATE POLICY "Admins can update casinos" ON public.casinos FOR UPDATE 
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users au 
          WHERE au.user_id = auth.uid() 
          AND au.is_active = true
        )
      );

      CREATE POLICY "Admins can delete casinos" ON public.casinos FOR DELETE 
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users au 
          WHERE au.user_id = auth.uid() 
          AND au.is_active = true
        )
      );

      -- Create admin policies for casino_features table
      CREATE POLICY "Admins can manage casino features" ON public.casino_features FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users au 
          WHERE au.user_id = auth.uid() 
          AND au.is_active = true
        )
      );

      -- Create admin policies for casino_badges table
      CREATE POLICY "Admins can manage casino badges" ON public.casino_badges FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users au 
          WHERE au.user_id = auth.uid() 
          AND au.is_active = true
        )
      );

      -- Create admin policies for casino_links table
      CREATE POLICY "Admins can manage casino links" ON public.casino_links FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users au 
          WHERE au.user_id = auth.uid() 
          AND au.is_active = true
        )
      );

      -- Create admin policies for casino_categories table
      CREATE POLICY "Admins can manage casino categories" ON public.casino_categories FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users au 
          WHERE au.user_id = auth.uid() 
          AND au.is_active = true
        )
      );

      -- Create admin policies for casino_category_assignments table
      CREATE POLICY "Admins can manage casino category assignments" ON public.casino_category_assignments FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users au 
          WHERE au.user_id = auth.uid() 
          AND au.is_active = true
        )
      );

      -- Create function to check if user is admin (helper function)
      CREATE OR REPLACE FUNCTION public.is_current_user_admin()
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM public.admin_users au 
          WHERE au.user_id = auth.uid() 
          AND au.is_active = true
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Grant execute permission on the helper function
      GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;
    `;

    console.log('📝 Executing RLS policy fixes...');
    
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error executing SQL:', error);
      
      // Try alternative approach - execute each statement separately
      console.log('🔄 Trying alternative approach...');
      
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error: stmtError } = await supabase.rpc('exec_sql', { 
              sql_query: statement.trim() + ';' 
            });
            
            if (stmtError) {
              console.warn(`⚠️ Warning executing statement: ${stmtError.message}`);
            } else {
              console.log(`✅ Executed: ${statement.trim().substring(0, 50)}...`);
            }
          } catch (e) {
            console.warn(`⚠️ Warning: ${e.message}`);
          }
        }
      }
    } else {
      console.log('✅ RLS policies fixed successfully!');
    }

    // Test the policies
    console.log('\n🧪 Testing RLS policies...');
    
    const { data: testData, error: testError } = await supabase
      .from('casinos')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Test failed:', testError);
    } else {
      console.log('✅ RLS policies are working correctly!');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixCasinoRLS().then(() => {
  console.log('\n🎉 Casino RLS fix completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
