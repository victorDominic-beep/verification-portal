import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
  activePage?: string;
  pageTitle?: string;
  onNavigate?: (page: string) => void;
};

export default function Layout({ children, activePage, pageTitle, onNavigate }: LayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fafcff]">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitle} onSignOut={() => onNavigate?.('signout')} />
        <main className="flex-1 overflow-y-auto bg-[#fafcff] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
