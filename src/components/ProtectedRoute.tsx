import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenValid } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isTokenValid()) {
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}
