import type { Metadata } from 'next';
import AdminGate from './AdminGate';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
