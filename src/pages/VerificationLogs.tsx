import { useState } from 'react';

type LogEntry = {
  id: string;
  dateTime: string;
  trackingId: string;
  examBody: 'WAEC' | 'NECO' | 'NABTEB' | 'NBAIS';
  examNoYear: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
};

const DEMO_LOGS: LogEntry[] = [
  { id: '1', dateTime: 'Sep 16, 2026, 01:57 PM', trackingId: 'CVP-PN7S2DGJ', examBody: 'WAEC', examNoYear: '4000000001 (2024)', status: 'COMPLETED' },
  { id: '2', dateTime: 'Sep 16, 2026, 01:56 PM', trackingId: 'CVP-2I3X36E6', examBody: 'WAEC', examNoYear: '4000000001 (2024)', status: 'COMPLETED' },
  { id: '3', dateTime: 'Sep 15, 2026, 11:14 PM', trackingId: 'CVP-T087G7X8', examBody: 'WAEC', examNoYear: '4041313057 (2012)', status: 'COMPLETED' },
];

const examBodyColors: Record<LogEntry['examBody'], string> = {
  WAEC:   'bg-[rgba(255,163,51,0.18)] text-[#b36a00]',
  NECO:   'bg-[rgba(56,17,155,0.12)] text-[#38119b]',
  NABTEB: 'bg-[rgba(17,155,116,0.12)] text-[#119b74]',
  NBAIS:  'bg-[rgba(255,85,51,0.12)] text-[#ff5533]',
};

const statusColors: Record<LogEntry['status'], string> = {
  COMPLETED: 'bg-[rgba(17,155,116,0.12)] text-[#119b74]',
  PENDING:   'bg-[rgba(255,163,51,0.18)] text-[#b36a00]',
  FAILED:    'bg-[rgba(255,85,51,0.12)] text-[#ff5533]',
};

const SEARCH_ICON = '/assets/b8edc.svg';

type Props = { onNavigate?: (page: string) => void };

export default function VerificationLogs({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [bodyFilter, setBodyFilter] = useState('all');

  const filtered = DEMO_LOGS.filter(log => {
    const matchesSearch =
      search === '' ||
      log.trackingId.toLowerCase().includes(search.toLowerCase()) ||
      log.examNoYear.toLowerCase().includes(search.toLowerCase());
    const matchesBody = bodyFilter === 'all' || log.examBody === bodyFilter;
    return matchesSearch && matchesBody;
  });

  const totalVerifications = DEMO_LOGS.length;
  const waecRecords = DEMO_LOGS.filter(l => l.examBody === 'WAEC').length;
  const necoRecords = DEMO_LOGS.filter(l => l.examBody === 'NECO').length;

  return (
    <div className="flex flex-col gap-4 min-h-full">

      {/* Section Header */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-5 flex items-start justify-between gap-6">
        <div>
          <h2 className="text-[22px] font-bold font-['Urbanist',sans-serif] text-[#38393d] leading-tight">
            O-Level Verification Logs
          </h2>
          <p className="text-[14px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-1">
            Historical verification audit trail and verified candidate result sheets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 mt-0.5">
          <button className="flex items-center gap-2 border border-[#dddedf] rounded-xl px-4 py-2.5 text-[14px] font-medium font-['Inter',sans-serif] text-[#38393d] hover:border-[#ff5533] hover:text-[#ff5533] transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.13-3.87M20 15a9 9 0 01-14.13 3.87" />
            </svg>
            Refresh
          </button>

          <button
            onClick={() => onNavigate?.('verify-candidate')}
            className="flex items-center gap-2 bg-[#ff5533] hover:bg-[#e64d2e] transition-colors text-white rounded-xl px-5 py-2.5 text-[14px] font-bold font-['Inter',sans-serif] shadow-[0px_4px_8px_rgba(211,1,28,0.2)]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Verification
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatMini label="Total Verifications" value={totalVerifications} valueColor="text-[#0f172b]" />
        <StatMini label="WAEC Records"         value={waecRecords}        valueColor="text-[#ff9933]" />
        <StatMini label="NECO Records"         value={necoRecords}        valueColor="text-[#38119b]" />
      </div>

      {/* Search + Filter */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-4 py-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 min-w-0">
          <img src={SEARCH_ICON} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Exam Number, Candidate Name, or Tracking ID..."
            className="w-full bg-[#fafcff] border border-[#dddedf] rounded-xl pl-9 pr-4 py-2.5 text-[14px] font-['Inter',sans-serif] text-[#4d4f54] placeholder-[#62646a]/50 focus:outline-none focus:border-[#ff5533]"
          />
        </div>

        <select
          value={bodyFilter}
          onChange={e => setBodyFilter(e.target.value)}
          className="appearance-none bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-2.5 text-[14px] font-['Inter',sans-serif] text-[#4d4f54] focus:outline-none focus:border-[#ff5533] cursor-pointer w-full sm:w-auto min-w-[160px]"
        >
          <option value="all">All Examination Bodies</option>
          <option value="WAEC">WAEC</option>
          <option value="NECO">NECO</option>
          <option value="NABTEB">NABTEB</option>
          <option value="NBAIS">NBAIS</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eeeef7]">
                {['Date & Time', 'Tracking ID', 'Exam Body', 'Exam No / Year', 'Status', 'Actions'].map(col => (
                  <th key={col} className="text-left px-6 py-4 text-[11px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em] whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeef7]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[14px] font-['Inter',sans-serif] text-[#62646a]">
                    No records found.
                  </td>
                </tr>
              ) : (
                filtered.map(log => (
                  <tr key={log.id} className="hover:bg-[#eeeef7]/40 transition-colors">
                    <td className="px-6 py-4 text-[14px] font-['Inter',sans-serif] text-[#4d4f54] whitespace-nowrap">
                      {log.dateTime}
                    </td>
                    <td className="px-6 py-4 text-[14px] font-bold font-['Inter',sans-serif] text-[#0f172b] whitespace-nowrap">
                      {log.trackingId}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[12px] font-bold font-['Urbanist',sans-serif] px-3 py-1 rounded-lg ${examBodyColors[log.examBody]}`}>
                        {log.examBody}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[14px] font-['Inter',sans-serif] text-[#4d4f54] whitespace-nowrap">
                      {log.examNoYear}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-bold font-['Urbanist',sans-serif] px-3 py-1.5 rounded-lg tracking-wide ${statusColors[log.status]}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="bg-[#0f172b] hover:bg-[#1e293b] transition-colors text-white text-[13px] font-semibold font-['Inter',sans-serif] px-4 py-2 rounded-xl whitespace-nowrap">
                        View Grade Sheet
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] py-2">
        © 2026 CVP Portal. All rights reserved.
      </p>
    </div>
  );
}

function StatMini({ label, value, valueColor }: { label: string; value: number; valueColor: string }) {
  return (
    <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-5">
      <p className="text-[11px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em] mb-3">
        {label}
      </p>
      <span className={`text-[48px] font-semibold font-['Urbanist',sans-serif] leading-none ${valueColor}`}>
        {value}
      </span>
    </div>
  );
}
