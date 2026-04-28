import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  private currentLang = 'en';

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  initLanguage() {

    const savedLang = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('lang') || 'en'
      : 'en';

    this.setLanguage(savedLang);

  }

  getCurrentLanguage(): string {
    return this.currentLang;
  }

  toggleLanguage() {

    const newLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);

  }
 getLang(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('app_lang') || this.currentLang;
    }
    return this.currentLang;
  }
  setLanguage(lang: string) {

    this.currentLang = lang;

    this.translate.use(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }

  }
}