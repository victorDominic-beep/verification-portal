import { useState } from 'react';

const arrowRightIcon = '/assets/779fb.svg';
const arrowRightLinear = '/assets/0cf60.svg';

type VerifyCandidateProps = {
  onNavigate?: (page: string) => void;
};

const examBodies = ['WAEC', 'NECO', 'NABTEB', 'NBAIS'];
const examTypes = ['School Candidate (Internal)', 'Private Candidate (External)', 'GCE'];
const examYears = Array.from({ length: 10 }, (_, i) => String(2024 - i));

export default function VerifyCandidate({ onNavigate }: VerifyCandidateProps) {
  const [form, setForm] = useState({
    examinationBody: 'WAEC',
    examType: 'School Candidate (Internal)',
    examYear: '2023',
    examinationNumber: '',
    candidateFullName: '',
  });

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    /* backend integration point */
  };

  return (
    <div className="flex flex-col gap-4 min-h-full">

      {/* ── Section Header ───────────────────────── */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-5 flex items-start justify-between gap-6">
        <div>
          <h2 className="text-[22px] font-bold font-['Urbanist',sans-serif] text-[#38393d] leading-tight">
            O-Level Result Verification
          </h2>
          <p className="text-[14px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-1 leading-relaxed">
            Instant verification for WAEC and NECO candidate examination results with live grade breakdown.
          </p>
        </div>

        <button
          onClick={() => onNavigate?.('verification-logs')}
          className="flex items-center gap-2 border border-[#dddedf] rounded-xl px-5 py-2.5 text-[14px] font-medium font-['Inter',sans-serif] text-[#38393d] hover:border-[#ff5533] hover:text-[#ff5533] transition-colors shrink-0 mt-0.5"
        >
          View Logs
          <img src={arrowRightLinear} alt="" className="w-4 h-4" />
        </button>
      </div>

      {/* ── Candidate Examination Details Form ───── */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-6">
        <h3 className="text-[18px] font-bold font-['Urbanist',sans-serif] text-[#38393d] mb-5">
          Candidate Examination Details
        </h3>

        <form onSubmit={handleVerify}>
          {/* 5-column field row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            {/* Examination Body */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em]">
                Examination Body
              </label>
              <div className="relative">
                <select
                  value={form.examinationBody}
                  onChange={set('examinationBody')}
                  className="w-full appearance-none bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-3 text-[15px] font-medium font-['Urbanist',sans-serif] text-[#4d4f54] focus:outline-none focus:border-[#ff5533] pr-8 cursor-pointer"
                >
                  {examBodies.map(b => <option key={b}>{b}</option>)}
                </select>
                <img src={arrowRightIcon} alt="" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* Exam Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em]">
                Exam Type
              </label>
              <div className="relative">
                <select
                  value={form.examType}
                  onChange={set('examType')}
                  className="w-full appearance-none bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-3 text-[15px] font-medium font-['Urbanist',sans-serif] text-[#4d4f54] focus:outline-none focus:border-[#ff5533] pr-8 cursor-pointer"
                >
                  {examTypes.map(t => <option key={t}>{t}</option>)}
                </select>
                <img src={arrowRightIcon} alt="" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* Exam Year */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em]">
                Exam Year
              </label>
              <div className="relative">
                <select
                  value={form.examYear}
                  onChange={set('examYear')}
                  className="w-full appearance-none bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-3 text-[15px] font-medium font-['Urbanist',sans-serif] text-[#4d4f54] focus:outline-none focus:border-[#ff5533] pr-8 cursor-pointer"
                >
                  {examYears.map(y => <option key={y}>{y}</option>)}
                </select>
                <img src={arrowRightIcon} alt="" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* Examination Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em]">
                Examination Number
              </label>
              <input
                type="text"
                value={form.examinationNumber}
                onChange={set('examinationNumber')}
                placeholder="e.g. 4250101001"
                className="w-full bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-3 text-[15px] font-medium font-['Urbanist',sans-serif] text-[#4d4f54] placeholder-[#62646a]/50 focus:outline-none focus:border-[#ff5533]"
              />
            </div>

            {/* Candidate Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em]">
                Candidate Full Name
              </label>
              <input
                type="text"
                value={form.candidateFullName}
                onChange={set('candidateFullName')}
                placeholder="e.g. Adebayo Blessing"
                className="w-full bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-3 text-[15px] font-medium font-['Urbanist',sans-serif] text-[#4d4f54] placeholder-[#62646a]/50 focus:outline-none focus:border-[#ff5533]"
              />
            </div>
          </div>

          {/* Bottom row: fee + submit */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-[14px] font-normal font-['Inter',sans-serif] text-[#62646a]">
              Verification Fee:{' '}
              <span className="font-bold text-[#0f172b]">₦6,000</span>
            </p>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#ff5533] hover:bg-[#e64d2e] transition-colors text-white rounded-xl px-6 py-3 text-[15px] font-bold font-['Inter',sans-serif] shadow-[0px_4px_8px_rgba(211,1,28,0.24)]"
            >
              Verify Candidate Result
              <img src={arrowRightLinear} alt="" className="w-4 h-4 brightness-0 invert" />
            </button>
          </div>
        </form>
      </div>

      {/* ── Footer ───────────────────────────────── */}
      <p className="text-center text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-auto py-4">
        © 2026 CVP Portal. All rights reserved.
      </p>
    </div>
  );
}
