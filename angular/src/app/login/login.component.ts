import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthData } from '../models/auth-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error:string = null;
  username:string = null;
  password:string = null;
  constructor(
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  login(){
    console.log(this.username);
    console.log(this.password);
    this.authService.loginUser(this.username, this.password).subscribe(
      response => {
        const expirationDate = new Date(
          Date.now() + response.expiresIn * 1000
        );
        console.log(expirationDate);
        // check if u got the token from the back end
        let authData = new AuthData(response.userID, response.type, expirationDate, response.token);
        this.authService.setUserLoggedIn(authData);
        this.authService.saveAuthData(authData);
        var type = authData.type;
        this.router.navigate([type]);

      }
      , err => {
        console.log(err);
        this.error = err.error;
      }
    )
  }

}
