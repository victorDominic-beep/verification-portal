import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
  activePage?: string;
  pageTitle?: string;
  onNavigate?: (page: string) => void;
};

export default function Layout({ children, activePage, pageTitle, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fafcff]">
      <div className="hidden lg:flex h-full">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />
      </div>

      <div
        className={`fixed inset-0 z-40 bg-[#0f172b]/40 transition-opacity duration-200 lg:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar
          activePage={activePage}
          onNavigate={(page) => {
            onNavigate?.(page);
            setSidebarOpen(false);
          }}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          pageTitle={pageTitle}
          onSignOut={() => onNavigate?.('signout')}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
        />
        <main className="flex-1 overflow-y-auto bg-[#fafcff] p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
