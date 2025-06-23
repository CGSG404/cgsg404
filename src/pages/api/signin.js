export default function handler(req, res) {
    if (req.method === 'POST') {
      const { email, password } = req.body;
      // Contoh validasi sederhana (ganti dengan validasi database Anda)
      if (email === 'user@example.com' && password === 'password123') {
        // Bisa generate token/session di sini
        return res.status(200).json({ success: true, token: 'dummy-token' });
      } else {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }