import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import * as firebaseui from 'firebaseui';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import firebase from 'firebase/app';
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {


    ui: firebaseui.auth.AuthUI

    constructor(private afAuth: AngularFireAuth, private router: Router) {

    }

    ngOnInit() {
        //| Firebase UI internally uses the the SDK (Software Development Kit) 
        //| We need to first wait for the firebase SDK to be fully initialized before initializing firebase UI 
        //| In order to do that we need to use the AngularFire Auth Service 
        //| This allows us to interact with all the authentication related functionality of the firebase SDK that angular fire uses underneath 
        //| The below promise will deliver an <app> object with all the properties of the running firebase SDK application, meaning it's then fully initialized 
        this.afAuth.app.then(app => {
            //| NOW we can initialize firebase UI
            const uiConfig = {
                //> config sign in options
                signInOptions: [
                    GoogleAuthProvider.PROVIDER_ID,
                    EmailAuthProvider.PROVIDER_ID,
                ],
                //> When a sign in is successful
                //! Because these are callbacks with their own THIS reference
                //! We have to bind the new THIS reference from the callback to our local function call
                callbacks: {
                    signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this)
                }
            }
            //| Setup the constructor function and pass in the <app> property we recieved back from the promise and call the auth() method
            //| This will pass in to firebase ui the authentication service from the firebase SDK that firebase needs internally to work
            this.ui = new firebaseui.auth.AuthUI(app.auth());
            //| After calling the constructor function, we can now bootstrap the firebase ui library 
            //| By calling the start method, we need to pass in the ID reference from our html container where we want the UI to be loaded - # ref to ID
            //| The second arg is the UI config that we have defined above 
            this.ui.start("#firebaseui-auth-container", uiConfig as any)
            this.ui.disableAutoSignIn();
        })
    }

    ngOnDestroy() {
        //| Be sure to destroy the UI instance whenever we leave the component
        this.ui.delete();
    }

    onLoginSuccessful(result){
        console.log(`%c C4 LOG RESULT`, `background: red; color: blue;`, result)
        this.router.navigateByUrl('/courses');
    }
}


