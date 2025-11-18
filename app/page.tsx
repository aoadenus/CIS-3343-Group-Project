'use client';

import { PublicHome } from '../src/pages/public/Home'
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  
  return <PublicHome onNavigate={(page) => router.push(`/${page}`)} />
}
