import StatCard from '../components/ui/StatCard';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const chartData = [14, 32, 22, 48, 35, 70, 44, 58, 41, 75, 52, 63];
const maxVal = Math.max(...chartData);

const arrowRightIcon = '/assets/779fb.svg';

type DashboardProps = {
  onNavigate?: (page: string) => void;
};

function QuickLink({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between py-4 w-full group"
    >
      <span className="text-[16px] font-bold font-['Urbanist',sans-serif] text-[#4d4f54] group-hover:text-[#ff5533] transition-colors text-left">
        {label}
      </span>
      <div className="flex items-center gap-0.5 shrink-0">
        <span className="text-[14px] font-medium font-['Inter',sans-serif] text-[#ff5533]">Go</span>
        <img src={arrowRightIcon} alt="" className="w-4 h-4" />
      </div>
    </button>
  );
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="flex flex-col gap-4 min-h-full">

      {/* ── Section Header ─────────────────────────────────────── */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-5">
        <h2 className="text-[22px] font-bold font-['Urbanist',sans-serif] text-[#38393d] leading-tight">
          Institutional Overview
        </h2>
        <p className="text-[14px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-1 leading-relaxed">
          Track key performance indicators, submission volume, and urgent pending requests.
        </p>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Pending Payment"  value={0} badge="Awaiting Settlement" badgeColor="pending"  />
        <StatCard label="Pending Request"   value={7} badge="Urgent"              badgeColor="urgent"   />
        <StatCard label="Under Review"     value={2} badge="In Progress"         badgeColor="progress" />
        <StatCard label="Completed Request" value={0} badge="Fulfilled"          badgeColor="fulfilled"/>
      </div>

      {/* ── Bottom Row ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 flex-1 min-h-[320px] lg:flex-row">

        {/* Monthly Request Volume */}
        <div className="flex-1 min-w-0 bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-bold font-['Urbanist',sans-serif] text-[#0f172b]">
              Monthly Request Volume
            </h3>
            <span className="text-[12px] font-medium font-['Inter',sans-serif] text-[#ff5533] border border-[#ff5533] px-3 py-1 rounded-xl leading-none">
              Live Trends
            </span>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-1.5 flex-1">
            {chartData.map((val, i) => {
              const pct = Math.round((val / maxVal) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group min-w-0">
                  <div className="w-full flex flex-col justify-end" style={{ height: '200px' }}>
                    <div
                      title={`${months[i]}: ${val}`}
                      className="w-full rounded-t-md bg-[#eeeef7] group-hover:bg-[#ff5533] transition-colors duration-150 cursor-pointer"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-medium font-['Inter',sans-serif] text-[#62646a]">{months[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="w-full flex-shrink-0 bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] p-4 sm:p-6 flex flex-col lg:w-[300px]">
          <h3 className="text-[20px] font-bold font-['Urbanist',sans-serif] text-[#0f172b] mb-2">
            Quick Links
          </h3>

          <div className="flex flex-col divide-y divide-[#eeeef7]">
            <QuickLink label="Incoming Request"  onClick={() => onNavigate?.('incoming-requests')} />
            <QuickLink label="Configure Service" onClick={() => onNavigate?.('settings-admin')} />
            <QuickLink label="Branding & API"    onClick={() => onNavigate?.('branding')} />
          </div>

          {/* Active Brand Color */}
          <div className="mt-auto pt-5 border-t border-[#eeeef7]">
            <p className="text-[10px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-widest mb-3">
              Active Brand Color
            </p>
            <div className="flex items-center gap-2">
              <span
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{ backgroundColor: '#fe2f11' }}
              />
              <span className="text-[14px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">
                #fe2f11
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <p className="text-center text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] py-2">
        © 2026 CVP Portal. All rights reserved.
      </p>
    </div>
  );
}
