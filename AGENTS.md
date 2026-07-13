# AGENTS.md — instruções de trabalho (Claude e Codex)

Você vai trabalhar em vários projetos meus nesta máquina (Windows, PowerShell).
Raiz: `C:\Users\Rafa00oliveira\Claude\`

## Regras gerais (valem pra todos)

- **Continuidade mora nos arquivos, não na memória da ferramenta.** Fonte confiável:
  `HANDOFF.md`, `SESSION_LOG.md`, `CONTEXTO.md` e o `git log`. Leia-os antes de começar;
  atualize `HANDOFF.md` (e `SESSION_LOG.md`) ao concluir a tarefa.
- **Sequência segura antes de puxar mudanças:**
  1. ler contexto → 2. `git status` → 3. confirmar branch e remotes (`git remote -v`) →
  4. `git pull --rebase` **só com a árvore limpa**. Havendo WIP/alterações locais, preservar
     (stash ou commit) e me avisar antes — o rebase pode parar ou exigir tratamento.
- **Confirmação explícita minha** antes de: `git push`, deploy, migrations/DDL em ambiente
  remoto, e troca de branch. Nunca fazer isso sozinho.
- **Antes do primeiro commit em cada repo**, verificar `git config user.email` (deve ser
  `rnloliveira1@gmail.com`) — `destak-crm` e `reformo-erp` rejeitam o deploy se o autor for outro.
- Deploy = produção na maioria dos projetos. Cuidado redobrado.
- Commits pequenos, mensagens em **português** e descritivas.
- **Nunca** commitar segredos: `.env`, chaves, tokens, senhas. Ficam só local.
- Sem travessão em textos que vão para o cliente.
- Não assumir acesso operacional a Supabase/Vercel: depende das credenciais/CLIs/conectores
  desta sessão. **Verificar antes de usar**, não presumir.

## Projetos

**1) destak-tasks** — Next.js 16 + Supabase + Vercel
- Deploy: GitHub Actions no push para `master`.
- ATENÇÃO: repo local está na branch `melhoria-dashboard-ui` (WIP do dashboard).
  NÃO troque de branch. Publicar via refspec: `git push origin melhoria-dashboard-ui:master`.
- DDL/migrations: rodar via `db-run.mjs`.

**2) destak-crm** — Vite + React + Supabase + Vercel
- Deploy: `git push` na `master`. Bloqueia se o commit não for de `rnloliveira1@gmail.com`.
- DDL: `scripts/supabaseRun.mjs`.

**3) destak-produtividade (Cronos)** — monolito `index.html` vanilla JS + Supabase
- Repo PÚBLICO do parceiro (`tropaupam-eng`); sou colaborador com push.
- Deploy: GitHub Pages no push para `main` = produção real.
- O parceiro pusha muito: seguir a sequência segura acima, sempre `git pull --rebase` antes.

**4) reformo-erp** — Next.js 16 + Supabase + Vercel — NO AR em reformoengenharia.com.br
- Deploy: `git push main` → Vercel automático. Bloqueia se o autor não for `rnloliveira1@gmail.com`.
- Repo privado `rafa00oliveira/reformo-erp`, branch `main`.

**5) quero-bahia-crm** — Next.js 16 + Supabase + Vercel
- Deploy: `vercel --prod` (precisa da Vercel CLI logada).

**6) memoria-compartilhada** — esta memória entre Claude e Codex
- Só docs/estado. Repo privado. Mesmas regras de commit.
- Ao terminar qualquer sessão, atualizar `HANDOFF.md` e `SESSION_LOG.md` aqui.

## Permissões necessárias

- Ler/escrever arquivos nas pastas acima.
- Rodar `git`, `npm`, `node`, `vercel` — pedindo confirmação em push/deploy/DDL remoto.
- Acesso de rede (npm install, git push, supabase, vercel).
- Git autenticado no GitHub (conta `rafa00oliveira`; colaborador em `tropaupam-eng/destak-produtividade`).
- Vercel CLI logada para o `quero-bahia-crm`.
- Os `.env` de cada projeto presentes localmente (segredos só na máquina, nunca no Git).
