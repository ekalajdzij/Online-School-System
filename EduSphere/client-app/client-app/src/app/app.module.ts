import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './admin/admin.component';
import { ViewStudentComponent } from './viewstudent/viewstudent.component';
import { AnsambleComponent } from './ansamble/ansamble.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingPageComponent } from './landingpage/landingpage.component';
import { DataService } from './services/data.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ViewCourseComponent } from './viewcourse/viewcourse.component';
import { MatButtonModule } from '@angular/material/button';
import { ToastrModule } from 'ngx-toastr';
import { AddCourseComponent } from './add-course/add-course.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { AddProfessorComponent } from './add-professor/add-professor.component';
import { AddAssistantComponent } from './add-assistant/add-assistant.component';
import { StudentComponent } from './student/student.component';
import { ViewAssistantComponent } from './viewassistant/viewassistant.component';
import { ViewProfessorComponent } from './viewprofessor/viewprofessor.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { AllCoursesViewComponent } from './all-courses-view/all-courses-view.component';
import { ViewCourseInfoComponent } from './view-course-info/view-course-info.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginpageComponent,
    AdminComponent,
    ViewStudentComponent,
    AnsambleComponent,
    LandingPageComponent,
    SidebarComponent,
    ViewCourseComponent,
    AddCourseComponent,
    AddStudentComponent,
    AddProfessorComponent,
    AddAssistantComponent,
    StudentComponent,
    ViewAssistantComponent,
    ViewProfessorComponent,
    ProfileViewComponent,
    AllCoursesViewComponent,
    ViewCourseInfoComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    ToastrModule.forRoot(),
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
