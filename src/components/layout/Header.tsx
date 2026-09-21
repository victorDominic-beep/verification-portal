type HeaderProps = {
  pageTitle?: string;
  userName?: string;
  onSignOut?: () => void;
  onMenuToggle?: () => void;
};

export default function Header({ pageTitle = 'Dashboard', userName = 'Techbroker University Admin', onSignOut, onMenuToggle }: HeaderProps) {
  return (
    <header className="min-h-[60px] bg-[#fafcff] border-b border-[#eeeef7] flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3 flex-shrink-0 shadow-[0px_2px_8px_rgba(238,238,247,0.8)]">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={onMenuToggle}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#dddedf] bg-white text-[#0f172b] shadow-sm"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <h1 className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold font-['Urbanist',sans-serif] text-[#0f172b] leading-tight break-words">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
        <span className="text-[12px] sm:text-[14px] lg:text-[15px] font-medium font-['Inter',sans-serif] text-[#4d4f54] text-right break-words">
          {userName}
        </span>
        <button
          onClick={onSignOut}
          className="text-[12px] sm:text-[14px] lg:text-[15px] font-medium font-['Inter',sans-serif] text-[#62646a] hover:text-[#ff5533] transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
