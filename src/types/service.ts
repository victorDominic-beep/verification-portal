export type FieldType = 'Short Text' | 'Long Text' | 'Date picker' | 'File upload' | 'Number' | 'Dropdown';

export type FormField = {
  id: string;
  label: string;
  jsonKey: string;
  type: FieldType;
  required: boolean;
};

export type ServiceConfigData = {
  id: string;
  name: string;
  feeAmount: number;
  currency: string;
  estimatedWorkingDays: number;
  requiresUpfrontPayment: boolean;
  isActive: boolean;
  formFields: FormField[];
};
