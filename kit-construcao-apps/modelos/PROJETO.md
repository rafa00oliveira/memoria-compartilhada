# PROJETO: <nome>

Especificação do sistema (MANUAL-CONSTRUCAO.md, P1). Mora no repositório, ao lado do código; cópia em Drive ou PDF é
só para leitura. Sistema que já existe: escreva depois de ler o código e marque `[PLANEJADO]` no que ainda não existe e
`[DIVERGE]` onde o código faz diferente do combinado.

## 1. Problema

<Em três a cinco linhas: o que dói hoje, para quem, e como se sabe que o sistema resolveu.>

## 2. Quem usa

| Papel | O que faz no sistema | O que não pode fazer |
|---|---|---|
| <admin> | <...> | <...> |

## 3. Telas

| Tela | Papel | O que mostra | O que grava |
|---|---|---|---|
| <...> | <...> | <...> | <...> |

## 4. Tabelas

### <nome_da_tabela>

| Coluna | Tipo | Obrigatória | Regra (check, único, chave estrangeira) |
|---|---|---|---|
| id | uuid | sim | chave primária |
| criado_em | timestamptz | sim | default now() |

## 5. Regras de negócio

Cada regra com um exemplo numérico feito à mão. Regra que pode mudar (prazo, percentual, limite, lista de opções) vai
para cadastro editável.

- **R01 <nome>:** <regra>. Exemplo: <entrada> → <conta> → <resultado>.

## 6. Critérios de aceite

Cada critério vira um teste (`node --test`) ou um roteiro de tela.

- **A01:** dado <situação>, quando <ação>, então <resultado>. Teste: <arquivo ou roteiro>.

## 7. Fora do escopo

<O que não entra no MVP, para ninguém construir por engano.>

## 8. Pendências (decisões que não são da IA)

| # | Pergunta | Quem responde | Até quando | O que fica travado |
|---|---|---|---|---|
| D01 | <...> | <dono, cliente, grupo> | <data> | <...> |
