import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  @ViewChild('drawer') sidenav: MatSidenav;
  handset: boolean;
  userName = 'Admin';
  department = 'Teksystems';

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {
    this.isHandset$.subscribe(data => this.handset = data);
  }

  isLogin(): boolean {
    if (this.router.url.includes('/login')) {
      return true;
    } else {
      // this.updateInfo();
      return false;
    }
  }

  updateInfo() {
    this.userName = 'Admin';
    this.department = 'Teksystems';
  }

  drawerToggle() {
    if (this.handset) {
      this.sidenav.toggle();
    }
  }

}
