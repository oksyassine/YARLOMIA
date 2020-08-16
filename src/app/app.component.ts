import { Component } from '@angular/core';

@Component({
  selector: 'pm-root',
  template: `
    <mat-toolbar color="primary">
    <nav class='navbar navbar-expand navbar-dark'>
        <span class='navbar-brand'>{{pageTitle}}</span>
        <ul class='nav nav-pills'>
          <li><a class='nav-link' style="color:white;" routerLinkActive='active' [routerLink]="['/home']">Home</a></li>
          <li><a class='nav-link' style="color:white;" routerLinkActive='active' [routerLink]="['/users']">Users</a></li>
          <li><a class='nav-link' style="color:white;" routerLinkActive='active' [routerLink]="['/form']">Form</a></li>
        </ul>
    </nav>
    </mat-toolbar>
    <div class='container'>
      <router-outlet></router-outlet>
    </div>
    `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle = 'IDEMIA Internship';
}
