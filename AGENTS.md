# AGENTS.md — instruções de trabalho (Claude e Codex)

Você vai trabalhar em vários projetos meus nesta máquina (Windows, PowerShell).
Raiz: `C:\Users\Rafa00oliveira\Claude\`

> **Fonte de verdade deste arquivo:** `memoria-compartilhada/AGENTS.md`.
> A cópia na raiz é só pro Codex ler automaticamente — sincronize com `sync-agents.ps1`
> (nunca edite a cópia da raiz à mão).

## Autonomia (decisão do Rafael, 2026-10-05)

O método já está testado: **execute sozinho, sem pedir permissão** — inclusive commit,
`git push`, deploy, migrations/DDL remoto e troca de branch. Revisor independente
(Claude ↔ Codex) é opcional, não etapa obrigatória.

Autonomia não é atalho. Continuam valendo, sempre (são as regras que já evitaram estrago):
- `npm run build` (e o teste/lint do repo) **antes** de qualquer push. Deploy = produção.
- `git pull --rebase` antes do push. Nunca `--force`, nunca `--no-verify`.
  Conflito de rebase: **para e relata** — não resolve às cegas.
- Commit sai como `rnloliveira1@gmail.com` (`git config user.email`), senão a Vercel bloqueia.
- DDL destrutivo (`DROP`, `TRUNCATE`, `DELETE`/`UPDATE` sem `WHERE`) só com backup/dump antes.
- Depois do deploy, prova no ar (URL/endpoint real), não só "deu push".
- Nunca segredo em arquivo versionado (`.env`, chave, token, senha).
- Mover ou apagar arquivo do Rafael: mostra o plano antes (criar arquivo novo é livre).

> Tradeoff assumido: mais velocidade, menos uma barreira contra erro em produção.
> Caminho de volta: reintroduzir a linha "confirmação explícita antes de push/deploy/DDL".

## Teia — onde cada informação mora (ler nesta ordem, parar quando achar)

| Pergunta | Onde buscar | Custo |
|---|---|---|
| Qual pasta é de qual assunto? | `~/PROJETOS.md` (mapa mestre) | 1 arquivo |
| Estou na pasta certa? Como publica? O que já quebrou? | `CONTEXTO.md` mais próximo (cabeçalho de 8 linhas primeiro) | barato |
| De onde vem o dado? | `DOCUMENTOS.md` da pasta | barato |
| Como deve ser o `CONTEXTO.md`? | `~/PADRAO-CONTEXTO.md` | só se for criar |
| O que mudou no código e quando? | `git log --oneline -20` no repo | barato |
| Sessões antigas | `docs/historico/` do repo | só se preciso |

**Um fato, uma casa.** Este arquivo só guarda regras e ponteiros; o estado vivo de cada
projeto mora no `CONTEXTO.md` dele e **prevalece** sobre qualquer coisa escrita aqui.

### Registrar (obrigatório, é o que mantém a teia viva)
1. **Antes de mexer:** ler o `CONTEXTO.md` mais próximo. Não existe? Criar na raiz do projeto.
2. **Ao fechar cada marco:** uma linha no log do `CONTEXTO.md` —
   `AAAA-MM-DD · Claude|Codex · o que · onde (arquivo/commit/URL) · pendente: ...`.
   Mudou estado, fonte de dados ou forma de publicar? Atualiza o cabeçalho também.
3. **Pasta ou entregável novo e durável:** uma linha de índice no `~/PROJETOS.md`.
4. Registro no mesmo commit da mudança. Respeitar o teto de log (condensar, não empilhar).

## Projetos (particularidades de deploy — detalhe vivo no CONTEXTO.md de cada um)

**1) destak-tasks** — Next.js 16 + Supabase + Vercel
- Deploy: GitHub Actions no push para `master`.
- ATENÇÃO: repo local está na branch `melhoria-dashboard-ui`.
  Publicar via refspec: `git push origin melhoria-dashboard-ui:master`.
- DDL/migrations: rodar via `db-run.mjs`; depois `npm run rls:audit`.

**2) destak-crm** — Vite + React + Supabase + Vercel
- Deploy: `git push` na `master`. Bloqueia se o commit não for de `rnloliveira1@gmail.com`.
- DDL: `scripts/supabaseRun.mjs`.

**3) destak-produtividade (Cronos)** — monolito `index.html` vanilla JS + Supabase
- Repo PÚBLICO do parceiro (`tropaupam-eng`); sou colaborador com push.
- Deploy: GitHub Pages no push para `main` = produção real.
- O parceiro pusha muito: sempre `git pull --rebase` antes.

**4) reformo-erp** — Next.js 16 + Supabase + Vercel — NO AR em reformoengenharia.com.br
- Deploy: `git push main` → Vercel automático. Bloqueia se o autor não for `rnloliveira1@gmail.com`.
- Repo privado `rafa00oliveira/reformo-erp`, branch `main`.

**5) quero-bahia-crm** — Next.js 16 + Supabase + Vercel
- Deploy: `vercel --prod` (precisa da Vercel CLI logada).

**6) memoria-compartilhada** — este arquivo de regras + ponteiros
- Só docs. Repo privado. Mesmas regras de commit.

## Gerais

- Commits pequenos, mensagens em **português** e descritivas.
- Sem travessão em textos que vão para o cliente.
- Não assumir acesso operacional a Supabase/Vercel/GitHub: depende das credenciais/CLIs
  desta sessão. **Verificar antes de usar**, não presumir.
- Sem shell local na sessão? Faz o que der (editar arquivos), e registra no `CONTEXTO.md`
  o que ficou sem commit/push para a próxima sessão com shell fechar.
