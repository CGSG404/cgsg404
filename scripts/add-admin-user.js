// Script untuk menambahkan user sebagai admin
// Jalankan dengan: node scripts/add-admin-user.js

const { createClient } = require('@supabase/supabase-js');

// Konfigurasi Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure you have:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addAdminUser() {
  try {
    console.log('🔍 Checking current users...');
    
    // Get all authenticated users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }
    
    console.log('📋 Found users:');
    users.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (ID: ${user.id})`);
    });
    
    if (users.users.length === 0) {
      console.log('⚠️ No users found. Please sign up first through the application.');
      return;
    }
    
    // Use the first user as admin (or modify this to select specific user)
    const userToMakeAdmin = users.users[0];
    console.log(`\n🔧 Making ${userToMakeAdmin.email} an admin...`);
    
    // Check if user is already admin
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userToMakeAdmin.id)
      .single();
    
    if (existingAdmin) {
      console.log('✅ User is already an admin');
      
      // Update to ensure they're active
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({
          is_active: true,
          role: 'super_admin',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userToMakeAdmin.id);
      
      if (updateError) {
        console.error('❌ Error updating admin status:', updateError);
      } else {
        console.log('✅ Admin status updated successfully');
      }
    } else {
      // Add new admin user
      const { data: newAdmin, error: insertError } = await supabase
        .from('admin_users')
        .insert({
          user_id: userToMakeAdmin.id,
          email: userToMakeAdmin.email,
          role: 'super_admin',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Error creating admin user:', insertError);
      } else {
        console.log('✅ Admin user created successfully:', newAdmin);
      }
    }
    
    console.log('\n🎉 Done! User should now have admin access.');
    console.log('💡 Refresh the admin page to see the changes.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

addAdminUser();
