import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { IUser } from './user';
import { UserService } from './user.service';
/**
 * detail of the citizen
 */
@Component({
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
    /** page title */

  pageTitle = 'Citizen Detail';
  /** Message shown to the user when the get has been succefully done or not */

  errorMessage = '';
    /** citizen detail */

  user: IUser | undefined;
/** Construct the component  */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private domSanitizer: DomSanitizer) {
  }
  /**  Initiate the component with the id of user*/

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = param;
      this.getUser(id);
    }
  }
  /**This function is triggered when the user hits the button to view the detail  */

  getUser(id: string): void {
    this.userService.getUser(id).subscribe({
      next: user => this.user = user,
      error: err => this.errorMessage = err
    });
  }
    /** This function is triggered to show the image*/

  sanatizeUrl(b64ImageUrl): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(b64ImageUrl);
  }
    /** This function is triggered to return to the table of users*/

  onBack(): void {
    this.router.navigate(['/users']);
  }
}