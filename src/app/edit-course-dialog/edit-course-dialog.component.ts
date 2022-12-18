import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "edit-course-dialog",
  templateUrl: "./edit-course-dialog.component.html",
  styleUrls: ["./edit-course-dialog.component.css"],
})
export class EditCourseDialogComponent {
  form: FormGroup;
  course: Course;
  constructor(
    private dialogRef: MatDialogRef<EditCourseDialogComponent>,
    private fb: FormBuilder,
    //| The data of the course we're selecting is passed down to the dialog component via dependency injection
    //> We recieve a new property that will contain the data that is currently being modified
    //> This will be injected via dependency injection using the INJECT decorator, then we provide the unique injection token - MAT_DIALOG_DATA
    //> So the caller of the dialog that is going to open this dialog and show it to the user needs to pass in the data to the dialog via the injection token
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesSVC: CoursesService
  ) {
    this.form = this.fb.group({
      //| Since this is an edit form, we need to provide the existing values and NOT set the values in the new form instance
      description: [course.description, Validators.required],
      longDescription: [course.longDescription, Validators.required],
      promo: [course.promo, Validators.required],
    });
    this.course = course;
  }

  close() {
    this.dialogRef.close();
  }

  save(){
    const changes = this.form.value;

    this.coursesSVC.updateCourse(this.course.id, changes).subscribe(() => {
      //| The below allows us to pass an argument to the afterClosed observable when the dialog closes
      this.dialogRef.close(changes);
    });
  }
}
