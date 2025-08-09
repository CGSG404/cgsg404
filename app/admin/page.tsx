import Link from 'next/link';

export default function AdminIndexPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <Link href="/admin/hero-banners" className="text-blue-600 hover:underline">
            Manage Hero Banners
          </Link>
        </li>
      </ul>
    </div>
  );
}


