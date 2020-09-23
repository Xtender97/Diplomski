import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateEditorComponent } from './template-editor/template-editor.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { TestComponent } from './test/test.component';


const routes: Routes = [
  { path: 'admin', component: TemplateEditorComponent },
  { path: 'student', component: StudentDashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'test', component: TestComponent },
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
