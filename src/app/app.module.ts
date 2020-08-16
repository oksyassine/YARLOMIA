import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { ProductModule } from './products/product.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadModule } from './file-upload/file-upload.module';
import { RFormModule } from './r-form/r-form.module';
import { MatToolbarModule } from "@angular/material/toolbar";
@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'home', component: WelcomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]),
    ProductModule,
    RFormModule,
    FileUploadModule,
    BrowserAnimationsModule,
    MatToolbarModule
  ],
  exports:[
    MatToolbarModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
