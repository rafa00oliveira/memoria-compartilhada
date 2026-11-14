# Lições do destak-crm e do destak-tasks para o MRP Ibacem (14/11/2026)

Escritas pelo agente do CRM da Destak (Claude Code @ detsak), só leitura, para o dev do MRP (Maestro "dev de pcp 2",
andar PCP 2 do workspace "Univasf estudo"). O Rafael pediu as duas coisas (opção 2c): as lições vão ao dev do MRP e
três delas entraram no kit público v1.4 (`kit-construcao-apps` `56aad0b`: P5.1 número de migration reservado, P5.8
RLS que nega calada, P9.2 `/version.json`).

Como usar: o dev do MRP diz ao Rafael, item por item, o que o MRP já tem (com a prova), o que vale adicionar e o que
não serve, como o dev da Destak fez com as 30 ideias de 13/11. Mudança em banco, infraestrutura ou deploy só com o OK
do Rafael.

---

1) ARQUITETURA
- CRM: React 18 + Vite (SPA) + Supabase (Postgres, Auth, RLS) + Vercel, funções em api/. Tasks: Next.js 16 (middleware virou src/proxy.ts) + shadcn sobre Base UI + Supabase + Vercel.
- Regra das duas desde 06/10: o navegador não escreve no banco; só faz auth, realtime e leitura sob RLS. CRM: acao('modulo.funcao') -> api/acoes.js (despachante único) -> api/_acoes/*.js, com a permissão em código. Tasks: route handler com getCurrentUser + cliente admin.
- Despachante único porque a Vercel Hobby limita a 12 funções; o núcleo fica em _arquivo.js fora do handler, reaproveitado por cron e por teste.
- Dado externo entra por carga agendada e idempotente (Actions 4x/dia lê o Power BI, grava só o dia que mudou, recalcula as tabelas derivadas no banco); nada digitado à mão.
- Fronteira snake/camel num ponto só (toCamel); cor só por token; mobile-first; regra de negócio em tabela de config, nunca chumbada no código.

2) SEGURANÇA
- RLS em todas as tabelas desde a 1ª migration (CRM 36/36, 107 policies; anon não lê nem escreve); service_role e chave de IA só no servidor (prefixo VITE_ vai para o bundle).
- Quem enxerga quem mora numa função só (minha_equipe()). Indicador agregado = security definer com a checagem de papel dentro; security invoker sobre várias RLS deu número diferente por perfil (21/09).
- Policy que chama função: usar (select f()) para virar InitPlan; medido 8,8 s -> 16 ms.
- Cliente admin = createClient(url, serviceKey) sem cookies; com os cookies do @supabase/ssr a RLS roda como o usuário e o update devolve 0 linhas com error null (outro app, mesma stack).
- Tasks começou com RLS USING(true) e permissão só na API (dívida consciente); hoje roda rls:audit depois de cada migration. Não tinha troca de senha (contas presas na senha inicial); trocar senha revoga o refresh token.
- Auditorias: jul (26 achados, 3 críticos), Codex 29/07, segurança 18/09 (nada crítico nem alto). Abertos: headers de segurança no vercel.json e backup automático do banco do CRM.

3) BANCO E MIGRATIONS
- Arquivo numerado em supabase/migrations, re-executável (create or replace, if not exists), aplicado por script em transação única que registra em config.migracoes e recusa reaplicar; o teste roda logo depois.
- O número colidiu 3 vezes entre sessões paralelas (27/10): reservar olhando todas as branches (git log --all -- supabase/migrations).
- Migration que muda policy sobe junto com o front, na ordem push -> deploy Ready -> migration. A RLS nega calada (devolve lista vazia, sem erro).
- Plano grátis de 500 MB: upsert recorrente e ensaio com rollback incham o banco (454 MB eram inchaço; voltou a 278 MB com reindex + vacuum full); o log do pg_cron cresce para sempre.
- PostgREST: delete/update sem WHERE morre (pg_safeupdate), até dentro de RPC; upsert em lote usa as colunas do 1º objeto; head:true em tabela inexistente volta count nulo sem erro.
- Backup: o Tasks grava JSON gzip diário de 31 tabelas no R2 (tabela nova TEM que entrar na lista); o CRM ainda não tem.

4) DEPLOY
- Push no master = produção. /version.json com o sha do build prova o que está no ar; o ignoreCommand pula o deploy de commit que só mexe em docs.
- Crons da Vercel não respeitam a ordem (38 min de atraso): o dependente chama o núcleo do outro, e a prova de execução é um carimbo no banco. O schedule do Actions atrasa 3 a 5 h, então o disparo vem do cron da Vercel.
- Já houve push sem deploy (21/10) e deploy preso por incidente da Vercel (18/09): conferir o status da Vercel antes de redisparar.
- Hobby: 12 funções e uso comercial fora dos termos (Pro custa ~US$ 20/mês). Supabase grátis: 2 projetos ativos por pessoa, somando as orgs; projeto pausado = fetch failed.
- Worktree por frente e commit de checkpoint antes de soltar agentes (um patch sumiu num rebase abortado, 24/09). Tasks: a branch divergiu do master, então publicar é worktree + cherry-pick, e a worktree precisa do .env.local para o pre-push buildar.

5) QUALIDADE
- 71 scripts teste*.mjs (puros e de banco com rollback); cada item do CONTEXTO traz o comando que o prova e a data. CI com build + check; pre-push com npm run check no Tasks.
- Plano -> revisão por outra IA -> construir -> inspeção por quem não construiu (agente sem contexto ou outra família); teste de tela com conta descartável, nunca com conta real.
- Vigia diário (deploy, frescor da carga, RLS, tamanho do banco, RPC lenta, testes em rodízio) comparado com a véspera; falso positivo se corrige no script.
- Erro do navegador gravado em tabela; aviso automático diz a causa e quem resolve (sino + push). CONTEXTO.md com Estado provado, ARMADILHAS.md (uma linha por depuração) e SESSION_LOG.

6) O QUE QUEBROU EM PRODUÇÃO
- jul: 2 estouros de cota do Firestore no mesmo dia -> migração para o Supabase (05 e 06/07).
- 04/09: projeto Supabase pausado -> fetch failed em tudo. 09/09: cron dependente rodou antes do outro.
- 14/09: RPC com delete sem WHERE quebrou ao ser chamada pelo PostgREST. Set (0024): policy nova subiu sem o front -> vendedor vendo 0 por 1,5 dia.
- 04/10: a API do Power BI corta a resposta acima de 15 MB e devolve HTTP 200 -> dado faltando sem aviso.
- 06/10 (apps Next.js): migration aplicada antes do push -> escrita quebrada até publicar; cliente admin com cookies -> sucesso na tela sem gravar nada.
- 12 a 16/10, 07 a 10/11 e desde 12/11: gateway do Power BI fora (máquina de terceiro). Depois de 4 falhas a agenda desliga; na 1ª vez o CRM congelou calado, hoje a carga recusa dado velho e avisa com a causa.

7) REPETIR / NÃO REPETIR
- Repetir: front sem escrita + despachante; RLS e teste por papel desde a 1ª migration; uma função de escopo; migration por script com registro; version.json; carga idempotente com guarda de frescor; vigia diário; CONTEXTO + ARMADILHAS; revisão por outra IA; config em tabela; conta de teste descartável.
- Não repetir: começar em Firestore; RLS permissiva "por enquanto"; fallback que esconde coluna faltando; branch longa divergida do master; sessões paralelas sem reservar número de migration; plano grátis sem backup; tudo direto no master sem staging; depender de máquina de terceiro sem alarme.
