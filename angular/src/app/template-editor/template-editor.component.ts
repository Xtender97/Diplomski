import { Component, OnInit } from '@angular/core';
import { CodeRunnerService } from '../services/code-runner.service';
import { stdout } from 'process';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.css']
})
export class TemplateEditorComponent implements OnInit {

  editorOptions = { theme: 'vs', language: 'c' };
  code: string = '';
  editor: any;
  stdout: string;
  stderr: string;
  detections: {useOfArgs : boolean, useOfInput: boolean} = {useOfArgs: false, useOfInput: false};
  variables:any[] = [];
  args:string;
  stdin:string;
  text: string;
  error: string [] = [];

  constructor(
    private codeRunner: CodeRunnerService
  ) { }

  ngOnInit(): void {
  }

  onInit(editor) {
    this.editor = editor;

  }

  onPaste() {
    let regex = new RegExp(`^\\s+`, 'mg');
    // let regex1 = new RegExp(`;`,'g');
    // this.code = this.code.replace(regex1, `;\n`);
    this.code = this.code.replace(regex, `\t`);
  }

  runCode() {
    this.stderr = '';
    this.stdout = '';
    this.codeRunner.runCode(this.code, this.args, this.stdin).subscribe(
      (data: any) => {
        this.error = [];
        console.log(data);
        if (data.stdout) {
          this.stdout = data.stdout;
        }
        if (data.stderr) {
          this.stderr = data.stderr;
        }
      },
      (err) => {
        console.log(err);
        this.error.push(err.error);
      }
    )
  }

  analyzeCode(){
    this.codeRunner.analyzeCode(this.code).subscribe(
      (data: {variables: any[], useOfArgs: boolean, useOfInput: boolean})=> {
        console.log(data);
        data.variables.forEach( variable => {
          this.variables.push({name:variable.name, value:variable.values});
        })
        this.detections = {
          useOfInput :data.useOfInput,
          useOfArgs : data.useOfArgs
        }

      },
      err => {
        console.log(err);
        this.error.push(err.error);

      }
    );
  }
  
  saveTemplate(){
    this.error = [];
    if(!this.text){
      this.error.push('Please insert template text!');
    }
    if(!this.code){
      this.error.push('Please insert template code!');

    }
    let template = {
      code : this.code, 
      args :this.args,
      stdin : this.stdin,
      vars : this.variables,
      text : this.text
    }

    if(this.error.length> 0){
      return;
    }
    this.codeRunner.saveTemplate(template).subscribe((data => {
      console.log(data);
      this.error = [];
    }))
  }

  deleteError(err){
    this.error = this.error.filter(item => item != err);
    console.log('deletederrot');
  }

}
