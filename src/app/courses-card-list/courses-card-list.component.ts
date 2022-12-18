import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { Course } from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditCourseDialogComponent } from "../edit-course-dialog/edit-course-dialog.component";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { Router } from "@angular/router";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "courses-card-list",
  templateUrl: "./courses-card-list.component.html",
  styleUrls: ["./courses-card-list.component.css"],
})
export class CoursesCardListComponent implements OnInit {
  @Input()
  courses: Course[];

  @Output()
  courseEdited = new EventEmitter();

  @Output()
  courseDeleted = new EventEmitter<Course>();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private coursesSVC: CoursesService
  ) {}

  ngOnInit() {}

  onDeleteCourse(course: Course) {
    console.log(course);
    this.coursesSVC
      .deleteCourse(course.id)
      .pipe(
        tap(() => {
          console.log("Deleted course: ", course);
          this.courseDeleted.emit();
        }),
        catchError((err) => {
            console.log(err);
            alert('Could not delete course');
            return throwError(err)
        })
      )
      .subscribe();
  }

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = "400px";

    dialogConfig.data = course;

    this.dialog
      .open(EditCourseDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          console.log(val);
          this.courseEdited.emit();
        }
      });
  }
}
