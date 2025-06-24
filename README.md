# Global Chat Application

Sebuah aplikasi obrolan global real-time yang dibangun dengan Next.js, TypeScript, dan Supabase. Aplikasi ini memungkinkan pengguna untuk berkomunikasi secara real-time dengan pengguna lain yang terhubung.

## 🚀 Fitur Utama

- **Obrolan Real-time** - Kirim dan terima pesan secara instan
- **Autentikasi Pengguna** - Login dengan Google OAuth
- **Tampilan Responsif** - Berfungsi dengan baik di perangkat desktop dan mobile
- **Dark/Light Mode** - Dukungan tema gelap dan terang
- **Indikator Online** - Melihat jumlah pengguna online
- **Riwayat Pesan** - Pesan tersimpan dan dapat dilihat kapan saja

## 🛠 Teknologi yang Digunakan

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Realtime)
- **State Management**: React Hooks
- **Icons**: Lucide Icons

## 🚀 Cara Menjalankan

### Prasyarat

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Akun Supabase

### Instalasi

1. Clone repositori ini:
   ```bash
   git clone [URL_REPOSITORY]
   cd cgsg404
   ```

2. Install dependencies:
   ```bash
   npm install
   # atau
   yarn install
   ```

3. Buat file `.env.local` di root direktori dan isi dengan:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Jalankan aplikasi:
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. Buka [http://localhost:8080](http://localhost:8080) di browser Anda.

## 🔒 Konfigurasi Supabase

1. Buat project baru di [Supabase](https://supabase.com/)
2. Aktifkan Authentication dan pilih provider Google
3. Buat tabel `chat_messages` dengan skema berikut:
   ```sql
   CREATE TABLE public.chat_messages (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES auth.users NOT NULL,
     message TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```
4. Aktifkan Row Level Security (RLS) dan tambahkan policies:
   ```sql
   -- Enable RLS
   ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

   -- Policy untuk membaca pesan
   CREATE POLICY "Enable read access for all users"
   ON public.chat_messages
   FOR SELECT
   USING (true);

   -- Policy untuk menulis pesan
   CREATE POLICY "Enable insert for authenticated users only"
   ON public.chat_messages
   FOR INSERT
   TO authenticated
   WITH CHECK (true);
   ```

## 🤝 Berkontribusi

1. Fork repositori ini
2. Buat branch fitur baru (`git checkout -b fitur/namafitur`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur/namafitur`)
5. Buat Pull Request

## 📝 Lisensi

Dilisensikan di bawah [MIT License](LICENSE).

---

Dibuat dengan ❤️ oleh Tim CGSG404
