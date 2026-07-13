# HANDOFF — estado da tarefa

> Estado **temporário** do trabalho em andamento, para o próximo (Claude ou Codex) continuar
> sem depender da memória da conversa. Instruções permanentes: `README.md` / `AGENTS.md`.
> Contexto de longo prazo: `CONTEXTO.md`. Histórico: `SESSION_LOG.md`.
> **Mantenha sempre as seis seções abaixo.**

_Atualizado: 2026-07-13._

## Estado atual

- Repo `memoria-compartilhada` inicializado localmente, branch `main`, árvore limpa.
- Ainda **sem repositório remoto no GitHub** e sem `origin`.
- Modelo de trabalho por papéis (Autor / Revisor independente / Rafael autoriza) definido no `AGENTS.md`.

## Alterações feitas

- Criados: `README.md`, `CONTEXTO.md`, `SESSION_LOG.md`, `.gitignore`, `HANDOFF.md`, `AGENTS.md`, `sync-agents.ps1`.
- `AGENTS.md` copiado para a raiz `C:\Users\Rafa00oliveira\Claude\` (cópia que o Codex lê automaticamente).
- Pastas `docs/`, `work/`, `outputs/` com `.gitkeep`.

## Validação executada

- `git grep` confirmou que não há senhas/tokens nos arquivos versionados (só as frases de aviso).
- `git log` / `git status`: 3+ commits, árvore limpa.
- `sync-agents.ps1` roda e sincroniza a cópia da raiz.

## Pendências e riscos

- **Pendência:** criar o repo privado no GitHub e dar push (bloqueado: `gh` não instalado, sem credencial — precisa do Rafael).
- **Pendência:** revisar os "Próximos passos" do `CONTEXTO.md` (herdados da memória, podem estar desatualizados).
- **Risco:** NÃO rodar `git init`/push na raiz `Claude\` — vazaria todos os projetos e segredos.
- **Risco:** segredo commitado por engano é irreversível após push; conferir `.gitignore` antes de cada commit.
- **Risco de divergência:** editar `AGENTS.md` só na fonte (`memoria-compartilhada/`) e rodar `sync-agents.ps1`.

## Próximo passo seguro

Rafael cria o repositório privado no GitHub e dá o primeiro push (comandos no `README.md`).
Depois, preencher a URL aqui e no `SESSION_LOG.md`.

## Operações que exigem autorização do usuário

- `git push` / criação do repositório remoto.
- Qualquer deploy (Vercel, GitHub Actions, GitHub Pages).
- Migrations / DDL em ambiente remoto.
- Troca de branch.
