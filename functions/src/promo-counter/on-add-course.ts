import * as functions from "firebase-functions";
import { db } from "../init";
import { FieldValue } from "@google-cloud/firestore";

export default async (docSnapshot, context) => {
    await functions.logger.debug(
      `Running add course trigger for courseId - context = ${context.params.courseId}`,
      `Doc Snapshot = ${docSnapshot.id}`
    );
    const course = docSnapshot.data();
    if (course.promo) {
      return db.doc("courses/stats").update({
        totalPromo: FieldValue.increment(1),
      });
    }
  }