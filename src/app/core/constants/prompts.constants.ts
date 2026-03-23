import { Dificuldade } from '../enums/dificuldade.enum';
import { Linguagem } from '../enums/linguagem.enum';

export const PROMPTS_NIVEL: Record<Dificuldade, string> = {
  [Dificuldade.Iniciante]:
    'Nível Iniciante: Desenvolva questões práticas focadas em lógica de programação, sintaxe básica, loops, arrays e manipulação de variáveis. As questões devem focar na leitura e interpretação de trechos de código curtos. É OBRIGATÓRIO incluir sutis armadilhas (pegadinhas) de sintaxe ou de lógica condicional. PROIBIDO fazer perguntas puramente teóricas ou triviais (ex: "O que é um int?"). O objetivo é avaliar a atenção e o raciocínio prático do candidato.',
  [Dificuldade.Intermediario]:
    'Nível Intermediário: Elabore questões que envolvam arquitetura de software, padrões de projeto (design patterns), injeção de dependências, uso de coleções complexas e concorrência leve. Adicione cenários onde o candidato precise dominar escopo, assincronismo, tipos mutáveis/imutáveis e peculiaridades clássicas da linguagem escolhida. As opções de resposta devem ser desafiadoras, exigindo análise minuciosa.',
  [Dificuldade.Avancado]:
    'Nível Avançado: Crie questões de extrema complexidade e profundidade técnica. O foco absoluto deve ser em detalhes obscuros de Runtime, gerenciamento avançado de memória (como Garbage Collection), Boxing/Unboxing, Reflection, otimização de performance, Mutexes/Locks pesados em cenários de alta concorrência e edge-cases raríssimos. Apresente códigos contendo sutis armadilhas arquiteturais onde até programadores seniores podem errar.',
};

export function construirPromptQuiz(
  linguagem: Linguagem,
  dificuldade: Dificuldade,
  quantidade: number,
  langCode: string
): string {
  const promptNivel = PROMPTS_NIVEL[dificuldade];

  return `Crie um teste rigoroso sobre programação na tecnologia/linguagem ${linguagem}.
    ${promptNivel}

    O teste deve conter exatamente ${quantidade} questões de múltipla escolha.
    Siga EXATAMENTE este formato JSON:

    {
      "questoes": [
        {
          "pergunta": "Descubra qual é a saída do código abaixo:\\n\\n\`\`\`${langCode}\\nint x = 5;\\nConsole.Write(x);\\n\`\`\`\\n",
          "opcoes": ["5", "0", "Erro de compilação", "Nenhuma das alternativas"],
          "indiceCorreto": 0,
          "explicacao": "O valor de x é impresso no console diretamente."
        }
      ]
    }

    REGRAS OBRIGATÓRIAS DE FORMATAÇÃO:
    1. Sempre use a propriedade "pergunta" para incluir a pergunta E também o bloco de código, se houver.
    2. É OBRIGATÓRIO escapar quebras de linha com \\n dentro dos valores string do JSON para que não quebre o parse.
    3. SEMPRE que houver código na "pergunta", envolva-o em blocos de markdown e quebre as linhas corretamente: \\n\`\`\`linguagem\\ncodigo\\n\`\`\`\\n
    4. NÃO use marcação de código ou blocos markdown dentro do array de "opcoes" nem na string da "explicacao". Somente texto simples nelas.
    5. Se for SQL, NÃO utilize variáveis ou tabelas temporárias iniciadas por "#" (ex: #Tabela). O caractere "#" é lido como comentário e prejudica a legibilidade no frontend.
    6. Retorne APENAS o JSON válido. Nada de textos narrativos ou marcações soltas de sintaxe antes ou depois da chave de fechamento.`;
}
