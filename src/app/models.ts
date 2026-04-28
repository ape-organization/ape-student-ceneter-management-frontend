export interface Teacher {
  id?: number; // Make ID optional for new teachers
  name: string;
  phone: string;
  subject: string;
  salary: number;
  isActive: boolean;
  paymentMethod?: string; // Added paymentMethod
  email?: string; // Email is optional
}

export interface Student {
  id?: number;
  name: string;
  phone: string;
  parentPhone: string;
  grade: string;
  discount: number;
  isActive: boolean;
}

export interface Subject {
  id?: number;
  name: string;
  isActive: boolean;
}

export interface Location {
  id?: number;
  branch: string;
  classroom: string;
  capacity: number;
  isActive: boolean;
}

export type PaymentMethod = 'month' | 'hour';

export interface ClassModel {
  id?: number;
  name: string;
  teacherId: number;
  price: number;
  dayFrom: string;
  dayTo: string;
  hourFrom: string;
  hourTo: string;
  capacity: number;
  locationId: number;
  paymentMethod: PaymentMethod;
  isActive: boolean; // Added isActive property
  totalPrice: number;
}