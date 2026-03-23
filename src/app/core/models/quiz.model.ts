import { Dificuldade } from "../enums/dificuldade.enum";
import { Linguagem } from "../enums/linguagem.enum";

export interface ConfiguracoesQuiz {
  chaveApi: string;
  provedor: 'gemini' | 'openai';
  linguagem: Linguagem;
  dificuldade: Dificuldade;
  quantidadeQuestoes: number;
}

export interface Questao {
  pergunta: string;
  opcoes: string[];
  indiceCorreto: number;
  explicacao: string;
}

export interface ResultadoQuiz {
  pontuacao: number;
  questoes: Questao[];
  respostasUsuario: number[];
}
