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
  variables:any[] = [];
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
    this.codeRunner.runCode(this.code).subscribe(
      (data: any) => {
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
      }
    )
  }

  analyzeCode(){
    this.codeRunner.analyzeCode(this.code).subscribe(
      (data: any[])=> {
        console.log(data);
        data.forEach( variable => {
          this.variables.push({name:variable.name, value:variable.values});
        })
      },
      err => {
        console.log(err);
      }
    );
  }

}
