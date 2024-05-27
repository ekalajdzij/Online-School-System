// view-course-info.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubmissionService } from '../services/submission.service';
import { MaterialService } from '../services/material.service';
import { AssignmentService } from '../services/assignment.service';
import { CourseService } from '../services/courses.service';
import { AnsambleService } from '../services/ansamble.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, of, switchMap, tap, map } from 'rxjs';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-view-course-info',
  templateUrl: './view-course-info.component.html',
  styleUrls: ['./view-course-info.component.css']
})
export class ViewCourseInfoComponent implements OnInit {
  course: any;
  materials: any[] = [];
  assignments: any[] = [];
  submissions: any[] = [];
  allSubmissions: any[] = [];
  studentId: number = Number(localStorage.getItem('id'));
  courseId: number = 0;
  isEnrolled: boolean = false;
  role: string = '';
  newMaterialName: string = ''; // Dodajte ovo svojstvo

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private ansambleService: AnsambleService,
    private materialService: MaterialService,
    private assignmentService: AssignmentService,
    private submissionService: SubmissionService,
    private toastr: ToastrService,
    private studentService: StudentService,

  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourseData();
    this.checkEnrollmentStatus();
  }

  loadCourseData(): void {
    this.courseService.getCourseById(this.courseId).pipe(
      switchMap((course: any) =>
        forkJoin({
          professor: this.ansambleService.getProfessorById(course.professorId),
          assistant: this.ansambleService.getAssistantById(course.assistantId)
        }).pipe(
          tap(({ professor, assistant }) => {
            course.professorName = `${professor.title} ${professor.name}`;
            course.assistantName = `${assistant.title} ${assistant.name}`;
            this.course = course;
          }),
          map(() => course)
        )
      ),
      switchMap(course =>
        forkJoin({
          materials: this.materialService.getAllMaterials(),
          assignments: this.assignmentService.getAssignments(),
          submissions: this.submissionService.getAllSubmissions()
        }).pipe(
          tap(({ materials, assignments, submissions }) => {
            this.materials = materials.filter((m: { courseId: number; }) => m.courseId === this.courseId);
            this.assignments = assignments.filter((a: { courseId: number; }) => a.courseId === this.courseId);
            
            this.assignments.forEach(assignment => {
              assignment.submissions = submissions.filter((submission: { assignmentId: number; }) => submission.assignmentId === assignment.id);
            });

            this.allSubmissions = [];
            this.assignments.forEach(assignment => {
              this.allSubmissions = this.allSubmissions.concat(assignment.submissions);
            });
            
            forkJoin(this.allSubmissions.map(submission => 
              forkJoin({
                student: this.studentService.getStudentById(submission.studentId),
                assignment: this.assignmentService.getAssignmentById(submission.assignmentId)
              }).pipe(
                map(({ student, assignment }) => ({
                  ...submission,
                  studentName: `${student.firstName} ${student.lastName}`,
                  assignmentName: assignment.name
                }))
              )
            )).subscribe(enhancedSubmissions => {
              this.allSubmissions = enhancedSubmissions;
            });
          })
        )
      ),
      catchError(error => {
        this.toastr.error('Failed to load course data', 'Error');
        console.error(error);
        return of(null); // or another appropriate default value
      })
    ).subscribe();
  }

  checkEnrollmentStatus(): void {
    this.courseService.getCoursesByStudent(this.studentId).pipe(
      tap((courses: { id: number; }[]) => {
        this.isEnrolled = courses.some((c: { id: number; }) => c.id === this.courseId);
      })
    ).subscribe();
  }

  enroll(): void {
    this.studentService.enrollStudent(this.studentId, this.courseId).subscribe(() => {
      this.isEnrolled = true;
    });
  }

  unenroll(): void {
    this.studentService.unenrollStudent(this.studentId, this.courseId).subscribe(() => {
      this.isEnrolled = false;
    });
  }
  toggleEnrollment(): void {
    if (this.isEnrolled) {
      this.unenroll();
    } else {
      this.enroll();
    }
  }

  addMaterial(name: string): void {
    const data = {
      name,
      courseId: this.courseId
    };
    this.newMaterialName = '';
    this.materialService.postMaterial(data).subscribe(() => {
      alert('Material added successfully');
      // Ponovno učitajte materijale kako biste ažurirali prikaz
      this.loadCourseData();
    });
  }
  

  navigateToAssignment(id: number): void {
    this.router.navigate([`/assignment/${id}`]);
  }

  navigateToSubmission(id: number): void {
    this.router.navigate([`/submission/${id}`]);
  }
}
