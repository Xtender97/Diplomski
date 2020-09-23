import { Component, OnInit } from '@angular/core';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(
    private testService: TestService
  ) { }

  data:any[] = [];

  ngOnInit(): void {
    this.testService.getTest().subscribe((data: {pitalice: any[]})=> {
      console.log(data);
      this.data = data.pitalice;
      // this.data[0].anwsers = [this.data[0].correctAnwser,this.data[0].correctAnwser,this.data[0].correctAnwser];

    },
    err => {
      console.log(err);
    })
  }

  next(){

  }

}
