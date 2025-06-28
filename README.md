# Global Chat Application

A real-time global chat application built with Next.js, TypeScript and Supabase. The application allows users to communicate instantly with other connected users.

## Key Features

- Live Chat** - Get the latest information instantly!
- Automatic login** - Sign in via Google OAuth
- **Tampilan Responsif** - available on desktop and mobile devices
- Dark/Light Mode** - show and change themes
- **Indikator Online** - access to tons of information online
- **Riwayat Pesan** - delete content anywhere, anytime

## 🛠 Technology Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Realtime)
- **State Management**: React Hooks
- **Icons**: Lucide Icons

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