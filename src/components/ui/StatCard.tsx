type StatCardProps = {
  label: string;
  value: number | string;
  badge: string;
  badgeColor: 'pending' | 'urgent' | 'progress' | 'fulfilled';
};

const cfg = {
  pending: {
    valueCls: 'text-[#0f172b]',
    badgeBg: 'bg-[rgba(255,163,51,0.18)]',
    badgeText: 'text-[#0f172b]',
  },
  urgent: {
    valueCls: 'text-[#ff5533]',
    badgeBg: 'bg-[rgba(255,85,51,0.13)]',
    badgeText: 'text-[#ff5533]',
  },
  progress: {
    valueCls: 'text-[#38119b]',
    badgeBg: 'bg-[rgba(56,17,155,0.1)]',
    badgeText: 'text-[#38119b]',
  },
  fulfilled: {
    valueCls: 'text-[#119b74]',
    badgeBg: 'bg-[rgba(17,155,116,0.1)]',
    badgeText: 'text-[#119b74]',
  },
} as const;

export default function StatCard({ label, value, badge, badgeColor }: StatCardProps) {
  const { valueCls, badgeBg, badgeText } = cfg[badgeColor];
  return (
    <div className="bg-[#eeeef7] border border-[#fafcff] rounded-xl px-6 py-8 flex flex-col gap-5 shadow-[0px_4px_6px_rgba(171,171,176,0.2)] min-w-0">
      {/* Label */}
      <p className="text-[11px] font-bold font-['Urbanist',sans-serif] text-[#4d4f54] uppercase tracking-[0.08em]">
        {label}
      </p>

      {/* Value + Badge row — aligned to bottom */}
      <div className="flex items-end justify-between gap-2">
        <span className={`text-[56px] font-semibold font-['Urbanist',sans-serif] leading-none ${valueCls}`}>
          {value}
        </span>
        <span className={`${badgeBg} ${badgeText} text-[11px] font-normal font-['Inter',sans-serif] px-3 py-1.5 rounded-xl whitespace-nowrap mb-1 shrink-0`}>
          {badge}
        </span>
      </div>
    </div>
  );
}
