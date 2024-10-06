import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';  
import { AuthGuard } from './services/auth.guard';
import { BlogFormComponent } from './components/blog-form/blog-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent , canActivate: [AuthGuard]},
  { path: 'register', component: RegisterComponent },
  { path: 'blog-form', component: BlogFormComponent, canActivate: [AuthGuard] }, 
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
  { path: 'profile', component: ProfileComponent },  
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
