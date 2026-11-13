# 001. Apps de empresa e de cliente seguem no Vercel Hobby, com o risco aceito

Data: 12/11/2026. Decisão do Rafael (opção "2b"), registrada a pedido dele. Liga com a falha F20 do
`MANUAL-CONSTRUCAO.md`.

## Contexto

Os termos da Vercel limitam o Hobby a uso pessoal e não comercial: "You shall only use the Services under a Hobby
plan for your personal or non-commercial use" (https://vercel.com/legal/terms, conferido em 12/11/2026). Os oito
projetos do Rafael estão no time `rafaels-projects-e17ff5ee` (`vercel project ls`, 12/11), que é Hobby (memória
`vercel-storage-deploy-de-docs`).

- Uso comercial, empresa do Rafael: `destak-prime-crm` (CRM da Destak), `destak-tasks` (Gestor de Tarefas da Destak),
  `reformo-erp` (Reformo).
- Uso comercial, trabalho para terceiro: `crm-luiza`, `clube-poker` e `quero-bahia-crm` (frente encerrada, site no ar).
- Fora do risco: `mrp-ibacem` (faculdade) e `selo-hu` (extensão universitária).

## Opções

1. Pro na conta da empresa: cobrança mensal por membro mais o uso acima da cota (preço na página de planos da
   Vercel; conferir no dia).
2. Ficar no Hobby com o risco escrito.

## Decisão

Opção 2.

## O que fica aceito

- Usar o Hobby para fim comercial descumpre os termos: a Vercel pode exigir a troca de plano ou suspender o projeto.
- Os limites do Hobby continuam: log de uma hora, rollback só para o deploy anterior, sem membro de equipe na Vercel.

## Se a Vercel cobrar ou suspender

Criar o time Pro na conta da empresa dona do app e transferir o projeto para ele. Antes, conferir na documentação o
que a transferência leva (variáveis, domínio, crons); depois, prova no ar como na P9 do manual.

## Rever quando

- a Vercel mandar aviso sobre o plano;
- um cliente exigir contrato ou garantia de disponibilidade;
- alguém de fora precisar de acesso ao projeto na Vercel.
