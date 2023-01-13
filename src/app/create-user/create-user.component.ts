import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { environment } from "src/environments/environment";

@Component({
  selector: "create-user",
  templateUrl: "create-user.component.html",
  styleUrls: ["create-user.component.css"],
})
export class CreateUserComponent {
  form = this.fb.group({
    email: ["", [Validators.email, Validators.required]],
    password: ["", [Validators.required, Validators.minLength(5)]],
    admin: [false],
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  onCreateUser() {
    const user = this.form.value;

    //| We're using the HTTP service, and accessing the specific request on them which is an Observable
    //| We can passing into it
    //: post<T>(url: string, body: any, options: { headers?: HttpHeaders | { [header: string]: string | string[]; }
    //! We still need to ensure that the URL is not able to be accessed by anyone, only authenticated users
    console.log(`%c C4 LOG 1ST`, `background: black; color: red;`)
    this.http
      .post(environment.api.createUser, {
        email: user.email,
        password: user.password,
        admin: user.admin,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          alert("Unable to create user");
          return throwError(err);
        })
      )
      .subscribe(() => {
        alert("User created successfully");
        this.form.reset();
      });
      //| We need to now make sure that we can recieve and handle this call in our endpoint - functions/src/create-user.ts
      /*
        : Process:
        | We create the call within our components TS function
        | Which access our provided URL via our API property in our ENV file
        | The URL is the FCF which is uploaded from our functions folder 
      */

    console.log(user);
  }
}
