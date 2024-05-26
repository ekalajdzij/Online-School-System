import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { AnsambleComponent } from './ansamble/ansamble.component';
import { StudentComponent } from './student/student.component';
import { LandingPageComponent } from './landingpage/landingpage.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { ViewCourseComponent } from './viewcourse/viewcourse.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginpageComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'student', component: StudentComponent },
  { path: 'ansamble', component: AnsambleComponent },
  { path: 'viewcourses', component: ViewCourseComponent },
  { path: 'addcourse', component: AddCourseComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
