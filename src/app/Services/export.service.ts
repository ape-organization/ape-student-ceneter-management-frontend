import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })
export class ExportService {
    exportPDF(data:any,name:any) {
      const doc = new jsPDF();
    console.log(data)
      autoTable(doc, {
    head: [['ID', 'Name']],
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [63, 81, 181] },
    styles: { fontSize: 11 }
  });
    
      doc.save(`${name}.pdf`);
    }
    exportExcel(data:any,name:any) {
     
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data); // use json_to_sheet
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, name);
    
      XLSX.writeFile(wb, `${name}.xlsx`);
    }
}