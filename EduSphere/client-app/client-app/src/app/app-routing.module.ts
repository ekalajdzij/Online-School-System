import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { AnsambleComponent } from './ansamble/ansamble.component';
import { StudentComponent } from './student/student.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: LoginpageComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'student', component: StudentComponent },
  { path: 'ansamble', component: AnsambleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
