import { useState } from 'react';
import type { RequestRecord } from '../types/request';

export const DEMO_REQUESTS: RequestRecord[] = [
  {
    id: '1',
    trackingCode: 'TR-2026-60J8II',
    dateTime: 'Aug 8, 2026, 11:15 PM',
    method: 'MAIL',
    status: 'SUBMITTED',
    serviceType: 'Certificate Verification',
    requesterName: 'Arowolo Malik',
    requesterEmail: 'arowolomalik12@gmail.com',
    requesterPhone: '0000000000',
    applicationType: 'Agency',
    formParams: [
      { label: 'Matric Number', value: '21/9016' },
      { label: 'Graduation Year', value: '2025-08-09' },
      { label: 'Certificate Image', value: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80', type: 'image' },
    ],
    attachedDocumentName: 'certificate_scan.pdf',
    auditTimeline: [
      { id: 'a1', description: 'Status_changed → Completed', timestamp: '9/17/2026, 11:45:40 AM' },
      { id: 'a2', description: 'Request submitted by requester', timestamp: '8/8/2026, 11:15 PM' },
    ],
  },
  {
    id: '2',
    trackingCode: 'TR-2026-8YL3R8',
    dateTime: 'Aug 8, 2026, 08:10 PM',
    method: 'PICKUP',
    status: 'SUBMITTED',
    serviceType: 'Transcript Request',
    requesterName: 'Chisom Adaeze',
    requesterEmail: 'chisom.adaeze@gmail.com',
    requesterPhone: '08012345678',
    applicationType: 'Individual',
    formParams: [
      { label: 'Matric Number', value: '19/4421' },
      { label: 'Graduation Year', value: '2023-07-15' },
      { label: 'Destination Institution', value: 'University of Lagos' },
    ],
    auditTimeline: [
      { id: 'b1', description: 'Request submitted by requester', timestamp: '8/8/2026, 08:10 PM' },
    ],
  },
  {
    id: '3',
    trackingCode: 'TR-2026-BP0Z33',
    dateTime: 'Aug 8, 2026, 08:00 PM',
    method: 'PICKUP',
    status: 'SUBMITTED',
    serviceType: 'Letter of Completion',
    requesterName: 'Emeka Nwosu',
    requesterEmail: 'emeka.nwosu@outlook.com',
    requesterPhone: '08098765432',
    applicationType: 'Corporate',
    formParams: [
      { label: 'Matric Number', value: '20/1137' },
      { label: 'Course of Study', value: 'Computer Science' },
      { label: 'Graduation Year', value: '2024-06-20' },
    ],
    auditTimeline: [
      { id: 'c1', description: 'Request submitted by requester', timestamp: '8/8/2026, 08:00 PM' },
    ],
  },
  {
    id: '4',
    trackingCode: 'TR-2026-0BER9Z',
    dateTime: 'Aug 8, 2026, 03:50 PM',
    method: 'MAIL',
    status: 'SUBMITTED',
    serviceType: 'Certificate Verification',
    requesterName: 'Fatima Bello',
    requesterEmail: 'fatimabello@yahoo.com',
    requesterPhone: '07066554433',
    applicationType: 'Agency',
    formParams: [
      { label: 'Matric Number', value: '22/0089' },
      { label: 'Graduation Year', value: '2026-01-10' },
    ],
    auditTimeline: [
      { id: 'd1', description: 'Request submitted by requester', timestamp: '8/8/2026, 03:50 PM' },
    ],
  },
];

const methodStyle: Record<string, string> = {
  MAIL:    'bg-[#eeeef7] text-[#4d4f54]',
  PICKUP:  'bg-[#eeeef7] text-[#4d4f54]',
  COURIER: 'bg-[#eeeef7] text-[#4d4f54]',
};

const statusStyle: Record<string, { badge: string; dot: string }> = {
  SUBMITTED:  { badge: 'bg-[rgba(255,163,51,0.18)] text-[#b36a00]',  dot: 'bg-[#ff9933]' },
  IN_REVIEW:  { badge: 'bg-[rgba(56,17,155,0.12)] text-[#38119b]',  dot: 'bg-[#38119b]' },
  COMPLETED:  { badge: 'bg-[rgba(17,155,116,0.12)] text-[#119b74]', dot: 'bg-[#119b74]' },
  REJECTED:   { badge: 'bg-[rgba(255,85,51,0.12)] text-[#ff5533]',  dot: 'bg-[#ff5533]' },
};

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: 'SUBMITTED',
  IN_REVIEW: 'IN REVIEW',
  COMPLETED: 'COMPLETED',
  REJECTED:  'REJECTED',
};

type Props = {
  onNavigate?: (page: string) => void;
  onProcess?: (request: RequestRecord) => void;
};

export default function PendingRequests({ onProcess }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all-pending');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filtered = DEMO_REQUESTS.filter(r => {
    const q = search.toLowerCase();
    const matchesSearch =
      q === '' ||
      r.trackingCode.toLowerCase().includes(q) ||
      r.requesterName.toLowerCase().includes(q) ||
      r.requesterEmail.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === 'all-pending' ||
      r.status.toLowerCase().replace('_', '-') === statusFilter;
    return matchesSearch && matchesStatus && (paymentFilter === 'all' || true);
  });

  return (
    <div className="flex flex-col gap-4 min-h-full">

      {/* Section Header */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-5">
        <h2 className="text-[22px] font-bold font-['Urbanist',sans-serif] text-[#38393d] leading-tight">
          Student Service Submissions
        </h2>
        <p className="text-[14px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-1">
          Review, process, and manage incoming student credential requests.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-4 py-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#62646a]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name, email, or tracking code..."
            className="w-full bg-[#fafcff] border border-[#dddedf] rounded-xl pl-9 pr-4 py-2.5 text-[14px] font-['Inter',sans-serif] text-[#4d4f54] placeholder-[#62646a]/50 focus:outline-none focus:border-[#ff5533]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="appearance-none bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-2.5 text-[14px] font-['Inter',sans-serif] text-[#4d4f54] focus:outline-none focus:border-[#ff5533] cursor-pointer w-full sm:w-auto min-w-[160px]"
        >
          <option value="all-pending">All Pending</option>
          <option value="submitted">Submitted</option>
          <option value="in-review">In Review</option>
        </select>

        <select
          value={paymentFilter}
          onChange={e => setPaymentFilter(e.target.value)}
          className="appearance-none bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-2.5 text-[14px] font-['Inter',sans-serif] text-[#4d4f54] focus:outline-none focus:border-[#ff5533] cursor-pointer w-full sm:w-auto min-w-[180px]"
        >
          <option value="all">All Payment Statuses</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eeeef7]">
                {['Tracking Code', 'Method', 'Request Status', 'Actions'].map(col => (
                  <th key={col} className="text-left px-6 py-4 text-[11px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em] whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeef7]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[14px] font-['Inter',sans-serif] text-[#62646a]">
                    No requests found.
                  </td>
                </tr>
              ) : (
                filtered.map(req => {
                  const { badge, dot } = statusStyle[req.status];
                  return (
                    <tr key={req.id} className="hover:bg-[#eeeef7]/40 transition-colors">

                      {/* Tracking Code + date */}
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center border border-[#0f172b] rounded-lg px-3 py-1 mb-1.5">
                          <span className="text-[13px] font-bold font-['Inter',sans-serif] text-[#0f172b] tracking-wide">
                            {req.trackingCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-[#62646a]/60 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
                          </svg>
                          <span className="text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a]">
                            {req.dateTime}
                          </span>
                        </div>
                      </td>

                      {/* Method */}
                      <td className="px-6 py-5">
                        <span className={`text-[12px] font-bold font-['Urbanist',sans-serif] px-3 py-1.5 rounded-lg ${methodStyle[req.method]}`}>
                          {req.method}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-2 text-[12px] font-bold font-['Urbanist',sans-serif] px-3 py-1.5 rounded-xl ${badge}`}>
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                          {STATUS_LABELS[req.status]}
                        </span>
                      </td>

                      {/* Process button */}
                      <td className="px-6 py-5">
                        <button
                          onClick={() => onProcess?.(req)}
                          className="flex items-center gap-1.5 border border-[#dddedf] hover:border-[#0f172b] rounded-xl px-4 py-2 text-[13px] font-semibold font-['Inter',sans-serif] text-[#0f172b] transition-colors whitespace-nowrap"
                        >
                          Process
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] py-2">
        © 2026 CVP Portal. All rights reserved.
      </p>
    </div>
  );
}
