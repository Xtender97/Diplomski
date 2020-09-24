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

  data: any[] = [];
  pageNumber: number = 0;
  timer: number;
  minutes: string;
  seconds: string;
  finished: boolean = false;
  points: number = 0;

  ngOnInit(): void {
    this.data = [];
    this.pageNumber = 0;
    this.finished = false;
    this.points = 0;
    this.testService.getTest().subscribe((data: { pitalice: any[] }) => {
      console.log(data);
      this.data = data.pitalice;
      this.startTimer();
    },
      err => {
        console.log(err);
      })
  }

  next() {
    if (this.pageNumber < this.data.length - 1) {
      this.pageNumber++;
    }

  }

  finish() {

    this.data.forEach(pitalica => {
      if (pitalica.checkAnswer) {
        if (pitalica.correctAnwser.trim() == pitalica.checkAnswer) {
          this.points++;
          pitalica.correct = true;
        }
      }
    })
    this.finished = true;


  }
  previous() {
    if (this.pageNumber > 0) {
      this.pageNumber--;
    }
  }

  startTimer() {
    this.timer = 25*60; //25 min
    this.minutes = '25';
    this.seconds = '00';
    setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.minutes = ((this.timer - (this.timer % 60)) / 60) < 10 ? '0' + ((this.timer - (this.timer % 60)) / 60).toString() : ((this.timer - (this.timer % 60)) / 60).toString();
        this.seconds = (this.timer % 60) < 10 ? '0' + (this.timer % 60).toString() : (this.timer % 60).toString();
      }
      else {
        this.finish();
      }
    }, 1000)
  }
  goTo(index) {
    this.pageNumber = index;
  }

  checkAnswer(pitalica, anwser) {
    pitalica.checkAnswer = anwser;

  }
  restart(){
    this.ngOnInit();
  }
}
