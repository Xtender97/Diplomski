import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CodeRunnerService {

  apiUrl = environment.apiUrl + '/template';

  constructor(
    private http: HttpClient
  ) { }

  runCode(code: string) {
    return this.http.post(this.apiUrl + `/runCode`, { code: code });
  }
  analyzeCode(code: string) {
    return this.http.post(this.apiUrl + `/analyzeCode`, { code: code });
  }

}
