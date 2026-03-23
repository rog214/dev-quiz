import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfiguracoesQuizService } from '../../core/services/configuracoes-quiz.service';
import { CommonModule } from '@angular/common';
import { Linguagem } from '../../core/enums/linguagem.enum';
import { Dificuldade } from '../../core/enums/dificuldade.enum';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private configService = inject(ConfiguracoesQuizService);

  form: FormGroup;

  linguagens = Object.values(Linguagem);
  dificuldades = Object.values(Dificuldade);
  quantidades = [5, 10, 15, 20];

  constructor() {
    const configAtual = this.configService.obterConfigAtual();
    this.form = this.fb.group({
      chaveApi: [configAtual.chaveApi, Validators.required],
      provedor: [configAtual.provedor, Validators.required],
      linguagem: [configAtual.linguagem, Validators.required],
      dificuldade: [configAtual.dificuldade, Validators.required],
      quantidadeQuestoes: [configAtual.quantidadeQuestoes, Validators.required],
    });
  }

  iniciarQuiz() {
    if (this.form.valid) {
      this.configService.atualizarConfig(this.form.value);
      this.router.navigate(['/quiz']);
    }
  }
}
