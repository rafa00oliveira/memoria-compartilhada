# CONTEXTO — Memória compartilhada (Rafael)

- **É:** memória compartilhada de longo prazo do Rafael — perfil de trabalho, stack padrão e convenções, para alternar entre Claude e Codex sem repetir contexto.
- **Para:** os agentes (Claude, Codex), não para pessoa nenhuma.
- **Entrega típica:** nenhuma — é estado, não entregável.
- **Fonte de dados:** as próprias sessões de trabalho.
- **Estado:** ativo como **regras + teia de ponteiros** (`AGENTS.md`). Estado de projeto NÃO mora aqui: mora no `CONTEXTO.md` de cada repo. Seções abaixo de "Perfil de trabalho" são de 2026-07-13 e não são mantidas.
- **Próxima ação:** commit + push deste repo (sessão de 2026-10-05 não tinha shell local) e criar o remoto privado no GitHub (nunca subiu).
- **Não confundir com:** `~/.claude/projects/.../memory/` — aquilo é a memória automática do Claude Code; isto aqui é um arquivo escrito à mão.
- **Atualizado:** 2026-10-05

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
- 2026-10-05 · Claude · `AGENTS.md`: autonomia total (push/deploy/DDL/branch sem pedir) com guarda-corpos técnicos + seção "Teia" (onde buscar cada informação e como registrar); cópia da raiz atualizada · `AGENTS.md`, `../AGENTS.md`, `HANDOFF.md` · pendente: commit/push deste repo e criar remoto GitHub (sessão sem shell local; `gh` sem credencial).
- 2026-10-05 · Claude · achados de segurança do destak-tasks (Mural + documentos) conferidos: já corrigidos em `2c92c26` (13/07) · `HANDOFF.md` · pendente: nada.
