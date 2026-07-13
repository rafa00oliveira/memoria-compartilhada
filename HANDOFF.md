# HANDOFF — estado da tarefa

> Estado **temporário** do trabalho em andamento, para o próximo (Claude ou Codex) continuar sem depender da memória da conversa.
> Instruções permanentes ficam no `README.md`. Contexto de longo prazo no `CONTEXTO.md`. Histórico no `SESSION_LOG.md`.

_Atualizado: 2026-07-13._

## Tarefa atual

Transformar esta pasta numa memória compartilhada, versionada e **privada** no GitHub, para alternar entre Claude e Codex.

## Estado atual

- Repositório Git **local** inicializado na branch `main`. Último commit: `7d32900`.
- Arquivos base criados: `README.md`, `CONTEXTO.md`, `SESSION_LOG.md`, `.gitignore`, `docs/`, `work/`, `outputs/`.
- `CONTEXTO.md` consolidado a partir da memória do Claude, **sem segredos**.
- **Ainda NÃO existe repositório remoto no GitHub** nem `origin` configurado.

## Decisões

- A pasta versionada é a **subpasta isolada** `memoria-compartilhada/`. A raiz `C:\Users\Rafa00oliveira\Claude` NÃO é versionada — contém todos os projetos, com `.env`, `node_modules` e senhas em texto puro.
- Segredos (senhas, tokens, chaves) **nunca** entram neste repo. Ficam em gerenciador de senhas.
- README = permanente; HANDOFF = temporário; CONTEXTO = longo prazo; SESSION_LOG = histórico.

## Próximos passos

1. Criar o repositório privado no GitHub e dar push (bloqueado: `gh` não instalado e sem credencial nesta máquina — precisa do Rafael). Ver `README.md` / `SESSION_LOG.md` para os comandos.
2. Após o push, preencher a URL do repo no `SESSION_LOG.md` e neste HANDOFF.
3. Rafael validar a lista de "Próximos passos" do `CONTEXTO.md` (herdada da memória, pode estar desatualizada).

## Comandos de validação

```powershell
cd C:\Users\Rafa00oliveira\Claude\memoria-compartilhada
git status                 # árvore limpa esperada
git log --oneline          # ver commits
git remote -v              # vazio até criar o remoto
# checagem de segredos (não deve retornar nada além das frases de aviso):
git grep -iE "senha|password|token|secret" -- CONTEXTO.md
```

## Arquivos alterados nesta sessão

- `README.md`, `CONTEXTO.md`, `SESSION_LOG.md`, `.gitignore` — criados.
- `HANDOFF.md` — criado.
- `docs/.gitkeep`, `work/.gitkeep`, `outputs/.gitkeep` — placeholders.

## Pendências

- Push para o GitHub (depende do Rafael autenticar).
- Confirmar nome do repo / conta (`rafa00oliveira/memoria-compartilhada`).
- Revisar "Próximos passos" do `CONTEXTO.md`.

## Riscos

- **Não rodar `git init`/push na raiz `Claude/`** — vazaria todos os projetos e segredos.
- Só commitar segredo por engano é irreversível depois do push. `.gitignore` cobre `.env`/chaves; conferir antes de cada commit.
- `CONTEXTO.md` pode ter fatos desatualizados (memória herdada) — tratar como rascunho até o Rafael validar.
