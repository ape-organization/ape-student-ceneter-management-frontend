import { Component, ElementRef, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material/MaterialModule';
import { SharedModule } from '../../../material/SharedModule';

interface SMSTemplate {
  id: number;
  name: string;
  body: string;
}

@Component({
  selector: 'app-sms-templates',
  standalone: true,
  imports: [
   SharedModule,
    MaterialModule
    
  ],
  templateUrl: './sms-templates.component.html',
  styleUrls: ['./sms-templates.component.scss']
})
export class SmsTemplatesComponent {
  @ViewChild('templateTextArea') templateTextArea!: ElementRef<HTMLTextAreaElement>;

  templateName: string = '';
  templateBody: string = '';
  editingId: number | null = null;

  // Mock initial data
  savedTemplates: SMSTemplate[] = [
    { id: 1, name: 'Absence Alert', body: 'Dear parent {parent_name}, your child {child_name} was absent today. Please contact us.' },
    { id: 2, name: 'Attendance Confirmation', body: 'Dear parent {parent_name}, {child_name} has safely arrived at the center.' }
  ];

  insertVariable(variable: string) {
    const textarea = this.templateTextArea.nativeElement;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const text = this.templateBody || '';
    
    this.templateBody = text.substring(0, start) + variable + text.substring(end);
    
    // Set focus back to textarea and move cursor after the inserted variable
    setTimeout(() => {
      textarea.focus();
      const newPos = start + variable.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  }

  getPreview(): string {
    if (!this.templateBody) return 'Template preview will appear here...';
    
    return this.templateBody
      .replace(/{parent_name}/g, '[Parent Name]')
      .replace(/{child_name}/g, '[Child Name]')
      .replace(/{class_name}/g, '[Class Name]')
      .replace(/{today_date}/g, new Date().toLocaleDateString());
  }

  saveTemplate() {
    if (this.editingId !== null) {
      const index = this.savedTemplates.findIndex(t => t.id === this.editingId);
      if (index !== -1) {
        this.savedTemplates[index] = {
          id: this.editingId,
          name: this.templateName,
          body: this.templateBody
        };
      }
      this.editingId = null;
    } else {
      this.savedTemplates.unshift({
        id: Date.now(),
        name: this.templateName,
        body: this.templateBody
      });
    }
    this.resetForm();
  }

  editTemplate(template: SMSTemplate) {
    this.templateName = template.name;
    this.templateBody = template.body;
    this.editingId = template.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteTemplate(id: number) {
    this.savedTemplates = this.savedTemplates.filter(t => t.id !== id);
  }

  resetForm() {
    this.templateName = '';
    this.templateBody = '';
    this.editingId = null;
  }
}
