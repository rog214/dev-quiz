import { Injectable, signal } from '@angular/core';
import { ConfiguracoesQuiz } from '../models/quiz.model';
import { Dificuldade } from '../enums/dificuldade.enum';
import { Linguagem } from '../enums/linguagem.enum';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesQuizService {
  private configSignal = signal<ConfiguracoesQuiz>({
    chaveApi: '',
    provedor: 'gemini',
    linguagem: Linguagem.JavaScript,
    dificuldade: Dificuldade.Iniciante,
    quantidadeQuestoes: 5
  });

  get config() {
    return this.configSignal.asReadonly();
  }

  atualizarConfig(novaConfig: Partial<ConfiguracoesQuiz>) {
    this.configSignal.update(config => ({ ...config, ...novaConfig }));
  }

  obterConfigAtual(): ConfiguracoesQuiz {
    return this.configSignal();
  }
}
