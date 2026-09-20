import { useState } from 'react';
import type { ServiceConfigData } from '../types/service';

/* ─── Types ──────────────────────────────────────────────────────────────── */
export type ServiceStatus = 'Active' | 'Inactive';

export type OfferedService = {
  id: string;
  serviceId: string;
  price: number;
  currency: string;
  requiresPayment: boolean;
  turnaroundDays: number;
  fieldsCount: string;
  status: ServiceStatus;
};

export type ServiceTemplate = {
  id: string;
  name: string;
  description: string;
  offered: boolean;
};

/* ─── Demo data (replace with GET /api/services + GET /api/service-templates) */
const DEMO_SERVICES: OfferedService[] = [
  { id: 'o1', serviceId: '446f841b-6e7b-480d-9656-570446ff21ba', price: 200,  currency: 'NGN', requiresPayment: true, turnaroundDays: 2, fieldsCount: 'Custom Form Enabled', status: 'Active' },
  { id: 'o2', serviceId: '37005133-e230-4561-8abf-1ad8d7abea53', price: 7500, currency: 'NGN', requiresPayment: true, turnaroundDays: 2, fieldsCount: 'Custom Form Enabled', status: 'Active' },
  { id: 'o3', serviceId: '08193c44-c364-4750-92f2-3f71524cbaa5', price: 200,  currency: 'NGN', requiresPayment: true, turnaroundDays: 7, fieldsCount: 'Custom Form Enabled', status: 'Active' },
  { id: 'o4', serviceId: 'd89ba7e0-9ac8-4720-bfbe-16af0e0c5a24', price: 100,  currency: 'NGN', requiresPayment: true, turnaroundDays: 7, fieldsCount: 'Custom Form Enabled', status: 'Active' },
];

const DEMO_TEMPLATES: ServiceTemplate[] = [
  { id: 't1', name: 'Certificate Verification',     description: 'Verify your certificate online',              offered: true  },
  { id: 't2', name: 'Student Transcript Request',   description: 'Request for Student Transcript Online',        offered: true  },
  { id: 't3', name: 'Letter of Completion',         description: 'Official letter confirming course completion', offered: false },
  { id: 't4', name: 'NYSC Exemption Letter',        description: 'Apply for NYSC exemption documentation',      offered: false },
  { id: 't5', name: 'Degree Certificate Request',   description: 'Request a copy of your degree certificate',   offered: false },
  { id: 't6', name: 'Academic Transcript (Postal)', description: 'Mail transcript to an external institution',  offered: false },
];

const TEMPLATES_PER_PAGE = 6;

/* ─── Default form fields per template name (used when opening editor) ───── */
const DEFAULT_FIELDS: Record<string, ServiceConfigData['formFields']> = {
  'Certificate Verification': [
    { id: 'df1', label: 'Matric Number',    jsonKey: 'matric_number',    type: 'Short Text',  required: true },
    { id: 'df2', label: 'Graduation Year',  jsonKey: 'graduation_year',  type: 'Date picker', required: true },
    { id: 'df3', label: 'Certificate Image', jsonKey: 'certificate_image', type: 'File upload', required: true },
  ],
  'Student Transcript Request': [
    { id: 'df4', label: 'Matric Number',          jsonKey: 'matric_number',          type: 'Short Text', required: true },
    { id: 'df5', label: 'Destination Institution', jsonKey: 'destination_institution', type: 'Short Text', required: true },
  ],
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {
  onNavigate?: (page: string) => void;
  onEditConfig?: (service: ServiceConfigData) => void;
};

export default function ConfigureServices({ onEditConfig }: Props) {
  const [services] = useState<OfferedService[]>(DEMO_SERVICES);
  const [templates] = useState<ServiceTemplate[]>(DEMO_TEMPLATES);
  const [templatePage, setTemplatePage] = useState(1);

  const totalTemplatePages = Math.ceil(templates.length / TEMPLATES_PER_PAGE);
  const visibleTemplates = templates.slice(
    (templatePage - 1) * TEMPLATES_PER_PAGE,
    templatePage * TEMPLATES_PER_PAGE,
  );

  const buildConfig = (name: string, price: number, currency: string, days: number): ServiceConfigData => ({
    id: name,
    name,
    feeAmount: price,
    currency,
    estimatedWorkingDays: days,
    requiresUpfrontPayment: true,
    isActive: true,
    formFields: DEFAULT_FIELDS[name] ?? [],
  });

  const handleEditService = (svc: OfferedService) => {
    /* backend integration point — GET /api/services/:svc.serviceId/config */
    onEditConfig?.(buildConfig(svc.serviceId, svc.price, svc.currency, svc.turnaroundDays));
  };

  const handleEditTemplate = (tpl: ServiceTemplate) => {
    /* backend integration point — GET /api/service-templates/:tpl.id/config */
    onEditConfig?.(buildConfig(tpl.name, 0, 'NGN', 2));
  };

  return (
    <div className="flex flex-col gap-4 min-h-full">

      {/* Section Header */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-5">
        <h2 className="text-[22px] font-bold font-['Urbanist',sans-serif] text-[#38393d] leading-tight">
          Active Student Services
        </h2>
        <p className="text-[14px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-1">
          Configure prices, processing days, payment rules, and custom submission forms for each service.
        </p>
      </div>

      {/* Currently Offered Services */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#eeeef7]">
          <h3 className="text-[16px] font-bold font-['Urbanist',sans-serif] text-[#38393d]">
            Currently Offered Services
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eeeef7]">
                {['Service Name', 'Price Info', 'Turnaround', 'Fields Count', 'Status', 'Actions'].map(col => (
                  <th key={col} className="text-left px-6 py-3 text-[11px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em] whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeef7]">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[14px] font-['Inter',sans-serif] text-[#62646a]">
                    No services configured yet.
                  </td>
                </tr>
              ) : (
                services.map(svc => (
                  <tr key={svc.id} className="hover:bg-[#eeeef7]/40 transition-colors">

                    <td className="px-6 py-4 text-[13px] font-normal font-['Inter',sans-serif] text-[#62646a] max-w-[260px]">
                      <span className="block truncate" title={`ServiceID: ${svc.serviceId}`}>
                        ServiceID: {svc.serviceId}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-[14px] font-bold font-['Urbanist',sans-serif] text-[#0f172b] whitespace-nowrap">
                        {svc.currency} {svc.price.toLocaleString()}
                      </p>
                      {svc.requiresPayment && (
                        <p className="text-[11px] font-normal font-['Inter',sans-serif] text-[#62646a]">
                          Requires payment
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 text-[13px] font-normal font-['Inter',sans-serif] text-[#4d4f54] whitespace-nowrap">
                      {svc.turnaroundDays} Working {svc.turnaroundDays === 1 ? 'Day' : 'Days'}
                    </td>

                    <td className="px-6 py-4 text-[13px] font-normal font-['Inter',sans-serif] text-[#4d4f54] whitespace-nowrap">
                      {svc.fieldsCount}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-bold font-['Urbanist',sans-serif] px-3 py-1.5 rounded-lg ${
                        svc.status === 'Active'
                          ? 'bg-[rgba(17,155,116,0.12)] text-[#119b74]'
                          : 'bg-[#eeeef7] text-[#62646a]'
                      }`}>
                        {svc.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEditService(svc)}
                        className="text-[13px] font-bold font-['Inter',sans-serif] text-[#ff5533] hover:opacity-75 transition-opacity whitespace-nowrap"
                      >
                        Edit Config
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Service Templates */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-6">
        <div className="flex items-center justify-between gap-4 mb-1">
          <h3 className="text-[16px] font-bold font-['Urbanist',sans-serif] text-[#38393d]">
            Available Service Templates
          </h3>
          {totalTemplatePages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTemplatePage(p => Math.max(1, p - 1))}
                disabled={templatePage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#dddedf] disabled:opacity-40 hover:border-[#0f172b] transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => setTemplatePage(p => Math.min(totalTemplatePages, p + 1))}
                disabled={templatePage === totalTemplatePages}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#dddedf] disabled:opacity-40 hover:border-[#0f172b] transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <p className="text-[13px] font-normal font-['Inter',sans-serif] text-[#62646a] mb-5">
          Showing page {templatePage} of {totalTemplatePages} ({templates.length} total templates available)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleTemplates.map(tpl => (
            <TemplateCard key={tpl.id} template={tpl} onEdit={() => handleEditTemplate(tpl)} />
          ))}
        </div>
      </div>

      <p className="text-center text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] py-2">
        © 2026 CVP Portal. All rights reserved.
      </p>
    </div>
  );
}

/* ─── Template Card ───────────────────────────────────────────────────────── */
function TemplateCard({ template, onEdit }: { template: ServiceTemplate; onEdit: () => void }) {
  return (
    <div className="border border-[#eeeef7] rounded-xl p-5 flex flex-col gap-3 hover:shadow-[0px_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[15px] font-bold font-['Urbanist',sans-serif] text-[#0f172b] leading-snug">
          {template.name}
        </h4>
        {template.offered && (
          <span className="text-[10px] font-bold font-['Urbanist',sans-serif] px-2.5 py-1 rounded-lg bg-[rgba(17,155,116,0.12)] text-[#119b74] whitespace-nowrap flex-shrink-0 border border-[rgba(17,155,116,0.2)]">
            OFFERED
          </span>
        )}
      </div>

      <p className="text-[13px] font-normal font-['Inter',sans-serif] text-[#62646a] flex-1">
        {template.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-[#eeeef7]">
        <span className="text-[10px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em]">
          Template
        </span>
        <button
          onClick={onEdit}
          className="bg-[#ff5533] hover:bg-[#e64d2e] transition-colors text-white text-[12px] font-bold font-['Inter',sans-serif] px-4 py-1.5 rounded-lg"
        >
          Edit Config
        </button>
      </div>
    </div>
  );
}
