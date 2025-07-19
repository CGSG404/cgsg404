# CGSG404 - Casino Guide Singapore

A comprehensive casino guide platform built with Next.js, TypeScript and Supabase. The application provides trusted casino reviews, bonuses, and community features for Singapore casino enthusiasts.

## 🎯 Key Features

- **🎰 Casino Reviews** - Comprehensive reviews with safety ratings
- **🎁 Bonus Tracking** - Latest casino bonuses and promotions
- **💬 Live Forum** - Real-time community discussions
- **🔐 User Authentication** - Secure Google OAuth integration
- **📱 Responsive Design** - Optimized for desktop and mobile
- **🌙 Modern UI** - Professional casino-themed interface
- **📊 User Rankings** - Gamified user experience with levels

## 🛠 Technology Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Realtime)
- **State Management**: React Hooks
- **Icons**: Lucide Icons

## 🔐 Admin System

CGSG404 dilengkapi dengan sistem admin yang komprehensif dengan Row Level Security (RLS) dan permission management yang granular.

### **📚 Admin Documentation:**
- **[Admin Setup Guide](ADMIN_SETUP_GUIDE.md)** - Setup dan konfigurasi sistem admin
- **[Developer Guide](docs/ADMIN_DEVELOPER_GUIDE.md)** - Panduan untuk developer
- **[Permission Reference](docs/PERMISSION_REFERENCE.md)** - Daftar lengkap permissions
- **[Troubleshooting](docs/ADMIN_TROUBLESHOOTING.md)** - Panduan troubleshooting
- **[Quick Reference](docs/ADMIN_QUICK_REFERENCE.md)** - Referensi cepat

### **🔑 Key Features:**
- ✅ **Role-based Access Control** (Super Admin, Admin, Moderator)
- ✅ **Granular Permissions** (25+ permission types)
- ✅ **Database-level Security** (RLS policies)
- ✅ **Activity Logging** (Audit trail)
- ✅ **React Context Integration** (Easy frontend usage)

## 🚀 How to Run

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Supabase account

### Instalasi

1. Clone this repository:
   ```bash
 git clone [URL_REPOSITORY]
 cd cgsg404
 ```

2. Install dependencies:
   ```bash
 npm install
   # or
 yarn install
 ````

3. Create a `.env.local` file in the root directory and fill it with:
   ``env
 NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
 NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
 ``

4. Run the application:
   ```bash
 npm run dev
   # or
 dev thread
 ```

5. Open [http://localhost:8080](http://localhost:8080) in your browser.

## 🔒 Supabase Configuration

1. Create a new project in [Supabase](https://supabase.com/)
2. Enable Authentication and select Google provider
3. Create the `chat_messages` table with the following schema:
   ```sql
 CREATE TABLE public.chat_messages(
 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
 user_id UUID REFERENCES auth.users NOT NULL,
 message TEXT NOT NULL,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 );
 ```''

4. Create a new table in [Database]. Enable Row Level Security (RLS) and add policies:
   ``sql
   -- Enable RLS
 ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

   -- Policy for reading messages
 CREATE POLICY "Enable read access for all users"
 ON public.chat_messages
 FOR SELECT
 USING (true);

   -- Policy for writing messages
 CREATE POLICY "Enable insert for authenticated users only"
 ON public.chat_messages
 FOR INSERT
 TO authenticated
 WITH CHECK(true);
 ```

## 🤝 Contribute

1. Fork this repository
2. Create a new feature branch (`git checkout -b feature/feature name`)
3. Commit your changes (`git commit -m ‘Added new feature’`)
4. Push to the branch (`git push origin feature/feature name`)
5. Make a Pull Request

## 📝 License

Licensed under the [MIT License](LICENSE).

---

Created with ❤️ by Team CGSG404