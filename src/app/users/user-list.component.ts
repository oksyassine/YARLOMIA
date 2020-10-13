import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { IUser } from './user';
import { UserService } from './user.service';
    /** the liste of all citizens*/

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),

    ]),
  ],
})
export class UserListComponent implements OnInit {
    /** page title */

  pageTitle ='Citizens List';
    /** size of the image */

  imageWidth = 50;
  imageMargin = 2;
  showImage = true;
    /** message to show when we have error */

  errorMessage = '';
    /** detail about citizen */

  expandedElement: IUser | null;
    /** use to upload  the spinner*/

  isLoadingResults = false;
  /** the citizens */

  Users: IUser[] = [];
    /** use to show the columns of the table of citizens */

  displayedColumns: string[] = ['pic', 'firstName', 'lastName', 'cin','address','sexe'];
  dataSource;
/** Construct the component  */
  constructor(private domSanitizer: DomSanitizer,private userService: UserService) { }
  /** This function is triggered when the user filitered the citizens*/

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  /**  This function is triggered to show the image*/

  sanatizeUrl(b64ImageUrl): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(b64ImageUrl);
  }

 /**
   * Initiate the component 
   */

  ngOnInit(): void {
    this.isLoadingResults = true;

    this.userService.getUsers().subscribe({
      next: Users => {
        this.Users = Users;
        this.dataSource = new MatTableDataSource(this.Users);
        this.isLoadingResults = false;

      },
      error: err => this.errorMessage = err
    });
  }
}