import * as functions from "firebase-functions";
import { createUserApp } from "./create-user";
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//

// //| The above was overkill, here is a simplified way to do it

export const onAddCourseUpdatePromoCounterSimplified = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "128MB",
  })
  .firestore.document("courses/{courseId}")
  .onCreate(async (snap, context) => {
    await (
      await import("./promo-counter/on-add-course")
    ).default(snap, context);
  });

export const onCourseUpdatedUpdatePromoCounter = functions.firestore
  .document("courses/{courseId}")
  .onUpdate(async (change, context) => {
    await (
      await import("./promo-counter/on-course-updated")
    ).default(change, context);
  });

export const onCourseDeletedUpdatePromoCounter = functions.firestore
  .document("courses/{courseId}")
  .onDelete(async (snap, context) => {
    await (
      await import("./promo-counter/on-delete-course")
    ).default(snap, context);
  });

//!! DATABASE TRIGGER TRANSACTIONS BELOW

/// export const onAddCourseUpdatePromoCounter = functions
///   .runWith({
///     timeoutSeconds: 300,
///     memory: "128MB",
///   })
///   .firestore.document("courses/{courseId}")
///   .onCreate(async (docSnapshot, context) => {
///     await functions.logger.debug(
///       `Running add course trigger for courseId - context = ${context.params.courseId}`,
///       `Doc Snapshot = ${docSnapshot.id}`
///     );

//     //| We retreive the newly created docs data
///     const course = docSnapshot.data();

//     //| We could use BATCH writes, configure, and then BATCH.commit() and then those operations would be commited to the db in an atomic way, BUT this is ONLY useful is if we only have write operations in our transaction
//     //| In our case, we want to READ the counter from the DB
//     //| So we can LOCK the data and ensure that no-one can WRITE to it while we are running the transaction
//     //| We want to check the content of the course, see if the course is in promo
//     //| And depending if it is, update the counter and save the new value in an atomic way
//     //| Ensuring that while our transaction is running, no one else has the ability to modify/update the value in the db
//     //| So for this reason, a BATCH write is not sufficient, instead, we need to write a db transaction

///     if (course.promo) {
//       //| This takes a function as it's argument, which recieves the transaction object
///       return db.runTransaction(async (transaction) => {
//         //| The result of this function is a success or failure
//         //| If this transaction succeeds, the trigger execution was a success

///         const counterRef = db.doc('courses/stats')

//         //| We want to then read the current value of the counter inside the transaction
//         //| When we read some info from the db from inside the transaction, we are SURE that nobody can modify it while our transaction is running
///         const snap = await transaction.get(counterRef)
//         //| this retrieves a snapshot of this document, but is not the object yet
///         const stats = snap.data() ?? {totalPromo: 0};
//         //* The nullish coalescing (??) operator is a logical operator that returns its right-hand side operand when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand.
//         //* So if snap.data() is null or undefined, we return the right. Else we return the left.

//         //| Now we set the new value and have it in memory
///         stats.totalPromo += 1;

//         //| Now we need to write it back to the db inside the same on-going transaction

///         transaction.set(counterRef, stats);

//         //| SUMMARY:
//         //: READ the current value
//         //: INCREMENTED the value
//         //: WROTE it back to the db
//         //: ALL within the SAME TRANSACTION
//         //| SO there are TWO seperate transactions happening here!
//         //| The first added a doc into the DB
//         //| The second is triggered by our trigger via the detection of the create doc event
///       });
///     }
///   });

// !! HTTP ENDPOINT

//* This is a FULL express application, capable of handling multiple types of requests - POST PUT GET DELETE etc

export const createUser = functions.https.onRequest(createUserApp);
