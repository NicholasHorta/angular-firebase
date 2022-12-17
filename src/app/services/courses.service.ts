import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { from, Observable } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { Course } from "../model/course";
import { convertSnapshots } from "./db-utils";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private db: AngularFirestore) {}

  createCourse(newCourse: Partial<Course>, courseId?: string) {
    //> Getting the course with the highest seqNo, to build the data for the new course
    return this.db
      .collection("courses", (ref) => ref.orderBy("seqNo", "desc").limit(1))
      .get()
      .pipe(
        concatMap((result) => {
          //> Current Courses
          const courses = convertSnapshots<Course>(result);
          const lastCourseSeqNo = courses[0]?.seqNo ?? 0;
          console.log('%ccourses.service.ts line:24 CurrentCourses', 'color: white; background-color: #26bfa5;', courses);
          //> New course
          const course = {
            ...newCourse,
            seqNo: lastCourseSeqNo + 1,
          };

          //> Create new Obsv
          let save$: Observable<any>;
          console.log('%ccourses.service.ts line:33 NewCourse', 'color: #26bfa5;', course);
          if (courseId) {
            //> If the course ID exists, replace at that ID within the collection
            save$ = from(this.db.doc(`courses/${courseId}`).set(course));
          } else {
            //> If the course ID does not exist, we add to the new course to the collection
            save$ = from(this.db.collection("courses").add(course));
          }

          //> Return the obsv 
          return save$.pipe(
            map((res) => {
              console.log('%ccourses.service.ts line:45 RESULT SAVE$', 'color: white; background-color: #007acc;', res);
              //> return the new obj with either the existing id or new id
              return {
                id: courseId ?? res.id,
                ...course,
              };
            })
          );
        })
      );
  }

  loadCoursesByCategory(category: string): Observable<Course[]> {
    return this.db
      .collection("courses", (queryRef) =>
        queryRef
          .where("categories", "array-contains", category)
          .orderBy("seqNo")
      )
      .get()
      .pipe(map((snapshots) => convertSnapshots<Course[]>(snapshots)));
  }
}
