import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import { finalize, map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
  loading = false;
  course: Course;
  lessons: Lesson[];
  lastPageLoaded = 0;

  displayedColumns = ["seqNo", "description", "duration"];

  constructor(private route: ActivatedRoute, private courses: CoursesService) {}

  ngOnInit() {

    //| Route snapshot is a snap in time at the very moment this method was called of the state of the activated route
    console.log(this.route.snapshot.data["course"]);
    this.course = this.route.snapshot.data["course"];

    this.loading = true;

    this.courses
      .findLessons(this.course.id)
      .pipe(
        //! This will be called if the observable errors out || if it emits a valid value, then it completes and performs the actions provided below
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (lessons) =>
          (this.lessons = lessons.length
            ? lessons
            : [
                {
                  id: 123,
                  description: "No lessons provided",
                  duration: "00:00",
                  seqNo: 0,
                  courseId: 123,
                },
              ])
      );

  }

  loadMore() {
    this.lastPageLoaded++;
    this.loading = true;
    this.courses
      .findLessons(this.course.id, "asc", this.lastPageLoaded)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((lessons) => {
        this.lessons = this.lessons.concat(lessons);
      });
  }
}
