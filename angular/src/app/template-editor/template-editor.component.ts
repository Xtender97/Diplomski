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
  detections: { useOfArgs: boolean, useOfInput: boolean } = { useOfArgs: false, useOfInput: false };
  variables: any[] = [];
  args: string;
  stdin: string;
  text: string;
  error: string[] = [];
  analyzed:boolean = false;

  constructor(
    private codeRunner: CodeRunnerService
  ) { }

  ngOnInit(): void {
    this.code = '';
    this.stdout = '';
    this.stderr = '';
    this.stdin = '';
    this.args = '';
    this.detections = { useOfArgs: false, useOfInput: false };
    this.variables = [];

  }

  onInit(editor) {
    this.editor = editor;

  }

  onPaste() {
    this.formatCode();
  }

  formatCode() {
    let lines = this.code.split('\n');
    let newLines = [];
    let depth: number = 0;
    lines.forEach(line => {
      let regex1 = new RegExp(`}`, 'g');
      let result1 = line.match(regex1);

      if (result1) {
        depth -= line.match(regex1).length;
      }
      let newLine = line.trim();
      for (let i = depth; i > 0; i--) {
        newLine = "    " + newLine;
      }
      newLines.push(newLine);
      let regex = new RegExp(`{`, 'g');
      let result = line.match(regex);
      if (result) {
        depth += result.length;
      }

    })
    this.code = newLines.join('\n');

  }

  runCode() {
    this.stderr = '';
    this.stdout = '';
    if (!this.code) {
      this.error.push('Please insert template code!');
      return;
    }
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

  analyzeCode() {
    if (!this.code) {
      this.error.push('Please insert template code!');
      return;
    }
    this.variables = [];
    this.detections = { useOfArgs: false, useOfInput: false };
    this.codeRunner.analyzeCode(this.code).subscribe(
      (data: { variables: any[], useOfArgs: boolean, useOfInput: boolean }) => {
        console.log(data);
        data.variables.forEach(variable => {
          this.variables.push({ name: variable.name, value: variable.values, raw: variable.raw, class: variable.class, type: variable.type});
        })
        this.detections = {
          useOfInput: data.useOfInput,
          useOfArgs: data.useOfArgs
        }
        this.analyzed = true;

      },
      err => {
        console.log(err);
        this.error.push(err.error);

      }
    );
  }

  saveTemplate() {
    this.error = [];
    if (!this.text) {
      this.error.push('Please insert template text!');
    }
    if (!this.code) {
      this.error.push('Please insert template code!');

    }
    if(!this.analyzed){
      this.error.push('Please analyze code before saving!');
    }
    this.formatCode();

    let template = {
      code: this.code,
      args: this.args,
      stdin: this.stdin,
      vars: this.variables,
      text: this.text
    }

    if (this.error.length > 0) {
      return;
    }
    this.codeRunner.saveTemplate(template).subscribe((data => {
      console.log(data);
      this.error = [];
      this.ngOnInit();

    }))
  }

  deleteError(err) {
    this.error = this.error.filter(item => item != err);
    console.log('deletederrot');
  }

}
