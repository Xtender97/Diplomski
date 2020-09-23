import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = new User('','','','','');
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signUp(){
    console.log(this.user);
    this.authService.registerUser(this.user).subscribe( data =>{
      this.router.navigate(['/login']);
    },
    err => {
      console.log(err);
      this.error = err.error; 
    })
  }

}
