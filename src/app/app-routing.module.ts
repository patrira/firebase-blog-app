import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';  // Add Profile Component
import { AuthGuard } from './services/auth.guard';
import { BlogFormComponent } from './components/blog-form/blog-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'blog-form', component: BlogFormComponent, canActivate: [AuthGuard] }, 
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },  
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
