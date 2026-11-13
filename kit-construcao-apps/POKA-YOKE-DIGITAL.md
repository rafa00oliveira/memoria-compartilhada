# Poka-yoke digital: guia para os devs

> v1.0-geral · 13/11/2026. Junta duas pesquisas: a lente da qualidade (Shingo, FMEA, servidor e banco) e a lente
> do serviço (Chase e Stewart, tela, cliente e funcionário). Este guia é a parte que se aplica no código e vale para todo
> site e sistema feito com o kit. Ele completa o `MANUAL-CONSTRUCAO.md` (P7 itens 4, 5 e 8, P8 item 4) e não repete o
> que já está lá.

## 1. A ideia em 6 linhas

1. O erro de quem usa é inevitável. O defeito é o erro que virou dado gravado errado (pedido duplicado, saldo negativo,
   estrutura órfã) e esse se evita (Shingo).
2. Pedir mais atenção não resolve. O que resolve é um dispositivo que separa o certo do errado sozinho, em 100% dos casos.
3. Num app há três camadas, e a mesma regra vale nas três:
   - **tela:** dá a resposta rápida, mas qualquer um passa por cima dela;
   - **servidor:** é a fronteira, onde chega tudo o que vem da tela, da API, da importação e de script;
   - **banco:** é a garantia, porque toda escrita passa por ele, venha de onde vier.
4. Regra grave e sem exceção (dinheiro, estoque, dado de outra pessoa) tem **controle** no servidor e no banco. Aviso amarelo na tela não basta.
5. Regra com exceção legítima vira **advertência**: pede a justificativa e registra quem passou, quando e por quê.
6. Ação de rotina se protege com **desfazer**, não com "tem certeza?".

## 2. Como ler as colunas

- **Função:** C = controle (bloqueia) · A = advertência (avisa) · R = recuperação (o erro acontece e o sistema desfaz o efeito).
- **Detecção:** contato (confere um atributo, inclusive "isso já existe?") · valor fixo (confere uma contagem ou um total) ·
  etapa (confere a sequência) · "—" (o padrão elimina a entrada em vez de conferir).
- **Momento:** P = prevenção (a ação errada nem pode ser feita) · D = detecção (a ação é feita e o sistema recusa antes de virar defeito).
- Onde as duas pesquisas classificam diferente, vale a lente da qualidade, que é a de Shingo.

## 3. Catálogo

### 3.1 Banco: a inspeção na fonte

| # | Falha que evita | Dispositivo | Tipo | Exemplo genérico |
|---|---|---|---|---|
| B1 | Campo obrigatório gravado vazio | `NOT NULL` | C · contato · D | ordem sem data de necessidade é recusada |
| B2 | Valor fora da faixa ou incoerente entre campos | `CHECK` de coluna ou de tabela | C · contato · D | `CHECK (qtd > 0)`, `CHECK (fim >= inicio)` |
| B3 | Código ou cadastro duplicado | `UNIQUE` ou chave primária | C · contato · D | dois itens com o mesmo código |
| B4 | Referência a algo que não existe; pai apagado com filhos órfãos | chave estrangeira com `ON DELETE RESTRICT` entre objetos independentes (`CASCADE` só quando o filho é parte do pai) | C · contato · D | apagar componente ainda usado numa estrutura |
| B5 | Mesmo recurso reservado duas vezes no mesmo horário | `EXCLUDE USING gist (... WITH &&)` | C · contato entre linhas · D | máquina ou sala com horários sobrepostos |
| B6 | Operação de vários passos interrompida no meio | transação: os passos numa função do banco chamada uma vez | C · etapa · P | baixa de estoque e registro do movimento entram juntos ou nenhum entra |
| B7 | Usuário lê ou altera linha que não é dele | RLS em toda tabela exposta, com os *grants* que o `anon` não usa revogados | C · contato · P na leitura, D na escrita | perfil de uma unidade não enxerga a outra |
| B8 | Dois usuários editam o mesmo registro e um apaga a mudança do outro | coluna `versao` no `WHERE` do `UPDATE`; versão mudou, recusa e mostra o que mudou | C · contato · D | duas pessoas ajustam a mesma ordem ao mesmo tempo |

Limites que pegam gente boa (PostgreSQL 18, §5.5.1):
- `CHECK` passa quando a expressão dá nulo. Coluna obrigatória leva `NOT NULL` junto.
- `CHECK` não consulta outra linha nem outra tabela. Regra entre linhas vai em `UNIQUE`, `EXCLUDE` ou chave estrangeira.
- `CHECK` só roda na inserção e na alteração. Mudou a regra? As linhas antigas não são reconferidas sozinhas.
- View criada pelo `postgres` passa por cima da RLS por padrão, e a chave `service_role` também. Ela fica só no servidor.

### 3.2 Servidor: a fronteira

| # | Falha que evita | Dispositivo | Tipo | Exemplo genérico |
|---|---|---|---|---|
| S1 | Dado inválido que entra por outro caminho (API direta, importação, tela antiga) | o servidor valida de novo o que a tela validou: formato e sentido para a operação (zod) | C · contato · D | a importação de planilha passa pela mesma regra da tela |
| S2 | Etapa feita fora de ordem | máquina de estados: o servidor só aceita as transições permitidas; a tela só habilita o botão da etapa seguinte | C · etapa · P na tela, D no servidor | rascunho, aprovado, liberado, sem atalho |
| S3 | Duplo clique, reenvio ou nova tentativa da rede gravam duas vezes | chave de idempotência gerada na tela por intenção; o servidor guarda a chave (`UNIQUE`) e devolve o mesmo resultado. Travar o botão ajuda, mas não cobre a nova tentativa | C · contato · P na tela, D no servidor | "registrar entrada" clicado duas vezes gera uma entrada |
| S4 | Enviar com item obrigatório faltando | regra de completude conferida no servidor ("N de N com evidência"); a tela mostra "faltam 2 de 12" | C · valor fixo · D | checklist de critérios só fecha com todos evidenciados |
| S5 | Soma das partes diferente do total | conferência do total antes de fechar. Controle se a regra não tem exceção, advertência com justificativa se tem | C ou A · valor fixo · D | separação com quantidade diferente da pedida |
| S6 | Inconsistência que passou por todas as barreiras | rotina agendada de conferência (reconciliação) que avisa o responsável dizendo a causa | A · valor fixo · D | saldo calculado × soma dos movimentos |

### 3.3 Tela: fluxo e formulário

| # | Falha que evita | Dispositivo | Tipo | Exemplo genérico |
|---|---|---|---|---|
| T1 | Pedir o serviço errado | triagem de 2 ou 3 perguntas antes do formulário, que abre o fluxo certo | C · etapa · P | "troca, devolução ou compra nova?" |
| T2 | Começar sem ter o que o processo pede | lista do que vai precisar, antes de começar | A · valor fixo · P | "Você vai precisar de: nota fiscal e foto do produto" |
| T3 | Não saber o tamanho do caminho | indicador de etapas e tempo | A · etapa · P | "Passo 2 de 4 · cerca de 3 min" |
| T4 | Escolher valor fora do conjunto válido | escolher em vez de digitar (lista vinda da tabela, calendário, máscara), com chave estrangeira no banco | C · contato · P | unidade de medida escolhida da tabela de unidades; calendário que não aceita dia passado quando a regra não tem exceção |
| T5 | Digitar fora do formato | formato tolerante: o sistema aceita as formas comuns e converte | A · contato · D | "1.234,50", "1234,5" e "R$ 1234,50" valem o mesmo |
| T6 | Errar código ou documento | dígito verificador conferido na hora, e de novo no servidor | C · contato · D | CPF ou CNPJ com dígito inválido barrado antes de enviar |
| T7 | Redigitar e errar o que já foi informado | valor pré-preenchido com o que o usuário já deu, e o padrão provável já marcado (WCAG 3.3.7) | — · P | endereço de entrega igual ao de cobrança já marcado |
| T8 | Enviar faltando campo | botão ativo que, no clique, lista o que falta junto do campo; botão desabilitado só com o motivo visível ao lado | C · etapa · D | "Falta: telefone e CEP" |
| T9 | Enviar duas vezes | botão travado durante o envio, mostrando "Enviando…" (`useFormStatus`). A garantia é a S3 | C · contato · P | |
| T10 | Compromisso financeiro, legal ou de dado enviado com erro | tela de revisão com "editar" em cada bloco e botão que diz a consequência (WCAG 3.3.4) | C · etapa · D | "Excluir 12 pedidos" e "Manter pedidos" no lugar de "Sim" e "Não" |
| T11 | Não entender o erro e desistir | mensagem junto do campo com causa e conserto, sem código técnico (WCAG 3.3.1 e 3.3.3) | A · contato · D | "CEP não encontrado. Confira os 8 números ou digite o endereço à mão" |

### 3.4 Recuperação

| # | Falha que evita | Dispositivo | Tipo | Exemplo genérico |
|---|---|---|---|---|
| R1 | Ação destrutiva por deslize | desfazer por alguns segundos e exclusão lógica com prazo, no lugar da confirmação | R | "Pedido excluído · Desfazer" por 10 s; item fica N dias na lixeira |
| R2 | Trabalho perdido ao sair no meio ou quando a conexão cai | rascunho salvo sozinho e retomada, com mensagem que diz o que aconteceu, o que foi salvo e o que fazer | R · etapa | "A conexão caiu. Seu pedido foi salvo como rascunho. Reenviar" |
| R3 | Não perceber o que aconteceu nem o próximo passo | comprovante com número, status e próximo passo | A | "Pedido 4821 recebido · próximo passo: separação" |
| R4 | Problema que ninguém relata | link de um clique "relatar problema com este registro" no fim do fluxo | A | |

### 3.5 Sistema interno: o funcionário como "servidor" (Chase e Stewart)

Na tela de sistema interno (CRM, MRP, painel) quem erra é o funcionário. Os erros dele são de tarefa e de tratamento.

| # | Falha que evita | Dispositivo | Tipo | Exemplo genérico |
|---|---|---|---|---|
| F1 | Fazer o trabalho errado ou na ordem errada | checklist obrigatório antes de concluir, conferido no servidor (S4) | C · valor fixo · D | "Concluir separação" só ativa com os 5 itens conferidos |
| F2 | Fazer coisa diferente do pedido | pedido original ao lado da tela de execução; leitura de código recusa item fora do pedido | C · contato · D | leitor recusa item que não está no pedido |
| F3 | Não reconhecer o cliente | ficha do cliente abre junto do atendimento: histórico e última reclamação | A | "Última reclamação: atraso na entrega" |

### 3.6 Esteira: o dispositivo que protege os outros dispositivos

| # | Falha que evita | Dispositivo | Tipo |
|---|---|---|---|
| E1 | O dispositivo some numa mudança de código e ninguém vê | teste que tenta violar a regra (inserir quantidade negativa, ler linha de outro perfil, pular etapa) e espera a recusa, a cada mudança | C (barra a publicação) · contato · D |
| E2 | Código manda campo com nome ou tipo errado | tipos gerados do esquema do banco e conferidos na compilação | C · contato · P |

## 4. Controle, advertência ou desfazer?

| Pergunta | Resposta | Dispositivo |
|---|---|---|
| A regra tem exceção legítima? | não, e a falha é grave | controle no servidor e no banco (C) |
| | às vezes (ex.: lançamento retroativo) | advertência com justificativa registrada; controle para quem não tem permissão |
| A ação é de rotina e reversível? | sim | desfazer (R), sem confirmação |
| A ação é grave e irreversível? | sim | confirmação que diz o objeto e a consequência, com botões que dizem o verbo; no raríssimo, digitar o nome |
| O campo é opcional e de baixo impacto? | sim | nada, ou um bom valor padrão. Aviso aqui só ensina a ignorar avisos |

Do FMEA para o dispositivo: o dispositivo de prevenção baixa a **ocorrência**; o de detecção com controle melhora a
**detecção** e barra o defeito; a advertência só melhora a detecção se alguém agir sobre ela.

## 5. O que não fazer

1. **"Tem certeza?" em tudo.** A pessoa aprende a clicar "sim" sem ler. Alertas de medicamento são ignorados em 49% a 96%
   dos casos (van der Sijs et al., 2006). Confirmação só no grave e irreversível; no resto, desfazer.
2. **Bloquear sem dizer o motivo.** Todo bloqueio diz o quê, por quê e como sair, ou quem libera. Controle que atrapalha o
   trabalho legítimo vira contorno: o código de barras de medicamento gerou 15 tipos de contorno em cinco hospitais
   (Koppel et al., 2008).
3. **Validar só no navegador.** A tela é contornável. A mesma regra, de preferência o mesmo esquema zod, vale na tela, no
   servidor e no banco.
4. **Mostrar erro cru.** "Erro 500", "Dados inválidos" ou o código do Postgres na tela. Traduza (seção 7).
5. **Dispositivo sem dono.** O `CHECK` cuja regra mudou e ninguém reconferiu, a RLS esquecida numa view nova, o teste
   desligado. Cada dispositivo tem dono, teste (E1) e revisão quando o processo muda.

## 6. Checklist do PR

Vale para toda tela ou gravação nova ou mudada, junto do P8 do manual:

- [ ] A regra de negócio mexida tem a mesma validação na tela, no servidor e, se for grave e sem exceção, no banco.
- [ ] Gravação de vários passos está numa transação (B6). Gravação que pode chegar duas vezes tem chave de idempotência (S3).
- [ ] Toda tabela nova tem RLS e o teste de *deny* (E1).
- [ ] Erro do banco e do servidor chega na tela traduzido, junto do campo, com causa e conserto (T11).
- [ ] Nenhuma confirmação em ação de rotina; ação destrutiva de rotina tem desfazer (R1).
- [ ] Formulário longo salva rascunho (R2).
- [ ] Advertência que pode ser ultrapassada registra quem passou, quando e por quê.
- [ ] Há um teste que tenta violar a regra nova e espera a recusa.

## 7. Código de erro do Postgres para traduzir na tela

| Código | O que é | Exemplo de mensagem |
|---|---|---|
| `23502` | `NOT NULL` | "Preencha a data de necessidade." |
| `23503` | chave estrangeira | "Este componente ainda é usado em 3 estruturas. Remova dele antes de excluir." |
| `23505` | `UNIQUE` | "Já existe um item com o código X." |
| `23514` | `CHECK` | "A quantidade precisa ser maior que zero." |
| `23P01` | `EXCLUDE` | "A máquina já está reservada das 8h às 10h." |

A tradução fica num só lugar no código, por nome da restrição. As mensagens acima são modelos; o texto final é de cada app.

## 8. Por onde começar em cada sistema

1. **Levantamento primeiro, sem mudar código.** Para cada módulo, uma tabela: item do catálogo, tem ou falta, onde está a
   prova (arquivo, migration, teste). Falta grave e sem exceção (seção 4) vai para o topo.
2. **Na stack Next.js + Supabase:** Server Action com zod (S1), função do banco para operação de
   vários passos (B6), restrições e RLS em migration, `error.tsx` e mensagens traduzidas (T11 e seção 7).
3. **Na stack Vite + React + Supabase:** não há Server Action. A fronteira é a RLS, a função do banco
   chamada por RPC e as funções em `api/`. Por isso a regra grave mora no banco (B1 a B8) e na função.
4. Mudança de banco segue o manual (P5, trava de alvo, PR). Este guia não passa por cima dele.

## 9. Fontes principais

- Shingo (1986), *Zero quality control*; Vidor e Saurin (2011), *Revista Produção Online*, v. 11, n. 2, p. 344-368, DOI 10.14488/1676-1901.v11i2.644.
- Chase e Stewart (1994), "Make your service fail-safe", *Sloan Management Review*; Fitzsimmons e Fitzsimmons (2014), cap. 6.
- Robinson (1997), poka-yoke em software.
- Nielsen, heurísticas 1, 3, 5 e 9 (rev. 2024) e "Confirmation dialogs" (2018); Laubheimer (2015), *slips* e *mistakes*; Norman (2013).
- ISO 9241-110:2020, robustez ao erro de uso (evitar, tolerar, recuperar); WCAG 2.2, critérios 3.3.1 a 3.3.9.
- PostgreSQL 18, §3.4 e §5.5 e Apêndice A; Supabase, Row Level Security; OWASP, Input Validation Cheat Sheet; RFC 9110 e o rascunho IETF do cabeçalho `Idempotency-Key` (rev. 08, 22/10/2026).
- Koppel et al. (2008) e van der Sijs et al. (2006), *JAMIA*: os casos de contorno e de alerta ignorado.
