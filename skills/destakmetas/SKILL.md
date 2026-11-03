---
name: "destakmetas"
description: "Calcula a meta do mês seguinte da Destak Prime por vendedor e unidade a partir do snapshot diário do BI ou da planilha-resumo de faturamento: metade âncora na meta anterior, metade venda dos 3 meses, trava, folga por vendedor, teto de alta para quem já bate a meta, eventos e quadro."
---

# DESTAKMETAS v6.3 · Meta do mês seguinte por vendedor · Destak Prime

Três modos:

- **Modo cálculo**: Rafael manda a planilha-resumo (ou pede pelo BI) e pede as metas do mês seguinte.
- **Modo BI (automático, todo dia 25)**: a tarefa agendada lê o snapshot diário do BI e calcula sozinha. Ver seção [13].
- **Modo comparação**: Rafael devolve a tabela que ele fechou (PDF, planilha, ou a própria proposta com células pintadas). A skill mede o erro, separa julgamento de erro de regra e recalibra se precisar. Ver seção [8].

Não confundir com `destakrps` (semanal) nem com `destakfechamneto` (mês fechado). Aquelas medem resultado; esta define a meta que elas vão medir.

> **Origem desta versão.** A v6.3 foi escrita em 03/11/2026 a partir da planilha `2026-10-destak-metas-novembro-v5.xlsx` (aba Método e rodapé, que documentam a v6.2) e dos ajustes que o Rafael pintou nela. O SKILL.md da v6.2 não estava acessível na sessão: onde a v6.2 local disser algo diferente nas seções [4] a [6A], **a v6.2 local vence** e só as mudanças marcadas "v6.3" entram por cima.

## [1] A regra que importa

**A meta parte da meta anterior e do que o vendedor de fato vendeu, meio a meio.** Âncora sozinha imita o Rafael mas perpetua meta injusta; venda sozinha é justa mas não imita. A v6 junta as duas.

Backtest nas 9 viradas de fev a out/26 (321 vendedor × mês, fora Diretoria, gestão, rampa e meta zero), cada regra decidindo no dia 24 com o que se sabia então:

| Método | Erro mediano contra a meta fechada | Dentro de ±10% | Dispersão do atingimento (menor = mais justo) | Atingimento a ±15% do típico |
|---|---|---|---|---|
| Metas que o Rafael fechou | 0 | 100% | 0,220 | 33,6% |
| Repetir a meta anterior | 11,1% | 46,7% | 0,253 | 30,5% |
| v5: anterior × atingimento do mês | 11,7% | 44,2% | 0,191 | 38,3% |
| Só venda dos 3 meses | 15,8% | 31,5% | 0,168 | 43,9% |
| **v6: 50% âncora + 50% venda, trava −30%/+25%** | 12,5% | 44,2% | 0,190 | 41,7% |

Conta refeita em R (`confere.R`): bootstrap por mês mostra a v6 com +3,4 pontos na faixa de ±15% contra a v5 (IC 90% +0,9 a +6,1).

Testado e descartado: carteira do CRM na conta (o dono troca a cada venda; piora tudo), sazonalidade por unidade (piora a justiça; a do grupo já está na meta oficial), média de 6 meses (não supera a de 3).

Calibração contra o que o Rafael fechou, mês a mês:

| Mês | Regra | Erro mediano | Erro médio | Dentro de ±5% | Observação |
|---|---|---|---|---|---|
| out/26 | v3 (âncora + atingimento) | 3,8% | 6,9% | — | 31 de 41 a ±10% |
| nov/26 | v6.2 | 0,8% | 4,7% | 22 de 38 | 10 de 10 do degrau de folga 10% ficaram abaixo da proposta |
| nov/26 | v6.3 | 0,0% | 2,5% | 32 de 38 | **ajustada no mesmo mês (dentro da amostra); confirmar em dez/26** |

A meta é decisão do Agenor. A skill entrega a proposta e a lista do que é julgamento.

## [2] Input

**Modo BI (preferido):** snapshot do BI (seção [13]); meta vigente da planilha Google do Caio, aba Vendedores, relida no dia do cálculo.

**Modo planilha:** a planilha-resumo de faturamento (`.xltx`/`.xlsx`), uma aba por mês. Coluna A código (vazia = linha de unidade), B nome (sempre `.strip()`), C REALIZADO, D METAS. Layout diferente: perguntar qual rotina do Proton gerou o arquivo antes de deduzir a estrutura.

O Rafael costuma mandar junto, em texto: férias, quem saiu, quem entrou, transferências, metas travadas. Isso vence o cálculo. Se a tabela oficial do mês corrente divergir da planilha, **a tabela oficial é a âncora**.

## [3] Meta do grupo

**Meta oficial** = a do plano anual, em `Desktop/destak/dados/diario/meta-oficial.json` (fonte única; a tabela abaixo é cópia de conferência). Arredondada para múltiplo de R$ 100 mil:

| Mês | Oficial | Usada |
|---|---|---|
| Setembro | 30.373.160,44 | 30.400.000 |
| Outubro | 27.433.435,95 | 27.400.000 |
| Novembro | 26.923.318,92 | 26.900.000 |
| Dezembro | 29.824.595,19 | 29.800.000 |

Total do ano: R$ 335.963.013,64. Jan a ago: 22.135.572,41 · 26.960.141,13 · 25.076.932,28 · 24.792.272,01 · 30.285.704,97 · 32.508.646,29 · 29.954.581,76 · 29.694.652,29.

**O atingimento do GRUPO é sempre medido contra a meta oficial, nunca contra a soma das individuais.**

## [4] Cálculo por vendedor (v6)

```
dias_op      = seg a sex = 1; sábado = 0,75; feriado = 0,37        (mediana medida no histórico)
projetado    = realizado * dias_op_mês / dias_op_decorridos        (negativo -> zero)
at_mês       = projetado / meta_anterior
at_3m        = atingimento dos 3 últimos meses (o corrente projetado)

âncora       = meta_anterior * fator(at_3m)
               at_3m <  0,90 -> 1 + 0,5 * (at_3m - 1)
               0,90 a 0,95   -> 1,00
               at_3m >= 0,95 -> 1,03
venda_3m     = 0,5 * projetado + 0,3 * mês-1 + 0,2 * mês-2
regra        = (âncora + venda_3m) / 2
regra        = trava entre meta_anterior * 0,70 e meta_anterior * 1,25
```

Conferido nos números de nov/26: Jhonatan, meta 400, at_3m 65,7% → âncora 331; venda 0,5×193 + 0,3×497 + 0,2×294 = 304; regra 318.

**Projeção:** no dia 24 o erro por vendedor fica em 7,7% (linear seg-sáb: 8,1%). Com menos de 20 dias de operação decorridos, avisar que o atingimento ainda vai mexer.

**Retorno de evento** (férias, atestado, feira no mês corrente): âncora parte da meta do mês anterior ao evento e o atingimento usado é o de 3 meses.

**v6.3 · Teto de alta para quem já bate a meta.** Se at_3m >= 100% e at_mês < 130%:

```
meta = base limitada entre meta_anterior e meta_anterior * 1,05      (sem folga por cima)
```

Motivo: em nov/26 os 10 vendedores do degrau de folga 10% terminaram entre −4% e +5% da meta anterior (Bruno, Canário, Paulo, Vinícius Dias, Aline, Thalita, Lorena, Ezequias, Erik, Géssica). Quem bate a meta não é punido com meta subindo 10%.

**v6.3 · Alta forte.** Se at_mês >= 130% (at_3m quando houve evento no mês), inclusive rampa e transferido:

```
meta = (meta_anterior + projetado) / 2       (venda_3m no lugar de projetado se houve evento)
trava em meta_anterior * 1,50; sem folga por cima; vai para a lista de julgamento
```

Em nov/26 acertou Adeilton (130%, 170) e Thaiana (137% em 3 meses, 150) em cheio; Alírio (188%) dá 290 contra 300 fechado, Vinícius Vilar −4,7% e Alsen +2,5%.

## [5] Casos que a fórmula não decide sozinha

| Situação | Padrão | Exemplo real |
|---|---|---|
| Férias, atestado, feira no mês da meta | meta zero, escrito por extenso (FÉRIAS, ATESTADO, FEIRAS). **Não redistribui** | out/26: Erik, Thaiana, Gessica |
| Saiu da empresa | meta zero, vai para SEM META. **Não vai para os colegas** | Porfirio (set/26), Rilke (24/10/26) |
| Novo vendedor sem venda | R$ 55 mil (piso R$ 50 mil + folga de 2%), "a confirmar se começa no mês" | nov/26: 182, 184, 187 a 190 |
| Novo vendedor com venda no mês | **sem regra: julgamento**. Mostrar 1ª venda e valor no mês | nov/26: Caio 100 mil (R$ 64 mil desde 06/10), Remerson 200 mil (R$ 113 mil desde 03/10), Fernando e Herlândio 55 mil |
| Vaga sem cadastro na planilha Google | sem meta, bloco SEM META | 2 vagas do CD, nov/26 |
| Rampa (menos de 4 meses) ou transferido | mantém a meta anterior + folga da escada com teto de 5%; at_mês >= 130% cai na alta forte da seção [4] | Alírio, Iranildo, Juan |
| **v6.3** Rampa ou transferido **sem venda no mês** | **sem meta**, vai para SEM META com o motivo | nov/26: Lauro (transferido para Salvador, R$ 0 em out), removido pelo Rafael |
| Meta travada pelo Rafael | entra como está, fora da fórmula | Brenda, Beatriz |
| Sem meta por decisão | bloco SEM META | Agenor |

Redistribuir a meta de quem saiu só quando o Rafael pedir (caso Kaique, set/26).

## [6] Fechamento

1. **Escala:** a regra dos elegíveis (fórmula e retorno de evento; fora rampa, novo, travada, alta forte e evento zero) é multiplicada por um fator único para a soma da base, com os não elegíveis, dar a meta oficial usada. Nov/26: fator 0,9693.
2. **Folga por vendedor** sobre a base (seção [6A]).
3. **Arredondamento:** múltiplo de R$ 5 mil até R$ 200 mil e de R$ 10 mil acima; piso de R$ 50 mil, exceto zero por evento.
4. **Diretoria:** base do Anderson em múltiplo de R$ 500 mil; a diferença do arredondamento passa para o Alsen. Sempre perguntar o split.
5. Unidade = soma dos vendedores (mais novos). **A soma final é resultado, não alvo:** publicar a folga total que sobrou.

## [6A] Folga por vendedor (v6.2, com o teto da v6.3)

Pedido do Rafael (27/10 e 28/10): folga diferente por vendedor, ninguém com folga zero.

```
at_3m <  85%      -> 2%
85% a 100%        -> 5%
>= 100%           -> teto de alta da seção [4] (v6.3): entre a meta anterior e +5%, sem folga por cima
trava: meta final <= meta_anterior * 1,25; a trava cede só até o piso de 2%
rampa: mesma escada com teto de 5%; novo vendedor: 2% (vira R$ 55 mil no arredondamento)
alta forte (at_mês >= 130%): sem folga
```

Por que essa escada (mesmo backtest de 321 vendedor × mês): folga única só sobe todo mundo junto e não muda a justiça. Quem vem abaixo de 85% segue abaixo no mês seguinte (vende 86% da base, mediana), por isso o piso é 2% e não mais. 15 e 20% não se sustentam: quem recebeu bateu a meta em 22% das vezes; acima de 130% de atingimento o vendedor vende no mês seguinte 77% da base (pico volta para a média).

| Folga | Sobe (média) | Batem a meta | Folga derrubou | Dispersão |
|---|---|---|---|---|
| Única de 10% (v2) | 10,0% | 24,6% | 12,5% | 0,190 |
| Única de 5% | 5,0% | 31,2% | 5,9% | 0,190 |
| v6.1: 0 / 5 / 10% + trava | 4,5% | 30,8% | 6,2% | 0,174 |
| v6.2: 2 / 5 / 10% + piso 2% + trava | 5,3% | 30,2% | 6,9% | 0,183 |

A v6.3 tira o degrau de 10% na prática; a folga total cai. Nov/26: proposta v6.2 com 6,5% sobre a meta oficial usada; fechada pelo Rafael com 5,9% (R$ 28,5 mi contra R$ 26,9 mi).

**Tradeoff registrado:** o atingimento individual cai cerca de "folga" pontos; comissão atrelada a atingimento cai junto. Folga não protege mês em que o grupo inteiro cai junto. Caminho de volta: degraus a zero.

## [7] Lista de julgamento (sempre entregar junto)

Pintar em amarelo claro na planilha e listar no chat, com o número:

1. **Cortes acima de 15%.** Em nov/26 o Rafael amaciou três veteranos (Carlos: manteve 250 contra 200 da regra; Daniel Duarte 550 contra 490; Anderson Maia 100 contra 90) e aprofundou um (Jhonatan 300 contra 320). Sem padrão ainda: perguntar caso a caso.
2. **Alta forte (at_mês >= 130%)** pela seção [4]: confirmar o valor.
3. **Diretoria:** split Anderson e Alsen.
4. **Atingimento abaixo de 20%:** confirmar se o vendedor segue com a carteira.
5. **Quadro:** novos com e sem venda, rampa sem venda, vagas.
6. **Folga total** em % e R$, e a diferença contra o mês anterior.

## [8] Modo comparação

Quando o Rafael devolver a tabela que fechou:

1. **Ler as marcas.** Na proposta devolvida: amarelo forte (FFFF00) = ele mudou o valor; vermelho (FF0000) = ele removeu a linha; amarelo claro (FFF2CC) é a lista de julgamento da própria skill. A proposta da regra está na OBS (`→ R$ X mil`); comparar a coluna de meta contra ela. PDF: `pdftotext -layout`.
2. **Reconciliar** a tabela: soma dos vendedores contra o cabeçalho de cada unidade, unidades contra o grupo, **e todo vendedor dentro do intervalo de alguma unidade** (nov/26: Remerson estava fora de qualquer soma). Divergência vai para o topo da resposta.
3. **Comparar** por vendedor: final, regra, meta anterior, atingimentos. Erro mediano, médio, quantos a ±5% e ±10%, para a regra atual e para "repetir a meta anterior".
4. **Separar julgamento de erro de regra.** Ajuste isolado com motivo conhecido é julgamento (seção [7]). **Três ou mais vendedores no mesmo sentido e no mesmo degrau é erro de regra**, mesmo com erro mediano baixo.
5. **Recalibrar** quando o item 4 apontar erro de regra ou o erro mediano passar de 6%: testar a mudança mais simples que explica o padrão, medir antes e depois, e registrar como "dentro da amostra" até o mês seguinte confirmar.
6. Entregar a planilha final (ajustes do Rafael aplicados, OBS com "regra dava R$ X mil", removidos no bloco SEM META) e a skill atualizada com a nova linha na tabela de calibração da seção [1].

## [9] Exclusões fixas

Códigos de gestão 162 (Rafael), 169 (João Vitor), 170 (Caio): sem meta. Natal: descontinuada. Agenor: sem meta desde out/26.

## [10] Armadilhas

1. Replicação de célula: vendedores da mesma unidade com valor idêntico ao centavo (Televendas, abr/26). Corrigir pela mediana e avisar.
2. Unidade fantasma fora da linha GRUPO DESTAK (CELSO CEBOLA, jun/26).
3. Realizado negativo por devolução: entra como zero.
4. Cabeçalho de unidade que não bate com a soma (Patos, out/26).
5. Linha "VENDEDOR" sem código é vaga.
6. Vendedor que muda de unidade: a unidade vale pela aba mais recente ou pela tabela oficial.
7. Código novo de vendedor veterano (José Gleydson, 58 → 70 em ago/26): juntar a história dos dois códigos.
8. **Linha fora do intervalo da soma da unidade** (Remerson, nov/26): a fórmula SUM do cabeçalho não pega quem foi inserido depois da última linha. Conferir pelo item 2 do QA.
9. Texto da OBS que não bate com a meta (nov/26: Paulo, Aldenir, Vinícius Dias, Anderson N. Barbosa, Aline e Thalita já vinham com a meta diferente do "→ R$ X mil"). Ao reescrever uma meta, reescrever a OBS junto.

## [11] QA

1. Soma dos vendedores igual ao cabeçalho da unidade, em todas as unidades.
2. Soma direta de todas as linhas com código igual ao GRUPO DESTAK (pega linha fora de intervalo).
3. Toda meta no múltiplo da seção [6] e nenhuma abaixo de R$ 50 mil, exceto zero por evento.
4. Nenhuma meta para código de gestão, Natal, quem saiu ou rampa sem venda.
5. Nenhuma alta acima de +25% fora da alta forte, nem acima de +50% dentro dela.
6. Folga total declarada no rodapé igual à da planilha.
7. Recalcular o xlsx (`scripts/recalc.py` da skill xlsx); erro bloqueia a entrega. Fórmula de rodapé conferida depois de inserir ou apagar linha.

## [12] Entregável

XLSX com três abas: **Metas** (hierárquica), **Histórico e carteira**, **Método**.

```
COD | UNIDADE / VENDEDOR | META <MÊS> | META <MÊS ANTERIOR> | VAR | ATING <MÊS ANTERIOR> | ATING 3 MESES | FOLGA | VENDA MÉDIA 3 MESES | REGRA ANTIGA | OBS
```

GRUPO DESTAK em faixa preta, unidades em cinza, eventos por extenso, lista de julgamento em amarelo claro, bloco "SEM META" no rodapé, linhas finais com meta oficial, usada, soma e folga em R$ e %. OBS de cada vendedor com a conta (âncora + venda → regra; base + folga → meta). Arial, cabeçalho 1A1A1A, título CC1214, sem célula mesclada.

Nome: `AAAA-MM-destak-metas-<mês seguinte>-vN.xlsx`. Nunca sobrescrever; versão nova a cada rodada.

No chat: tabela por unidade (mês novo contra anterior), folga total, lista de julgamento e resíduo de fechamento. Sem mais nada.

## [13] Modo BI (tarefa agendada, todo dia 25)

Roda sem o Rafael. Nada é enviado ao time: a proposta fica na pasta para ele levar ao Agenor.

1. **Ler o CONTEXTO.md** de `Desktop/destak` antes de tudo (quadro, férias e travas do mês).
2. **Input:** snapshot mais recente em `Desktop/destak/dados/diario/snap-AAAA-MM-DD.json.gz` (chaves `pedidos`, `estornos`, `gerencial`, `metasBI`). Snapshot de antes do dia 23: parar e relatar que o relatório diário não rodou.
3. **Realizado por vendedor:** mesma regra de faturamento do `destak-crm/scripts/relatorioDiario.py` (status, origem, data do documento, estornos). Ler a regra de lá. Conferir o total contra o painel do mesmo dia; diferença acima de 1% bloqueia.
4. **Meta vigente:** planilha Google do Caio (aba Vendedores) ou `dados/diario/metas-AAAA-MM.json`; senão `metasBI`.
5. Calcular seções [4] a [6A], montar o xlsx da seção [12] em `Desktop/destak/entregas/metas/`. Nunca sobrescrever.
6. Registrar no CONTEXTO.md: data, snapshot, folga, soma contra meta oficial, lista de julgamento pendente. No chat, só o resumo da seção [12].
