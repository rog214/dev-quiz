import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfiguracoesQuizService } from './configuracoes-quiz.service';
import { Questao } from '../models/quiz.model';
import { Observable, map } from 'rxjs';
import { Dificuldade } from '../enums/dificuldade.enum';
import { construirPromptQuiz } from '../constants/prompts.constants';

@Injectable({
  providedIn: 'root',
})
export class IaService {
  private http = inject(HttpClient);
  private configService = inject(ConfiguracoesQuizService);

  gerarQuiz(): Observable<Questao[]> {
    const config = this.configService.obterConfigAtual();
    let langCode = config.linguagem.toLowerCase();
    if (langCode === 'c#') langCode = 'csharp';
    if (langCode === 'angular') langCode = 'typescript';

    const prompt = construirPromptQuiz(
      config.linguagem,
      config.dificuldade,
      config.quantidadeQuestoes,
      langCode
    );

    if (config.provedor === 'gemini') {
      return this.gerarQuizGemini(prompt, config.chaveApi);
    } else {
      return this.gerarQuizOpenAI(prompt, config.chaveApi);
    }
  }

  private gerarQuizGemini(
    prompt: string,
    apiKey: string,
  ): Observable<Questao[]> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    };

    return this.http.post<any>(url, body).pipe(
      map((response) => {
        const textResponse = response.candidates[0].content.parts[0].text;
        const json = JSON.parse(textResponse);
        return json.questoes as Questao[];
      }),
    );
  }

  private gerarQuizOpenAI(
    prompt: string,
    apiKey: string,
  ): Observable<Questao[]> {
    const url = `https://api.openai.com/v1/chat/completions`;
    const body = {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    };
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    return this.http.post<any>(url, body, { headers }).pipe(
      map((response) => {
        const content = response.choices[0].message.content;
        const json = JSON.parse(content);
        return json.questoes as Questao[];
      }),
    );
  }
}
