import { Routes } from '@angular/router';
import { InicioComponent } from './features/inicio/inicio.component';
import { QuizComponent } from './features/quiz/quiz.component';
import { ResultadoComponent } from './features/resultado/resultado.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'resultado', component: ResultadoComponent },
  { path: '**', redirectTo: '' }
];
