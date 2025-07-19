# 🗄️ Database Migration Guide - CGSG404

## 📋 **OVERVIEW**

Panduan ini akan membantu Anda melakukan migrasi database dari static files ke Supabase database yang proper. Setelah migrasi ini, semua data casino dan news akan disimpan di database dan dapat dikelola melalui admin dashboard.

## 🚀 **PERSIAPAN YANG SUDAH SELESAI**

✅ **Files yang sudah dibuat:**
1. `supabase/migrations/20250119000001_create_casinos_schema.sql` - Database schema
2. `supabase/migrations/20250119000002_seed_casino_data.sql` - Initial data
3. `src/types/database.ts` - TypeScript types
4. `src/lib/database-api.ts` - API functions
5. `src/components/CasinoListings.tsx` - Updated component

✅ **Komponen yang sudah diupdate:**
- CasinoListings menggunakan database API
- Loading states dan error handling
- Search dan filter functionality

## 🔧 **LANGKAH MIGRASI DATABASE**

### **STEP 1: Jalankan Migration di Supabase**

Anda perlu menjalankan SQL migration files di Supabase Dashboard:

1. **Buka Supabase Dashboard**
   - Login ke https://supabase.com
   - Pilih project CGSG404

2. **Jalankan Schema Migration**
   - Buka SQL Editor
   - Copy paste isi file `supabase/migrations/20250119000001_create_casinos_schema.sql`
   - Klik "Run" untuk membuat tables

3. **Jalankan Data Seeding**
   - Copy paste isi file `supabase/migrations/20250119000002_seed_casino_data.sql`
   - Klik "Run" untuk populate data

### **STEP 2: Verifikasi Database**

Setelah migration, verifikasi bahwa tables sudah dibuat:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'casino%' OR table_name = 'news_articles';

-- Check casino data
SELECT COUNT(*) FROM casinos;
SELECT name, rating, safety_index FROM casinos LIMIT 5;

-- Check news data
SELECT COUNT(*) FROM news_articles;
SELECT title, category FROM news_articles;
```

### **STEP 3: Test Aplikasi**

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Casino Listings**
   - Buka http://localhost:3000/casinos
   - Pastikan casino cards muncul dari database
   - Test search functionality
   - Test filter tabs (All, Best, New, Bonuses)

3. **Test News Page**
   - Buka http://localhost:3000/news
   - Pastikan news articles muncul

## 📊 **DATABASE SCHEMA OVERVIEW**

### **Tables Created:**

1. **`casinos`** - Main casino data
   - id, name, slug, logo, rating, safety_index
   - bonus, description, play_url
   - is_new, is_hot, is_featured

2. **`casino_features`** - Casino features (normalized)
   - casino_id, feature

3. **`casino_badges`** - Casino badges (normalized)
   - casino_id, badge

4. **`casino_links`** - Casino links (bonus, review, complaint)
   - casino_id, link_type, url

5. **`casino_categories`** - Categories (Top Rated, New, etc.)
   - name, description

6. **`casino_category_assignments`** - Many-to-many relationship
   - casino_id, category_id

7. **`user_casino_ratings`** - User ratings for casinos
   - user_id, casino_id, rating, review

8. **`news_articles`** - News articles
   - title, slug, excerpt, content, author, category

### **Data Populated:**

- **10 Casinos** with complete data (Ducky Luck, Speed Sgd, TOP1, BK88, etc.)
- **10 Categories** (Top Rated, New Casinos, Best Bonuses, etc.)
- **2 News Articles** (CGSG Launch, Future of Gaming)
- **All relationships** properly linked

## 🔍 **API FUNCTIONS AVAILABLE**

### **Casino Operations:**
```typescript
// Get all casinos with filtering
databaseApi.getCasinos(params)

// Get casinos formatted for cards
databaseApi.getCasinosForCards(params)

// Get single casino
databaseApi.getCasino(id_or_slug)

// Rate a casino
databaseApi.rateCasino(rating)
```

### **News Operations:**
```typescript
// Get news articles
databaseApi.getNewsArticles(params)

// Get single article
databaseApi.getNewsArticle(id_or_slug)
```

### **Search Operations:**
```typescript
// Global search
databaseApi.globalSearch(query)

// Search suggestions
databaseApi.getSearchSuggestions(query)
```

## 🎯 **BENEFITS SETELAH MIGRASI**

### **1. Dynamic Data Management**
- ✅ Data casino bisa diupdate real-time
- ✅ Admin bisa menambah/edit casino via dashboard
- ✅ User ratings tersimpan di database

### **2. Better Performance**
- ✅ Database indexing untuk search yang cepat
- ✅ Pagination untuk large datasets
- ✅ Caching dengan TanStack Query

### **3. Advanced Features Ready**
- ✅ User rating system
- ✅ Advanced search dan filtering
- ✅ Category management
- ✅ News management

### **4. Scalability**
- ✅ Bisa handle ribuan casino
- ✅ User-generated content
- ✅ Real-time updates

## 🚨 **TROUBLESHOOTING**

### **Migration Errors:**
```sql
-- If tables already exist, drop them first
DROP TABLE IF EXISTS casino_category_assignments;
DROP TABLE IF EXISTS casino_links;
DROP TABLE IF EXISTS casino_badges;
DROP TABLE IF EXISTS casino_features;
DROP TABLE IF EXISTS user_casino_ratings;
DROP TABLE IF EXISTS casino_categories;
DROP TABLE IF EXISTS news_articles;
DROP TABLE IF EXISTS casinos;
```

### **Data Issues:**
- Check Supabase logs in Dashboard
- Verify RLS policies are correct
- Ensure user authentication is working

### **Component Issues:**
- Check browser console for errors
- Verify API calls in Network tab
- Check TanStack Query devtools

## ✅ **VERIFICATION CHECKLIST**

- [ ] Database schema created successfully
- [ ] Sample data populated
- [ ] Casino listings page loads from database
- [ ] Search functionality works
- [ ] Filter tabs work correctly
- [ ] Loading states display properly
- [ ] Error handling works
- [ ] News page loads from database

## 🎉 **NEXT STEPS AFTER MIGRATION**

1. **Dashboard Admin Development** - CRUD operations
2. **Search Enhancement** - Advanced filtering
3. **User Profile System** - Rating and reviews
4. **Forum Enhancement** - Database-driven discussions

---

**🔥 Setelah migration ini selesai, project Anda akan memiliki foundation database yang solid untuk semua pengembangan selanjutnya!**
