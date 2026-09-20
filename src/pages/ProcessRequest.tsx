import { useState, useRef } from 'react';
import type { RequestRecord, RequestStatus } from '../types/request';

const ACTION_STATUS_OPTIONS = [
  'Pending Review',
  'In Progress',
  'Awaiting Documents',
  'Completed (Dispatched)',
  'Completed (Pickup Ready)',
  'Rejected',
];

const OUTCOME_OPTIONS = [
  '-- Select Outcome --',
  'Verified – Authentic',
  'Verified – With Discrepancies',
  'Not Verified – Fraudulent',
  'Incomplete Submission',
  'Duplicate Request',
];

const statusBadge: Record<RequestStatus, string> = {
  SUBMITTED:  'bg-[rgba(255,163,51,0.18)] text-[#b36a00]',
  IN_REVIEW:  'bg-[rgba(56,17,155,0.12)] text-[#38119b]',
  COMPLETED:  'bg-[rgba(56,17,155,0.12)] text-[#38119b]',
  REJECTED:   'bg-[rgba(255,85,51,0.12)] text-[#ff5533]',
};

const STATUS_LABELS: Record<RequestStatus, string> = {
  SUBMITTED: 'Submitted',
  IN_REVIEW: 'In Review',
  COMPLETED: 'Completed',
  REJECTED:  'Rejected',
};

type Props = {
  request: RequestRecord;
  onBack: () => void;
};

export default function ProcessRequest({ request, onBack }: Props) {
  const [actionStatus, setActionStatus] = useState(
    request.status === 'COMPLETED' ? 'Completed (Dispatched)' : 'Pending Review'
  );
  const [outcome, setOutcome] = useState('-- Select Outcome --');
  const [internalNotes, setInternalNotes] = useState('');
  const [responseNote, setResponseNote] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setAttachedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    /* backend integration point — POST /api/requests/:id/process */
  };

  return (
    <div className="flex flex-col gap-4 min-h-full">

      {/* Header */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <button
            onClick={onBack}
            className="mt-1 w-7 h-7 flex items-center justify-center rounded-lg border border-[#dddedf] hover:border-[#0f172b] transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4 text-[#0f172b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-[20px] font-bold font-['Urbanist',sans-serif] text-[#38393d]">
                Process Request: {request.trackingCode}
              </h2>
              <span className="text-[12px] font-bold font-['Urbanist',sans-serif] px-3 py-1 rounded-lg bg-[rgba(255,85,51,0.12)] text-[#ff5533]">
                {request.serviceType}
              </span>
            </div>
            <p className="text-[13px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-0.5">
              Review student-provided details, process request, and post timeline updates.
            </p>
          </div>
        </div>

        <span className={`text-[12px] font-bold font-['Urbanist',sans-serif] px-3 py-1.5 rounded-lg flex-shrink-0 mt-1 ${statusBadge[request.status]}`}>
          {STATUS_LABELS[request.status]}
        </span>
      </div>

      {/* Two-column body */}
      <div className="flex gap-4 items-start flex-wrap lg:flex-nowrap">

        {/* Left column */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">

          {/* Requester & Service Profile */}
          <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-6">
            <h3 className="text-[16px] font-bold font-['Urbanist',sans-serif] text-[#38393d] mb-5">
              Requester &amp; Service Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <ProfileField label="Requester Name" value={request.requesterName} />
              <ProfileField
                label="Service Name"
                value={request.serviceType}
                valueClass="text-[#ff5533] font-semibold"
              />
              <ProfileField label="Requester Email Address" value={request.requesterEmail} />
              <ProfileField label="Requester Phone Number" value={request.requesterPhone} />
              <ProfileField label="Application Type" value={request.applicationType} />
            </div>
          </div>

          {/* Submitted Form Parameters */}
          <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-6">
            <h3 className="text-[16px] font-bold font-['Urbanist',sans-serif] text-[#38393d] mb-5">
              Submitted Form Parameters
            </h3>
            <div className="flex flex-col gap-3">
              {request.formParams.map((param, i) => (
                <div key={i} className="border border-[#eeeef7] rounded-xl px-4 py-3">
                  <p className="text-[11px] font-medium font-['Urbanist',sans-serif] text-[#62646a] mb-1">
                    {param.label}
                  </p>
                  {param.type === 'image' ? (
                    <img
                      src={param.value}
                      alt={param.label}
                      className="mt-2 max-h-[200px] w-auto rounded-lg object-cover"
                    />
                  ) : (
                    <p className="text-[15px] font-medium font-['Inter',sans-serif] text-[#0f172b]">
                      {param.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 w-full lg:w-[340px] flex-shrink-0">

          {/* Workflow Actions */}
          <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-6">
            <h3 className="text-[16px] font-bold font-['Urbanist',sans-serif] text-[#38393d] mb-5">
              Workflow Actions
            </h3>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4">

              {/* Action Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold font-['Urbanist',sans-serif] text-[#4d4f54]">
                  Action Status
                </label>
                <select
                  value={actionStatus}
                  onChange={e => setActionStatus(e.target.value)}
                  className="w-full appearance-none bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-2.5 text-[14px] font-['Inter',sans-serif] text-[#4d4f54] focus:outline-none focus:border-[#ff5533] cursor-pointer"
                >
                  {ACTION_STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              {/* Outcome */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold font-['Urbanist',sans-serif] text-[#4d4f54]">
                  Verification Conclusion / Outcome <span className="text-[#62646a] font-normal">(Optional)</span>
                </label>
                <select
                  value={outcome}
                  onChange={e => setOutcome(e.target.value)}
                  className="w-full appearance-none bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-2.5 text-[14px] font-['Inter',sans-serif] text-[#4d4f54] focus:outline-none focus:border-[#ff5533] cursor-pointer"
                >
                  {OUTCOME_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              {/* Internal Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold font-['Urbanist',sans-serif] text-[#4d4f54]">
                  Internal Notes <span className="text-[#62646a] font-normal">(Staff Only)</span>
                </label>
                <textarea
                  value={internalNotes}
                  onChange={e => setInternalNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Document generated, awaiting registrar signature..."
                  className="w-full bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-3 text-[14px] font-['Inter',sans-serif] text-[#4d4f54] placeholder-[#62646a]/50 focus:outline-none focus:border-[#ff5533] resize-none"
                />
              </div>

              {/* Response Note */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold font-['Urbanist',sans-serif] text-[#4d4f54]">
                  Response Note <span className="text-[#62646a] font-normal">(Tracking portal)</span>
                </label>
                <textarea
                  value={responseNote}
                  onChange={e => setResponseNote(e.target.value)}
                  rows={3}
                  placeholder="e.g. Your transcript has been approved and compiled..."
                  className="w-full bg-[#fafcff] border border-[#dddedf] rounded-xl px-4 py-3 text-[14px] font-['Inter',sans-serif] text-[#4d4f54] placeholder-[#62646a]/50 focus:outline-none focus:border-[#ff5533] resize-none"
                />
              </div>

              {/* File Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold font-['Urbanist',sans-serif] text-[#4d4f54]">
                  Attach Response Document <span className="text-[#62646a] font-normal">(PDF/Image)</span>
                </label>
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl px-4 py-6 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                    isDragging ? 'border-[#ff5533] bg-[rgba(255,85,51,0.04)]' : 'border-[#dddedf] hover:border-[#ff5533]'
                  }`}
                >
                  <svg className="w-6 h-6 text-[#62646a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4-4 4M12 8v8" />
                  </svg>
                  {attachedFile ? (
                    <p className="text-[13px] font-medium font-['Inter',sans-serif] text-[#0f172b] text-center">
                      {attachedFile.name}
                    </p>
                  ) : (
                    <>
                      <p className="text-[13px] font-medium font-['Inter',sans-serif] text-center">
                        <span className="text-[#ff5533]">Click to upload</span>
                        <span className="text-[#62646a]"> or drag and drop</span>
                      </p>
                      <p className="text-[11px] font-['Inter',sans-serif] text-[#62646a]">
                        PDF, PNG, JPG or JPEG (Max 10MB)
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Currently attached */}
                {request.attachedDocumentName && !attachedFile && (
                  <div className="flex items-center gap-2 mt-1">
                    <svg className="w-3.5 h-3.5 text-[#62646a] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-[12px] font-['Inter',sans-serif] text-[#62646a] truncate">
                      {request.attachedDocumentName}
                    </span>
                    <button type="button" className="text-[12px] font-medium font-['Inter',sans-serif] text-[#ff5533] hover:underline whitespace-nowrap flex items-center gap-0.5">
                      View/Download
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#ff5533] hover:bg-[#e64d2e] transition-colors text-white rounded-xl py-3 text-[15px] font-bold font-['Inter',sans-serif] shadow-[0px_4px_8px_rgba(211,1,28,0.2)] mt-1"
              >
                Update Request
              </button>
            </form>
          </div>

          {/* Audit Timeline */}
          <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-6">
            <h3 className="text-[16px] font-bold font-['Urbanist',sans-serif] text-[#38393d] mb-4">
              Audit Timeline
            </h3>
            <div className="flex flex-col gap-0">
              {request.auditTimeline.map((event, i) => (
                <div key={event.id} className="flex gap-3">
                  {/* Timeline spine */}
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#0f172b] flex-shrink-0 mt-0.5" />
                    {i < request.auditTimeline.length - 1 && (
                      <div className="w-px flex-1 bg-[#eeeef7] my-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-[13px] font-semibold font-['Inter',sans-serif] text-[#0f172b] leading-snug">
                      {event.description}
                    </p>
                    <p className="text-[11px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-0.5">
                      {event.timestamp}
                    </p>
                  </div>
                </div>
              ))}
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

function ProfileField({ label, value, valueClass = '' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em] mb-1">
        {label}
      </p>
      <p className={`text-[15px] font-medium font-['Inter',sans-serif] text-[#0f172b] ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}
