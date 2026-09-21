import { useState } from 'react';

/* ─── Types (swapped for API response shape when backend is ready) ─────── */
export type UserProfile = {
  staffName: string;
  email: string;
};

/* ─── Demo seed data ─────────────────────────────────────────────────────── */
const DEMO_PROFILE: UserProfile = {
  staffName: 'Techbroker University Admin',
  email: 'Techbrokersltd@outlook.com',
};

/* ─── Eye toggle icon ────────────────────────────────────────────────────── */
function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
    </svg>
  );
}

/* ─── Reusable password field ─────────────────────────────────────────────── */
function PasswordField({
  label, value, onChange, placeholder = '••••••••',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-3 pr-10 text-[14px] font-['Inter',sans-serif] text-[#0f172b] placeholder-[#62646a]/40 focus:outline-none focus:border-[#ff5533]"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#62646a] hover:text-[#0f172b] transition-colors"
        >
          <EyeIcon visible={show} />
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */
type Props = {
  onNavigate?: (page: string) => void;
  initialProfile?: UserProfile; // passed from backend response
};

export default function ProfileSecurity({ initialProfile = DEMO_PROFILE }: Props) {
  /* Profile form */
  const [staffName, setStaffName] = useState(initialProfile.staffName);
  const [email, setEmail]         = useState(initialProfile.email);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  /* Password form */
  const [currentPassword, setCurrentPassword]   = useState('');
  const [newPassword, setNewPassword]           = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !email.trim()) {
      setProfileMsg({ type: 'error', text: 'Name and email are required.' });
      return;
    }
    setProfileSaving(true);
    setProfileMsg(null);
    /* backend integration point — PATCH /api/profile { staffName, email } */
    await new Promise(r => setTimeout(r, 600));
    setProfileSaving(false);
    setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'All password fields are required.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setPasswordSaving(true);
    setPasswordMsg(null);
    /* backend integration point — POST /api/profile/change-password { currentPassword, newPassword } */
    await new Promise(r => setTimeout(r, 600));
    setPasswordSaving(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
  };

  return (
    <div className="flex flex-col gap-4 min-h-full">

      {/* Section Header */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-5">
        <h2 className="text-[22px] font-bold font-['Urbanist',sans-serif] text-[#38393d] leading-tight">
          Profile &amp; Security
        </h2>
        <p className="text-[14px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-1">
          Manage your staff member details and update security credentials.
        </p>
      </div>

      {/* Two-column forms */}
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-nowrap items-start">

        {/* Left — Edit Staff Profile */}
        <div className="w-full flex-1 min-w-0 bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-4 py-5 sm:px-6 sm:py-6">
          <h3 className="text-[18px] font-bold font-['Urbanist',sans-serif] text-[#38393d] mb-5">
            Edit Staff Profile
          </h3>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">
                Staff Name
              </label>
              <input
                type="text"
                value={staffName}
                onChange={e => setStaffName(e.target.value)}
                className="w-full bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-3 text-[14px] font-['Inter',sans-serif] text-[#0f172b] focus:outline-none focus:border-[#ff5533]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-3 text-[14px] font-['Inter',sans-serif] text-[#0f172b] focus:outline-none focus:border-[#ff5533]"
              />
            </div>

            {profileMsg && (
              <p className={`text-[13px] font-medium font-['Inter',sans-serif] ${
                profileMsg.type === 'success' ? 'text-[#119b74]' : 'text-[#ff5533]'
              }`}>
                {profileMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={profileSaving}
              className="w-full bg-[#ff5533] hover:bg-[#e64d2e] disabled:opacity-60 transition-colors text-white font-bold font-['Inter',sans-serif] text-[15px] py-3 rounded-xl shadow-[0px_4px_8px_rgba(211,1,28,0.2)] mt-1"
            >
              {profileSaving ? 'Saving…' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right — Change Account Password */}
        <div className="flex-1 min-w-0 bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-6">
          <h3 className="text-[18px] font-bold font-['Urbanist',sans-serif] text-[#38393d] mb-5">
            Change Account Password
          </h3>

          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <PasswordField
              label="New Password (Min 6 chars)"
              value={newPassword}
              onChange={setNewPassword}
            />
            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            {passwordMsg && (
              <p className={`text-[13px] font-medium font-['Inter',sans-serif] ${
                passwordMsg.type === 'success' ? 'text-[#119b74]' : 'text-[#ff5533]'
              }`}>
                {passwordMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={passwordSaving}
              className="w-full bg-[#0f172b] hover:bg-[#1e293b] disabled:opacity-60 transition-colors text-white font-bold font-['Inter',sans-serif] text-[15px] py-3 rounded-xl mt-1"
            >
              {passwordSaving ? 'Changing…' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>

      <p className="text-center text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-auto py-4">
        © 2026 CVP Portal. All rights reserved.
      </p>
    </div>
  );
}
