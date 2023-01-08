//!! DATABASE CONNECTION 

//| We implement the required packages 
const admin = require('firebase-admin');

//| Initialize a valid db connection, no args are needed as when we don't provide args
//| the default is used which is the credentials which exists in our firebase local environment 
//| Whenever we initialize our project, we logged in by using the 
//> firebase login 
//| This gives us the right to read, modify anything in the db
//| so by just initializeApp() we get access to the default service account which gives us all access across the board
//: TLDR: The main firebase account is being used to initialize the app, so you have all permissions automatically
admin.initializeApp();

//| This is now a cloud function due to us exporting it
//| using the DB const we will be able to query the db and write data to it, including transactions
export const db = admin.firestore()

//| We will also need access to authentication in order to be able to create our user
export const auth = admin.auth() 
