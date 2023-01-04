import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { Course } from "../model/course";
import { catchError, concatMap, last, map, take, tap } from "rxjs/operators";
import { from, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { AngularFireStorage } from "@angular/fire/storage";
import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "create-course",
  templateUrl: "create-course.component.html",
  styleUrls: ["create-course.component.css"],
})
export class CreateCourseComponent implements OnInit {
  courseId: string;
  percentageChanges$: Observable<number>;
  iconUrl: string;
  form = this.fb.group({
    description: ["", Validators.required],
    category: ["BEGINNER", Validators.required],
    url: ["", Validators.required],
    longDescription: ["", Validators.required],
    promo: [false],
    promoStartAt: [null],
  });
  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private angularFirestoreSVC: AngularFirestore,
    private router: Router,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.courseId = this.angularFirestoreSVC.createId();
  }

  uploadThumbnail(event) {
    //| Access the event
    const file = event.target.files[0];
    //| Then assign where the files will be stored
    const filePath = `courses/${this.courseId}/${file.name}`;
    //| Then perform the upload(<path>, <file>, ?<metadata>)
    //| we store this in a variable becuae what we have here is not the immediate upload
    //| It is an ANGULAR FIRE UPLOAD TASK, which provides us options on the upload task
    const task = this.storage.upload(filePath, file, {
      //| This allows us to ensure we don't have to download the file every time
      //| This is useful if the file will not change
      cacheControl: "max-age=259200,public",
    });
    this.percentageChanges$ = task.percentageChanges();
    task
      .snapshotChanges()
      .pipe(
        //| last will only run when the source observable is completed before emitting any value
        //| So any value here emitted after last() will occurr ONLY when the file has been fully uploaded
        last(),
        //| We then want to make another request to firebase storage to create a safe download URL for our file
        //| ConcatMap allows us to then make another request to firebase storage
        concatMap(() => this.storage.ref(filePath).getDownloadURL()),
        tap(url => this.iconUrl = url),
        catchError((err: any) => {
          console.log(err);
          alert('Could not create thumbnail url');
          return throwError(err)
        }) 
      )
      .subscribe((i) => console.log(i));
  }

  onCreateCourse() {
    const val = this.form.value;

    const newCourse: Partial<Course> = {
      description: val.description,
      url: val.url,
      longDescription: val.longDescription,
      promo: val.promo,
      categories: [val.category],
    };

    newCourse.promoStartAt = Timestamp.fromDate(this.form.value.promoStartAt);
    console.log(newCourse);
    this.coursesService
      .createCourse(newCourse, this.courseId)
      .pipe(
        tap((course) => {
          console.log("created new course: ", course);
          this.router.navigateByUrl("/courses");
        }),
        catchError((err) => {
          console.log(err);
          alert(`Could not create the course due to ${err.message}`);
          return throwError(err);
        })
      )
      .subscribe();
  }
}
