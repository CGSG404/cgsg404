// Di halaman mana pun, misalnya src/app/forum/page.tsx
import LiveChat from '@/components/LiveChat';

export default function ForumPage() {
  return (
    <div>
      {/* Konten halaman lainnya */}
      <LiveChat />
    </div>
  );
}