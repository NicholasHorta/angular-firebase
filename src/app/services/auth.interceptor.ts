import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: AuthService) {}

  //! The interceptor is lazy
  //| So in order to have our TOKEN available from our service
  //| We should instantiate it earlier, somewhere else where the app is bootstrapped
  //| We can do this in the App Component
  //| all we need to do is have the service call and run there, see AppComponent constructor

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    //| Using the auth token service, which retrieves the current JWT
    //| We can check for the presence of the JWT
    if (this.token.authJwtToken) {
      console.log(`%c C4 LOG 3RD`, `background: black; color: red;`);
      //| if it is present, we want to clone the HTTP request
      //| Add the token as a header
      //| And send that modified HTTP request as the output of our interceptor
      const cloned = request.clone({
        headers: request.headers.set("Authorization", this.token.authJwtToken),
      });
      next
        .handle(cloned)
        .subscribe((i) =>
          console.log(
            `%c C4 LOG MUTATED`,
            `background: yellow; color: purple;`,
            i
          )
        );
      return next.handle(cloned);
    } else {
      next
        .handle(request)
        .subscribe((i) =>
          console.log(
            `%c C4 LOG WITHOUT MUTATION`,
            `background: yellow; color: purple;`,
            i
          )
        );
      return next.handle(request);
    }
  }
}
