import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthData } from '../models/auth-data';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  authenticated: boolean = false;//pazi na ovo
  sub: Subscription;
  user: AuthData = new AuthData(null, null, null, null);

  isDispatcher: boolean;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authenticated = this.auth.getInitialStatus();
    this.user = this.auth.getUser();
    if (!this.user) {
      this.user = new AuthData(null, null, null, null);
    }

    this.sub = this.auth.getStatus().subscribe(user => {
      if (user) {
        this.authenticated = true;
        this.user = user;

      }
      else {
        console.log("izlogovan");
        this.authenticated = false;
        this.user = new AuthData(null, null, null, null);

      }
    },
      err => {
        this.authenticated = false;
      });


  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  logout() {

    this.auth.loguot();

  }
}


