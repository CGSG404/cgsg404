#!/usr/bin/env tsx
/**
 * Fix Admin Access Issues - CGSG404
 * This script diagnoses and fixes admin access problems
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseAdminIssues() {
  console.log('🔍 Starting admin access diagnosis...\n');

  try {
    // 1. Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('1. Session Check:');
    console.log('   Session exists:', !!session);
    console.log('   User ID:', session?.user?.id || 'None');
    console.log('   User email:', session?.user?.email || 'None');
    console.log('   Session error:', sessionError?.message || 'None');
    console.log('');

    if (!session) {
      console.log('❌ No active session found. Please sign in first.');
      return;
    }

    // 2. Check if user exists in admin_users table
    const { data: adminUsers, error: adminUsersError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id);

    console.log('2. Admin Users Check:');
    console.log('   Admin record exists:', adminUsers && adminUsers.length > 0);
    console.log('   Admin data:', adminUsers);
    console.log('   Error:', adminUsersError?.message || 'None');
    console.log('');

    // 3. Test is_admin RPC function
    const { data: isAdminResult, error: isAdminError } = await supabase.rpc('is_admin');
    console.log('3. is_admin RPC Test:');
    console.log('   Result:', isAdminResult);
    console.log('   Error:', isAdminError?.message || 'None');
    console.log('');

    // 4. Test get_current_user_admin_info function
    const { data: adminInfo, error: adminInfoError } = await supabase.rpc('get_current_user_admin_info');
    console.log('4. get_current_user_admin_info Test:');
    console.log('   Result:', adminInfo);
    console.log('   Error:', adminInfoError?.message || 'None');
    console.log('');

    // 5. Check all admin users
    const { data: allAdmins, error: allAdminsError } = await supabase
      .from('admin_users')
      .select('email, role, is_active, created_at')
      .order('created_at', { ascending: false });

    console.log('5. All Admin Users:');
    console.log('   Total admins:', allAdmins?.length || 0);
    console.log('   Admin list:', allAdmins);
    console.log('   Error:', allAdminsError?.message || 'None');
    console.log('');

    // 6. Diagnosis summary
    console.log('📊 DIAGNOSIS SUMMARY:');
    console.log('   ✅ Session:', !!session);
    console.log('   ✅ Admin record:', adminUsers && adminUsers.length > 0);
    console.log('   ✅ is_admin function:', isAdminResult === true);
    console.log('   ✅ Admin info function:', adminInfo && adminInfo.length > 0);
    console.log('');

    // 7. Recommendations
    if (!adminUsers || adminUsers.length === 0) {
      console.log('🔧 RECOMMENDATION: User is not registered as admin');
      console.log('   Run: await setupAdminUser()');
    } else if (!isAdminResult) {
      console.log('🔧 RECOMMENDATION: is_admin function issue');
      console.log('   Check RLS policies and function permissions');
    } else {
      console.log('✅ All checks passed - admin access should work');
    }

  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  }
}

async function setupAdminUser(email?: string, role: 'super_admin' | 'admin' | 'moderator' = 'super_admin') {
  console.log('🔧 Setting up admin user...\n');

  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('❌ No active session. Please sign in first.');
      return;
    }

    const userEmail = email || session.user.email;
    if (!userEmail) {
      console.log('❌ No email provided or found in session.');
      return;
    }

    console.log(`Setting up ${role} for: ${userEmail}`);

    // Use the setup_admin_user RPC function
    const { data: result, error } = await supabase.rpc('setup_admin_user', {
      admin_email: userEmail,
      admin_role: role
    });

    if (error) {
      console.error('❌ Setup failed:', error.message);
      return;
    }

    console.log('✅ Setup result:', result);
    console.log('');

    // Verify setup
    console.log('🔍 Verifying setup...');
    await diagnoseAdminIssues();

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'diagnose':
      await diagnoseAdminIssues();
      break;
    case 'setup':
      const email = args[1];
      const role = (args[2] as any) || 'super_admin';
      await setupAdminUser(email, role);
      break;
    case 'fix':
      console.log('🔧 Running full fix...\n');
      await diagnoseAdminIssues();
      console.log('\n🔧 Setting up admin user...\n');
      await setupAdminUser();
      break;
    default:
      console.log('Usage:');
      console.log('  npm run fix-admin diagnose    - Diagnose admin issues');
      console.log('  npm run fix-admin setup [email] [role] - Setup admin user');
      console.log('  npm run fix-admin fix         - Full diagnosis and fix');
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { diagnoseAdminIssues, setupAdminUser };
