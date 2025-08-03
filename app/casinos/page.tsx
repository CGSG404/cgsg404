import { redirect } from 'next/navigation';

export default function CasinosPage() {
  // Redirect /casinos to /casinos-singapore permanently
  redirect('/casinos-singapore');
}
