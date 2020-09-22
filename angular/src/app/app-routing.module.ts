import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateEditorComponent } from './template-editor/template-editor.component';


const routes: Routes = [
  { path: '', component: TemplateEditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
