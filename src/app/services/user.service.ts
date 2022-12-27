import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserService {
  isLoggedIn$:  Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  pictureUrl$: Observable<string>;
  //| Within a service we have the constructor which acts as an ngOnInit
  constructor(private afAuth: AngularFireAuth) {
    //| If we want to get access to the current logged in users JWT, we use the following
    //> You can view the content of the JWT on the JWT site
    this.afAuth.idToken.pipe(tap(i => console.log(i, 'idToken JWT'))).subscribe()
    //| AuthState will give us all the information about the user
    this.afAuth.authState.pipe(tap(i => console.log(i, 'authState'))).subscribe()

    this.isLoggedIn$ = afAuth.authState.pipe(tap(i => console.log(i, 'Logged In')), map((user) => Boolean(user)))
    this.isLoggedOut$ = this.isLoggedIn$.pipe(tap(i => console.log(!i, 'Logged Out')), map((loggedIn) => !loggedIn))
    this.pictureUrl$ = afAuth.authState.pipe(tap(i => console.log(i?.photoURL, 'Pic URL')), map(user => user ? user.photoURL : null))
  }

  logout(){
    this.afAuth.signOut();
  }
}
