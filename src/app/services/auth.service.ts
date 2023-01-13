import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {
    console.log(`%c C4 LOG 2ND`, `background: black; color: red;`)
    afAuth.idToken.subscribe((jwt) => {
      console.log(`%c C4 LOG `, `background: salmon; color: black;`, jwt)
      this.authJwtToken = jwt;
    });
  }

  authJwtToken: string;
}
