export interface Teacher {
  id?: number | string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  paymentMethod: 'partially' | 'total';
  salary: number;
  isActive: boolean;
}
