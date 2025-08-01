/**
 * Setup Admin User Script for CGSG404
 * 
 * This script helps setup admin users in production.
 * Run this script after a user has signed in with Google.
 * 
 * Usage:
 * node scripts/setup-admin-user.js <email> [role]
 * 
 * Example:
 * node scripts/setup-admin-user.js admin@example.com super_admin
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You need to add this to .env.local

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdminUser(email, role = 'admin') {
  try {
    console.log(`🔧 Setting up admin user: ${email} with role: ${role}`);

    // First, check if user exists in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      throw new Error(`Failed to list users: ${authError.message}`);
    }

    const user = authUsers.users.find(u => u.email === email);
    if (!user) {
      throw new Error(`User with email ${email} not found. Please sign in with Google first.`);
    }

    console.log(`✅ Found user: ${user.id}`);

    // Use the setup_admin_user function
    const { data, error } = await supabase.rpc('setup_admin_user', {
      admin_email: email,
      admin_role: role
    });

    if (error) {
      throw new Error(`Setup failed: ${error.message}`);
    }

    console.log(`✅ ${data}`);

    // Verify the setup
    const { data: adminUser, error: verifyError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (verifyError) {
      console.warn(`⚠️ Could not verify setup: ${verifyError.message}`);
    } else {
      console.log(`✅ Verification successful:`, {
        email: adminUser.email,
        role: adminUser.role,
        is_active: adminUser.is_active,
        created_at: adminUser.created_at
      });
    }

    console.log(`\n🎉 Admin user setup completed successfully!`);
    console.log(`📝 Next steps:`);
    console.log(`   1. User should refresh their browser`);
    console.log(`   2. Admin button should appear in navbar`);
    console.log(`   3. User can access /admin dashboard`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
🔧 CGSG404 Admin User Setup Script

Usage: node scripts/setup-admin-user.js <email> [role]

Arguments:
  email    Email address of the user (must have signed in with Google first)
  role     Admin role: super_admin, admin, or moderator (default: admin)

Examples:
  node scripts/setup-admin-user.js admin@example.com super_admin
  node scripts/setup-admin-user.js moderator@example.com moderator

Roles:
  - super_admin: Full access to everything
  - admin: Standard admin access (most features)
  - moderator: Content moderation only

Prerequisites:
  1. User must have signed in to the app with Google OAuth first
  2. SUPABASE_SERVICE_ROLE_KEY must be set in .env.local
  `);
  process.exit(0);
}

const email = args[0];
const role = args[1] || 'admin';

// Validate role
const validRoles = ['super_admin', 'admin', 'moderator'];
if (!validRoles.includes(role)) {
  console.error(`❌ Invalid role: ${role}`);
  console.error(`Valid roles: ${validRoles.join(', ')}`);
  process.exit(1);
}

// Validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error(`❌ Invalid email format: ${email}`);
  process.exit(1);
}

// Run the setup
setupAdminUser(email, role);
