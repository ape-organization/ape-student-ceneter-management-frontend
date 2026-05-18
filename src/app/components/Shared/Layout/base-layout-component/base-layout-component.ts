import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../../material/MaterialModule';
import { SidenavComponent } from '../sidenav-component/sidenav-component';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header-component/header-component';
import { LanguageService } from '../../../../Services/language.service';
@Component({
  selector: 'app-base-layout-component',
  imports: [MaterialModule,RouterModule,
    CommonModule,SidenavComponent,HeaderComponent
  ],
  templateUrl: './base-layout-component.html',
  styleUrl: './base-layout-component.scss',
})

export class BaseLayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;

  constructor(
    public languageService: LanguageService,
    private observer: BreakpointObserver
  ) {}
  ngOnInit(): void {

  }

  ngAfterViewInit() {

    this.observer.observe([Breakpoints.Handset])
      .subscribe(result => {

        this.isMobile = result.matches;

        if (this.isMobile) {
          this.sidenav.close();
        } else {
          this.sidenav.open();
        }

      });

  }
onItemSelected() {
  if (this.isMobile) {
    this.sidenav.close();
  }

}

}