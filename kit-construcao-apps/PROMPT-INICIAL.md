# Prompts prontos

Cole na IA de código (Claude Code, Codex, Cursor), aberta na pasta do projeto, com o kit já copiado para `docs/kit/`.
Troque o que está entre `< >`. Não cole chave, senha nem token em nenhum deles.

## Prompt 1. Primeiro dia de um projeto novo

```text
Vamos construir <o que é, em uma linha>. Antes de escrever qualquer código:

1. Leia inteiros docs/kit/MANUAL-CONSTRUCAO.md, docs/kit/CICLO-DA-TAREFA.md e docs/kit/POKA-YOKE-DIGITAL.md.
2. As cinco linhas do P0 que eu já tenho:
   - quem usa: <...>
   - problema que resolve: <...>
   - dado que entra: <...>
   - nível que eu acho: <N1, N2 ou N3>
   - prazo: <...>
   Diga em qual nível você classifica o projeto e por quê, e me pergunte o que faltar do P0.
3. Com o P0 aprovado por mim, siga P1 a P6 em ordem, um passo por vez: entregue o que o passo pede, rode a prova
   dele, me mostre a saída e espere meu OK antes do próximo.
4. Use docs/kit/modelos como base do primeiro commit (AGENTS.md, CLAUDE.md, CONTEXTO.md, docs/PROJETO.md,
   .gitignore, .env.example, .github/workflows/ci.yml, scripts/alvo.mjs e o teste dela).
5. Regra de negócio que não está escrita não é sua para decidir: anote na seção Pendências do docs/PROJETO.md e me
   pergunte.
6. Nunca me peça chave, senha ou token no chat. Diga em qual arquivo ou painel eu coloco.

Comece pelo item 1 e me responda o item 2.
```

## Prompt 2. Cada tarefa nova

```text
Tarefa: <o que precisa mudar, para quem, e como eu sei que deu certo>.

Siga o docs/kit/CICLO-DA-TAREFA.md: leia o código que a tarefa toca antes de planejar e me mostre o plano com os
arquivos exatos e o teste. Depois de construir, rode `npm run check` e me mostre a saída. Tela nova ou mudada passa
pelo checklist da seção 6 do docs/kit/POKA-YOKE-DIGITAL.md. Mudança de banco, login, permissão ou dinheiro vai por PR.
Não diga "pronto" sem a prova do P8 do manual, e atualize o CONTEXTO.md no fim.
```

## Prompt 3. Projeto que já existe

```text
Este projeto já existe e não quero mudança de código agora. Leia docs/kit/MANUAL-CONSTRUCAO.md e depois o código.
Me entregue uma tabela: passo do manual (P2 a P10) | tem, em parte ou falta | prova (arquivo e linha, ou o comando
que você rodou e a saída). Só leitura: nada de gravar no banco nem de publicar. Falta que expõe dado ou segredo vai
para o topo. Depois eu decido o que consertar primeiro.
```

## Prompt 4. Revisão por outra IA

Use uma IA diferente da que construiu, de preferência de outra família, numa conversa nova. Cole o plano ou o diff
(`git diff main...<branch>`) logo abaixo do prompt.

```text
Revise este <plano | diff> como quem não construiu. Para cada problema: arquivo e linha, o que quebra e o cenário
concreto que mostra a falha (entrada, estado, resultado errado). Olhe em especial segurança (login e papel conferidos
no servidor, RLS, segredo), perda de dado, regra de negócio inventada e teste que não testa nada. Não reescreva o
código e não liste gosto pessoal. Termine com uma palavra: APROVADO ou REVISAR.
```

Com REVISAR, leve os achados para a IA que construiu, decida cada um (aceita ou recusa com motivo) e mande de novo ao
mesmo revisor. Resposta vazia ou com erro não é aprovação.
