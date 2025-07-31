-- Fix Admin Permissions Script for casinogurusg404@gmail.com
-- Run this in Supabase SQL Editor to restore all 25 permissions

-- STEP 1: Check current state for specific user
SELECT
  au.id,
  au.email,
  au.role,
  au.is_active,
  COUNT(arp.permission_id) as permission_count
FROM admin_users au
LEFT JOIN admin_role_permissions arp ON au.id = arp.admin_user_id
WHERE au.email = 'casinogurusg404@gmail.com'
GROUP BY au.id, au.email, au.role, au.is_active;

-- STEP 2: Check total permissions available
SELECT COUNT(*) as total_permissions FROM admin_permissions;

-- STEP 3: Check which permissions are missing for casinogurusg404@gmail.com
WITH admin_user AS (
  SELECT id, email FROM admin_users WHERE email = 'casinogurusg404@gmail.com'
),
missing_permissions AS (
  SELECT ap.id, ap.name, ap.description, ap.category
  FROM admin_permissions ap
  CROSS JOIN admin_user au
  WHERE NOT EXISTS (
    SELECT 1 FROM admin_role_permissions arp
    WHERE arp.admin_user_id = au.id
    AND arp.permission_id = ap.id
  )
)
SELECT COUNT(*) as missing_count, ARRAY_AGG(name) as missing_permissions FROM missing_permissions;

-- STEP 4: Fix - Grant ALL permissions to casinogurusg404@gmail.com
INSERT INTO admin_role_permissions (admin_user_id, permission_id, granted_by)
SELECT
  au.id as admin_user_id,
  ap.id as permission_id,
  au.user_id as granted_by
FROM admin_users au
CROSS JOIN admin_permissions ap
WHERE au.email = 'casinogurusg404@gmail.com'
  AND au.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM admin_role_permissions arp
    WHERE arp.admin_user_id = au.id
    AND arp.permission_id = ap.id
  );

-- STEP 5: Verify the fix for casinogurusg404@gmail.com
SELECT
  au.email,
  au.role,
  au.is_active,
  COUNT(arp.permission_id) as permission_count,
  ARRAY_AGG(ap.name ORDER BY ap.name) as permissions
FROM admin_users au
LEFT JOIN admin_role_permissions arp ON au.id = arp.admin_user_id
LEFT JOIN admin_permissions ap ON arp.permission_id = ap.id
WHERE au.email = 'casinogurusg404@gmail.com'
GROUP BY au.id, au.email, au.role, au.is_active;

-- STEP 6: Double check - show all admin users and their permission counts
SELECT
  au.email,
  au.role,
  au.is_active,
  COUNT(arp.permission_id) as permission_count
FROM admin_users au
LEFT JOIN admin_role_permissions arp ON au.id = arp.admin_user_id
GROUP BY au.id, au.email, au.role, au.is_active
ORDER BY au.email;
