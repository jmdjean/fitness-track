import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'fitness-app';

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private router: Router) {}

  get isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/signup';
  }

  onToggle(): void {
    this.sidenav.toggle();
  }

  onLogout(): void {
    this.router.navigate(['/login']);
  }
}
