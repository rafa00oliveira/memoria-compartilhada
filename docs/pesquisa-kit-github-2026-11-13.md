# Projetos parecidos com o kit de construção de apps: o que copiar e o que não copiar

Pesquisa de 13/11/2026, só leitura (nada instalado). Estrelas e datas colhidas pelo `gh api` às 23h41 UTC de 13/11/2026.

## Resumo

- **15 projetos** do GitHub analisados (seção 1) e **30 ideias** que o kit ainda não tem (seção 3), cada uma com fonte,
  passo do kit, custo e veredito para MVP.
- Das 30, **21 valem para um MVP** de faculdade ou de pequena empresa (no todo ou em parte), **6 ficam para o N3 ou
  para projeto maior** (A4, C1, D1, E4, G1, G3) e **3 são complexidade a mais** para MVP (B3, D5, F4).
- O kit já está igual ou à frente dos projetos achados em níveis de risco, prova antes de "pronto", trava de alvo,
  revisão por outra família de IA, poka-yoke e operação (seção 5). As lacunas reais ficam no detalhe do Supabase
  (RLS e Auth), na cadeia de dependências do npm, no formato da especificação e em travas aplicadas no próprio agente.

### Se for adotar pouco, nesta ordem

1. **E1**: sete armadilhas de RLS que o P5 não lista (`WITH CHECK`, `TO authenticated` sem dono, Storage...). Custo baixo.
2. **F1 + F2**: `getClaims()` no servidor e camada de dados com `import 'server-only'`. Custo baixo.
3. **D1 + D2**: ações do CI fixadas por SHA e um `.npmrc` com quarentena de versão e bloqueio de dependência por git/URL.
4. **E2**: teste `tests.rls_enabled('public')` já no N2; suíte pgTAP por papel no N3.
5. **B1 + A1 + A2**: bug com "o que não pode mudar"; fatias e suposições no `PROJETO.md`.
6. **C2**: `permissions.deny` no `.claude/settings.json` do projeto.

## Método e limites

- Busca com `gh search repos` em 24 termos (spec-kit, AGENTS.md, cursorrules, Claude Code best practices, pgTAP,
  Supabase RLS testing, ADR, production readiness, vibe coding security, slopsquatting, spec driven development,
  Next.js + Supabase starter, entre outros). Estrelas por `gh api repos/<dono>/<repo>`; último commit por
  `gh api repos/<dono>/<repo>/commits?per_page=1`, no branch padrão.
- De cada projeto abri o README e os arquivos citados, pelo `gh api` (conteúdo do arquivo). Os links do relatório
  apontam para esses mesmos arquivos no GitHub. O repositório do Kiro é só o rastreador de issues; as páginas da
  documentação dele (kiro.dev) abri por `curl`, todas com HTTP 200.
- Para não chamar de "falta" o que o kit já tem, li o próprio kit em
  `~/Claude/memoria-compartilhada/kit-construcao-apps/` (manual, ciclo, poka-yoke, prompts e modelos), só leitura.
- Documentação oficial lida dentro dos repositórios `supabase/supabase` (branch `master`) e `vercel/next.js`
  (branch `canary`). Entram como fonte de ideia, não como projeto da lista.
- Abri e deixei fora da lista, para ficar em 15: `architecture-decision-record/architecture-decision-record`
  (17.464 estrelas; a ideia útil dele, ligar a decisão a um teste, já está no MADR) e `buildermethods/agent-os`
  (5.603 estrelas; o README não traz conteúdo técnico, a documentação fica no site do autor).
- **Não abri:** links citados dentro dos READMEs e não listados aqui (por exemplo Decision Guardian e ADR Guard,
  citados no repositório de ADR acima, e qualquer biblioteca de teste por propriedade). **Não conferi na fonte
  original** números de terceiros: os 19,7% de pacotes inventados citados pela OpenSSF, as CVEs, os incidentes e os
  números de auditoria citados no `vibe-coding-security`.

## 1. Projetos

| # | Projeto | Estrelas | Último commit | O que é |
|---|---|---:|---|---|
| 1 | [github/spec-kit](https://github.com/github/spec-kit) | 149.690 | 12/11/2026 | Kit da GitHub de spec-driven development: constituição, especificação, clarificação, plano, tarefas e implementação por comandos no agente, com extensões de bugfix e de avaliação de ideia. |
| 2 | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | 74.803 | 13/11/2026 | SDD leve: cada mudança vira uma pasta com proposta, especificação em delta (ADDED/MODIFIED/REMOVED), design e tarefas; ao arquivar, o delta entra na especificação viva. |
| 3 | [kirodotdev/Kiro](https://github.com/kirodotdev/Kiro) | 4.468 | 05/11/2026 | Rastreador público de issues da IDE Kiro (AWS). O código do produto não está lá; as specs (EARS, bugfix spec, teste por propriedade) estão na documentação em kiro.dev. |
| 4 | [agentsmd/agents.md](https://github.com/agentsmd/agents.md) | 25.481 | 10/09/2026 | O formato aberto AGENTS.md e o site agents.md (Next.js), com exemplo e perguntas frequentes. |
| 5 | [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) | 69.039 | 13/11/2026 | Coletânea de práticas de Claude Code: 84 dicas com fonte, referência de `settings.json`, fluxos com outros modelos. |
| 6 | [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) | 41.157 | 30/05/2026 | Coleção comunitária de regras do Cursor (`.mdc`): 257 entradas em `rules/`, 7 com Supabase no nome. |
| 7 | [ossf/wg-best-practices-os-developers](https://github.com/ossf/wg-best-practices-os-developers) | 1.089 | 13/11/2026 | Grupo de trabalho da OpenSSF; tem o "Security-Focused Guide for AI Code Assistant Instructions", de 01/08/2025. |
| 8 | [anthropics/claude-code-security-review](https://github.com/anthropics/claude-code-security-review) | 6.883 | 11/02/2026 | GitHub Action que usa o Claude para revisar a segurança do diff do PR e comentar, mais o comando `/security-review`. |
| 9 | [supabase/agent-skills](https://github.com/supabase/agent-skills) | 3.054 | 02/10/2026 | Skills oficiais do Supabase para agentes (`supabase` e `supabase-postgres-best-practices`), com checklist de armadilhas de segurança. |
| 10 | [usebasejump/supabase-test-helpers](https://github.com/usebasejump/supabase-test-helpers) | 133 | 13/04/2024 | Funções pgTAP para testar Supabase: criar usuário de teste, entrar como ele, conferir RLS ligada no schema. |
| 11 | [imbhargav5/nextbase-nextjs-supabase-starter](https://github.com/imbhargav5/nextbase-nextjs-supabase-starter) | 833 | 02/10/2026 | Starter Next.js 16 + Supabase com CI (lint, typecheck, teste unitário), Playwright contra Supabase local e um arquivo com 42 testes pgTAP. |
| 12 | [adr/madr](https://github.com/adr/madr) | 2.638 | 28/08/2026 | Modelo Markdown de registro de decisão (MADR), em quatro variantes. |
| 13 | [mercari/production-readiness-checklist](https://github.com/mercari/production-readiness-checklist) | 949 | 17/05/2021 | Checklist de prontidão para produção da Mercari, para microsserviços em Go, Kubernetes e GCP, com níveis A, B e C definidos por SLO. |
| 14 | [boxed-dev/vibe-coding-security](https://github.com/boxed-dev/vibe-coding-security) | 15 | 09/08/2026 | Checklist de 69 itens antes de publicar app feito com IA (Lovable, v0, Bolt, Cursor), centrado em Supabase; o README vende um kit pago. |
| 15 | [MarinJursic/production-readiness-checklist](https://github.com/MarinJursic/production-readiness-checklist) | 43 | 03/09/2026 | 10.042 controles de prontidão com scanner local e modelos de registro de evidência e de exceção de risco. |

Fontes oficiais abertas (fora da contagem): Supabase,
[creating-a-client.mdx](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/auth/server-side/creating-a-client.mdx),
[security/production-checklist.mdx](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/security/production-checklist.mdx),
[going-into-prod.mdx](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/deployment/going-into-prod.mdx),
[npm-security.mdx](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/security/npm-security.mdx),
[database/testing.mdx](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/testing.mdx),
[pgtap-extended.mdx](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/local-development/testing/pgtap-extended.mdx);
Next.js,
[production-checklist.mdx](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/production-checklist.mdx),
[data-security.mdx](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/data-security.mdx),
[content-security-policy.mdx](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/content-security-policy.mdx);
Kiro, [feature-specs](https://kiro.dev/docs/specs/feature-specs/),
[bugfix-specs](https://kiro.dev/docs/specs/bugfix-specs/), [correctness](https://kiro.dev/docs/specs/correctness/).

## 2. Escala usada

- **Custo:** baixo = até 1 hora, sem dependência nova; médio = meio dia a um dia, ou uma ferramenta ou dependência
  nova; alto = mais de um dia, ou custo recorrente (minutos de CI, API paga).
- **MVP:** "vale" = entra já no MVP de faculdade ou de pequena empresa; "só N3" = só quando há cliente, dinheiro ou
  dado pessoal; "complexidade a mais" = não compensa no MVP.

## 3. Ideias que o kit não tem

### A. Especificação (P1, `modelos/PROJETO.md`)

| # | Ideia | Onde está | Entra em | Custo | MVP |
|---|---|---|---|---|---|
| A1 | Histórias em fatias priorizadas (P1, P2, P3), cada uma testável e entregável sozinha: feita só a primeira, já existe um MVP. Junto, construir por fatia vertical (banco + servidor + tela de uma funcionalidade), e não por camada (todo o banco, depois toda a API, depois as telas), que é o padrão da IA e atrasa o primeiro teste de ponta a ponta. | spec-kit, [spec-template.md](https://github.com/github/spec-kit/blob/main/templates/spec-template.md?plain=1#L11-L25); claude-code-best-practice, [README, dica "vertical slices"](https://github.com/shanraisshan/claude-code-best-practice/blob/main/README.md?plain=1#L225) | P1 e `PROJETO.md` (coluna "Fatia" em Telas e Critérios); Ciclo, Portão 1 item 3 | baixo | vale: é o jeito de cortar o MVP que o P0 pede |
| A2 | Seção "Suposições": o que a IA preencheu por padrão porque o pedido não dizia. Pendência é o que ninguém decidiu; suposição é o que a IA já decidiu e o dono precisa ver. | spec-kit, [spec-template.md, Assumptions](https://github.com/github/spec-kit/blob/main/templates/spec-template.md?plain=1#L120-L131) | `PROJETO.md`, ao lado de Pendências | baixo | vale |
| A3 | Varredura de ambiguidade por categorias (fora do escopo, papéis, ciclo de vida do registro, volume de dados, estados vazio/erro/carregando, desempenho, segurança e privacidade, falha de integração, edição simultânea, glossário, critério testável, adjetivo vago como "robusto"), com no máximo 5 perguntas e a resposta gravada na especificação, não no chat. | spec-kit, [commands/clarify.md](https://github.com/github/spec-kit/blob/main/templates/commands/clarify.md?plain=1#L73-L130) | Ciclo, Portão 1 item 2; Prompt 1 | baixo | vale: o Portão 1 já manda perguntar pouco e com opção; falta a lista do que perguntar |
| A4 | Checklist da qualidade da especificação ("teste unitário do português"): perguntas sobre o texto ("'rápido' está quantificado?", "a especificação diz o que acontece se X falhar?"), nunca sobre o código; só o revisor marca. | spec-kit, [commands/checklist.md](https://github.com/github/spec-kit/blob/main/templates/commands/checklist.md?plain=1#L9-L37) | Prompt 4, revisando a especificação antes do plano | baixo | só N3; no N2 a A3 basta |
| A5 | Exceção ao padrão com justificativa: no plano, a tabela "o que foge do padrão / por que precisa / alternativa mais simples recusada porque". Freia a IA que acrescenta camada, biblioteca ou tabela "para o futuro". | spec-kit, [plan-template.md, Complexity Tracking](https://github.com/github/spec-kit/blob/main/templates/plan-template.md?plain=1#L106-L113) | Ciclo, Portão 2; Prompt 2 | baixo | vale: complementa o "cortar o especulativo" do Portão 1 |
| A6 | Mudança descrita como delta da especificação (ACRESCENTA / MUDA / REMOVE requisito), colado no PR. | OpenSpec, [existing-projects.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/existing-projects.md?plain=1#L27-L35) e [concepts.md, Delta Specs](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md?plain=1#L348) | P7.3 (corpo do PR de risco); P1.4 (sistema que já existe) | baixo, sem instalar a CLI | vale em projeto existente; o kit já manda atualizar a especificação na mesma mudança (P8.7), o delta só facilita a revisão |

### B. Ciclo da tarefa

| # | Ideia | Onde está | Entra em | Custo | MVP |
|---|---|---|---|---|---|
| B1 | Bug em três blocos, cada um com teste: comportamento atual (defeito), esperado, e o que não pode mudar ("WHEN ... THE SYSTEM SHALL CONTINUE TO ..."). | Kiro, [bugfix-specs](https://kiro.dev/docs/specs/bugfix-specs/) | Ciclo, Portão 3 item 4; Prompt 2 | baixo | vale: hoje o portão diz "nada mais quebrou" sem obrigar a listar o que precisa continuar igual |
| B2 | Autocrítica antes da revisão externa: "revise sua resposta e ache problemas", depois "com base nisso, melhore" (chamada de RCI no guia). | OSSF, [guia, TL;DR](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.md?plain=1#L19) | Ciclo, Portão 2, antes de mandar à outra IA | nenhum | vale como passo barato; não substitui a revisão por outra família |
| B3 | Teste por propriedade para regra de dinheiro e estoque: em vez de um exemplo, uma regra que vale para qualquer entrada ("para qualquer pedido válido, a soma das parcelas é igual ao total"), testada com centenas de entradas geradas. | Kiro, [correctness](https://kiro.dev/docs/specs/correctness/) | P7.6 | médio: dependência nova de desenvolvimento e aprender a escrever propriedade | complexidade a mais; só N3, em conta de dinheiro, estoque ou MRP |

### C. Arquivos-base e travas no agente (P2, P3, P12, modelos)

| # | Ideia | Onde está | Entra em | Custo | MVP |
|---|---|---|---|---|---|
| C1 | Regra por pasta: AGENTS.md aninhado (o mais próximo do arquivo editado vence) ou regra com filtro de caminho (`.claude/rules/*.md` com `paths:`; `.mdc` do Cursor com `globs:`). Exemplo: as regras de migration em `supabase/migrations/AGENTS.md`, lidas só quando o agente mexe ali. | agents.md, [HowToUseSection.tsx](https://github.com/agentsmd/agents.md/blob/main/components/HowToUseSection.tsx#L35-L38) e [FAQSection.tsx](https://github.com/agentsmd/agents.md/blob/main/components/FAQSection.tsx#L18-L20); claude-code-best-practice, [README, dicas de CLAUDE.md e rules](https://github.com/shanraisshan/claude-code-best-practice/blob/main/README.md?plain=1#L255-L256) | P2; modelos | baixo | só quando o AGENTS.md da raiz passar de 200 linhas (meta citada no claude-code-best-practice); N2 não precisa. Não conferi como o Claude Code lê um AGENTS.md de subpasta sem um CLAUDE.md ao lado |
| C2 | Trava no próprio agente, além do texto: `.claude/settings.json` do projeto com `permissions.deny` para os comandos que o kit proíbe (no estilo `Bash(git push --force *)`, `Bash(supabase db push *)`, deploy de produção pela CLI). Regra `deny` tem precedência sobre `allow` e `ask`. A regra escrita depende de a IA obedecer; o `deny` barra o comando. | claude-code-best-practice, [claude-settings.md](https://github.com/shanraisshan/claude-code-best-practice/blob/main/best-practice/claude-settings.md?plain=1#L72) e [README, dica de settings.json](https://github.com/shanraisshan/claude-code-best-practice/blob/main/README.md?plain=1#L262) | P3 (junto da trava de alvo); P12; modelos | baixo; testar a sintaxe no projeto | vale para quem usa Claude Code; Codex e Cursor têm mecanismo próprio, que não conferi |
| C3 | Armadilha em par "NUNCA / SEMPRE", com o código errado e o certo lado a lado. | awesome-cursorrules, [nextjs15-supabase, RULE 1](https://github.com/PatrickJS/awesome-cursorrules/blob/main/rules/nextjs15-supabase-cursorrules-prompt-file.mdc?plain=1#L20-L32) | `modelos/AGENTS.md`, só para as 3 a 5 armadilhas mais caras do projeto | baixo | vale, com o conteúdo conferido na documentação atual (essa mesma regra está desatualizada; ver seção 4) |
| C4 | Varrer os arquivos de regra da IA (AGENTS.md, CLAUDE.md, `.cursor/rules`, `copilot-instructions.md`) atrás de Unicode invisível e revisá-los como código sensível. | vibe-coding-security, [README, item 55](https://github.com/boxed-dev/vibe-coding-security/blob/main/README.md?plain=1#L96-L109) | P12 (linha "instrução escondida"); P4 (um passo de busca no CI) | baixo | vale: o kit trata ordem escondida no que a IA lê, não no arquivo de regra do próprio repositório |

### D. CI e cadeia de dependências (P4, P12)

| # | Ideia | Onde está | Entra em | Custo | MVP |
|---|---|---|---|---|---|
| D1 | Fixar cada ação do GitHub pelo SHA do commit, não pela tag. O `modelos/ci.yml` usa `@v7` e `@v3`. | OSSF, [guia, instrução de CI/CD](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.md?plain=1#L66) | P4; `modelos/ci.yml` | baixo; atualizar o SHA fica manual ou com o Dependabot de versão (não conferi a configuração) | só N3; no N2, opcional |
| D2 | Quarentena de versão nova e bloqueio de dependência exótica num `.npmrc`: `min-release-age=7` (não instala versão publicada há menos de 7 dias) e `allow-git=root`, `allow-remote=root`, `allow-file=root`, `allow-directory=root` (dependência indireta não puxa código de git ou URL). Age no `npm install` da máquina, onde a IA acrescenta pacote; o `npm ci` do CI já segue o lockfile. | Supabase, [npm-security.mdx, quarentena](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/security/npm-security.mdx#L68-L127) e [dependência exótica](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/security/npm-security.mdx#L191-L219) | P12; novo `modelos/.npmrc` | baixo; a própria página avisa que npm antigo não tem `min-release-age`: conferir no npm instalado | vale. Conflito a escrever no kit: o P12 pede o `next` na última versão de correção no N3, e correção de segurança urgente precisa furar a quarentena de propósito |
| D3 | `npm audit signatures` no CI: confere a assinatura do registro e a proveniência dos pacotes. | Supabase, [npm-security.mdx, proveniência](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/security/npm-security.mdx#L148-L170) | P4, depois do `npm ci` | baixo | vale; testar antes num projeto, porque não sei se algum pacote sem assinatura derruba o job |
| D4 | Revisão de segurança com régua: só achado com mais de 80% de confiança de exploração, nota de 1 a 10, lista de exclusões (negação de serviço, limite de taxa, open redirect sem impacto provado) e um segundo passo que tenta derrubar cada achado como falso positivo. | claude-code-security-review, [security-review.md](https://github.com/anthropics/claude-code-security-review/blob/main/.claude/commands/security-review.md?plain=1#L36-L40) e [README, filtro](https://github.com/anthropics/claude-code-security-review/blob/main/README.md?plain=1#L109-L118) | Prompt 4 | baixo como prompt; alto como Action (chave de API e custo por PR) | o prompt vale; a Action, não (seção 4) |
| D5 | Teste de ponta a ponta (Playwright) no CI contra um Supabase local (`supabase start`, com o Inbucket recebendo o e-mail de login). | nextbase, [integration-tests.yml](https://github.com/imbhargav5/nextbase-nextjs-supabase-starter/blob/main/.github/workflows/integration-tests.yml#L56-L113) | P4; P8.4 (hoje a tela é conferida à mão) | alto: Docker no runner, minutos da cota de 2.000 por mês citada no P4, teste de tela quebradiço | complexidade a mais; no N3, no máximo 1 ou 2 fluxos (login e a gravação principal) |

### E. Banco, Supabase e Auth (P5, P6, P8)

| # | Ideia | Onde está | Entra em | Custo | MVP |
|---|---|---|---|---|---|
| E1 | Sete armadilhas que o P5.5 não lista: (a) policy de UPDATE precisa de `USING` e `WITH CHECK`, senão o usuário passa a linha para outro dono; (b) UPDATE sem policy de SELECT devolve 0 linhas, sem erro; (c) `TO authenticated` sozinho autentica mas não autoriza (IDOR) se faltar o predicado de dono (o kit já proíbe `using (true)`, que é o caso extremo); (d) `auth.role()` está obsoleto, usar `TO`; (e) apagar o usuário não invalida o token já emitido; (f) no Storage, upsert pede INSERT, SELECT e UPDATE; (g) nunca usar `security definer` para "resolver" erro de permissão. | supabase/agent-skills, [skills/supabase/SKILL.md](https://github.com/supabase/agent-skills/blob/main/skills/supabase/SKILL.md?plain=1#L38-L71) | P5.5; a prova de RLS do P5.8 (cada item vira uma tentativa que precisa ser recusada) | baixo | vale; é o item de maior retorno da lista |
| E2 | Prova de RLS em SQL com pgTAP: `supabase test db` roda os arquivos de `supabase/tests/`, cada um entre `begin` e `rollback`; os helpers criam usuários (`tests.create_supabase_user`), entram como eles (`tests.authenticate_as`) e conferem RLS ligada no schema inteiro (`tests.rls_enabled('public')`). | supabase-test-helpers, [README](https://github.com/usebasejump/supabase-test-helpers/blob/main/README.md) e [99-blog-example.sql](https://github.com/usebasejump/supabase-test-helpers/blob/main/supabase/tests/99-blog-example.sql); Supabase, [testing.mdx](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/testing.mdx) e [pgtap-extended.mdx](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/local-development/testing/pgtap-extended.mdx#L84-L97) | P5.8; P4 | médio: Docker local, aprender pgTAP; no CI, `supabase start` | o teste de uma linha `tests.rls_enabled('public')` vale já no N2; a suíte por papel, só no N3, onde roda num banco local descartável e alivia a trava de alvo, que hoje protege um banco de teste remoto. Ressalva: os helpers não recebem commit desde 13/04/2024, e a documentação do Supabase ainda manda instalá-los |
| E3 | Rodar os advisors do Supabase antes de gerar a migration: `supabase db advisors` (CLI 2.81.3 ou mais nova) ou `get_advisors` pelo MCP. | supabase/agent-skills, [SKILL.md](https://github.com/supabase/agent-skills/blob/main/skills/supabase/SKILL.md?plain=1#L141-L146); Supabase, [going-into-prod.mdx, Performance Advisor](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/deployment/going-into-prod.mdx#L17-L24) | P5 (prova); P8.3 | baixo | vale, como passo local: no CI exigiria credencial do projeto, que o kit mantém fora do CI |
| E4 | Conta e Auth de produção: MFA na conta do Supabase, mais de um dono na organização (o acesso não se perde se o único dono sumir ou perder a conta), validade do OTP de 3600 s ou menos, remover números de telefone de teste, SMTP próprio. Com SMTP próprio, o limite padrão é de 30 novos usuários por hora. Estender o MFA a GitHub e Vercel é sugestão minha, não da fonte. | Supabase, [security/production-checklist.mdx](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/security/production-checklist.mdx#L42-L60) e [going-into-prod.mdx](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/deployment/going-into-prod.mdx#L36-L38) | P8.5; P6 | baixo | MFA e segundo dono: só N3. SMTP próprio é complexidade a mais enquanto o cadastro público estiver desligado, como o P8.5 manda |

### F. Servidor e tela (P7, P9, poka-yoke)

| # | Ideia | Onde está | Entra em | Custo | MVP |
|---|---|---|---|---|---|
| F1 | No servidor, `supabase.auth.getClaims()`, que verifica a assinatura do token; nunca `getSession()`, que lê o cookie sem revalidar. O P7.4 diz "confere login e papel no servidor", mas não diz com qual chamada. | Supabase, [creating-a-client.mdx](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/auth/server-side/creating-a-client.mdx#L293-L297) | P7.4; `modelos/AGENTS.md` | nenhum | vale |
| F2 | Camada de acesso a dados só de servidor: módulo com `import 'server-only'` (o build quebra se um componente cliente o importar), que confere o papel e devolve só os campos que a tela usa (DTO). A documentação diz que o Next trata esse import internamente; o pacote só precisa ser instalado se o lint reclamar. | Next.js, [data-security.mdx, DAL](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/data-security.mdx#L56-L66) e [server-only](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/data-security.mdx#L243-L262); [production-checklist.mdx](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/production-checklist.mdx#L100) | P7.4; Poka-yoke 3.6 (dispositivo de contato que barra no build) | baixo | vale |
| F3 | Itens de borda que faltam no P7 e no P8: redirecionamento depois do login só para caminho interno (o `?next=` aceita lista fechada, item 24); assinatura de webhook conferida com comparação em tempo constante (item 19); nenhuma rota de debug ou teste no ar (item 35); usuário não grava campo sensível mandando-o no corpo, como `papel: 'admin'` (mass assignment, item 18). | vibe-coding-security, [README, itens 18, 19, 24 e 35](https://github.com/boxed-dev/vibe-coding-security/blob/main/README.md?plain=1#L48-L79) | P7.4; Poka-yoke 3.2 | baixo cada | vale quando o app tiver login com retorno, webhook ou rota de teste. O mass assignment o kit já trata em parte, com zod (S1) e `update` por coluna (P5.7) |
| F4 | Limite de taxa no login e em operação cara. | Next.js, [production-checklist.mdx](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/production-checklist.mdx#L100); Supabase, [going-into-prod.mdx, rate limits e CAPTCHA](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/deployment/going-into-prod.mdx#L56-L92); vibe-coding-security, item 16 | P7; P8 | baixo se ficar nos limites e no CAPTCHA que o Supabase Auth já tem; médio a alto com limite próprio, que pede um armazenamento compartilhado | complexidade a mais com cadastro desligado e poucos usuários; vale no N3 aberto ao público |
| F5 | Cabeçalhos de segurança: `X-Frame-Options` (citado pela OSSF e pelo item 36 do vibe-coding-security) e, depois, CSP. A CSP com nonce obriga renderização dinâmica; a alternativa por hash (SRI) é experimental. | Next.js, [content-security-policy.mdx, nonce](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/content-security-policy.mdx#L38) e [SRI](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/content-security-policy.mdx#L458); OSSF, [guia](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.md?plain=1#L130) | P9 (`next.config`) | baixo para `X-Frame-Options`; médio a alto para CSP estrita (página com nonce deixa de ser estática; script de terceiro quebra) | `X-Frame-Options` vale; CSP estrita é complexidade a mais no MVP |

### G. Operação e registros (P10, `modelos/decisao.md`)

| # | Ideia | Onde está | Entra em | Custo | MVP |
|---|---|---|---|---|---|
| G1 | Uma cópia do backup fora do alcance do agente. Hoje o dump vai para OneDrive ou Drive, que um agente rodando na mesma máquina alcança. | vibe-coding-security, [README, item 54](https://github.com/boxed-dev/vibe-coding-security/blob/main/README.md?plain=1#L96-L109) | P10.1 | baixo | só N3 |
| G2 | "Como confirmar" na decisão: que teste ou checagem mostra que a decisão continua valendo (o MADR chama de Confirmation e cita fitness function). | MADR, [adr-template.md, Confirmation](https://github.com/adr/madr/blob/develop/template/adr-template.md?plain=1#L42-L45) | `modelos/decisao.md` | baixo | vale: liga a decisão à prova, como o resto do kit |
| G3 | Risco aceito com prazo de validade: dono do risco, controle compensatório com prova (o que está só planejado não conta), data de correção e data em que a exceção vence sozinha. O `decisao.md` já pede "escreva o risco com todas as letras" e "Quando rever"; faltam "vence em" e "o que compensa, com prova". | MarinJursic, [risk-exception.md](https://github.com/MarinJursic/production-readiness-checklist/blob/main/docs/records/risk-exception.md) | `modelos/decisao.md` | baixo | só N3 |

## 4. O que não vale copiar, e por quê

1. **O spec-kit inteiro.** São seis ou mais comandos por funcionalidade (constituição, especificação, clarificação,
   checklist, plano, tarefas, análise, implementação, convergência), além de extensões, presets, bundles e catálogos.
   O próprio README do OpenSpec o chama de "thorough but heavyweight"
   ([README](https://github.com/Fission-AI/OpenSpec/blob/main/README.md?plain=1#L185-L187)). Para MVP, o
   `PROJETO.md` e o ciclo de quatro portões cobrem o essencial; vale pegar só os campos das ideias A1 a A5.
2. **Instalar a CLI do OpenSpec ou do spec-kit.** O kit funciona com qualquer agente e sem ferramenta própria. O
   formato do delta (A6) se copia sem instalar nada.
3. **O Kiro como ferramenta.** É uma IDE própria, o repositório só recebe issues e a API do GitHub não mostra licença
   nele. Vale copiar o formato do bugfix (B1), não adotar a IDE.
4. **Regras do awesome-cursorrules em bloco.** Regra comunitária envelhece sem aviso. A de Next.js 15 + Supabase
   (último commit no arquivo em 13/05/2026) acerta o principal, nunca `getSession()` no servidor, mas manda usar
   `getUser()` e chama o arquivo de sessão de `middleware`, enquanto a documentação atual do Supabase manda
   `getClaims()` e fala em Proxy, o nome do Next 16. Copiar importa a "API antiga" que o próprio P12 combate. A regra
   ainda abre com "You are an expert..." e "Follow ALL rules below unconditionally"; a OSSF não recomenda persona
   no caso geral ([guia, linha 109](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.md?plain=1#L109)).
5. **O vibe-coding-security como portão.** "Se não conseguir marcar os 69, não publique" vira teatro de checklist num
   MVP. Muitos itens não se aplicam ao stack (NoSQL, RAG e banco vetorial, especificação do MCP). Dois conselhos
   pedem cuidado: cookie de sessão com `SameSite=Strict` (item 8) faz quem chega por link de outro site, como e-mail
   ou WhatsApp, chegar sem sessão na primeira página; magic link preso ao IP ou ao aparelho (item 5) quebra quando a
   pessoa pede no computador e abre o e-mail no celular. O README vende um kit pago de US$ 10, a API do GitHub não
   mostra licença, e não conferi as CVEs e os números que ele cita.
6. **Os 10.042 controles do MarinJursic.** O scanner com contrato assinado e a escala de controles não cabem num MVP.
   Vale só o modelo de exceção de risco (G3).
7. **O checklist da Mercari.** Último commit em 2021, feito para microsserviço em Go, Kubernetes e GCP, com plantão e
   SLO de 99,9% no nível A. Os níveis por SLO não servem para app de faculdade; os níveis do kit, por risco de dado e
   de dinheiro, já fazem o papel.
8. **O banco do starter nextbase.** A migration
   [20260627094211_add_explicit_grants.sql](https://github.com/imbhargav5/nextbase-nextjs-supabase-starter/blob/main/apps/database/supabase/migrations/20260627094211_add_explicit_grants.sql#L22-L24)
   faz `GRANT ALL ON TABLE` a `anon` e `authenticated`, inclusive em `private_items`, e deixa a RLS como única
   barreira: o contrário do P5.7. O arquivo com 42 testes pgTAP existe, mas nos dois workflows que abri
   ([ci.yml](https://github.com/imbhargav5/nextbase-nextjs-supabase-starter/blob/main/.github/workflows/ci.yml#L75)
   e integration-tests.yml) não há `supabase test db`: o script se chama `test-db` em
   [apps/database/package.json](https://github.com/imbhargav5/nextbase-nextjs-supabase-starter/blob/main/apps/database/package.json#L11)
   e o CI roda `pnpm run test`. Não abri os outros três workflows. Copiar a estrutura sem conferir dá a falsa
   impressão de RLS testada.
9. **A Action claude-code-security-review.** O exemplo de uso fixa a ação em `@main`
   ([README, linha 37](https://github.com/anthropics/claude-code-security-review/blob/main/README.md?plain=1#L37)),
   o oposto da D1. O README avisa que ela não é resistente a prompt injection e só deve revisar PR confiável
   ([linha 45](https://github.com/anthropics/claude-code-security-review/blob/main/README.md?plain=1#L45)). Cobra API
   a cada PR e, se o código foi construído com o Claude, o revisor é da mesma família, o que o P7.2 evita. O último
   commit é de 11/02/2026.
10. **As partes da OSSF fora do stack.** SBOM, in-toto, cosign, contêiner e as regras de C, C++ e Rust não se aplicam a
    um app na Vercel. O próprio guia manda extrair só o que é relevante, porque o trecho irrelevante faz a IA se
    defender de ataques que não podem acontecer
    ([linhas 27 e 28](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.md?plain=1#L27-L28)).
11. **Parte das dicas do claude-code-best-practice.** Vêm de posts e mudam rápido. "prototype > PRD — build 20-30
    versions" ([linha 228](https://github.com/shanraisshan/claude-code-best-practice/blob/main/README.md?plain=1#L228))
    serve para um site N1, não para CRM ou ERP com dado de cliente. Dicas de modo automático de permissão e de
    roteador de modelo são da ferramenta, não de um manual de construção.

## 5. O que o kit já faz melhor ou igual

- **Níveis de risco com matriz passo × nível.** Na forma, igual à Mercari (níveis A, B e C, com a matriz verificação ×
  nível em [design-checklist.md](https://github.com/mercari/production-readiness-checklist/blob/master/docs/references/design-checklist.md));
  para MVP, o critério do kit (dado de cliente, dinheiro, dado pessoal) serve melhor que o SLO
  ([production-readiness-level.md](https://github.com/mercari/production-readiness-checklist/blob/master/docs/references/production-readiness-level.md)).
- **Especificação no repositório.** O "dado / quando / então" do kit equivale ao Given/When/Then do spec-kit e ao EARS
  do Kiro ([feature-specs](https://kiro.dev/docs/specs/feature-specs/)). As pendências com "quem responde" e "até
  quando" vão além do `[NEEDS CLARIFICATION]` do spec-kit, que não tem dono nem prazo. A regra de negócio com exemplo
  numérico feito à mão não aparece em nenhum modelo que abri. `[PLANEJADO]` e `[DIVERGE]` fazem, para sistema que já
  existe, o que o OpenSpec chama de brownfield-first, sem ferramenta.
- **Prova antes de "pronto".** A tabela afirmação × prova do Portão 4 e o P8 são mais explícitos que o "converge" do
  spec-kit, e seguem a mesma ideia do "Evidence, not checkbox theater" do MarinJursic
  ([README](https://github.com/MarinJursic/production-readiness-checklist/blob/main/README.md?plain=1#L436-L448)) em
  uma página, não em dez mil controles. A auto-revisão do plano do Portão 2 cobre o essencial do `analyze` do
  spec-kit (requisito sem tarefa, nome inconsistente).
- **Trava de alvo com teste.** Nos arquivos que abri, nenhum dos 15 tem o equivalente ao `alvo.mjs` com `alvo.test.mjs`. O
  vibe-coding-security só enuncia o princípio (itens 50 e 51: banco separado, token com escopo). O P6.3 (token `sbp_`
  gerado e revogado no mesmo dia; conexão que vale para um projeto só) vai na mesma linha da skill oficial do
  Supabase, que pede token com escopo
  ([SKILL.md, linha 43](https://github.com/supabase/agent-skills/blob/main/skills/supabase/SKILL.md?plain=1#L43)).
- **RLS.** O P5 já traz o que a skill oficial do Supabase põe como mais grave: `(select função())` na policy,
  `security definer` com `search_path = ''` e execução revogada, view com `security_invoker`, papel fora de
  `user_metadata`. E vai além com a revogação de privilégio (P5.7), que o starter nextbase faz ao contrário.
- **CI.** O gitleaks antes do `npm ci --ignore-scripts` e o `npm audit` crítico batem com o guia npm do Supabase
  (`npm ci`, `--ignore-scripts`) e com a OSSF. Nos dois workflows do nextbase que abri não há varredura de segredo.
  A varredura única do histórico inteiro (`gitleaks git . --redact`) não aparece em nenhum dos arquivos que abri.
- **Revisão por outra IA.** Outra família, conversa nova, "resposta vazia não é aprovação" e REVISAR → arbitrar →
  mandar ao mesmo revisor. É mais forte que a Action da Anthropic (mesmo modelo que construiu) e que a autocrítica
  da OSSF (o mesmo modelo se revisa).
- **Riscos de código feito por IA (P12).** Pacote inventado, API antiga e instrução escondida coincidem com a seção de
  cadeia de suprimentos da OSSF e com os itens 53 e 58 do vibe-coding-security. O kit diz como conferir o pacote
  (nome exato, downloads semanais, data da última versão, licença no npmjs.com).
- **Publicação e operação.** Migration em duas fases, rollback da Vercel que não desfaz migration, dump com ensaio de
  restauração e contagem de linhas, RPO e RTO escritos: mais concreto que o going-into-prod do Supabase (que fala de
  PITR e de backup não baixável no plano grátis) e que o item 31 do vibe-coding-security ("backups exist and are
  tested").
- **Poka-yoke digital.** Nos arquivos que abri, nenhum dos 15 tem catálogo parecido: idempotência, coluna de versão no UPDATE, máquina de
  estados, `EXCLUDE`, reconciliação agendada, desfazer no lugar de "tem certeza?". O mais perto é o item 30 do
  vibe-coding-security (exclusão lógica), que o kit já tem (R1).
- **Acessibilidade.** O P7.5, com números (contraste de 4,5:1 e 3:1, alvo de 24 × 24 px, tela de 360 px), é mais
  concreto que o checklist de produção do Next.js, que cita o lint `jsx-a11y`.
- **AGENTS.md curto, com `CLAUDE.md` = `@AGENTS.md`.** Segue o formato agents.md e a meta de menos de 200 linhas do
  claude-code-best-practice; a OSSF também manda extrair só o relevante.
- **Prompts sem persona.** Os quatro prompts do kit não pedem "aja como especialista", em linha com a nota da OSSF.
- **"Um fato, uma casa; cópia só por script" (P12).** Não encontrei regra equivalente nos arquivos que abri.
