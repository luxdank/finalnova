export interface Plan {
  id: string;
  name: string;
  subtitle: string;
  speed: string;
  download: string;
  upload: string;
  includedServices: string[];
  priceFidelity: number;
  originalPrice?: number;
  badges: string[];
  themeColor: 'purple' | 'magenta' | 'deepPurple';
  isFeatured?: boolean;
  category: 'residential' | 'business';
  noFidelity?: boolean;
}

export interface ClientAccount {
  id: string;
  name: string;
  cpf: string;
  email: string;
  planName: string;
  contractNumber: string;
  status: 'active' | 'suspended' | 'pending';
  invoiceMonth: string;
  invoiceDue: string;
  invoiceAmount: number;
  invoiceStatus: 'aberta' | 'paga' | 'vencida';
  pixCode: string;
  barcode: string;
  wifiSSID: string;
  wifiPass: string;
  downloadUsedGB: number;
  uploadUsedGB: number;
  ipAddress: string;
  address: string;
}
