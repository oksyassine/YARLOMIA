import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

import { IUser } from './user';
import { UserService } from './user.service';

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  pageTitle ='Users List';
  imageWidth = 50;
  imageMargin = 2;
  showImage = true;
  errorMessage = '';
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
  displayedColumns: string[] = ['imageUrl', 'firstName', 'lastName', 'cin'];
  dataSource;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(private userService: UserService) { }
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
