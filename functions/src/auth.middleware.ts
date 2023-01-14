import * as functions from "firebase-functions";
import { auth } from "./init";

//| I order to verify the credentials of who is calling the servive, we'll be using middleware
//| We'll be doing this in order to extract from the request, the Authorization header
//: Mainly, the identity of the user & their roles

//! The specific function of this middleware is only to extract the credentials if they exist.
//| So this means that if no credentials exist, which is the case here in this else block,
//| then we want to let the request go through the middleware chain.
export function getUserCredentialsMiddleware(req, res, next) {
  //| Here we need to extract the user credentials from the request
  //| We can extract it from req.headers.authorization which contains the JWT
  const jwt = req.headers.authorization;
    functions.logger.debug('C4 LOG 4TH >>>>>>>')
    functions.logger.debug(jwt, 'JWT')
  //| first, we want to be sure the JWT is actually present
  if (jwt) {
    //| If there are credentials, we are going to grab them from the authorization header
    //| and attach them back to the request under the UID and ADMIN props

    //| we can validate the signature of the Jasen Web token using the authentication service that we
    //| The function is going to validate the signature of the JSON Web token.
    //| And if the signature is valid, the function is going to give us back the JSON Web token payload.
    //| This call to verify the token is going to give us back a promise.
    //| If the promise is successfully evaluated and if there is an effort, let's start first with the Eric
    auth
      .verifyIdToken(jwt)
      .then((jwtPayload) => {
        //| Using this payload, we can grab the unique identifier of the user using the UID property.
        //| Let's then take the unique identifier and let's save it directly on the request object under the UID the property as well.
        //| So now any middleware or endpoint that receives the request further down the middleware chain is going to have access to the unique identifier of the user
        req["uid"] = jwtPayload.uid;

        //| Also from the JSON Web token payload, we can grab the information if the user is an admin or not.
        //| Remember, this information is guaranteed to be correct because it was extracted from the body of a valid JSON Web token.
        //! So the only way that somebody could grab hold of a Jason Web token saying that they are an administrator
        //! is by signing into the application with a valid email or password.
        req["admin"] = jwtPayload.admin;

        functions.logger.debug(
          `Credentials uid=${jwtPayload.uid}, admin=${jwtPayload.admin}`
        );

        next();
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  } else {
    //! We'll just call next and allow the endpoint to handle the rejection of it as this is the responsibility of the endpoint
    next();
  }
}
