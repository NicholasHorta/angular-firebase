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
