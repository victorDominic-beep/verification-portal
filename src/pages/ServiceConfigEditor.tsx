import { useState } from 'react';
import type { ServiceConfigData, FormField, FieldType } from '../types/service';

const FIELD_TYPES: FieldType[] = ['Short Text', 'Long Text', 'Date picker', 'File upload', 'Number', 'Dropdown'];

function toJsonKey(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

function newField(): FormField {
  return { id: `f${Date.now()}`, label: '', jsonKey: '', type: 'Short Text', required: true };
}

type Props = {
  service: ServiceConfigData;
  onBack: () => void;
};

export default function ServiceConfigEditor({ service, onBack }: Props) {
  const [feeAmount, setFeeAmount]         = useState(String(service.feeAmount));
  const [currency, setCurrency]           = useState(service.currency);
  const [sla, setSla]                     = useState(String(service.estimatedWorkingDays));
  const [requiresPayment, setRequiresPayment] = useState(service.requiresUpfrontPayment);
  const [isActive, setIsActive]           = useState(service.isActive);
  const [fields, setFields]               = useState<FormField[]>(service.formFields);
  const [saving, setSaving]               = useState(false);
  const [saveMsg, setSaveMsg]             = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  /* Field helpers */
  const updateField = (id: string, patch: Partial<FormField>) =>
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f));

  const updateFieldLabel = (id: string, label: string) =>
    setFields(prev => prev.map(f =>
      f.id === id ? { ...f, label, jsonKey: toJsonKey(label) } : f
    ));

  const removeField = (id: string) =>
    setFields(prev => prev.filter(f => f.id !== id));

  const addField = () => setFields(prev => [...prev, newField()]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    /* backend integration point — PUT /api/services/:service.id/config {
         feeAmount, currency, estimatedWorkingDays, requiresUpfrontPayment, isActive, formFields
       }
    */
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    setSaveMsg({ type: 'success', text: 'Configuration applied successfully.' });
  };

  return (
    <div className="flex flex-col gap-4 min-h-full">

      {/* Header */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold font-['Urbanist',sans-serif] text-[#38393d] leading-tight">
            Configure: {service.name || 'Service'}
          </h2>
          <p className="text-[13px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-1">
            Adopt and customize this student service. Configure fee metrics, SLA processing days, and form fields.
          </p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] font-medium font-['Inter',sans-serif] text-[#62646a] hover:text-[#0f172b] transition-colors whitespace-nowrap mt-0.5 flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
          Back to List
        </button>
      </div>

      {/* Two-column body */}
      <form onSubmit={handleApply}>
        <div className="flex gap-4 items-start flex-wrap lg:flex-nowrap">

          {/* Left — Service Settings */}
          <div className="w-full lg:w-[320px] flex-shrink-0 bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-6">
            <h3 className="text-[16px] font-bold font-['Urbanist',sans-serif] text-[#38393d] mb-5">
              Service Settings
            </h3>

            <div className="flex flex-col gap-4">
              <Field label="Fee Amount">
                <input
                  type="number"
                  min={0}
                  value={feeAmount}
                  onChange={e => setFeeAmount(e.target.value)}
                  className={inputCls}
                />
              </Field>

              <Field label="Currency (3-Letter Code)">
                <input
                  type="text"
                  maxLength={3}
                  value={currency}
                  onChange={e => setCurrency(e.target.value.toUpperCase())}
                  className={inputCls}
                  placeholder="NGN"
                />
              </Field>

              <Field label="Estimated Working Days (SLA)">
                <input
                  type="number"
                  min={1}
                  value={sla}
                  onChange={e => setSla(e.target.value)}
                  className={inputCls}
                />
              </Field>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={requiresPayment}
                  onChange={e => setRequiresPayment(e.target.checked)}
                  className="w-4 h-4 accent-[#ff5533] rounded cursor-pointer"
                />
                <span className="text-[14px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">
                  Requires Upfront Payment
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#ff5533] rounded cursor-pointer"
                />
                <span className="text-[14px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">
                  Offer this service (Active)
                </span>
              </label>
            </div>
          </div>

          {/* Right — Dynamic Form Fields Builder */}
          <div className="flex-1 min-w-0 bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-6">
            <h3 className="text-[16px] font-bold font-['Urbanist',sans-serif] text-[#38393d] mb-1">
              Dynamic Form Fields Builder
            </h3>
            <p className="text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] mb-5">
              Configure additional specific details students must supply when requesting this service (e.g. matriculation number, graduation session).
            </p>

            <div className="flex flex-col gap-3">

              {/* Column headers */}
              {fields.length > 0 && (
                <div className="grid grid-cols-[1fr_180px_160px_auto] gap-3 items-center px-1">
                  {['Field Label (Visible to Student)', 'JSON DB Key', 'Type', ''].map(h => (
                    <p key={h} className="text-[10px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em]">
                      {h}
                    </p>
                  ))}
                </div>
              )}

              {/* Field rows */}
              {fields.map(field => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_180px_160px_auto] gap-3 items-center border border-[#eeeef7] rounded-xl px-4 py-3"
                >
                  {/* Label */}
                  <input
                    type="text"
                    value={field.label}
                    onChange={e => updateFieldLabel(field.id, e.target.value)}
                    placeholder="e.g. Matric Number"
                    className={`${inputCls} text-[13px]`}
                  />

                  {/* JSON key (auto-generated, editable) */}
                  <input
                    type="text"
                    value={field.jsonKey}
                    onChange={e => updateField(field.id, { jsonKey: e.target.value })}
                    placeholder="auto_key"
                    className={`${inputCls} text-[13px] text-[#62646a] bg-[#f5f5f8]`}
                  />

                  {/* Type + Required */}
                  <div className="flex items-center gap-2">
                    <select
                      value={field.type}
                      onChange={e => updateField(field.id, { type: e.target.value as FieldType })}
                      className={`${inputCls} text-[13px] appearance-none cursor-pointer flex-1`}
                    >
                      {FIELD_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <label className="flex items-center gap-1 whitespace-nowrap cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={e => updateField(field.id, { required: e.target.checked })}
                        className="w-3.5 h-3.5 accent-[#ff5533] cursor-pointer"
                      />
                      <span className="text-[11px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">Req.</span>
                    </label>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#62646a] hover:text-[#ff5533] hover:bg-[rgba(255,85,51,0.08)] transition-colors"
                    title="Remove field"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Add Field */}
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-2 border border-dashed border-[#dddedf] hover:border-[#ff5533] hover:text-[#ff5533] rounded-xl px-5 py-3 text-[13px] font-medium font-['Inter',sans-serif] text-[#62646a] transition-colors w-fit mt-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Field Parameter
              </button>
            </div>

            {saveMsg && (
              <p className={`mt-4 text-[13px] font-medium font-['Inter',sans-serif] ${saveMsg.type === 'success' ? 'text-[#119b74]' : 'text-[#ff5533]'}`}>
                {saveMsg.text}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#eeeef7]">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 text-[14px] font-semibold font-['Inter',sans-serif] text-[#4d4f54] hover:text-[#0f172b] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#ff5533] hover:bg-[#e64d2e] disabled:opacity-60 transition-colors text-white font-bold font-['Inter',sans-serif] text-[15px] px-8 py-3 rounded-xl shadow-[0px_4px_8px_rgba(211,1,28,0.2)]"
              >
                {saving ? 'Applying…' : 'Apply Configuration'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <p className="text-center text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] py-2">
        © 2026 CVP Portal. All rights reserved.
      </p>
    </div>
  );
}

const inputCls =
  'w-full bg-[#fafcff] border border-[#dddedf] rounded-xl px-3 py-2.5 text-[14px] font-["Inter",sans-serif] text-[#0f172b] placeholder-[#62646a]/50 focus:outline-none focus:border-[#ff5533]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium font-['Inter',sans-serif] text-[#4d4f54]">{label}</label>
      {children}
    </div>
  );
}
