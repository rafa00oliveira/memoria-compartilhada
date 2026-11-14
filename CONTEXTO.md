# CONTEXTO — Memória compartilhada (Rafael)

- **É:** memória compartilhada de longo prazo do Rafael — perfil de trabalho, stack padrão e convenções, para alternar entre Claude e Codex sem repetir contexto.
- **Para:** os agentes (Claude, Codex), não para pessoa nenhuma.
- **Entrega típica:** nenhuma — é estado, não entregável.
- **Fonte de dados:** as próprias sessões de trabalho.
- **Estado:** ativo como **regras + teia de ponteiros** (`AGENTS.md`) e casa do **manual de construção** (`MANUAL-CONSTRUCAO.md`, v1.1 de 12/11/2026) e das decisões transversais (`docs/decisoes/`). Versão para colegas do manual: repositório público `~/Claude/kit-construcao-apps` (https://github.com/rafa00oliveira/kit-construcao-apps, v1.3-geral de 14/11, `9ed9608`). Catálogo de usabilidade no celular: `docs/USABILIDADE-MOBILE.md` (pesquisa em `docs/pesquisa-usabilidade-mobile/`); a cópia do Drive (`G:/Meu Drive/kit-construcao-apps`) parou na v1.1 por decisão do Rafael. Estado de projeto NÃO mora aqui: mora no `CONTEXTO.md` de cada repo. Seções abaixo de "Perfil de trabalho" são de 2026-07-13 e não são mantidas.
- **Próxima ação:** marcar na tabela F do manual o que os devs do MRP e do Selo fecharem, com a prova. O remoto privado existe (`github.com/rafa00oliveira/memoria-compartilhada`) e está em dia. Confere com: `git ls-remote origin main` = `git rev-parse HEAD`.
- **Não confundir com:** `~/.claude/projects/.../memory/` — aquilo é a memória automática do Claude Code; isto aqui é um arquivo escrito à mão.
- **Atualizado:** 2026-11-12 | provado: remoto = local (`git cherry @{u}` vazio), `ls docs/decisoes` = 001 | NÃO provado: seções de 07-13

> **NUNCA colocar senha, token, chave de API ou dado bancário aqui.**

---

> Fonte de verdade de longo prazo para trabalhar alternando entre Claude e Codex.
> Curto e atualizável. Histórico de sessões fica em `SESSION_LOG.md`.

---

## Perfil de trabalho

- Desenvolvedor solo tocando vários apps internos para empresas (comercial, logística, reformas, gestão de tarefas).
- Stack padrão: **Next.js 16 + Supabase (Postgres + Auth + RLS) + Vercel**. Alguns projetos usam Vite/React; um é monolito vanilla JS.
- Trabalha com **deploy = produção**: na maioria dos repos, `git push` já publica. Sempre `git pull --rebase` antes de mexer em repo compartilhado.
- Prefere que **eu execute** migrations/DDL direto (via MCP Supabase ou scripts `*.mjs` do próprio projeto) e monitore deploy.
- Cadência "roda solto": commits pequenos, mensagens claras **em português**.

## Projetos ativos

| Projeto | O que é | Stack / deploy | Pasta local |
|---|---|---|---|
| **Destak Tasks** ("Gestor de Tarefas") | App interno de gestão de tarefas/solicitações por setor | Next.js 16 + Supabase + Vercel (via GitHub Actions, `push master`) | `destak-tasks` |
| **Destak CRM** | CRM comercial (44 vendedores, ~9,3k clientes) | Vite+React + Supabase + Vercel (`git push` master) | `destak-crm` |
| **Destak Produtividade (Cronos)** | Logística/expedição (repo de um parceiro, Rafael é colaborador) | Monolito `index.html` vanilla JS + Supabase; GitHub Pages | `destak-produtividade` |
| **Reformo ERP** | ERP de reformas (Petrolina-PE/Juazeiro-BA), por fases | Next.js 16 + Supabase + Vercel; no ar em reformoengenharia.com.br | `reformo-erp` |
| **Quero Bahia CRM** | CRM interno de rede de móveis/eletro (Salvador) | Next.js 16 + Supabase + Vercel (`vercel --prod`) | `quero-bahia-crm` |

Cada projeto tem seu próprio `CONTEXTO.md` / `SESSION_LOG.md` na raiz do repo — detalhe vivo mora lá.

## Preferências

- **Português** em toda comunicação e mensagens de commit. Sem travessão em textos que vão pro cliente.
- Modo **ponytail** (solução mais enxuta que funciona): sem abstração especulativa, stdlib/nativo antes de dependência, menor diff que resolve.
- **Verificar antes de declarar "pronto"** — evidência fresca (build, runtime no domínio, não só `npm run build`).
- Rodar `npm run build` mesmo em tarefa de "só asset" (já quebrou build Turbopack por favicon RGB).
- Segredos nunca entram em repo nem em chat. Buckets Supabase privados.

## Decisões recorrentes

- **Segredos fora do Git**: `.env`, chaves, tokens, dumps → sempre no `.gitignore`.
- **Apps independentes** (ex.: Cronos × Gestor de Tarefas): compartilham marca visual, mas ficam separados pra poder vender/cobrar cada um.
- Supabase: entender schema (`list_tables`) antes de alterar; `get_logs`/`get_advisors` antes de debugar.
- Migrations versionadas e numeradas por projeto.

## Próximos passos / pendências abertas

> Confirmar com Rafael quais ainda valem — lista herdada da memória, pode estar desatualizada.

- **Este repo**: criar o repositório privado `memoria-compartilhada` no GitHub e dar o primeiro push (ver `SESSION_LOG.md`).
- **Reformo ERP**: billing Google/Gemini (destrava IA real), SMTP para e-mail de reset, planilha de ~50 serviços, conteúdo real da landing, WhatsApp API/BSP.
- **Destak Tasks**: consolidar branch `melhoria-dashboard-ui` (WIP do dashboard) antes de publicar docs.
- **Quero Bahia CRM**: ligar a integração Conta Azul.
- **Destak CRM**: smoke test de papéis em produção; migrar `syncRotasCrono` (ainda no Firestore).

---

### Como sincronizar (fluxo Claude ↔ Codex)

Antes de trabalhar: `git pull`
Ao salvar: `git add -A && git commit -m "mensagem clara em pt" && git push`

## Log

- 2026-11-14 · Claude · kit v1.3-geral, 2ª rodada com a opinião dos 3 devs (`9ed9608`: advisors, `npm audit signatures`, Unicode invisível no CI, cabeçalhos simples, fatias, borda do P7.4, `ask` no lugar de `deny` para `db push` e `--prod`) · catálogo `docs/USABILIDADE-MOBILE.md` (129 regras de 3 pesquisas, 10/10 citações conferidas; `mede-mobile.js` testado em 2 páginas) enviado aos devs do Selo e do CRM; dev de PCP 2 fora, por pedido do Rafael. Selo entregou (`selo-hu` PR #23, só doc: 72 regras MVP, 26 atendem, 37 falham) e o catálogo foi à v1.1 com as 11 críticas dele (script não conta sr-only; rótulo conta pelo rádio) · pendente: levantamento do CRM; OK do Rafael nas 10 correções do Selo; portar as rodadas 1 e 2 do kit para este manual; CI do kit espera o escopo `workflow`.
- 2026-11-13 · Claude · kit para colegas virou repositório público (`2666f2b`, v1.2 com 7 ideias da pesquisa no GitHub; `permissions.deny` testado num Claude real) e saiu daqui (estava em `db08e2d`) · 30 ideias (`docs/pesquisa-kit-github-2026-11-13.md`) enviadas aos devs de PCP 2, Destak e Selo; Destak respondeu (`destak-crm` `9168bd8`: 14 já tem, 9 adicionar, 7 não serve; G1, D1 e C2 conferidas) · pendente: respostas de PCP 2 e Selo, depois a 2ª rodada do kit; portar os 7 itens para este manual; CI do kit espera o escopo `workflow` no gh. Licença MIT em 13/11 (`e69c62a`).
- 2026-11-13 · Claude · `kit-construcao-apps/` (versão para colegas: 15 arquivos, `alvo.test.mjs` 4/4, gitleaks limpo) e trava da P3 corrigida no manual (furo `db.<ref>`) · Drive `G:/Meu Drive/kit-construcao-apps` = local por hash (15/15) + zip · pendente: o link de compartilhamento é do Rafael; o `alvo.mjs` do `mrp-ibacem` segue com o furo.
- 2026-11-12 · Claude · guia `docs/POKA-YOKE-DIGITAL.md` (PESQ-01 de GQ + PESQ-02 de GS) e item 8 no P7 do manual · pendente: devs fazerem o levantamento tem/falta
- 2026-10-05 · Claude · `AGENTS.md`: autonomia total (push/deploy/DDL/branch sem pedir) com guarda-corpos técnicos + seção "Teia" (onde buscar cada informação e como registrar); cópia da raiz atualizada · `AGENTS.md`, `../AGENTS.md`, `HANDOFF.md` · pendente: commit/push deste repo e criar remoto GitHub (sessão sem shell local; `gh` sem credencial).
- 2026-10-05 · Claude · achados de segurança do destak-tasks (Mural + documentos) conferidos: já corrigidos em `2c92c26` (13/07) · `HANDOFF.md` · pendente: nada.
- 2026-10-14 · Claude · `AGENTS.md`: destak-tasks publica por worktree + cherry-pick (push por refspec é recusado, históricos divergidos); cópia da raiz sincronizada · `699c01d` · pendente: nada.
- 2026-11-12 · Claude · `MANUAL-CONSTRUCAO.md` v1.1 (F01–F21, ordem do conserto) e decisão 001 (Vercel Hobby, risco aceito pelo Rafael) · `cfc90d2`, `3b0c99b`, `930777a` · pendente: Node 26.x na Vercel × 24 no manual.
