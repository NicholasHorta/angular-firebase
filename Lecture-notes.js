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

//!! Firestore Transactional Batched Writes

//| We want to delete in a single transaction not only the course document, but every single additional document nested in other collections associated to the document
//| As we cannot delete a collection, but a collection cannot exist with no documents, so the collection is therefor deleted
//| For that, we'll need a batched write transaction. This ONLY has write operations so there are no read locks on the DB
//! View deleteCourseAndLessons functions for information on the above

//| Additionally...
/// batch.set( ref, {...data}, {merge: boolean}? )
//| Passing in the reference, and data
//| Just like any firestore SET operation, this will override any data that exists there
//| Unless we pass in an optional options object that allows you to merge the data WITH the existing data

/// batch.update( ref, {...fields we want to modify} )
//| We can update with the above, by passing in a reference to the data
//| And then the fields that we want to modify

//!! View Course Section

//| When we select an individual "view course" button in the courses page
//| We're using the angular router to access these specific courses
//| Each URL will be unique to the course and we'll use the url to access the data to the course
//: We'll do this using the router and router resolver immediately, before the router transition completes
//| So when the user clicks the "view courses" button, the router will trigger a transition to the course page
//| During that transition we'll be using a scpecial type of service called a router resolved in order to fetch the data from the db that the target page needs

//* ------------------------------------------------------------------------------------------------------------------------------------------------
//* ------------------------------------------------------------------------------------------------------------------------------------------------
//* ------------------------------------------------------------------------------------------------------------------------------------------------
//* ------------------------------------------------------------------------------------------------------------------------------------------------

//!! Authentication

//| Allows us to manage the authentication of users without having to store pwd's in your db
//| Takes care of saving user credentials, sepeate of your main data in your db
//| Can validate user email & pw, the auth service will then emit a JWT proving the id of the user to be used in the app
//| YOu can add admin rights to the JWT & give access to only certain features
//| Authentication is also integrated with Firestore security rules

//| Firebase UI - convenient and ready to use way of adding authentication to your application

//!! Firebase Security Rules

//| firestore.rules file overview
//> Version
/// rules_version = '2';
//> specifies which rules we are targeting, service keyword followed by WHICH
//> It specifies that this is for a firestore db
/// service cloud.firestore {
//> Top level rule which specifies the path, this one is a top level rule
//> every firestore rule we write needs one, the {} area takes path variables
///   match /databases/{database}/documents {
//| The above is specific to EVERY rule we write, each rules will have the above mentioned
//> The ** wildcard matches every doc no matter what
//> So in this case we are allowing read, write requests to ALL documents in every case
///     match /{document=**} {
///       allow read, write: if true
///     }
///   }
/// }

//| As a rule of thumb, we don't want to target any collections with firestore security rules
//| We usually want to target documents
//| And therefor, if we target a specific document, the nested collections will not be auto accessible
//| The collections and subsequent documents within those will also need to be written rules for access to read/write
//> This is the perfect occasion to nest those rules within the already set rule for the outer collection to reduce duplication of paths
///   match /databases/{database}/documents/courses/{courseId} {
///     allow read;
///     match /lessons/{lessonId} {
///       allow read;
///     }
///   }

//| The ability to READ is an umbrella for multi options such as:
//: Get
//> gives us the permision to read a document, but ONLY one document. Meaning anyone can read any document on the courses collection
//: List
//> The ability to query the permission itself
//> Allow us to decide if we want a given request to be able to query the collection or not
//> We might want to allow individual documents to be read one at a time
//> but we might want to impose conditions on the ability to query the collection
//> The query could have a lot of data that we don't want anyone to issue a query for as this could cause performance issues and increase costs

//| The ability to WRITE is an umbrella for multi options such as:
//: Create | Update | Delete
//| And these can be given and inhibited independently

//! TROUBLESHOOTING NOTE!
//% For rules with the same path..
//% If there is 1 rule that allows access to an item
//% and 1000 rules that deny access to an item, THE ITEM IS ACCESSIBLE!
//% If a condition grants access to a given request, that request will go through
//% independent of where the condition is situated, order does not matter

//? JWT
//| The JWT we recieve is held in memory by the firebase SDK

//| Whenever we do a firestore request from our web client using AngularFire
//| the firebase SDK, which AngularFire uses under the hood, is going to grab the JWT which identifies the user
//| and will attach the JWT to the request sent to the firestore db server

//| So whenever a request for a read or write operation is made to the firestore db server
//| it will include a JWT that uniquely identifies the user

//| The JWT will include the users unique ID, and additional data known as a Custom Claim
//| This is an object which allows us to cutomly build including fields relevant to our platform
//: Custom Claim
/// {
///     "admin": true
/// }
//| There is a size limit, so we cannot add tons of data, but we can include useful data and privileges

//| In our firestore.rules file we have access to the REQUEST object which is either a request to read or write data
//| This REQUEST object gives us access to additional objects:
//: auth | path | resource | time
//$ https://firebase.google.com/docs/reference/rules

//* Functions
//| Functions in firestore rules are scope specific
//| Functions MUST return a Boolean

//* Firestore Schemas
//| Gives us more security and control over the format of our data being input
//| We can access the data we are trying to write via the resource.data
//> This is data NOT YET written to the db
/// request.resource.data;
//| If we needed access to data in the db, and for instance is about to be replaced with new data
/// resource.data;

//: request.data - Gives you the data already in the db before the request gets committed
//: request.resource.data -  Gives you the incoming data, the request is trying to update or insert into the db

//| This means that any property on the client side, even if set as optional, if we set it as a required field or set requirements on it on the firestore.rules file, it must be met as these are server side requirements.

//* Whitelist
//| The following ensures our data is not only accessible to authenticated users exclusively
//| but the data can also only be read by pre-defined users
//| This is called defining a WHITELIST where only these users can read the data from the db

//| We can include variables in paths within the built in utility functions with - $(<variable>)
//| The below is a util function to see that an doc/entry exists
/// exists(/databases/$(database)/documents/users/$(request.auth.uid))
//| We can also retrieve a property with the util function GET
/// get(/databases/$(database)/documents/users/$(request.auth.uid)).data.<property>

//!! RBAC - Role Based Access Control - Using

//| Given through Custom Claims object properties
//| This cannot be given through the Front-End, this has to be done via a Node process or through a cloud function
//|

//!! RBAC - Role Based Access Control - Setting

//| To Be Written ---------------------------------- See Firebase Cloud Functions

//!! Security Rules for Collection Group Queries

//| ** is a wildcard which targets anything that appears in its place
//| {<variable>=**} - the variable represents the full path
//| So if we need to access the current path, we can simply reference the variable name and this will represent that current path

//!! AngularFire Route Guards

//| AngularFireAuthGuard provides a prebuilt canActivate Router Guard using AngularFireAuth.
//| By default unauthenticated users are not permitted to navigate to protected routes
//$ https://github.com/angular/angularfire/blob/master/docs/auth/router-guards.md
//! View this in the app-routing module

//!! Serverless File Upload With Firebase Storage
//| AngularFireStorage - Service used
//| The upload action will be a change event

//| In the event of updating storage rules
/// firebase deploy --only storage

//!! -----------------------------------------------------------------
//!! FIREBASE CLOUD FUNCTIONS ----------------------------------------
//!! -----------------------------------------------------------------

//| Cloud functions are integral to our setup as it's the very base for our servers actions
//| The call to firebase authentication to create users with custom claims cannot be done in a
//| secure way from the front end, this is why we need this code on the server/BE
//| when we call the BE however, we do still need the credentials to do so, so we still need to do that in a secure way. This includes other actions such as payments
//| This also allows us to have functionality that runs when we make changes on the BE data
//| Such as, changing the timestamp of a documents field anytime the price field changes

//| These are small pieces of Node code that run in the BE in response to a particular event in the firebase eco-system
//| An example could be adding, updating or deleting a document, or even an http event etc.

//| A server is always up and running, able to process as soon as there is an event at any time.
//| THIS IS NOT THAT, Firebase cloud functions will not be running at all in the server.
//| The FCF (Firebase cloud function) mechanism will allow us to scale our BE all the way down to ZERO
//| If we are not making any requests, or triggering DB operations that trigger FCF's, uploading files or making requests to a FCF then NO SERVER AT ALL WILL BE RUNNING IN THE BE and you won't be charged

//| If after a while, an event happens that triggers a FCF, then the following happens:
//: A container will be prepared and bootstrapped
//: The FCF will be deployed inside that cloud container
//: And the function will be executed
//* This process will take some time to bootstrap, this is known as The Cold Start-up Time

//| An example of how this works:
//> You define a FCF which is a trigger that detects the creation of documents on a collection
//> If you update or delete the docs the trigger isn't executed, but if you add a doc, only then the trigger gets executed
//> If there were no instances of the FCF running and ready to process that event, then the FB runtime in the BE is going to spin up a new container
//> It will deploy the cloud function function in the container, and process the event using the cloud function.

//> IF 10-20 seconds later a new similar event occurs (a new doc is added), then that SAME INSTANCE of the cloud function, which is still up and running, will process the request.
//> So that second request will be processed MUCH faster and will continue to do so.

//> If this process continues and it registers that you are adding a large batch of documents at the same time, it will bootstrap ANOTHER container and help process those requests.

//> This continues additional containers will be created to meet the volume of requests allowing for sufficient scaling
//> Once the requests subside and drop, so will the container needs and they will drop off and close as need be
//> This means that once these close, if the requests pick up again, you will need to wait for the containers to create and bootstrap once again
//> Once we aren't using anymore, it will scale all the way back down to ZERO

//| FCF are implemented using the Google Cloud Platform
//| Select > Project Settings > Service Accounts

//| When we setup cloud functions in our project, we were supplied with an auto generated functions folder which contains all of our FCF's.
//| Here you will see an index file which is the entry point for our functions module, which is the following import
//| ANY EXPORT on this index.ts file will be considered a cloud function, so ensure that they are cloud functions
//| This provides us with all the properties and functiionality
/// import * as functions from "firebase-functions";

//| The output of the functions, after compilation, will be in the libs folder.
//| This is depployed to the cloud and that's how we deploy FCF's to firebase
//> In order to compile, we perform the following:
//> cd into functions folder
//> npm run build - This will trigger the TS compiler and compile our function into the lib folders index file
//! Always compile after changing your cloud functions

//| One of the most common use cases of FCF's is database triggers
//| This is a piece of logic that we want to trigger on the server side at the level of the firestore server in response to a db event
//| Be sure to name the functions well enough to recongnise them for their objectives in the cloud dashboard, as you won't have much information outside of the name of the function
//| A good practice is to name it in the following way:
//: on<1><2>
//> 1: What event the fn is responding to
//> 2: What the fn is doing in response to an event
//: EXAMPLE: on<LikeEvent><IncrementTotalLikes>

//! FIRESTORE TRIGGER EXAMPLE
//| We start by accessing functions
/// export const onAddCourseUpdatePromoCounter = functions
//| When we specify a function we can also specify what type of runtime requirements the function has
//| such as what is the max timeout for the function, and also how much memory the function can consume
//| If we don't provide this, the default params will be accepted.
//| But if we have heavy data processing and we want to configure this we use the runWith API which takes in a config object, where we can specify a few params such as:
//> timeout - 300s is the current max timeout for cloud functions
//> memory - how much memory the function consumes
///   .runWith({
///     timeoutSeconds: 300,
///     memory: "128MB",
///   })
//| We want a db trigger, so we select the firestore object
//| And then we specify the event that we want to detect
//| In this instance we want to detect a document creation, so we access the document API and provide the path to the document
//| We then have the events we want to detect
//> on<update | create | delete> to detect specific
//> Or on<write> to detect ALL
//| These take a function as an argument, and that function takes 2 arguments
//> (dataSnapshot, context)
//| DataSnapshot is a snapshot of the current data in the document, and context contains info such as the path variables of the doc we are creating on the db
///   .firestore.document("courses/{courseId}")
///   .onCreate(async (docSnapshot, context) => {
//| This function is going to returns a promise, so we need to treat the function as a promise (async await)
///     await functions.logger.debug(
///       `Running add course trigger for courseId - context = ${context.params.courseId}`,
///       `Doc Snapshot = ${docSnapshot.id}`
///     );
///   });
//! ^^^^^^^^^^^^^^^^



//!! Create an HTTP Endpoint with Firebase Cloud Functions

//| Two things:
//: First: we add a new user in our users collection
//: Second: Make a call to firebase authentication and add the user with its credentials, user and password, directly to the firebase authentication database. Which is a completely seperate database from out applicaitons database 
//| The firebase authentication database is managed ONLY by the firebase authentication service
//| This operation of adding a new user in a secure way and setting the custom claims, can ONLY be safely done from a backend 
//| Same as with a payment, as payments need a secret key and this cannot be exposed in our front end code. 
//! For these applications we NEED a REST endpoint, and we use HTTP endpoints for this




//!! Calling a firebase cloud function REST endpoint 

//| This will be shown in the create-user functionality