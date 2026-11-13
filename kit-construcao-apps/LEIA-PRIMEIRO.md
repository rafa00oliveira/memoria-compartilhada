# Kit de construção de apps

Passo a passo para construir um site ou sistema (CRM, ERP, MRP, painel interno) com IA, do "precisa existir?" até o
backup. É o método que uso nos meus apps em produção, com Next.js, Supabase e Vercel. Boa parte das regras nasceu de um
erro que já aconteceu.

## O que tem aqui

| Arquivo | Para quê | Quem lê |
|---|---|---|
| `LEIA-PRIMEIRO.md` | este guia | você |
| `PROMPT-INICIAL.md` | quatro prompts prontos: primeiro dia, cada tarefa, projeto que já existe, revisão por outra IA | você cola na IA |
| `MANUAL-CONSTRUCAO.md` | os passos P0 a P12 do projeto inteiro e o que é obrigatório em cada nível | você e a IA |
| `CICLO-DA-TAREFA.md` | os quatro portões de cada tarefa de código: entender, planejar, causa-raiz, prova | a IA |
| `POKA-YOKE-DIGITAL.md` | como impedir o erro de quem usa, na tela, no servidor e no banco | a IA, em toda tela |
| `modelos/` | os arquivos do primeiro commit, prontos para preencher | a IA |

## Como usar

1. **Classifique o projeto.** N1: site sem login. N2: app com login e dado que dá para refazer. N3: alguém depende dele
   no dia, ou ele guarda dado de cliente, dinheiro ou dado pessoal. Na dúvida, o nível mais alto.
2. **Escreva as cinco linhas do P0:** quem usa, que problema resolve, que dado entra, o nível e o prazo. Sem elas, não
   comece.
3. **Crie a pasta do projeto** e copie este kit inteiro para `docs/kit/` dentro dela.
4. **Abra a IA na pasta e cole o prompt 1** do `PROMPT-INICIAL.md`. Ela lê o manual e segue P1 a P6 com você, um passo
   por vez, mostrando a prova de cada um.
5. **A cada tarefa nova, cole o prompt 2.** Nada está pronto sem a prova do P8: `npm run check` verde, teste da regra,
   tela conferida e, depois do deploy, a URL respondendo com a mudança.

Projeto que já existe: comece pelo prompt 3, que só levanta o que tem e o que falta, sem mexer em nada.

## Para onde vai cada modelo

| Modelo | Destino no projeto |
|---|---|
| `modelos/AGENTS.md` e `modelos/CLAUDE.md` | raiz |
| `modelos/CONTEXTO.md` | raiz |
| `modelos/PROJETO.md` | `docs/PROJETO.md` |
| `modelos/decisao.md` | `docs/decisoes/001-<assunto>.md`, um arquivo por decisão |
| `modelos/.gitignore` e `modelos/.env.example` | raiz, antes do primeiro `git add` |
| `modelos/ci.yml` | `.github/workflows/ci.yml` |
| `modelos/alvo.mjs` e `modelos/alvo.test.mjs` | `scripts/` (preencha o ref de produção quando o banco existir) |

## O que é decisão sua, não da IA

- Regra de negócio: a IA anota a dúvida em `docs/PROJETO.md` (Pendências) e pergunta. Ela não escolhe por você.
- Rodar script, migration ou teste que grava no banco de produção.
- Trocar uma chave que vazou. Chave colada no chat da IA conta como vazada.
- Publicar mudança grande no que a equipe usa, e avisar quem usa.

## O que você precisa ter

- Contas no GitHub, na Vercel e no Supabase. Os três têm plano grátis, com limites que o manual explica: o Hobby da
  Vercel é só para uso não comercial, e o Supabase grátis pausa depois de uma semana sem uso e não faz backup sozinho.
- Node 24 e git. O gitleaks na máquina ajuda a varrer o histórico uma vez (P4).
- Uma IA de código que roda na pasta (Claude Code, Codex, Cursor) e, para revisar, uma segunda IA de outra família.

## Outra stack

Os passos valem para qualquer stack; os comandos dos exemplos são de Next.js, Supabase e Vercel. Fugir da stack é uma
decisão escrita em `docs/decisoes/`, com o motivo.
