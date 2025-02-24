// app/chat/layout.tsx
'use client';

import ProtectedPage from '../../components/ProtectedPage';
import { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  // Adjust allowedRoles as needed. Here both 'candidate' and 'recruiter' are allowed.
  return <ProtectedPage allowedRoles={['candidate', 'recruiter']}>{children}</ProtectedPage>;
}
