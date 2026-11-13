# Ciclo de cada tarefa de código

É o passo P7 do `MANUAL-CONSTRUCAO.md`. Vale para toda tarefa que não é trivial: funcionalidade nova, bug, refatoração
ou mudança de comportamento, e principalmente antes de dizer "pronto" ou de publicar onde publicar é produção.

São quatro portões. Cada um só abre com o anterior fechado. O processo garante entendimento e prova, não burocracia:
a solução continua sendo a mais enxuta que funciona.

## Portão 1. Entender antes de construir

1. **Explorar o contexto:** arquivos, padrões que já existem, commits recentes. Reusar o que o projeto já tem antes de
   escrever algo novo.
2. **Perguntar pouco e com opção:** pedido ambíguo vira pergunta de múltipla escolha. Decisões independentes podem ir
   juntas, numeradas com opções (1a, 2b). Nunca uma rajada de perguntas abertas.
3. **Escopo grande? Decompor primeiro:** pedido com vários subsistemas independentes vira subprojetos em ordem, não um
   plano gigante.
4. **Duas ou três abordagens com recomendação** quando há troca real (custo, risco, prazo), começando pela recomendada
   e dizendo por quê. Decisão trivial não precisa de menu.
5. **Cortar o especulativo:** o que é "para o futuro" sai do desenho.

"Simples demais para precisar disso" é a armadilha clássica. No trivial de verdade, o desenho cabe em duas frases,
mas ele existe e o dono confirma.

## Portão 2. Planejar sem inventar

- **Descoberta antes do plano:** ler a documentação, os exemplos e o código real antes de citar uma API. O erro mais
  comum de IA é inventar o método que "deveria existir". Na dúvida, procurar no código ou na documentação oficial.
- **Caminhos exatos, código real:** cada tarefa do plano nomeia os arquivos (criar ou modificar) e mostra o código.
  Proibido: "a definir", "adicionar tratamento de erro apropriado", "parecido com a tarefa 3", "escrever testes".
- **Tarefa é a menor unidade testável:** cada uma termina em algo que se confere sozinho, com o comando e o resultado
  esperado.
- **Auto-revisão do plano:** cada requisito tem tarefa? Sobrou algum "a definir"? O nome usado na tarefa 5 é o mesmo
  definido na tarefa 2?
- **Revisão por outra IA (tarefa não trivial):** depois da auto-revisão e antes de construir, o plano vai para outra
  IA, de preferência de outra família e sem o histórico da conversa (prompt 4 do `PROMPT-INICIAL.md`). "REVISAR"
  significa arbitrar cada achado e mandar de novo ao mesmo revisor. Resposta vazia, erro ou "não consegui" nunca é
  aprovação. Construído, o diff passa pela inspeção de quem não construiu. Fica de fora só o trivial de verdade:
  texto, erro de digitação, configuração de uma linha.
- **Travou executando? Parar e perguntar:** instrução obscura, dependência faltando, verificação falhando de novo. Não
  adivinhar, não forçar.

## Portão 3. Bug é causa-raiz, nunca sintoma

Nenhuma correção sem investigar a causa antes. Vale mais sob pressão, não menos: o caminho sistemático é mais rápido
que o chute.

1. **Investigar:** ler a mensagem de erro inteira (ela costuma ter a resposta); reproduzir de forma confiável; ver o
   que mudou (diff, dependências, configuração, variáveis). Em sistema de várias camadas (tela, servidor, banco),
   registrar a entrada e a saída em cada fronteira e rodar uma vez para ver onde quebra, antes de teorizar o porquê.
2. **Comparar:** achar no mesmo projeto um código parecido que funciona e listar toda diferença, inclusive as que "não
   podem importar".
3. **Uma hipótese, um teste mínimo:** "acho que X causa isso porque Y". Uma mudança por vez. Não funcionou? Hipótese
   nova; nunca empilhar correções.
4. **Corrigir na origem, com prova:** reproduzir a falha (teste ou script mínimo) antes de corrigir; corrigir só a
   causa, sem "já que estou aqui"; confirmar que a reprodução passa e nada mais quebrou. Antes de editar uma função,
   procurar os outros pontos que a chamam: a correção certa fica no ponto comum, não só no caminho que o relato citou.

**Três correções falharam: o problema é de desenho.** Parar de corrigir e discutir o desenho com o dono. Frases que
mandam voltar ao item 1: "correção rápida por enquanto", "deixa eu só tentar X", "provavelmente é X", "não entendo
bem, mas deve funcionar".

## Portão 4. Prova antes de "pronto"

Nenhuma declaração de sucesso sem prova fresca, desta rodada. "Deveria funcionar", "parece certo" e "o agente disse
que fez" não são prova.

Antes de qualquer "pronto", "corrigido" ou "passando":

1. Qual comando prova a afirmação? 2. Rodar agora, completo. 3. Ler a saída inteira (código de saída, número de
falhas). 4. Só então afirmar, mostrando a saída. Se a saída contradiz, relatar o estado real.

| Afirmação | Exige | Não basta |
|---|---|---|
| "Os testes passam" | rodar agora: 0 falhas | rodada anterior, "deve passar" |
| "O build está ok" | build completo com saída 0 | lint verde, log que "parecia bom" |
| "O bug foi corrigido" | o sintoma original testado de novo | código alterado não é código corrigido |
| "O subagente terminou" | diff e arquivos conferidos | o relatório do próprio agente |
| "Os requisitos foram atendidos" | lista conferida item a item contra o pedido | testes verdes |

### Antes de cada push (push costuma ser produção)

- `git pull --rebase` antes. Nunca `--force`, `--no-verify` nem `git stash` com trabalho de outra sessão. Conflito de
  rebase: parar e relatar, não resolver às cegas.
- `npm run check` local, mesmo em mudança "só de imagem" ou "só de texto".
- Commit com o e-mail da conta dona do projeto na Vercel, listando os arquivos pelo nome.
- Mudança visível na tela: abrir a tela (local ou preview) e conferir, não pedir para alguém olhar.
- Push que publica: "pronto" só com a prova no ar, a URL ou o endpoint real respondendo com a mudança.
- Relatar com honestidade: teste falhou, diga que falhou e mostre a saída.
