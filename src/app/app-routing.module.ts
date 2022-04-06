import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './info/info.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'post',
    component:InfoComponent
  },
  {
    path: 'user',
    component:UsersComponent
  },
  {
    path: '**',
    redirectTo:'post'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
