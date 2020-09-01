import { NgModule } from '@angular/core';
import { UserListComponent } from './user-list.component';
import { UserDetailComponent } from './user-detail.component';
import { RouterModule } from '@angular/router';
import { UserDetailGuard } from './user-detail.guard';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table'
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
  ],
  imports: [
    MatFormFieldModule,
    MatTableModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MatProgressSpinnerModule,
    RouterModule.forChild([
      { path: 'users', component: UserListComponent },
      {
        path: 'users/:id',
        canActivate: [UserDetailGuard],
        component: UserDetailComponent
      }
    ])
    ],
  exports:[
    MatTableModule,
    MatFormFieldModule
  ]
})
export class UserModule { }