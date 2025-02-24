// components/ProtectedPage.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  exp?: number;
  role?: string;
  [key: string]: any;
}

interface ProtectedPageProps {
  allowedRoles?: string[];
  children: ReactNode;
}

const ProtectedPage = ({ allowedRoles = [], children }: ProtectedPageProps) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Ensure 'exp' exists and the token hasn't expired.
      if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      // Check for allowed roles if provided.
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role || '')) {
        router.push('/unauthorized');
        return;
      }

      setAuthorized(true);
    } catch (err) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router, allowedRoles]);

  if (!authorized) return null; // Optionally, you can render a loading spinner.
  return <>{children}</>;
};

export default ProtectedPage;
