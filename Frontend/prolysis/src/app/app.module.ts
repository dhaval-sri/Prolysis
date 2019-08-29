import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainNavComponent } from './main-nav/main-nav.component';
// tslint:disable-next-line: max-line-length
import { MatSidenavModule, MatIconModule, MatToolbarModule, MatListModule, MatButtonModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { AvatarModule } from 'ngx-avatar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CandidateViewComponent } from './candidate-view/candidate-view.component';
import { ChartsModule } from 'ng2-charts';
import { ProblemViewComponent } from './problem-view/problem-view.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainNavComponent,
    CandidateViewComponent,
    ProblemViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    AvatarModule,
    ChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
