import { auth, db } from "./init";
const express = require("express");
import * as functions from "firebase-functions";
import { getUserCredentialsMiddleware } from "./auth.middleware";
const bodyParser = require("body-parser");
const cors = require("cors");

export const createUserApp = express();

//| This allows our requests to have the body of the content converted to json
createUserApp.use(bodyParser.json());

//| We need to prepare our endpoint ready for CORS (Cross domain requests)
//| because our domain we will be using to using the http request will be different to where this function is running (In the cloud)
//| In order for the browser to allow this type of CORS, we need to have our backend tell the browser that it's okay to send CORS
//| So only if our endpoint allows the browser for CORS to go through, will the browser allow the request to be made, otherwise ERR!
//| We can allow this by using the CORS middleware, we set the origin property to true
createUserApp.use(cors({ origin: true }));

//| Our middleware
createUserApp.use(getUserCredentialsMiddleware);

createUserApp.post("/", async (req, res) => {

  functions.logger.debug("Calling create user function");

  try {
    //! We can have our middleware perform the check prior to the rest of this function running
    //| We are going to start by checking if the user is correctly authenticated by accessing the UID in the property of the request.
    //| Remember, this is the property that we have just populated here using our middleware.
    //| So if the user has a unique identifier that is valid, that came from a valid correctly signed JSON web token && if the user is a known administrator
    //. ONLY THEN DO WE WANT THE CODE BELOW TO BE EXECUTED

    if (!(req["uid"] && req["admin"])) {
      const message = `Denied access to user creation service.`;
      functions.logger.debug(message);
      res.status(403).json({ message });
      return;
    }

    functions.logger.debug("C4 LOG 5TH & FINAL >>>>>>>");
    const email = req.body.email;
    const password = req.body.password;
    const admin = req.body.admin;

    //| We can create the user using the authentication service
    //| Our auth service allows us to perform ops related to firebase authentication from a secure env
    //| It is NOT available on the FE, it's only available on the BE.
    //| Therefore we will be running all calls with FULL authentication
    //| So we create the user
    const user = await auth.createUser({
      email,
      password,
    });

    //| Once this is created, we can setup the custom claims.
    //| In order to set the custom claims of a user, we can use the setCustomUserClaims API from FB Authentication
    //: 2 args are needed
    //: First: Unique user ID in FB auth
    //: Second: Custom claims we want to set for this user
    await auth.setCustomUserClaims(user.uid, { admin });

    //| Finally, we just need to add this user to our whitelist of trusted users
    //| If we don't do this, the user will stil not be able to access our app due to how we've built our security rules
    //: We access our db
    //: Access the users collection
    //: SET a new document within it
    //: We could add data but we simply need the user to exist
    db.doc(`users/${user.uid}`).set({});

    res.status(200).json({
      message: "User created successfully",
    });

  } catch (err) {
    functions.logger.debug("Could not create user", err);
    res.status(500).json({
      message: "could not create user",
    });
  }
});



