export type DeliveryMethod = 'MAIL' | 'PICKUP' | 'COURIER';

export type RequestStatus = 'SUBMITTED' | 'IN_REVIEW' | 'COMPLETED' | 'REJECTED';

export type FormParam = {
  label: string;
  value: string;
  type?: 'text' | 'image';
};

export type AuditEvent = {
  id: string;
  description: string;
  timestamp: string;
};

export type RequestRecord = {
  id: string;
  trackingCode: string;
  dateTime: string;
  method: DeliveryMethod;
  status: RequestStatus;
  serviceType: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  applicationType: string;
  formParams: FormParam[];
  attachedDocumentName?: string;
  auditTimeline: AuditEvent[];
};
