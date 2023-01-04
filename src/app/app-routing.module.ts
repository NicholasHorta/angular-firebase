import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {CourseComponent} from './course/course.component';
import {LoginComponent} from './login/login.component';
import {CreateCourseComponent} from './create-course/create-course.component';
import {AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {CreateUserComponent} from './create-user/create-user.component';
import { CourseResolver } from './services/course.resolver';

//| The following are function references which we provide the built in functions the AngularFireAuthGuard route guard gives us
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const adminOnly = () => hasCustomClaim("admin");

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: 'create-course',
    component: CreateCourseComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: adminOnly
    }
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: adminOnly
    }
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'courses/:courseUrl',
    component: CourseComponent,
    resolve: {
      //| The course property will be resolved by the CourseResolver
      //| meaning when there is a routing transition, we need to find a course in order to make it available to the target component
      //| And the process of fetching that data from somewhere in the db will be done by the course resolver 
      course: CourseResolver
    },
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
