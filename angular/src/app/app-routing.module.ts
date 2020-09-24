import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateEditorComponent } from './template-editor/template-editor.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { TestComponent } from './test/test.component';
import { LandingPagaComponent } from './landing-paga/landing-paga.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


const routes: Routes = [
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'template', component: TemplateEditorComponent },
  { path: 'student', component: StudentDashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'test', component: TestComponent },
  { path: '', component: LandingPagaComponent },
  

  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
