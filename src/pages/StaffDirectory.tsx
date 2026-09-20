import { useState } from 'react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
export type AccessRole = 'INSTITUTION-ADMIN' | 'INSTITUTION-REVIEWER';

export type StaffMember = {
  id: string;
  fullName: string;
  email: string;
  role: AccessRole;
  assignedDate: string;
};

/* ─── Demo data (replace with GET /api/staff response) ───────────────────── */
const DEMO_STAFF: StaffMember[] = [
  {
    id: 's1',
    fullName: 'Techbroker University Admin',
    email: 'Techbrokersltd@outlook.com',
    role: 'INSTITUTION-ADMIN',
    assignedDate: '8/4/2026, 5:07:32 PM',
  },
  {
    id: 's2',
    fullName: 'Arowolo Malik',
    email: 'Arowolomalik12@gmail.com',
    role: 'INSTITUTION-REVIEWER',
    assignedDate: '9/14/2026, 10:39:14 AM',
  },
];

const ACCESS_ROLES: { value: AccessRole; label: string }[] = [
  { value: 'INSTITUTION-REVIEWER', label: 'Institution Reviewer (Review Requests)' },
  { value: 'INSTITUTION-ADMIN',    label: 'Institution Admin (Full Access)' },
];

const roleBadge: Record<AccessRole, string> = {
  'INSTITUTION-ADMIN':    'bg-[rgba(56,17,155,0.1)] text-[#38119b] border border-[rgba(56,17,155,0.2)]',
  'INSTITUTION-REVIEWER': 'bg-[#eeeef7] text-[#4d4f54] border border-[#dddedf]',
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = { onNavigate?: (page: string) => void };

export default function StaffDirectory(_props: Props) {
  /* Staff list — populated by backend in production */
  const [staffList, setStaffList] = useState<StaffMember[]>(DEMO_STAFF);
  const [search, setSearch] = useState('');

  /* Onboard form */
  const [fullName, setFullName]     = useState('');
  const [workEmail, setWorkEmail]   = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [role, setRole]             = useState<AccessRole>('INSTITUTION-REVIEWER');
  const [registering, setRegistering] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !workEmail.trim() || !password) {
      setFormMsg({ type: 'error', text: 'All fields are required.' });
      return;
    }
    if (password.length < 6) {
      setFormMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setRegistering(true);
    setFormMsg(null);

    /* backend integration point — POST /api/staff/register { fullName, workEmail, password, role } */
    await new Promise(r => setTimeout(r, 700));

    const newMember: StaffMember = {
      id: `s${Date.now()}`,
      fullName: fullName.trim(),
      email: workEmail.trim(),
      role,
      assignedDate: new Date().toLocaleString('en-US'),
    };
    setStaffList(prev => [newMember, ...prev]);
    setFullName('');
    setWorkEmail('');
    setPassword('');
    setRole('INSTITUTION-REVIEWER');
    setRegistering(false);
    setFormMsg({ type: 'success', text: `${newMember.fullName} registered successfully.` });
  };

  const filtered = staffList.filter(s => {
    const q = search.toLowerCase();
    return q === '' || s.fullName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-4 min-h-full">

      {/* Two-column body */}
      <div className="flex gap-4 items-start flex-wrap lg:flex-nowrap flex-1">

        {/* Left — Onboard Staff Member */}
        <div className="w-full lg:w-[320px] flex-shrink-0 bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-6">
          <h3 className="text-[18px] font-bold font-['Urbanist',sans-serif] text-[#38393d] mb-5">
            Onboard Staff Member
          </h3>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Adegoke Benson"
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">Work Email Address</label>
              <input
                type="email"
                value={workEmail}
                onChange={e => setWorkEmail(e.target.value)}
                placeholder="e.g. benson@school.edu.ng"
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">
                Initial Password <span className="text-[#62646a] font-normal">(Min 6 chars)</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#62646a] hover:text-[#0f172b] transition-colors"
                >
                  {showPass ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">Security Access Level</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as AccessRole)}
                  className={`${inputCls} appearance-none pr-8 cursor-pointer`}
                >
                  {ACCESS_ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#62646a] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {formMsg && (
              <p className={`text-[13px] font-medium font-['Inter',sans-serif] ${formMsg.type === 'success' ? 'text-[#119b74]' : 'text-[#ff5533]'}`}>
                {formMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={registering}
              className="w-full bg-[#ff5533] hover:bg-[#e64d2e] disabled:opacity-60 transition-colors text-white font-bold font-['Inter',sans-serif] text-[15px] py-3 rounded-xl shadow-[0px_4px_8px_rgba(211,1,28,0.2)] mt-1"
            >
              {registering ? 'Registering…' : 'Register Staff User'}
            </button>
          </form>
        </div>

        {/* Right — Staff Directory */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">

          {/* Header */}
          <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-5">
            <h2 className="text-[20px] font-bold font-['Urbanist',sans-serif] text-[#38393d] leading-tight">
              Institutional Staff Directory
            </h2>
            <p className="text-[13px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-1">
              View and manage administrative staff members authorized to process student service submissions.
            </p>
          </div>

          {/* Search */}
          <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-4 py-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#62646a]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search staff directory by name or email..."
                className="w-full bg-[#fafcff] border border-[#dddedf] rounded-xl pl-9 pr-4 py-2.5 text-[14px] font-['Inter',sans-serif] text-[#4d4f54] placeholder-[#62646a]/50 focus:outline-none focus:border-[#ff5533]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] overflow-hidden flex-1">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#eeeef7]">
                    {['Staff Details', 'Access Role', 'Assigned Date'].map(col => (
                      <th key={col} className="text-left px-6 py-4 text-[11px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em] whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeef7]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-[14px] font-['Inter',sans-serif] text-[#62646a]">
                        No staff members found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(member => (
                      <tr key={member.id} className="hover:bg-[#eeeef7]/40 transition-colors">

                        <td className="px-6 py-4">
                          <p className="text-[15px] font-bold font-['Urbanist',sans-serif] text-[#0f172b]">
                            {member.fullName}
                          </p>
                          <p className="text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-0.5">
                            {member.email}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`text-[11px] font-bold font-['Urbanist',sans-serif] px-3 py-1.5 rounded-lg tracking-wide ${roleBadge[member.role]}`}>
                            {member.role}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-[13px] font-normal font-['Inter',sans-serif] text-[#62646a] whitespace-nowrap">
                          {member.assignedDate}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] py-2">
        © 2026 CVP Portal. All rights reserved.
      </p>
    </div>
  );
}

const inputCls =
  'w-full bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-3 text-[14px] font-["Inter",sans-serif] text-[#0f172b] placeholder-[#62646a]/50 focus:outline-none focus:border-[#ff5533]';
