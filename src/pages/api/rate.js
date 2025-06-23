export default function handler(req, res) {
    if (req.method === 'POST') {
      // Ambil data dari body
      const { casinoId, rating } = req.body;
  
      // Validasi sederhana
      if (!casinoId || !rating) {
        return res.status(400).json({ error: 'Invalid data' });
      }
  
      // Simpan rating ke database di sini (contoh: hanya log)
      console.log('Received rating:', { casinoId, rating });
  
      // Beri respon sukses
      return res.status(200).json({ success: true });
    } else {
      // Method selain POST tidak diizinkan
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }