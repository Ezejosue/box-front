'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDecodedToken, isTokenValid, clearAuth } from '@/utils/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface User {
  email: string;
}

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const decoded = getDecodedToken();
    if (decoded) {
      setUser({ email: decoded.email });
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center">
              <img
                src="/logo.svg"
                alt="Box App"
                className="h-8 w-auto"
              />
            </div>
          </div>
          {user && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 w-full px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
          <nav className="mt-2">
            <Link
              href="/orders"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <span className="mx-3">Órdenes</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
