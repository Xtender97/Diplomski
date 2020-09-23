import { Component, OnInit, Input } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() requiredMessage:string = 'This field is required!';
  @Input() emailMessage:string = 'Email adress is invalid! Please enter valid adress!';
  @Input() patternMessage:string = 'Unallowed format!'
  @Input() parent:NgForm; 



  constructor() { }

  ngOnInit(): void {

  }

}
