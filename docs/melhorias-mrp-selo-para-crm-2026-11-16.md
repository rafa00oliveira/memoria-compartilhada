# Melhorias do MRP Ibacem e do Selo para o CRM da Destak (16/11/2026)

Pedido do Rafael (16/11): levar ao `destak-crm` o que o MRP Ibacem (`~/Claude/mrp-ibacem`) e o app do Selo
(`~/Claude/selo-hu`) implementaram e que serve para outro sistema. Ficam de fora as regras de negócio de cada um: o
cálculo do MRP (P01 a P09 do Diário do Guia) e a auditoria do Selo. É o caminho inverso do
`licoes-crm-tasks-para-mrp-2026-11-14.md`.

**Como ler.** Cada linha traz a origem com commit ou PR, para copiar o que já foi testado, o erro que a melhoria evita e
uma pista do que o CRM tem hoje. A pista vem de busca no código em 16/11 (`grep` em `src/`, `api/`, `scripts/` e
`.github/`). Ela não prova nada: quem confirma, com arquivo:linha, é o dev do CRM.

**Stack.** O MRP e o Selo são Next.js 16 com server actions. O CRM é Vite + React com funções em `api/`. O que no Next é
server action, no CRM vai para `api/_acoes`. O que é de tela vale igual.

## Bloco A. Proteção e operação (o vendedor não vê)

O CRM marcou estes itens como "adicionar" em 13/11 (`docs/RESPOSTA-ideias-kit-2026-11-13.md`), na ordem sugerida "com o
OK do Rafael", e eles continuam fora em 16/11. Seis deles o Selo já fez no PR #22 (`3bf5d89`), com teste e inspeção por
outra IA. O corpo do PR conta como cada um foi testado.

| # | Melhoria | Origem testada | Erro que evita | No CRM em 16/11 |
|---|---|---|---|---|
| A1 | `.claude/settings.json` com `deny` para push `--force`, `--no-verify` e `+ramo`, `git add -A`, `git add .` e `vercel --prod` (a lista que o próprio CRM propôs em 13/11, C2) | Selo #22. Testado num Claude em bypass: deny e ask valem no Bash e no PowerShell. O Selo também pôs `ask` antes de script que grava no banco; no CRM isso travaria o fluxo autônomo, porque o Rafael autorizou aplicar migration direto (15/09). Fica de fora, salvo decisão dele | Comando proibido que hoje só a regra escrita barra | O arquivo não existe |
| A2 | CI que falha com Unicode invisível (largura zero, bidi U+2066 a U+2069, tags) nos `.md` e no `.claude/` | Selo #22, `.github/workflows/ci.yml` | Instrução escondida num texto que a IA lê | `checaProduto.mjs` não faz essa varredura |
| A3 | Actions fixadas pelo SHA | Selo #22 (SHA da v4.4.0, o mesmo para onde a tag aponta) | Ação trocada por baixo da tag rodar com os segredos do Power BI e do Supabase (`destak-importar-bi.yml`) | 7 `uses:` pela tag, 0 pelo SHA |
| A4 | `.npmrc` com `min-release-age=7` e `allow-git/file/directory=root` | Selo #22. O `allow-remote=root` quebrou o install pelo `@tailwindcss/oxide-wasm32-wasi`: testar antes | Pacote recém-publicado e comprometido entrar no install | O arquivo não existe |
| A5 | `npm audit signatures` no CI, depois do `npm ci` | Selo #22 | Pacote sem atestado de origem | Não está nos 3 workflows |
| A6 | Advisors do Supabase num comando, mostrando só o nome do aviso e o do objeto | Selo #22, `node scripts/db.mjs advisors` | Policy ou índice com problema que ninguém olha | Nada em `scripts/` |
| A7 | `X-Frame-Options: DENY` ou `frame-ancestors 'none'` no `vercel.json` | Achado do próprio CRM em 13/11 (F5) | O CRM aberto dentro de um iframe alheio (clickjacking) | Não está no `vercel.json` |
| A8 | Backup automático do banco | Achado do próprio CRM em 13/11 (G1, "o mais urgente"). Nem o MRP nem o Selo têm | O Supabase grátis não faz backup, e um dado perdido não volta | Não existe. Pede um segredo no GitHub: passo do Rafael |
| A9 | Trava de alvo em script que grava: lê o host e o usuário do endereço e recusa projeto desconhecido sem `--producao` | MRP `19b47bd`, `4ea2745`, `66912c1` e `9e0b8d8` (`scripts/alvo.mjs`). O revisor Codex achou 3 furos, todos fechados | Script rodar no banco de outro projeto: há vários projetos Supabase nesta máquina | 148 scripts citam o ref ou o host, e só 1 parece recusar. Conferir |
| A10 | Registro das migrations aplicadas e trava de versão: seed e prova recusam um banco com migration que o código não conhece | MRP `649a23c`, `ec6a40d`, `bb524ea` e `af01d38` | Script rodar contra um banco à frente ou atrás do código | Conferir: o `aplicar-migration.yml` e o `aplicarMigration.mjs` podem cobrir parte |
| A11 | Violação de UNIQUE (23505) traduzida pelo nome da restrição, com mensagem em português | MRP `54501dd` e `e14aef5` | Erro cru do Postgres na tela, ou duplicata que ninguém percebe | Tratado em 2 arquivos de `api/` e `scripts/`. Conferir o resto |

## Bloco B. Telas (o vendedor vê: plano, OK do Rafael e aviso à equipe)

Do Selo vêm as 10 correções do levantamento de 14/11 (`selo-hu/docs/USABILIDADE-MOBILE-levantamento-2026-11-14.md`),
nos PRs #24 a #34, todas medidas antes e depois a 390 e a 360 px. Do MRP vêm os itens K12 a K17 e as OS 6 e 7, revisados
pelo Codex.

| # | Melhoria | Origem | Erro que evita | Pista no CRM |
|---|---|---|---|---|
| B1 | Sem internet na hora de gravar, o aviso aparece no lugar e o formulário fica como estava | Selo #24 | Falha de rede trocar a tela pela página de erro e apagar o que foi digitado (o pior achado do Selo) | 4 arquivos tratam falha de fetch. Conferir se o formulário sobrevive |
| B2 | Anexo ou foto que falha avisa em português e oferece "Tentar de novo" | Selo #25 | Envio perdido sem ninguém saber | "Tentar de novo" em 9 arquivos: provavelmente já tem |
| B3 | Esqueleto de carregamento | Selo #26 | Tela parada de 2,6 a 4 s sem sinal nenhum (medido no Selo) | `Skeleton` em 1 arquivo |
| B4 | Alvo de toque com 48 px | Selo #28 | Toque no botão errado | Medir com o `mede-mobile.js` |
| B5 | Ação sem volta confirma num diálogo com o verbo ("Excluir visita", e não "OK") | Selo #29 | Confirmar no automático | `confirm(` em 6 arquivos |
| B6 | `select` com 16 px (o iPhone não dá zoom), `enterKeyHint`, `color-scheme`, `svh` e erro acima da barra inferior | Selo #30 | Zoom que desmonta a tela, teclado sem "Ir", erro escondido atrás da barra | `enterKeyHint` 0, `color-scheme` 0, `svh`/`dvh` em 15 arquivos |
| B7 | Título da tela no topo do celular, com quebra de linha | Selo #31 | Não saber em que tela se está | Conferir |
| B8 | Rascunho guardado no aparelho | Selo #32 | Perder o texto ao fechar a tela ou quando a rede cai | "rascunho" só no WhatsApp (2 arquivos) |
| B9 | Barra do celular com 3 a 5 destinos | Selo #33 | Destino que não cabe e rótulo cortado | Já previsto no `docs/PLANO-MOBILE-ADMIN.md` (4 + Mais) |
| B10 | Texto a 200% sem rolagem lateral, inclusive o texto que passa da própria caixa | Selo #34; MRP K16 e K17 | Quem usa letra grande perder parte da tela | Medir |
| B11 | Telas de erro, de carregando e de "não encontrada" em português, e erro geral pego | MRP K12 (`8e53fa6` e `1892c8e`) | Tela branca ou mensagem em inglês | `ErrorBoundary` em 6 arquivos: provavelmente tem |
| B12 | Contraste AA, foco visível, `<main>` e "Pular para o conteúdo" | MRP K15 (`1c8b4c2`) | Quem usa teclado ou enxerga pouco não conseguir usar | `focus-visible` 0; "Pular para o conteúdo" 0 |
| B13 | Tela vazia que traz a ação, e filtros que quebram linha | MRP K16 (`969bf63`) | Tela vazia sem saída | Conferir |
| B14 | Número em pt-BR (vírgula, até 3 casas, com a unidade) e campo numérico que não troca o valor sem avisar | MRP K14 (`632183a`) e `325738e` | Quantidade, meta ou preço gravados errados sem ninguém ver | Conferir nos campos de meta, preço e quantidade |
| B15 | Menu e abas parados, e só o cartão rola; cabeçalho da tabela preso; busca enquanto digita nas listas longas; texto longo com reticências que quebram na palavra | MRP OS 6 (`d5f2710`, `ff72ae8` e `ab0c677`) e `320f123` | Perder o menu ou o cabeçalho ao rolar | `sticky` em 9 arquivos |
| B16 | Paginação no banco, e página fora do intervalo que volta à 1 sem consultar | MRP `325738e` e `9a62782` | Lista lenta ou vazia | Conferir |

O que leva a este bloco é o levantamento de usabilidade que o CRM ainda não fez. Ele usa o catálogo
`memoria-compartilhada/docs/USABILIDADE-MOBILE.md` e o `mede-mobile.js` e segue o método do Selo:
- tarefas reais do vendedor a 390 e a 360 px;
- trava que aborta toda gravação pelo CDP;
- medida antes e depois.

## Bloco C. Jeito de trabalhar

| # | Melhoria | Origem | Erro que evita | No CRM |
|---|---|---|---|---|
| C1 | Uma função só decide status ou alerta, e a tela só mostra | MRP P04 (`2238f13` e `fd9a225`): saíram 3 campos que diziam a mesma coisa de jeitos diferentes | Tela e servidor discordarem (por exemplo, cliente disponível ou nomeado) | Conferir |
| C2 | Cadastro incompleto não derruba o resto: o item sai com aviso e o resto calcula | MRP `74f71ca` | Um cadastro ruim apagar o painel inteiro | Conferir |
| C3 | Verificador independente que refaz a conta por outro caminho | MRP `ebb14f8` (636 casos, 0 divergências) e `cef4305` | Conta errada que o próprio autor não enxerga | Em parte: há teste de invariante (B1 e B3 de 13/11) |
| C4 | Medir antes e depois, no celular, por tarefa | Levantamento do Selo de 14/11 | Mudança de tela que piora sem ninguém medir | Levantamento do CRM pendente desde 14/11 |

## O que fica com o Rafael

- A8: criar o segredo do banco no GitHub e escolher onde o backup fica guardado.
- Bloco B: dar o OK na lista que o levantamento devolver e avisar os vendedores das mudanças grandes (regra de 28/10).
- E4 de 13/11, fora do código: MFA nas contas do Supabase, da Vercel e do GitHub, e um segundo dono no Supabase.

## Ordem sugerida

1. A1 a A7 e A9: um commit por item, com `npm run check` verde e sem mudar tela. A3 e A5 passam antes numa branch, porque
   o CRM avisou em 13/11 que não sabe se algum pacote derruba o job.
2. A10 e A11: conferir o que já existe antes de mexer.
3. Levantamento do bloco B, só com leitura e medição. Ele devolve a lista ordenada por ganho e custo.
4. Bloco B, só com o OK do Rafael.
