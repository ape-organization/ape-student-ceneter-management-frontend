import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './Services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Center-Admin');
 constructor(private languageService: LanguageService) {}

  ngOnInit() {
    // initialize translation safely after app bootstrap
    this.languageService.initLanguage();
  }
}
