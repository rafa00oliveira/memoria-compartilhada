# HANDOFF — estado da tarefa

> Estado **temporário** do trabalho em andamento, para o próximo (Claude ou Codex) continuar
> sem depender da memória da conversa. Instruções permanentes: `README.md` / `AGENTS.md`.
> Contexto de longo prazo: `CONTEXTO.md`. Histórico: `SESSION_LOG.md`.
> **Mantenha sempre as seis seções abaixo.**

_Atualizado: 2026-10-05._

> 2026-10-05 · Claude: os dois achados do destak-tasks abaixo **já estavam corrigidos** no commit `2c92c26` (13/07, "fix(security): escopo nos endpoints sociais do Mural + escopo de escrita em documentos") e seguiram para produção nos deploys seguintes (master atual `410690d`). Conferido no código: `canViewAnnouncement` em comments/reactions/read e `canWriteSector` no `POST /api/documents`. Itens encerrados.

## Estado atual

- Repo `memoria-compartilhada` inicializado localmente, branch `main`, árvore limpa.
- Ainda **sem repositório remoto no GitHub** e sem `origin`.
- Modelo de trabalho por papéis (Autor / Revisor independente / Rafael autoriza) definido no `AGENTS.md`.
- Auditoria independente do `destak-tasks` concluída em 2026-07-13, sem alterações de código. Há dois achados de autorização a corrigir antes de publicar o WIP do dashboard.

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
- ~~**Destak Tasks — alto:** os endpoints sociais do Mural (`/api/announcements/[id]/comments`, `reactions` e `read`) aceitam qualquer usuário autenticado sem validar se o aviso está no escopo dele. Usam `service_role`, portanto permitem interação e, no caso de comentários, leitura cruzada se o ID for conhecido.~~ **Resolvido em `2c92c26`.**
- ~~**Destak Tasks — médio:** `POST /api/documents` aceita `sector_id` arbitrário de qualquer usuário autenticado. Isso permite gravar arquivo em biblioteca de setor alheio e consumir storage; deve aplicar o mesmo escopo usado no GET.~~ **Resolvido em `2c92c26`.**

## Próximo passo seguro

Rafael cria o repositório privado no GitHub e dá o primeiro push (comandos no `README.md`).
Depois, preencher a URL aqui e no `SESSION_LOG.md`.

No `destak-tasks`, o autor deve corrigir os dois controles de escopo acima; o revisor então reavalia apenas as rotas impactadas. A validação atual passou: `npx tsc --noEmit`, `npm run lint` (0 erros, 80 avisos preexistentes) e `npm run build`.

## Operações que exigem autorização do usuário

Nenhuma desde 2026-10-05 (ver "Autonomia" no `AGENTS.md`). Guarda-corpos técnicos continuam.
