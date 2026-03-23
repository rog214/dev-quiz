import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IaService } from '../../core/services/ia.service';
import { ConfiguracoesQuizService } from '../../core/services/configuracoes-quiz.service';
import { Questao, ResultadoQuiz } from '../../core/models/quiz.model';
import { CarregandoComponent } from '../carregando/carregando.component';
import { MarkdownPipe } from '../../shared/pipes/markdown.pipe';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, CarregandoComponent, MarkdownPipe],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  private iaService = inject(IaService);
  private router = inject(Router);
  private configService = inject(ConfiguracoesQuizService);

  questoes: Questao[] | null = null;
  erro: string | null = null;
  questaoAtualIndex = 0;
  respostasUsuario: number[] = [];
  opcaoSelecionada: number | null = null;
  mostrarAnimacao = false;

  ngOnInit() {
    const config = this.configService.obterConfigAtual();
    if (!config.chaveApi) {
      this.router.navigate(['/']);
      return;
    }

    this.iaService.gerarQuiz().subscribe({
      next: (questoesGeradas) => {
        this.questoes = questoesGeradas;
        this.mostrarAnimacao = true;
      },
      error: (err) => {
        console.error(err);
        this.erro = 'Ocorreu um erro ao gerar o teste. Verifique sua chave da API e tente novamente.';
      }
    });
  }

  get questaoAtual(): Questao | null {
    if (!this.questoes) return null;
    return this.questoes[this.questaoAtualIndex];
  }

  get progresso(): number {
    if (!this.questoes) return 0;
    return ((this.questaoAtualIndex + 1) / this.questoes.length) * 100;
  }

  selecionarOpcao(index: number) {
    this.opcaoSelecionada = index;
  }

  limparMarkdown(texto: string): string {
    if (!texto) return '';
    return texto.replace(/```[a-zA-Z]*\n?|\n?```/g, '').replace(/`/g, '').replace(/\\n/g, '\n').trim();
  }

  proximaQuestao() {
    if (this.opcaoSelecionada === null || !this.questoes) return;

    this.respostasUsuario.push(this.opcaoSelecionada);
    this.opcaoSelecionada = null;

    if (this.questaoAtualIndex < this.questoes.length - 1) {
      this.mostrarAnimacao = false;
      setTimeout(() => {
        this.questaoAtualIndex++;
        this.mostrarAnimacao = true;
      }, 300);
    } else {
      this.finalizarQuiz();
    }
  }

  finalizarQuiz() {
    if (!this.questoes) return;

    let pontuacao = 0;
    this.questoes.forEach((q, i) => {
      if (q.indiceCorreto === this.respostasUsuario[i]) {
        pontuacao++;
      }
    });

    const resultado: ResultadoQuiz = {
      pontuacao,
      questoes: this.questoes,
      respostasUsuario: this.respostasUsuario
    };

    this.router.navigate(['/resultado'], { state: { resultado } });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
