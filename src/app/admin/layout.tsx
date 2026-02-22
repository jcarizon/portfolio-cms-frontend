import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Portfolio CMS',
  description: 'Manage your portfolio content',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}