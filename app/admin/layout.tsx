import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | CGSG',
  description: 'Content Management System for CGSG',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-casino-dark">
      {children}
    </div>
  );
}
