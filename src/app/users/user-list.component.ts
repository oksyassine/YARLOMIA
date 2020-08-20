import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { IUser } from './user';
import { UserService } from './user.service';

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
  pageTitle ='Citizens List';
  imageWidth = 50;
  imageMargin = 2;
  showImage = true;
  errorMessage = '';
  expandedElement: IUser | null;

/*
  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredUsers = this.listFilter ? this.performFilter(this.listFilter) : this.Users;
  }

  filteredUsers: IUser[] = [];*/
  Users: IUser[] = [];
  displayedColumns: string[] = ['pic', 'firstName', 'lastName', 'cin','address','sexe'];
  dataSource;

  constructor(private domSanitizer: DomSanitizer,private userService: UserService) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sanatizeUrl(b64ImageUrl): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(b64ImageUrl);
  }

/*
  performFilter(filterBy: string): IUser[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.Users.filter((user: IUser) =>
      user.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }*/

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: Users => {
        this.Users = Users;
        //this.filteredUsers = this.Users;
        this.dataSource = new MatTableDataSource(this.Users);
      },
      error: err => this.errorMessage = err
    });
  }
}
