# 📊 Admin Monitoring System Setup - CGSG404

## 🚀 **AUTOMATED SETUP (RECOMMENDED)**

### **Option 1: Run Setup Script**
```bash
# Make script executable
chmod +x scripts/setup-monitoring.js

# Run automated setup
node scripts/setup-monitoring.js
```

**Script akan otomatis:**
- ✅ Check prerequisites
- ✅ Run database migrations
- ✅ Test monitoring functions
- ✅ Provide sample data queries
- ✅ Verify setup completion

### **Option 2: Manual Setup (If Script Fails)**

#### **Step 1: Run Database Migration**
```bash
# Using Supabase CLI
supabase db push

# OR manually in Supabase SQL Editor
# Copy and paste content from: supabase/migrations/20250119000005_enhanced_monitoring.sql
```

#### **Step 2: Test Functions**
```sql
-- Test in Supabase SQL Editor
SELECT public.enhanced_admin_log('test_action', 'test_resource', '123', '{"test": true}'::jsonb);
SELECT public.get_admin_metrics();
SELECT * FROM public.get_admin_activity_summary(7);
```

#### **Step 3: Verify Tables Created**
```sql
-- Check new tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%monitoring%' OR table_name LIKE '%alert%');
```

## 🎯 **WHAT GETS INSTALLED**

### **📊 Database Components**
- ✅ **Enhanced logging function** - `enhanced_admin_log()`
- ✅ **Metrics function** - `get_admin_metrics()`
- ✅ **Activity summary** - `get_admin_activity_summary()`
- ✅ **Security alerts table** - `security_alerts`
- ✅ **Monitoring metrics table** - `admin_monitoring_metrics`
- ✅ **Automated suspicious activity detection**
- ✅ **Performance indexes**

### **🔧 API Enhancements**
- ✅ **Enhanced database API functions**
- ✅ **Real-time metrics fetching**
- ✅ **Security alert management**
- ✅ **Performance analytics**

### **🎨 Frontend Components**
- ✅ **AdminMonitoringDashboard** - Complete monitoring UI
- ✅ **Real-time updates** - Auto-refresh every 30 seconds
- ✅ **Security alerts management**
- ✅ **Metrics visualization**

## 📈 **FEATURES OVERVIEW**

### **🔍 Real-time Monitoring**
```typescript
// Auto-updating metrics
const metrics = await databaseApi.getAdminMetrics();
// Returns: {
//   active_admins_today: 3,
//   total_actions_today: 45,
//   total_actions_this_week: 312,
//   critical_alerts_unresolved: 0,
//   high_alerts_unresolved: 1,
//   top_actions_today: [...],
//   recent_critical_alerts: [...]
// }
```

### **🚨 Automated Security Alerts**
- **Rapid Actions Detection** - >20 actions in 5 minutes
- **Critical Action Alerts** - Delete operations, permission changes
- **Suspicious Pattern Detection** - Unusual admin behavior
- **Real-time Notifications** - Immediate alert creation

### **📊 Performance Analytics**
```typescript
// Get admin performance metrics
const performance = await databaseApi.getAdminPerformanceMetrics('admin-id', 30);
// Returns: {
//   totalActions: 150,
//   actionBreakdown: { "create_casino": 20, "update_news": 30 },
//   dailyActivity: { "2025-01-19": 45, "2025-01-18": 32 },
//   averageActionsPerDay: 5.2,
//   mostActiveDay: ["2025-01-19", 45]
// }
```

### **📋 Activity Tracking**
```typescript
// Enhanced logging with severity levels
await databaseApi.logAdminActivity(
  'delete_casino',           // action
  'casino',                  // resource type
  'casino-123',              // resource id
  { name: 'Casino Name' },   // details
  'critical',                // severity: info|warning|error|critical
  'session-abc123'           // session id
);
```

## 🎨 **USING THE DASHBOARD**

### **Import Component**
```typescript
import { AdminMonitoringDashboard } from '@/components/admin/AdminMonitoringDashboard';

function AdminPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AdminMonitoringDashboard />
    </div>
  );
}
```

### **Dashboard Features**
- 📊 **Real-time Metrics Cards** - Key performance indicators
- 🔥 **Top Actions Today** - Most performed admin actions
- 🚨 **Security Alerts** - Unresolved security incidents
- 🔄 **Auto-refresh** - Updates every 30 seconds
- ✅ **Alert Resolution** - One-click alert resolution

## 🔧 **CONFIGURATION**

### **Customize Alert Thresholds**
```sql
-- Modify in enhanced_monitoring.sql
-- Change rapid action threshold (default: 20 actions in 5 minutes)
IF recent_actions_count > 20 THEN  -- Change this number
```

### **Add Custom Alert Types**
```sql
-- Add new alert types in check_suspicious_activity function
IF action_performed IN ('your_custom_action') THEN
  INSERT INTO public.security_alerts (
    alert_type,
    severity,
    message,
    details,
    admin_user_id
  ) VALUES (
    'custom_alert_type',
    'medium',
    'Custom alert message',
    jsonb_build_object('custom_data', 'value'),
    admin_id
  );
END IF;
```

### **Customize Metrics**
```sql
-- Modify get_admin_metrics() function to add custom metrics
'custom_metric', (
  SELECT COUNT(*) FROM your_custom_table WHERE condition
)
```

## 🧪 **TESTING**

### **Test Enhanced Logging**
```sql
-- Create test log entry
SELECT public.enhanced_admin_log(
  'test_action',
  'test_resource', 
  'test-123',
  '{"test": true}'::jsonb,
  'info',
  'test-session'
);
```

### **Test Security Alerts**
```sql
-- Trigger rapid action alert (run multiple times quickly)
SELECT public.enhanced_admin_log('test_rapid', 'test', '1', '{}'::jsonb);
SELECT public.enhanced_admin_log('test_rapid', 'test', '2', '{}'::jsonb);
-- ... repeat 20+ times
```

### **Test Metrics**
```sql
-- Get current metrics
SELECT public.get_admin_metrics();

-- Get activity summary
SELECT * FROM public.get_admin_activity_summary(7);
```

## 🔍 **TROUBLESHOOTING**

### **Migration Fails**
1. Check Supabase connection
2. Verify admin permissions
3. Run migration manually in SQL Editor

### **Functions Not Found**
```sql
-- Check if functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%admin%';
```

### **No Data in Dashboard**
1. Ensure user is admin: `SELECT public.is_admin();`
2. Check RLS policies are applied
3. Verify API calls in browser console

### **Alerts Not Triggering**
1. Test logging function directly
2. Check alert thresholds
3. Verify trigger conditions

## 📞 **SUPPORT**

### **Quick Checks**
```sql
-- Verify setup
SELECT 'Functions' as component, COUNT(*) as count FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE '%admin%'
UNION ALL
SELECT 'Tables', COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%admin%'
UNION ALL
SELECT 'Policies', COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename LIKE '%admin%';
```

### **Get Help**
1. Check browser console for errors
2. Test functions in Supabase SQL Editor
3. Verify admin permissions
4. Review setup script output

---

**🎉 Monitoring system setup complete! Your admin dashboard now has comprehensive monitoring and security features.**
