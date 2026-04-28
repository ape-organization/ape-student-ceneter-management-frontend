// src/app/features/cards/models/card-template.model.ts
export interface CardTemplate {
  image: string;     // uploaded card design URL
  qrTop: number;     // QR position top in px
  qrLeft: number;    // QR position left in px
  qrSize: number;    // QR size in px
}