const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://plhpubcmugqosexcgdhj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaHB1YmNtdWdxb3NleGNnZGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDY5MzUyNCwiZXhwIjoyMDY2MjY5NTI0fQ.wnCPfmL0i9irgXGIcXdnwM57ij2lehDNOhHRZQoDLPQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLS() {
  console.log('🔧 Fixing Casino RLS Policies...');

  try {
    // Create admin insert policy for casinos
    const { error: insertError } = await supabase.rpc('exec_sql', {
      sql_query: `
        DROP POLICY IF EXISTS "Admins can insert casinos" ON public.casinos;
        CREATE POLICY "Admins can insert casinos" ON public.casinos FOR INSERT 
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.is_active = true
          )
        );
      `
    });

    if (insertError) {
      console.error('❌ Insert policy error:', insertError);
    } else {
      console.log('✅ Insert policy created');
    }

    // Create admin update policy for casinos
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql_query: `
        DROP POLICY IF EXISTS "Admins can update casinos" ON public.casinos;
        CREATE POLICY "Admins can update casinos" ON public.casinos FOR UPDATE 
        USING (
          EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.is_active = true
          )
        );
      `
    });

    if (updateError) {
      console.error('❌ Update policy error:', updateError);
    } else {
      console.log('✅ Update policy created');
    }

    // Create admin delete policy for casinos
    const { error: deleteError } = await supabase.rpc('exec_sql', {
      sql_query: `
        DROP POLICY IF EXISTS "Admins can delete casinos" ON public.casinos;
        CREATE POLICY "Admins can delete casinos" ON public.casinos FOR DELETE 
        USING (
          EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.is_active = true
          )
        );
      `
    });

    if (deleteError) {
      console.error('❌ Delete policy error:', deleteError);
    } else {
      console.log('✅ Delete policy created');
    }

    console.log('🎉 RLS policies fixed!');

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

fixRLS();
