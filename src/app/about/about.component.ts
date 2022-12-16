import { Component, OnInit } from "@angular/core";

import "firebase/firestore";

import { AngularFirestore } from "@angular/fire/firestore";
import { COURSES, findLessonsForCourse } from "./db-data";
import { map, switchMap, tap } from "rxjs/operators";
import { from } from "rxjs";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent {
  constructor(private db: AngularFirestore) {}

  async uploadData() {
    const coursesCollection = this.db.collection("courses");
    const courses = await this.db.collection("courses").get();
    for (let course of Object.values(COURSES)) {
      const newCourse = this.removeId(course);
      const courseRef = await coursesCollection.add(newCourse);
      const lessons = await courseRef.collection("lessons");
      const courseLessons = findLessonsForCourse(course["id"]);
      console.log(`Uploading course ${course["description"]}`);
      for (const lesson of courseLessons) {
        const newLesson = this.removeId(lesson);
        delete newLesson.courseId;
        await lessons.add(newLesson);
      }
    }
  }

  removeId(data: any) {
    const newData: any = { ...data };
    delete newData.id;
    return newData;
  }

  onReadDoc() {
    this.db
      .doc("courses/UCIi3v9SX6I7YhYukqWx")
      .get()
      .subscribe((doc) => {
        console.log(doc.exists);
        console.log(doc.id);
        console.log(doc.data());
      });
    this.db
      .doc("courses/UCIi3v9SX6I7YhYukqWx/lessons/7QKOZ3JHLH40hhT2zR1b")
      .get()
      .subscribe((doc) => {
        console.log(doc.exists);
        console.log(doc.id);
        console.log(doc.data());
      });
  }

  onReadCollection() {
    this.db
      .collection("courses", (ref) =>
        ref.where("seqNo", "<=", 5).orderBy("seqNo")
      )
      .get()
      .subscribe((col) => {
        col.forEach((doc) => console.log(doc.data(), doc.id));
      });
    this.db
      .collection("courses", (ref) => ref.where("seqNo", "==", 10))
      .get()
      .subscribe((col) => {
        col.forEach((doc) => console.log(doc.data(), doc.id));
      });
    this.db
      .collection("courses/UCIi3v9SX6I7YhYukqWx/lessons", (ref) =>
        ref.where("seqNo", ">", 5).where("duration", "==", "4:44")
      )
      .get()
      .subscribe((col) => {
        col.forEach((doc) => console.log(doc.data(), doc.id));
      });
  }

  onReadCollectionGroup() {
    this.db
      .collectionGroup("lessons", (ref) => ref.where("seqNo", "==", 1))
      .get()
      .subscribe((snap) => {
        snap.forEach((i) =>
          console.log(`%c  => `, "color: red; background: white;", i.data())
        );
      });
  }

  snapShotValues$;

  viewSnapshotChanges() {
    this.snapShotValues$ = this.db.doc('courses/UCIi3v9SX6I7YhYukqWx').snapshotChanges().pipe(tap(i => console.log(i)), map(i => i.payload.data()))
  }

  valueChangeValues$;
  viewValueChanges() {
    this.valueChangeValues$ = this.db.doc('courses/UCIi3v9SX6I7YhYukqWx').valueChanges().pipe(tap(i => console.log(i)), map(i => i))
  }
}
