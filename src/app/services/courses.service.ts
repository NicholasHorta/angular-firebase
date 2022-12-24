import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { OrderByDirection } from "@google-cloud/firestore";
import { from, Observable } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";
import { convertSnapshots } from "./db-utils";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private db: AngularFirestore) {}

  deleteCourseAndLessons(courseId: string) {
    //| We need to read every document nested in the nested collections of the document
    //| This way we can delete them one by one
    //> Retrieve all lessons documents of a given course
    return this.db
      .collection(`courses/${courseId}/lessons`)
      .get()
      .pipe(
        //> We need to transform it into a data modification request
        //> Read request that we need to turn into a write transaction
        //> That will ultimately delete every lesson retrieved and the parent course document
        //> In order to transform it into a data modification operation we use concatMap op - turn an observable into another observable
        concatMap((results) => {
          const lessons = convertSnapshots<Lesson>(results);
          //> Now, using the lessons, we simply have to loop through them, delete each one and finally delete the course doc
          //> We need to do this in one single db transaction called a batch transaction
          const batch = this.db.firestore.batch();
          //> We can add many ops to a batch write such as set, delete, update
          //> When we are done, call COMMIT (promise) to complete.
          //> This is an atomic process, so either ALL complete or NONE if there's an err
          //| In order to delete a document in a batched write we need a firestore reference to the document
          //| This gives us a client side reference to the document that we can use in the batched write
          const courseRef = this.db.doc(`courses/${courseId}`).ref;
          //> So we pass the courseRef to the batch cmd
          batch.delete(courseRef);
          //> Loop through and delete
          for (let lesson of lessons) {
            //> In order ot delete we need to grab a ref of each doc
            const lessonRef = this.db.doc(
              `courses/${courseId}/lessons/${lesson.id}`
            ).ref;
            batch.delete(lessonRef);
          }

          //> At the end when all ops are added to our batched write, we need to call COMMIT - Which is a promise
          return from(batch.commit());
        })
      );
  }

  //. deleteCourse(courseId: string){
  //.   return from(this.db.doc(`courses/${courseId}`).delete())
  //. }

  updateCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return from(this.db.doc(`courses/${courseId}`).update(changes));
  }

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
          console.log(
            "%ccourses.service.ts line:24 CurrentCourses",
            "color: white; background-color: #26bfa5;",
            courses
          );
          //> New course
          const course = {
            ...newCourse,
            seqNo: lastCourseSeqNo + 1,
          };

          //> Create new Obsv
          let save$: Observable<any>;
          console.log(
            "%ccourses.service.ts line:33 NewCourse",
            "color: #26bfa5;",
            course
          );
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
              console.log(
                "%ccourses.service.ts line:45 RESULT SAVE$",
                "color: white; background-color: #007acc;",
                res
              );
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

  findCourseByUrl(courseUrl: string): Observable<Course | null> {
    return this.db
      .collection("courses", (ref) => ref.where("url", "==", courseUrl))
      .get()
      .pipe(
        map((results) => {
          const courses = convertSnapshots<Course>(results);
          return courses.length == 1 ? courses[0] : null;
        })
      );
  }

  findLessons(
    courseId: string,
    sortOrder: OrderByDirection = "asc",
    pageNumber = 0,
    pageSize = 3
  ): Observable<Lesson[]> {
    return this.db
      .collection(`courses/${courseId}/lessons`, (ref) =>
        ref
          .orderBy("seqNo", sortOrder)
          .limit(pageSize)
          .startAfter(pageNumber * pageSize)
      )
      .get()
      .pipe(map((results) => convertSnapshots<Lesson>(results)));
  }
}
