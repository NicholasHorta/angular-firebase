import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { Course } from "../model/course";
import { CoursesService } from "./courses.service";

@Injectable({
  providedIn: "root",
})
//| Resolve<resulting-data-being-fetched>
export class CourseResolver implements Resolve<Course> {
  constructor(private coursesService: CoursesService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Course> {
    //| We can access the properties of route.paramMap using the key/id we provide as the placeholder in the url
    /// {
    ///     path: 'courses/:courseUrl',
    ///     component: CourseComponent
    /// }
    const courseUrl = route.paramMap.get("courseUrl");

    return this.coursesService.findCourseByUrl(courseUrl)


    //! We must still, by using this method, add this to our routing module by adding the resolver property
    //! Be sure to checkout the routing module which relates to this component
  }
}
