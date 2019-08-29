import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CandidateViewComponent } from './candidate-view/candidate-view.component';
import { ProblemViewComponent } from './problem-view/problem-view.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'contest/:id',
    component: DashboardComponent
  },
  {
    path: 'contest/:cid/candidate/:uid',
    component: CandidateViewComponent
  },
  {
    path: 'problem',
    component: ProblemViewComponent
  }, {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
