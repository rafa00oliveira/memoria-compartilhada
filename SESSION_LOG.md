# SESSION_LOG — Memória compartilhada

Histórico resumido das sessões. Uma entrada por sessão, mais recente no topo.

---

## 2026-11-12 — Manual de construção v1.1 e decisão 001 (Vercel Hobby)

- `MANUAL-CONSTRUCAO.md` criado e levado à v1.1 (`cfc90d2`, `3b0c99b`): passos P0–P12 por nível N1/N2/N3, falhas F01–F21
  com prova e ordem do conserto (seção 4). Revisado por um Claude independente (21 achados, conferidos um a um) e pela
  auditoria do time do MRP. Recusado com motivo: `paths-ignore` de `.md` no CI (o gitleaks precisa ver documento).
- Decisão 001 (`930777a`): apps comerciais seguem no Vercel Hobby com o risco aceito (Rafael, opção 2b); a F20 e a
  seção 4 apontam para `docs/decisoes/001-vercel-hobby-risco-aceito.md`.
- Manual aplicado: kit do MRP (`Desktop/univasf/PCP 2/08-Projeto-Ibacem-MRP/kit-sistema-mrp`) e OS de 9 itens para o
  app do Selo (`Desktop/Hopitasl Universitario/trabalho/OS-selo-manual-construcao-2026-11-12.md`; o dev respondeu "recebido").
- Não feito: Node 26.x na Vercel (mrp-ibacem, selo-hu) × 24 no manual, sem decisão. A pesquisa do Gemini lançada para o
  manual seguia rodando no fechamento: auditar antes de usar.
- Próxima ação: conferir as respostas dos devs (MRP e Selo) e marcar na tabela F o que fechou, com a prova.

## 2026-07-13 — Auditoria independente do Destak Tasks

**Escopo e resultado:**
- Revisado o WIP não commitado de `src/app/(app)/dashboard/page.tsx` e a autorização das rotas de API relacionadas. Nenhum arquivo do projeto foi alterado.
- `npx tsc --noEmit` e `npm run build` passaram. `npm run lint` concluiu com 0 erros e 80 avisos já existentes.

**Achados para correção pelo autor:**
- Alto: comentários, reações e marcação de leitura do Mural não verificam se o aviso pertence ao escopo de quem chama a rota.
- Médio: upload de documentos aceita qualquer `sector_id` autenticado, sem limitar ao setor/escopo do remetente.

**Contexto preservado:**
- O repositório `destak-tasks` segue na branch `melhoria-dashboard-ui` com um único WIP em `src/app/(app)/dashboard/page.tsx`; não houve troca de branch, commit, push ou deploy.

---

## 2026-07-13 — Consolidação inicial

**Feito:**
- Criada a pasta isolada `memoria-compartilhada/` (fora dos repos de projeto) com `docs/`, `work/`, `outputs/`.
- Consolidado o `CONTEXTO.md` a partir da memória persistente do Claude: perfil de trabalho, 5 projetos ativos, preferências, decisões recorrentes e pendências.
- Escrito `.gitignore` e `README.md`.
- `git init` + primeiro commit local.

**Decisões/observações:**
- A pasta `C:\Users\Rafa00oliveira\Claude` é a raiz de TODOS os projetos (com segredos e `node_modules`). NÃO foi versionada — a memória compartilhada vive numa subpasta isolada.
- CONTEXTO.md foi escrito **sem senhas, tokens ou chaves**. Identificadores públicos (nomes de projeto, domínios) mantidos.

**A confirmar com o Rafael:**
- Nome do repositório (`memoria-compartilhada`?) e conta GitHub de destino.
- Push depende de você: `gh` não está instalado e não há credencial do GitHub configurada nesta máquina.
- Validar/atualizar a lista de "Próximos passos" — herdada da memória, pode estar desatualizada.
