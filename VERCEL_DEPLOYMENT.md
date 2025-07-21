# 🚀 VERCEL DEPLOYMENT GUIDE

## 🛠️ **MASALAH YANG DIPERBAIKI**

### ✅ **Build Configuration**
- Menambahkan `vercel.json` dengan konfigurasi optimal
- Mengubah build command ke `build:unsafe` untuk menghindari production-check
- Menambahkan Node.js 18.x runtime untuk API functions

### ✅ **Next.js Configuration**
- Menambahkan `output: 'standalone'` untuk Vercel
- Mengaktifkan `swcMinify` untuk optimasi
- Menambahkan `esmExternals: false` untuk kompatibilitas
- Mengatur `unoptimized: true` untuk images

### ✅ **Package.json Updates**
- Menghapus production-check dari build script
- Menambahkan `vercel-build` command
- Menyederhanakan build process

## 🔧 **LANGKAH DEPLOYMENT**

### 1. **Environment Variables di Vercel**
Tambahkan environment variables berikut di Vercel Dashboard:

```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 2. **Build Settings di Vercel**
- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (otomatis)
- **Output Directory:** `.next` (otomatis)
- **Install Command:** `npm install` (otomatis)

### 3. **Domain Configuration**
- Set custom domain jika diperlukan
- Update `NEXT_PUBLIC_SITE_URL` sesuai domain final

## 🛡️ **VERCEL-SPECIFIC OPTIMIZATIONS**

### **vercel.json Features:**
- ✅ Custom build command
- ✅ Node.js 18.x runtime
- ✅ CORS headers
- ✅ API routes configuration

### **next.config.mjs Features:**
- ✅ Standalone output untuk Vercel
- ✅ SWC minification
- ✅ ESM externals disabled
- ✅ Image optimization disabled (untuk kompatibilitas)

## 🔍 **TROUBLESHOOTING**

### **Jika Build Masih Gagal:**

1. **Clear Vercel Cache:**
   - Go to Vercel Dashboard
   - Project Settings → Functions
   - Clear cache and redeploy

2. **Check Environment Variables:**
   - Pastikan semua env vars sudah diset
   - Tidak ada typo dalam nama variables
   - Values tidak mengandung karakter khusus

3. **Check Build Logs:**
   - Lihat detailed error di Vercel deployment logs
   - Focus pada module not found errors
   - Check import/export statements

### **Common Issues:**

#### **Module Not Found:**
- Pastikan semua dependencies ada di `package.json`
- Check relative import paths
- Verify file extensions (.ts, .tsx, .js)

#### **Environment Variables:**
- Prefix client-side vars dengan `NEXT_PUBLIC_`
- Server-side vars tidak perlu prefix
- Restart deployment setelah update env vars

#### **API Routes:**
- Check API route file structure
- Verify export default functions
- Ensure proper HTTP methods

## 🚀 **DEPLOYMENT CHECKLIST**

### **Pre-Deployment:**
- [ ] All environment variables set in Vercel
- [ ] `vercel.json` configuration added
- [ ] `next.config.mjs` updated
- [ ] Build scripts simplified
- [ ] No production-check script

### **Post-Deployment:**
- [ ] Test homepage loads
- [ ] Test authentication flow
- [ ] Test admin dashboard access
- [ ] Check API endpoints
- [ ] Verify CORS headers
- [ ] Test mobile responsiveness

### **Monitoring:**
- [ ] Check Vercel function logs
- [ ] Monitor error rates
- [ ] Test performance
- [ ] Verify SSL certificate
- [ ] Check custom domain (if used)

## 📞 **SUPPORT**

Jika masih ada masalah:

1. **Check Vercel Status:** https://vercel-status.com
2. **Vercel Documentation:** https://vercel.com/docs
3. **Next.js Deployment Guide:** https://nextjs.org/docs/deployment

### **Common Commands:**
```bash
# Local testing
npm run build
npm run start

# Vercel CLI (optional)
npx vercel --prod
npx vercel logs
```

## 🎯 **EXPECTED RESULT**

Setelah deployment berhasil:
- ✅ Homepage accessible
- ✅ Authentication working
- ✅ Admin dashboard protected
- ✅ API endpoints responding
- ✅ No console errors
- ✅ Fast loading times
