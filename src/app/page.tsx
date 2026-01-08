'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/reply-helper');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p>Loading...</p>
    </div>
  );
}