//!! Documents & Collections

//| In order to access a single document, this will supply us with options of how to retrieve
/// this.db
/// this.db.doc(<collection/docId>)
/// .get()
/// .subscribe((doc) => {
///   console.log(doc.data());
/// });
//| We can the access additional collections within the document too
/// this.db
/// this.db.doc(<collection/docId/collection/docId>)
/// .get()
/// .subscribe((doc) => {
///   console.log(doc.data());
/// });

//| Unique ID's are not generated on the server side, they are generated on the client side,
//| so they can be generated offline without the worry of overwriting an existing ID.
/// 7QKOZ3JHLH40hhT2zR1b

//| doc() is not a long lived Observable, it provides one instance and completes

//| snapshotChanges vs valueChanges is saved in the screenshots

//!! Creating a mock firebase database for dev
//> firebase login
//> firebase init
//| Select the following
//* Firestore: Configure security rules and indexes files for Firestore
//* Functions: Configure a Cloud Functions directory and its files
//* Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys
//* Storage: Configure a security rules file for Cloud Storage
//* Emulators: Set up local emulators for Firebase products

//! ENSURE that the default GCP resource location is set
//% In the Firebase Dashboard, go to Project Settings -> General
//% Set "Default GCP resource location" again.

//| Add useEmulators property in the environment.ts file
//| Then in the app.module file, in the providers, add the following according to the ports you assigned to them, these ports can be configured in the FIREBASE.JSON file

//> Emulator for the FB Auth emulator
// Will allow us to have predefined test users such as admin and user
/// { provide: USE_AUTH_EMULATOR, useValue: environment.useEmulators ? ['localhost', 9099] : undefined },
//> Emulator for the FB firestore emulator
// Will give us a running local version of the firestore database which will allow us to upload and test data
///   { provide: USE_FIRESTORE_EMULATOR, useValue: environment.useEmulators ? ['localhost', 8080] : undefined },
//> Emulator for the FB cloud functions emulator
// Allow us to run functions locally, without having to upload it to test it
///   { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.useEmulators ? ['localhost', 5001] : undefined }

//| In order to run the emulators we use the cmd
//$ firebase emulators:start --only firestore
//! The --only specifies a specific emulator, so it ensures you don't start all of them, unless you want to

//| Due to the emulator running on virtual memory, if the instance is shut down, ALL of the data setup is lost
//| In order to save the data, we can export the data
//$ firebase emulators:export <filename>
//! BUT IT NEEDS TO BE DONE BEFORE THE INSTANCE IS CLOSED

//| If we want to start the emulator with that data at runtime we use the following cmd
//$ firebase emulators:start --import <filename>

//!! Creating and Updating a Doc in a Collection
//| If the course ID does not exist, we add to the new course to the collection
//| First create a unique ID using firebase firestore
/// import {AngularFirestore} from '@angular/fire/firestore';
/// courseId = this.angularFirestoreSVC.createId()
/// this.db.doc(`<collection>/${<DocID>}`).set(course)

//| set() create or overwrite a single document && you have the option to specify an ID for the document to create
//| add() auto generate doc and give it ID automatically

//| When you use set() on a DocumentReference, you're putting data into a document that you're already identified by some unique id. (Otherwise, you wouldn't already have a DocumentReference object!) As it says in the docs, "If the document does not yet exist, it will be created." If the document already exists, you're either replacing or merging new data into it.
//? https://cloud.google.com/nodejs/docs/reference/firestore/latest#set
//| When you use add() on a CollectionReference, you're unconditionally creating a new document in a collection, and that new document will have a unique id assigned to it. The data you pass will become the contents of the new document.
//? https://cloud.google.com/nodejs/docs/reference/firestore/latest#add

// !! MatDialog data input
//| View the edit-course-dialog && courses-card-list components to view the inner workings

// !! Deleting courses recipe

/// deleteCourse(courseId: string){
///    return from(this.db.doc(`courses/${courseId}`).delete())
/// }

//| Draws from the service
/// onDeleteCourse(course: Course) {
///   this.coursesSVC
///     .deleteCourse(course.id)
///     .pipe(
///       tap(() => {
///         console.log("Deleted course: ", course);
///         this.courseDeleted.emit();
///       }),
///       catchError((err) => {
///           console.log(err);
///           alert('Could not delete course');
///           return throwError(err)
///       })
///     )
///     .subscribe();
/// }

//| BUT We need to ensure that nested collections are deleted too as the above will only delete the contents of the document, not nested collections


