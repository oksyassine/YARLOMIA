import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { IUser } from './user';
import { UserService } from './user.service';

@Component({
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  pageTitle = 'Citizen Detail';
  errorMessage = '';
  user: IUser | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private domSanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = param;
      this.getUser(id);
    }
  }

  getUser(id: string): void {
    this.userService.getUser(id).subscribe({
      next: user => this.user = user,
      error: err => this.errorMessage = err
    });
  }
  sanatizeUrl(b64ImageUrl): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(b64ImageUrl);
  }
  onBack(): void {
    this.router.navigate(['/users']);
  }
}