type HeaderProps = {
  pageTitle?: string;
  userName?: string;
  onSignOut?: () => void;
};

export default function Header({ pageTitle = 'Dashboard', userName = 'Techbroker University Admin', onSignOut }: HeaderProps) {
  return (
    <header className="h-[60px] bg-[#fafcff] border-b border-[#eeeef7] flex items-center justify-between px-8 flex-shrink-0 shadow-[0px_2px_8px_rgba(238,238,247,0.8)]">
      <h1 className="text-[22px] font-bold font-['Urbanist',sans-serif] text-[#0f172b]">{pageTitle}</h1>
      <div className="flex items-center gap-3">
        <span className="text-[15px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">{userName}</span>
        <button
          onClick={onSignOut}
          className="text-[15px] font-medium font-['Inter',sans-serif] text-[#62646a] hover:text-[#ff5533] transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
