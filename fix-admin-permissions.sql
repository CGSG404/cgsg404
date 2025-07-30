-- Fix Admin Permissions Script
-- Run this in Supabase SQL Editor to restore all 25 permissions

-- First, let's check current state
SELECT 
  au.email,
  au.role,
  au.is_active,
  COUNT(arp.permission_id) as permission_count
FROM admin_users au
LEFT JOIN admin_role_permissions arp ON au.id = arp.admin_user_id
WHERE au.is_active = true
GROUP BY au.id, au.email, au.role, au.is_active;

-- Check what permissions exist
SELECT COUNT(*) as total_permissions FROM admin_permissions;

-- Check which permissions are missing for your admin user
WITH admin_user AS (
  SELECT id, email FROM admin_users WHERE is_active = true LIMIT 1
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
SELECT * FROM missing_permissions;

-- Fix: Grant ALL permissions to the active admin user
INSERT INTO admin_role_permissions (admin_user_id, permission_id, granted_by)
SELECT 
  au.id as admin_user_id,
  ap.id as permission_id,
  au.user_id as granted_by
FROM admin_users au
CROSS JOIN admin_permissions ap
WHERE au.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM admin_role_permissions arp 
    WHERE arp.admin_user_id = au.id 
    AND arp.permission_id = ap.id
  );

-- Verify the fix
SELECT 
  au.email,
  au.role,
  au.is_active,
  COUNT(arp.permission_id) as permission_count,
  ARRAY_AGG(ap.name ORDER BY ap.name) as permissions
FROM admin_users au
LEFT JOIN admin_role_permissions arp ON au.id = arp.admin_user_id
LEFT JOIN admin_permissions ap ON arp.permission_id = ap.id
WHERE au.is_active = true
GROUP BY au.id, au.email, au.role, au.is_active;
