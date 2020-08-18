import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IUser } from './user';
import { UserService } from './user.service';

@Component({
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  pageTitle = 'User Detail';
  errorMessage = '';
  user: IUser | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getUser(id);
    }
  }

  getUser(id: number): void {
    this.userService.getUser(id).subscribe({
      next: user => this.user = user,
      error: err => this.errorMessage = err
    });
  }

  onBack(): void {
    this.router.navigate(['/users']);
  }
}
