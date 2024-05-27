import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { ViewStudentComponent } from './viewstudent/viewstudent.component';
import { LandingPageComponent } from './landingpage/landingpage.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { ViewCourseComponent } from './viewcourse/viewcourse.component';
import { StudentComponent } from './student/student.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { AddAssistantComponent } from './add-assistant/add-assistant.component';
import { AddProfessorComponent } from './add-professor/add-professor.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ViewCourseInfoComponent } from './view-course-info/view-course-info.component';
import { AllCoursesViewComponent } from './all-courses-view/all-courses-view.component';
import { ProfessorComponent } from './professor/professor.component';
import { AssistantComponent } from './assistant/assistant.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginpageComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'student', component: StudentComponent },
  { path: 'professor', component: ProfessorComponent },
  { path: 'assistant', component: AssistantComponent },
  { path: 'viewcourses', component: ViewCourseComponent },
  { path: 'viewstudents', component: ViewStudentComponent },
  { path: 'addcourse', component: AddCourseComponent },
  { path: 'addstudent', component: AddStudentComponent },
  { path: 'addassistant', component: AddAssistantComponent },
  { path: 'addprofessor', component: AddProfessorComponent },
  { path: 'profile', component: ProfileViewComponent },
  { path: 'viewcourseinfo/:id', component: ViewCourseInfoComponent },
  { path: 'allcoursesview', component: AllCoursesViewComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
