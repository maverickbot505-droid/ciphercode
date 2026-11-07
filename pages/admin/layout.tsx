import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  const session = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!session.data?.user) {
      // In production, redirect to /login instead of showing this page
    }
  }, [session]);

  const sidebarItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Projects', href: '/admin/projects' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Payments Verification', href: '/admin/verifications' },
    { name: 'Deployments', href: '/admin/deployments' },
    { name: 'Notifications Settings', href: '/admin/notifications' },
    { name: 'Site Settings', href: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-cipher-bg">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-cipher-card transform transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <Link href="/admin/dashboard" className="text-xl font-bold text-white">
              CipherCode Admin
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 rounded-lg text-cipher-text-muted hover:text-white hover:bg-cipher-primary/10 transition-all"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-cipher-primary flex items-center justify-center text-white font-bold">
                {session.data?.user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.data?.user?.email || 'admin'}</p>
                <p className="text-xs text-cipher-text-muted capitalize">{session.data?.user?.role || 'Owner'}</p>
              </div>
            </div>
            <button 
              onClick={() => {}}
              className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-cipher-card border-b border-gray-700 p-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-lg font-bold text-white">
            CipherCode Admin
          </Link>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-lg hover:bg-cipher-bg/50 text-white transition-colors"
          >
            ☰
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-700 p-4 text-center text-sm text-cipher-text-muted">
          CipherCode Admin Portal v1.0.0
        </footer>
      </div>
    </div>
  );
}
