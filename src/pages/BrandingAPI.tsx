import { useRef, useState } from 'react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
export type BrandingConfig = {
  institutionName: string;
  supportEmail: string;
  helplinePhone: string;
  brandHexColor: string;
  logoUrl: string;
  corsOrigins: string;
  widgetEnabled: boolean;
  apiKey: string;
};

/* ─── Demo seed (replace with GET /api/settings/branding response) ───────── */
const DEMO_CONFIG: BrandingConfig = {
  institutionName: 'Techbroker University',
  supportEmail: 'Techbrokersltd@outlook.com',
  helplinePhone: '+2348165049996',
  brandHexColor: '#fe2f11',
  logoUrl: 'https://app.centralverification.com/logo.png',
  corsOrigins: '',
  widgetEnabled: true,
  apiKey: 'CVP_KEY_adb73d3811ca739d6411798ddf2e6a8fb09751fa01d3fa7099a0132cc4d93b9b',
};

function buildSnippet(apiKey: string) {
  return `<iframe\n  src="https://embed.centralverification.com/?clientId=${apiKey}"\n  width="100%"\n  height="800"\n  frameborder="0"></iframe>`;
}

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {
  onNavigate?: (page: string) => void;
  initialConfig?: BrandingConfig;
};

export default function BrandingAPI({ initialConfig = DEMO_CONFIG }: Props) {
  const [form, setForm] = useState<BrandingConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof BrandingConfig>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    /* backend integration point — PATCH /api/settings/branding */
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    setSaveMsg({ type: 'success', text: 'Configuration saved successfully.' });
  };

  const copyToClipboard = async (text: string, which: 'key' | 'code') => {
    try {
      await navigator.clipboard.writeText(text);
      if (which === 'key') { setKeyCopied(true); setTimeout(() => setKeyCopied(false), 2000); }
      else { setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000); }
    } catch { /* clipboard unavailable */ }
  };

  const snippet = buildSnippet(form.apiKey);

  return (
    <div className="flex flex-col gap-4 min-h-full">

      {/* Section Header */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-5">
        <h2 className="text-[22px] font-bold font-['Urbanist',sans-serif] text-[#38393d] leading-tight">
          Branding &amp; API Configuration
        </h2>
        <p className="text-[14px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-1">
          Configure your institution's theme color, active logo, secure widget origin constraints, and access token.
        </p>
      </div>

      {/* Two-column body */}
      <div className="flex flex-col gap-4 items-start lg:flex-row lg:flex-nowrap">

        {/* Left — Profile Settings */}
        <div className="w-full flex-1 min-w-0 bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-4 py-5 sm:px-6 sm:py-6">
          <h3 className="text-[18px] font-bold font-['Urbanist',sans-serif] text-[#38393d] mb-5">
            Profile Settings
          </h3>

          <form onSubmit={handleSave} className="flex flex-col gap-4">

            {/* Institution Name */}
            <Field label="Institution Name">
              <input
                type="text"
                value={form.institutionName}
                onChange={set('institutionName')}
                className={inputCls}
              />
            </Field>

            {/* Support Email + Helpline Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Support Email">
                <input type="email" value={form.supportEmail} onChange={set('supportEmail')} className={inputCls} />
              </Field>
              <Field label="Helpline Phone">
                <input type="tel" value={form.helplinePhone} onChange={set('helplinePhone')} className={inputCls} />
              </Field>
            </div>

            {/* Primary Branding Hex Color */}
            <Field label="Primary Branding Hex Color">
              <div className="flex items-center gap-3 w-full bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-2.5 focus-within:border-[#ff5533]">
                {/* Clickable swatch opens native color picker */}
                <button
                  type="button"
                  onClick={() => colorInputRef.current?.click()}
                  className="w-8 h-8 rounded-md flex-shrink-0 border border-[#dddedf] cursor-pointer"
                  style={{ backgroundColor: form.brandHexColor }}
                />
                <input
                  ref={colorInputRef}
                  type="color"
                  value={form.brandHexColor}
                  onChange={e => setForm(prev => ({ ...prev, brandHexColor: e.target.value }))}
                  className="sr-only"
                />
                <input
                  type="text"
                  value={form.brandHexColor}
                  onChange={e => setForm(prev => ({ ...prev, brandHexColor: e.target.value }))}
                  className="flex-1 bg-transparent text-[14px] font-['Inter',sans-serif] text-[#0f172b] focus:outline-none"
                  placeholder="#000000"
                />
              </div>
            </Field>

            {/* Logo URL */}
            <Field label="Logo URL">
              <input type="url" value={form.logoUrl} onChange={set('logoUrl')} className={inputCls} placeholder="https://..." />
            </Field>

            {/* CORS Origins */}
            <Field label="Allowed CORS Origins (CORS Domains)">
              <input
                type="text"
                value={form.corsOrigins}
                onChange={set('corsOrigins')}
                className={inputCls}
                placeholder="e.g. school.edu.ng, registry.school.edu.ng"
              />
              <p className="text-[11px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-1">
                Restricts widget activation exclusively to these domains.
              </p>
            </Field>

            {/* Widget Enabled */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.widgetEnabled}
                onChange={set('widgetEnabled')}
                className="w-4 h-4 accent-[#ff5533] rounded cursor-pointer"
              />
              <span className="text-[14px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">
                Widget Enabled
              </span>
            </label>

            {saveMsg && (
              <p className={`text-[13px] font-medium font-['Inter',sans-serif] ${saveMsg.type === 'success' ? 'text-[#119b74]' : 'text-[#ff5533]'}`}>
                {saveMsg.text}
              </p>
            )}

            {/* Save */}
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#ff5533] hover:bg-[#e64d2e] disabled:opacity-60 transition-colors text-white font-bold font-['Inter',sans-serif] text-[15px] px-8 py-3 rounded-xl shadow-[0px_4px_8px_rgba(211,1,28,0.2)] sm:w-auto"
              >
                {saving ? 'Saving…' : 'Save Configurations'}
              </button>
            </div>
          </form>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 w-full lg:w-[340px] lg:flex-shrink-0">

          {/* Widget API Key */}
          <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-6">
            <h3 className="text-[16px] font-bold font-['Urbanist',sans-serif] text-[#38393d] mb-1">
              Widget API Key
            </h3>
            <p className="text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] mb-4">
              Use this secret key to authenticate requests coming from your embedded client script.
            </p>

            <div className="relative bg-[#0f172b] rounded-xl px-4 py-3 overflow-hidden">
              <p className="text-[12px] font-mono text-[#fafcff]/80 break-all leading-relaxed pr-6">
                {form.apiKey}
              </p>
              <button
                type="button"
                onClick={() => copyToClipboard(form.apiKey, 'key')}
                title="Copy API key"
                className="absolute top-2.5 right-2.5 text-[#fafcff]/50 hover:text-[#ff5533] transition-colors"
              >
                {keyCopied ? (
                  <svg className="w-4 h-4 text-[#119b74]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="9" y="9" width="13" height="13" rx="2" /><path strokeLinecap="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Widget Snippet */}
          <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-6">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-[16px] font-bold font-['Urbanist',sans-serif] text-[#38393d]">
                Widget Snippet
              </h3>
              <button
                type="button"
                onClick={() => copyToClipboard(snippet, 'code')}
                className="text-[13px] font-semibold font-['Inter',sans-serif] text-[#ff5533] hover:opacity-75 transition-opacity whitespace-nowrap flex-shrink-0"
              >
                {codeCopied ? '✓ Copied' : 'Copy Code'}
              </button>
            </div>
            <p className="text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] mb-4">
              Embed the student services interface directly on the school portal by copying this iframe snippet.
            </p>

            <div className="bg-[#0f172b] rounded-xl p-4 overflow-x-auto">
              <pre className="text-[12px] font-mono text-[#fafcff]/80 whitespace-pre leading-relaxed">
                {snippet}
              </pre>
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

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const inputCls =
  'w-full bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-3 text-[14px] font-["Inter",sans-serif] text-[#0f172b] placeholder-[#62646a]/50 focus:outline-none focus:border-[#ff5533]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">
        {label}
      </label>
      {children}
    </div>
  );
}
