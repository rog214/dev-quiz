import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ResultadoQuiz } from '../../core/models/quiz.model';
import { MarkdownPipe } from '../../shared/pipes/markdown.pipe';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule, MarkdownPipe],
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss']
})
export class ResultadoComponent implements OnInit {
  private router = inject(Router);

  resultado: ResultadoQuiz | null = null;

  ngOnInit() {
    const nav = this.router.getCurrentNavigation() || { extras: { state: history.state } };
    this.resultado = nav.extras.state?.['resultado'];

    if (!this.resultado) {
      this.router.navigate(['/']);
    }
  }

  limparMarkdown(texto: string): string {
    if (!texto) return '';
    return texto.replace(/```[a-zA-Z]*\n?|\n?```/g, '').replace(/`/g, '').replace(/\\n/g, '\n').trim();
  }

  get percentualAcertos(): number {
    if (!this.resultado || this.resultado.questoes.length === 0) return 0;
    return Math.round((this.resultado.pontuacao / this.resultado.questoes.length) * 100);
  }

  novoTeste() {
    this.router.navigate(['/']);
  }
}
