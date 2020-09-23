import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { AuthData } from '../models/auth-data';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl + '/auth';
  user: AuthData = null;
  userLoggedIn: boolean = false;
  userLoggedIn$ = new Subject<AuthData>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getStatus(): Observable<AuthData> {
    return this.userLoggedIn$.asObservable();
  }

  setUserLoggedIn(authData: AuthData) {
    if (authData) {
      this.userLoggedIn = true;
      this.userLoggedIn$.next(authData);
      this.user = authData;
    }
  }

   getUser(): AuthData {
    if (this.user) {
      return this.user;
    }
    else {
      return null;
    }
  }

  getUserType() {
    if (this.user) {
      return this.user.type;
    }
    else {
      return null;
    }
  }

  getInitialStatus(): boolean { //test if still works when token expires

    console.log('Initializing login information');
    const user: AuthData = this.getAuthData();
    if (!user.token || !user.id || !user.expirationDate || !user.type) {
      return false;
    }
    const notExpired = user.expirationDate.getTime() - Date.now() > 0;
    if (notExpired) {
      console.log('not expired');
      this.userLoggedIn = true;
      this.user = user;
      return true;
    }
    else {
      this.loguot();
      return false;
    }

  }

  loguot() {
    this.clearAuthData();
    this.userLoggedIn = false;
    this.userLoggedIn$.next(null);
    this.user = null;
    this.router.navigate([""]);
  }


  registerUser(user: User) {
    return this.http.post(this.apiUrl + '/register', user);
  }

  loginUser(username: string, password: string) {
    let credentials = {
      username: username,
      password: password
    }
    return this.http.post<{ message: string, token: string, expiresIn: number, userID: number, type: string }>(this.apiUrl + '/login', credentials);
  }


  saveAuthData(user: AuthData) {
    localStorage.setItem("token", user.token);
    localStorage.setItem("expiration", user.expirationDate.toISOString());
    localStorage.setItem("userId", user.id.toString());
    localStorage.setItem("type", user.type);
  }

  clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("type");
  }
  getAuthData(): AuthData {
    return new AuthData(
      +localStorage.getItem("userId"),
      localStorage.getItem("type"),
      new Date(localStorage.getItem("expiration")),
      localStorage.getItem("token"))
  }

}
