#!/usr/bin/env node

/**
 * Script to make a user admin
 * Usage: node scripts/make-user-admin.js <email>
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://plhpubcmugqosexcgdhj.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaHB1YmNtdWdxb3NleGNnZGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDY5MzUyNCwiZXhwIjoyMDY2MjY5NTI0fQ.wnCPfmL0i9irgXGIcXdnwM57ij2lehDNOhHRZQoDLPQ';

// Create admin client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function makeUserAdmin(email) {
  console.log(`🔧 Making user admin: ${email}`);
  
  try {
    // 1. Find user by email in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message);
      return;
    }
    
    const authUser = authUsers.users.find(u => u.email === email);
    if (!authUser) {
      console.error(`❌ User not found in auth: ${email}`);
      return;
    }
    
    console.log(`✅ Found auth user: ${authUser.id}`);
    
    // 2. Check if user exists in users table
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (userError && userError.code !== 'PGRST116') {
      console.error('❌ Error checking users table:', userError.message);
      return;
    }
    
    // 3. Create/update user in users table
    if (!existingUser) {
      console.log('📝 Creating user record...');
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          role: 'super_admin',
          is_admin: true,
          created_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error('❌ Error creating user:', insertError.message);
        return;
      }
    } else {
      console.log('📝 Updating user record...');
      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: 'super_admin',
          is_admin: true
        })
        .eq('id', authUser.id);
        
      if (updateError) {
        console.error('❌ Error updating user:', updateError.message);
        return;
      }
    }
    
    // 4. Create/update admin_users record
    console.log('👑 Creating admin record...');
    const { error: adminError } = await supabase
      .from('admin_users')
      .upsert({
        user_id: authUser.id,
        role: 'super_admin',
        is_active: true,
        created_by: authUser.id,
        created_at: new Date().toISOString()
      });
    
    if (adminError) {
      console.error('❌ Error creating admin record:', adminError.message);
      return;
    }
    
    console.log('🎉 User successfully made admin!');
    
    // 5. Verify the changes
    console.log('\n🔍 Verifying changes...');
    
    const { data: verifyUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    const { data: verifyAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', authUser.id)
      .single();
    
    console.log('✅ User record:', verifyUser);
    console.log('✅ Admin record:', verifyAdmin);
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node scripts/make-user-admin.js <email>');
  process.exit(1);
}

makeUserAdmin(email);
