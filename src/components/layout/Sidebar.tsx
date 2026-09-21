import { useState } from 'react';

type Child = { id: string; label: string };

type NavItemConfig = {
  id: string;
  label: string;
  iconLinear: string;
  iconBold: string;
  children?: Child[];
};

const MAIN_MENU: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    iconLinear: '/assets/b8edc.svg',
    iconBold: '/assets/331e4.svg',
  },
  {
    id: 'o-level',
    label: 'O-Level Verification',
    iconLinear: '/assets/283f3.svg',
    iconBold: '/assets/9efda.svg',
    children: [
      { id: 'verify-candidate', label: 'Verify Candidate' },
      { id: 'verification-logs', label: 'Verification Logs' },
    ],
  },
  {
    id: 'verification-requests',
    label: 'Verification Requests',
    iconLinear: '/assets/dd3b5.svg',
    iconBold: '/assets/33f6b.svg',
    children: [
      { id: 'pending-requests', label: 'Pending Requests' },
      { id: 'my-jobs', label: 'My Jobs' },
      { id: 'completed-requests', label: 'Completed Requests' },
    ],
  },
];

const MANAGEMENT: NavItemConfig[] = [
  {
    id: 'wallet',
    label: 'Wallet & Balance',
    iconLinear: '/assets/3ffa2.svg',
    iconBold: '/assets/51a17.svg',
  },
  {
    id: 'settings-admin',
    label: 'Settings Admin',
    iconLinear: '/assets/a7d4d.svg',
    iconBold: '/assets/df336.svg',
    children: [
      { id: 'branding', label: 'Branding & API' },
      { id: 'staff-directory', label: 'Staff Directory' },
      { id: 'configure-services', label: 'Configure Services' },
    ],
  },
];

const ACCOUNT: NavItemConfig[] = [
  {
    id: 'profile',
    label: 'Profile & Security',
    iconLinear: '/assets/78cf2.svg',
    iconBold: '/assets/a3b69.svg',
  },
  {
    id: 'signout',
    label: 'Sign Out',
    iconLinear: '/assets/3fd56.svg',
    iconBold: '/assets/1674a.svg',
  },
];

const ARROW_DOWN = '/assets/9163c.svg';

type SidebarProps = {
  activePage?: string;
  onNavigate?: (page: string) => void;
  institutionName?: string;
  onClose?: () => void;
};

export default function Sidebar({
  activePage = 'dashboard',
  onNavigate,
  institutionName = 'Techbroker University',
  onClose,
}: SidebarProps) {
  const getInitialExpanded = () => {
    const map: Record<string, boolean> = {};
    for (const section of [MAIN_MENU, MANAGEMENT, ACCOUNT]) {
      for (const item of section) {
        if (item.children?.some(c => c.id === activePage)) {
          map[item.id] = true;
        }
      }
    }
    return map;
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>(getInitialExpanded);

  const toggle = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const go = (id: string) => {
    onNavigate?.(id);
    onClose?.();
  };

  const isActive = (item: NavItemConfig) =>
    activePage === item.id ||
    item.children?.some(c => c.id === activePage) === true;

  const NavItem = ({ item }: { item: NavItemConfig }) => {
    const active = isActive(item);
    const open = expanded[item.id];
    const hasChildren = !!item.children?.length;

    return (
      <>
        <div className="relative">
          {/* Active left-edge indicator */}
          {active && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[28px] bg-[#ff5533] rounded-r-full" />
          )}

          <button
            onClick={() => hasChildren ? toggle(item.id) : go(item.id)}
            className={`w-full flex items-center gap-3 pl-5 pr-4 py-[9px] rounded-xl transition-colors text-left ${
              active ? 'bg-[rgba(221,222,223,0.15)]' : 'hover:bg-white/[0.06]'
            }`}
          >
            <img
              src={active ? item.iconBold : item.iconLinear}
              alt=""
              className="w-5 h-5 flex-shrink-0"
            />
            <span
              className={`flex-1 text-[16px] font-['Urbanist',sans-serif] leading-none ${
                active
                  ? 'font-semibold text-[#ff5533]'
                  : 'font-medium text-[#dddedf]'
              }`}
            >
              {item.label}
            </span>
            {hasChildren && (
              <img
                src={ARROW_DOWN}
                alt=""
                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            )}
          </button>
        </div>

        {/* Sub-items */}
        {hasChildren && open && (
          <div className="ml-[44px] flex flex-col gap-0.5 mb-1">
            {item.children!.map(child => {
              const childActive = activePage === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => go(child.id)}
                  className={`w-full text-left py-2 px-3 rounded-lg text-[14px] font-['Urbanist',sans-serif] transition-colors flex items-center gap-2 ${
                    childActive
                      ? 'font-semibold text-[#ff5533]'
                      : 'font-medium text-[#dddedf] hover:text-[#ff5533]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${childActive ? 'bg-[#ff5533]' : 'bg-[#62646a]'}`} />
                  {child.label}
                </button>
              );
            })}
          </div>
        )}
      </>
    );
  };

  const SectionLabel = ({ label }: { label: string }) => (
    <p className="text-[10px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.12em] px-5 pt-5 pb-2">
      {label}
    </p>
  );

  return (
    <aside className="flex flex-col h-screen w-full bg-[#0f172b] flex-shrink-0 overflow-y-auto lg:w-[288px] lg:min-w-[288px]">

      {/* ── Logo ───────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        {/* Logo mark — orange rounded square with checkmark */}
        <div className="w-[46px] h-[46px] rounded-lg bg-[#ff5533] flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img
            src="/logo-cvp.png"
            alt="CVP"
            className="w-full h-full object-contain"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          {/* Fallback checkmark if no logo */}
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white absolute" fill="none" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="flex flex-col leading-snug">
          <span className="text-[11px] font-bold font-['Urbanist',sans-serif] text-[#fafcff] uppercase tracking-wide leading-none">
            Central
          </span>
          <span className="text-[11px] font-bold font-['Urbanist',sans-serif] text-[#fafcff] uppercase tracking-wide leading-none">
            Verification
          </span>
          <span className="text-[11px] font-bold font-['Urbanist',sans-serif] text-[#ff5533] uppercase tracking-wide leading-none">
            Portal
          </span>
          <span className="text-[9px] font-['Urbanist',sans-serif] text-[#62646a] leading-none mt-0.5">
            By Techbroker
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#dddedf] lg:hidden"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Institution Name ───────────────────── */}
      <div className="px-5 pb-4">
        <p className="text-[18px] font-bold font-['Urbanist',sans-serif] text-[#fafcff]">
          {institutionName}
        </p>
      </div>

      {/* ── Navigation ────────────────────────── */}
      <nav className="flex-1 px-3 pb-6 flex flex-col gap-0.5">
        <SectionLabel label="Main Menu" />
        {MAIN_MENU.map(item => <NavItem key={item.id} item={item} />)}

        <SectionLabel label="Management" />
        {MANAGEMENT.map(item => <NavItem key={item.id} item={item} />)}

        <SectionLabel label="Account" />
        {ACCOUNT.map(item => <NavItem key={item.id} item={item} />)}
      </nav>
    </aside>
  );
}
