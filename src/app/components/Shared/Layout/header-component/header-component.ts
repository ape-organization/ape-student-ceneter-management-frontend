import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MaterialModule } from '../../../../material/MaterialModule';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../Services/language.service';
import { NotificationsComponent } from '../../../Dashboard/notifications-component/notifications.component';

@Component({
  selector: 'app-header-component',
  imports: [MaterialModule, CommonModule, TranslateModule,NotificationsComponent],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  @Output() toggle = new EventEmitter<void>();
  darkMode = false;
  username = 'Ereny';
  isMenuOpen = false;
dropdownOpen = false;
  constructor(public languageService: LanguageService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
 languages = [
    { code: 'en', label: 'English', flag: 'assets/flags/us.png' },
    { code: 'ar', label: 'العربية', flag: 'assets/flags/eg.png' },
  ];
     changeLanguage(lang: string) {
    this.languageService.setLanguage(lang);
    this.dropdownOpen = false;
  }
    // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-dropdown')) {
      this.dropdownOpen = false;
    }
  }
    get currentFlag(): string {
    const current = this.languages.find((l) => l.code === this.languageService.getLang());
    return current ? current.flag : this.languages[0].flag;
  }

  get currentLabel(): string {
    const current = this.languages.find((l) => l.code === this.languageService.getLang());
    return current ? current.label : this.languages[0].label;
  }
   toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  //////////
  ngOnInit() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      this.darkMode = true;
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;

    if (this.darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }

 toggleLanguage() {
  this.languageService.toggleLanguage(); // calls setLanguage safely
}
}
