import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'register', loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule) },
  { path: 'project', loadChildren: () => import('./content/content.module').then(m => m.ContentModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
