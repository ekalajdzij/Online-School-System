import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { AnsambleComponent } from './ansamble/ansamble.component';
import { ViewStudentComponent } from './viewstudent/viewstudent.component';
import { LandingPageComponent } from './landingpage/landingpage.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { ViewCourseComponent } from './viewcourse/viewcourse.component';
import { StudentComponent } from './student/student.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { AddAssistantComponent } from './add-assistant/add-assistant.component';
import { AddProfessorComponent } from './add-professor/add-professor.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginpageComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'student', component: StudentComponent },
  { path: 'ansamble', component: AnsambleComponent },
  { path: 'viewcourses', component: ViewCourseComponent },
  { path: 'viewstudents', component: ViewStudentComponent },
  { path: 'addcourse', component: AddCourseComponent },
  { path: 'addstudent', component: AddStudentComponent },
  { path: 'addassistant', component: AddAssistantComponent },
  { path: 'addprofessor', component: AddProfessorComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
