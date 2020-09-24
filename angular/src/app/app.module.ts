import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateEditorComponent } from './template-editor/template-editor.component';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MessageComponent} from './message/message.component'
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { TestComponent } from './test/test.component';
import { LandingPagaComponent } from './landing-paga/landing-paga.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateEditorComponent,
    LoginComponent,
    RegisterComponent,
    MessageComponent,
    NavbarComponent,
    StudentDashboardComponent,
    TestComponent,
    LandingPagaComponent,
    AdminDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    HttpClientModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
