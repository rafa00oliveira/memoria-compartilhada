# Memória persistente e sincronização entre dois computadores: diagnóstico e plano (20/11/2026)

Estado: **etapas 0, 1, 2, 3 e 6 executadas em 20/11/2026** (seção 14). Faltam as etapas 4 e 5, que precisam do PC da
Destak, e a 7. Pedido do Rafael: investigar, comparar e devolver um plano para aprovação.

Respostas do Rafael em 20/11, na ordem da seção 12:
1. Autorizou o `rafael-cerebro`.
2. O Alienware é dele e o PC de trabalho é da Destak, os dois com Windows.
3. O contrato permite levar tudo.
4. Pode fazer o zip.
5. O `destak-crm-auditoria` fica só local e os outros dois sobem.
O que está marcado como "verificado" foi lido ou rodado nesta sessão. O que está como "hipótese" ou "não verificado" ainda precisa de teste.

## 1. Resumo

O ecossistema pedido já existe pela metade. O Rafael tem as camadas L0 a L3, o isolamento por pasta, o grafo de conhecimento e vários ganchos automáticos. O que falta é o **transporte entre máquinas** e o **backup da parte que só existe neste PC**.

Recomendação: **não montar seis repositórios por área nem um sistema novo.** Fazer quatro coisas:

1. Versionar no GitHub, em um repositório privado, a "casca" que hoje só existe neste PC: o cofre de memória, o `CLAUDE.md` global, o `AGENTS.md`, o `PROJETOS.md` e o `PADRAO-CONTEXTO.md`.
2. Deixar os documentos do Desktop no OneDrive, que já sincroniza, e **não** pôr Git dentro dele.
3. Deixar o código nos repositórios que já existem.
4. Usar o Maestri Wire só para controlar o outro PC à distância. Ele **não sincroniza** nada.

Dois pontos dependem do Rafael antes de qualquer coisa: o contrato sobre dados da Destak em conta pessoal (seção 9) e se o PC de trabalho é da empresa (seção 7).

## 2. O que foi encontrado (verificado em 20/11/2026)

### 2.1 Maestri

- Versão instalada: **0.31.3** (`~/.maestri/manifest.json`). O changelog público lista a 0.60.0 de 18/11/2026, com Spaces e Remote Desktops. A versão instalada é mais antiga: atualizar antes de testar o Wire.
- Workspaces reais (`maestri workspace list`): `detsak`, `HU-univasf` (2 andares), `Apice`, `Univasf estudo` (10 andares) e `RAFA`. **Não existem** `apsi`, `destak`, `univasf`, `hu-univasf` e `pessoal` como espaços. Os nomes do pedido são exemplos.
- Estado do Maestri mora em `~/.maestri/` (JSON: workspaces, roles, presets, rotinas, layout da barra, contas em `accounts/`). Não encontrei exportação nem sincronização nativas. **O que foi verificado:** o `maestri` tem `workspace create --from` (clona um workspace), `partitura` (layout salvo de agentes) e `space`. **Não verificado:** se essas partituras exportam para arquivo.
- **Maestri Wire** (documentação oficial, página `/pt-br/docs/wire`, lida por um agente): é um protocolo beta para outro dispositivo controlar um PC que roda o Maestri. Conecta pela rede local ou por Tailscale, com código de 6 dígitos. **Não sincroniza workspaces.** O PC remoto precisa estar ligado. A documentação diz que dispositivos convidados são só de leitura. Isso precisa de teste, porque não ficou claro se vale para o seu segundo PC.
- Licença: o Pro cobre **um usuário em até 2 dispositivos** (`/pt-br/terms`, §5, e a página de preços). Dois PCs seus cabem. Conferir se o PC de trabalho conta como dispositivo seu.

### 2.2 A skill "Graph File"

No ambiente só existe a skill **`graphify`** com esse perfil (`~/.claude/skills/graphify`). Assumi que é ela. Se for outra, avise.

- Funcionamento (verificado): lê uma pasta, extrai entidades e relações e gera `graph.json`, um relatório e um HTML. A consulta é `graphify query "..."`, feita **dentro** de `Desktop/_graphify`.
- Há dois grafos: o **estrutural** (documentos e títulos, com arquivo e linha, ~390 KB, reconstruído todo domingo às 08h) e o **semântico curado** (conceitos, o mais novo de 11/10/2026, ~300 KB, refeito à mão pela skill).
- Consumo de tokens: o grafo **não é lido inteiro**. A consulta devolve um trecho. Isso é bom para a economia. Falta medir quantos tokens uma consulta típica devolve (teste D).
- Fraqueza: o grafo semântico tem 40 dias e depende de uma rodada manual com LLM. O estado dos projetos **não** passa por ele. Quem guarda o estado é o `CONTEXTO.md`.
- Portabilidade: mora em `OneDrive/Desktop/_graphify`, então já chega ao outro PC. Caminhos absolutos do PC atual ficam dentro de arquivos auxiliares (`.graphify_python`).

### 2.3 As camadas L0 a L3 já existem (memória `segundo-cerebro-arquitetura`)

| Camada pedida | O que já faz esse papel | Onde |
|---|---|---|
| L0 índice global | `PROJETOS.md` (uma linha por pasta, 15 KB) e `MEMORY.md` | `~/` e cofre de memória |
| L1 contexto ativo | `CONTEXTO.md` de cada pasta (cabeçalho de 8 linhas e `## Estado` com prova) | 24 no Desktop e 22 em `~/Claude` |
| L2 conhecimento | `SESSION_LOG.md`, `DOCUMENTOS.md`, `docs/`, cofre de memória (169 arquivos) | por pasta |
| L3 arquivo | `docs/historico/`, `_historico/` | por pasta, nunca lido |

O isolamento por cliente também existe: o Claude Code só carrega o `CLAUDE.md` e o `CONTEXTO.md` da pasta onde a sessão abriu.

### 2.4 Onde cada coisa mora hoje e o que a protege

| Item | Onde | Protegido por | Risco |
|---|---|---|---|
| Desktop inteiro (CONTEXTO, documentos, `_graphify`) | `OneDrive/Desktop` (verificado: a pasta Desktop do Windows aponta para o OneDrive) | OneDrive (histórico de versões) | baixo |
| Código dos apps (`destak-crm`, `selo-hu`, `mrp-ibacem` etc.) | `~/Claude/*` | GitHub (verificado: 24 repositórios com remoto) | baixo |
| Skills e ferramentas | `~/.claude/skills` e `~/.claude/tools` | GitHub privado (`apice-skills`, `claude-tools`) | baixo |
| **Cofre de memória** (169 arquivos, ~830 KB) | `~/.claude/projects/C--Users-Rafa00oliveira/memory` | **nada** (verificado: não é repositório Git e não está no OneDrive) | **alto** |
| **`CLAUDE.md` global, `AGENTS.md`, `PROJETOS.md`, `PADRAO-CONTEXTO.md`, `_IDENTIDADE_RAFAEL.md`, `settings.json`** | `~/` e `~/.claude/` | **nada** | **alto** |
| Estado do Maestri (workspaces, roles, presets) | `~/.maestri/` | só o disco local | médio |
| Repositórios sem remoto | `canal-dark`, `clube-poker`, `destak-crm-auditoria` | nada | médio |

**Este é o achado central:** o conhecimento acumulado de longo prazo e as regras dos agentes são o único conteúdo sem cópia. Se o disco falhar, perde-se mais do que o código.

### 2.5 Automação já instalada (`~/.claude/settings.json`, verificado)

- `SessionStart`: injeta o cartão de identidade (5 KB) mais outras leituras.
- `Stop`: o gatilho `aprendaelimpe-gatilho.js` dispara o fechamento da sessão em ~350 mil tokens.
- `PreCompact`: `compacta-fora-da-tarefa.js` adia a compactação até o fim da tarefa (testado em 15 e 16/11).
- `SessionEnd`: `check-semanal.ps1`.
- Skill `aprendaelimpe` (abertura, checkpoint, fechamento) e verificador `checa-contexto.ps1`.
- **Codex:** a saída do `codex exec` desta sessão mostra `hook: Stop Completed`, então ele tem ganchos. **Não verificado:** quais eventos ele aceita. Precisa ler a documentação oficial dele.

### 2.6 Custo de contexto no início de cada sessão (medido em bytes; tokens são estimativa, bytes ÷ 4)

`CLAUDE.md` global 14,7 KB + `AGENTS.md` 10,4 KB + `MEMORY.md` 22,2 KB + saída do gancho de identidade ~14 KB = **~61 KB, cerca de 15 mil tokens** antes da primeira pergunta. O `MEMORY.md` está colado no teto (aviso em 22 KB, limite do Claude Code em 25 KB). Qualquer solução que aumente o que carrega sozinho piora isso. O grafo e os `CONTEXTO.md` só entram sob demanda.

## 3. O que o pedido pressupõe e a realidade contradiz

1. **"Um repositório por área"** (`apsi`, `destak`, `univasf`...): as áreas já estão organizadas por pasta, com índice (`PROJETOS.md`) e estado (`CONTEXTO.md`). O que falta é backup e transporte. Seis repositórios novos duplicariam o que o OneDrive e os 24 repositórios de código já cobrem, e criariam fontes concorrentes de verdade.
2. **Git dentro do OneDrive:** o Desktop está no OneDrive. Pôr `.git` ali é uma combinação conhecida por corromper o repositório (o OneDrive sincroniza arquivos de `.git` fora de ordem). **Hipótese forte, não testada aqui.** Por isso a proposta não coloca repositórios no Desktop.
3. **"Sincronizar os Maestris":** o Wire não faz isso e o Maestri não tem sincronização nativa. A sincronização é do Git e do OneDrive. O Wire é controle remoto.
4. **"Memória atualizada automaticamente a cada decisão":** o Claude Code não tem evento "decisão tomada". Gancho dispara em início, fim, compactação e ferramenta. O registro de decisões só é automático se o agente tiver a regra de gravar no checkpoint (a `aprendaelimpe` já manda isso) e um gancho de fim de sessão conferir e sincronizar. **Promessa honesta:** o transporte é automático; o conteúdo depende de o agente cumprir a regra, e o verificador `checa-contexto.ps1` cobra o atraso.
5. **Caminhos absolutos:** as regras e a memória citam `C:\Users\Rafa00oliveira\...`. No outro PC, se o usuário do Windows for outro, isso quebra. O Claude Code também chaveia o cofre de memória pelo caminho da pasta (`C--Users-Rafa00oliveira`). Já existe o truque das junctions NTFS para isso (memória `segundo-cerebro-arquitetura`).

## 4. Arquitetura recomendada

Alternativa **A+B**: manter a estrutura atual, acrescentar transporte e backup.

### 4.1 Três canais, cada um com um dono

| Canal | Leva o quê | Por quê |
|---|---|---|
| **OneDrive** (já ativo) | documentos do Desktop, CONTEXTO das pastas de documentos, `_graphify` | sincroniza sozinho, sem conflito de `.git` |
| **GitHub** (repositórios existentes) | código e docs técnicos de cada app | já é a fonte única de cada app |
| **GitHub, repositório novo `rafael-cerebro` (privado)** | cofre de memória, `CLAUDE.md` global, `AGENTS.md`, `PROJETOS.md`, `PADRAO-CONTEXTO.md`, `_IDENTIDADE_RAFAEL.md`, `settings.json` sem segredos, scripts de ganchos | cobre o único buraco real de backup |

`skills` e `tools` continuam nos repositórios que já têm.

### 4.2 Estrutura do `rafael-cerebro`

```
rafael-cerebro/
  README.md                  como restaurar em um PC novo
  home/                      espelho de ~/ (AGENTS.md, PROJETOS.md, PADRAO-CONTEXTO.md, VOCABULARIO.md)
  claude/
    CLAUDE.md
    _IDENTIDADE_RAFAEL.md
    settings.template.json   sem segredos; o real é gerado no PC
    memory/                  o cofre (169 arquivos), com MEMORY.md gerado
  maestri/
    roles/ e presets.json    só o que é portátil (a confirmar)
  scripts/
    sync-cerebro.ps1         pull no início, commit por nome e push no fim, com gitleaks
    restaura-pc.ps1          recria junctions e caminhos
```

Isolamento entre empresas: **cada área já tem a sua pasta e o seu CONTEXTO.md.** Nada da área de um cliente é carregado se a sessão abrir em outra pasta. O `rafael-cerebro` carrega só regras e memória transversal, que já são lidas hoje.

### 4.3 Sincronização e conflitos

- **Início da sessão (`SessionStart`):** `git pull --ff-only`. Se não for avanço simples, não força nada: grava o motivo em `~/.claude/logs/sync.log` e avisa o Rafael.
- **Fim da sessão (`SessionEnd` ou `Stop`):** commit só dos arquivos que mudaram, nomeados um a um, com varredura de segredo (gitleaks já foi usado em 30/10) e push. Sem commit por mensagem. Com debounce de alguns minutos.
- **Conflito:** as duas versões ficam preservadas (arquivo `.conflito-<data>`), e o agente pede ao Rafael. Nunca `--force`, `stash` nem `--no-verify` (regras que já valem).
- **Sem internet:** o commit local acontece; o push espera a rede voltar.
- **O Maestri Wire** só entra para abrir a sessão de um PC no outro. Com um dos PCs desligado, tudo acima continua funcionando.

### 4.4 Memória sem apodrecer (o que já existe e o que falta)

Já existe: o `## Estado` com prova por item, o `## Armadilhas`, o teto de 3 sessões em `SESSION_LOG`, a decisão vigente com data e o verificador `checa-contexto.ps1`. Falta um campo de **substituição de decisão** (`substitui:`/`substituída por:`) nos arquivos de `docs/decisoes/`. É uma convenção de uma linha, sem banco novo.

### 4.5 Economia de tokens

- Manter o teto de 25 KB do `MEMORY.md`. Antes de qualquer acréscimo, juntar memórias do mesmo assunto (feito em 15 e 16/11).
- Leitura progressiva já é a regra: `PROJETOS.md` → `CONTEXTO.md` → `SESSION_LOG` → `docs/`.
- Busca semântica local (vetores): **não recomendo agora.** O ganho não foi demonstrado e acrescenta um componente. O grafo estrutural e o `grep` cobrem o caso.
- Medição: ver teste D.

## 5. Alternativas pesquisadas

| Alternativa | Veredito |
|---|---|
| Um repositório por área (proposta inicial) | **Não.** Duplica o que o OneDrive e os repositórios de código já fazem; dilui a fonte de verdade |
| Tudo em um monorepo | **Não.** Mistura Destak, Ápice, HU e pessoal; sem isolamento de acesso |
| Só OneDrive para o cofre de memória | Possível, mas o cofre fica em `~/.claude`, fora do OneDrive, e perde o histórico do Git. Mover o cofre para o OneDrive quebra o caminho que o Claude Code espera |
| Git LFS para PDFs e planilhas | Só se aparecer arquivo grande versionado. Hoje os documentos ficam no OneDrive |
| Banco ou servidor de memória (vetor, SQLite, serviço) | **Não** pela Regra 7 do pedido (sem componente novo sem benefício demonstrado) |
| Maestri Wire como sincronização | **Não serve:** é controle remoto |
| Maestri Box (Linux no servidor) | Fora do escopo; só se o Rafael quiser um PC sempre ligado |

## 6. Wire e Maestri: o que fazer

1. Atualizar o Maestri nos dois PCs (0.31.3 → atual) **antes** de qualquer teste do Wire, porque a documentação descreve a 0.60.
2. Parear os dois PCs pela rede local ou pelo Tailscale e testar (teste J).
3. Não depender do Wire para recuperar memória.
4. Roles, presets e rotinas do Maestri: replicar à mão ou por script só o que for portátil. **Pendente de verificar** o formato de `~/.maestri/roles` e `routines.json` antes de decidir.

## 7. Dois computadores

- Mesmo usuário do Windows nos dois? Se sim, quase nada muda. Se não, os caminhos `C:\Users\Rafa00oliveira` precisam virar `~` nas regras, ou as junctions precisam ser recriadas (o `restaura-pc.ps1` faz isso).
- O PC de trabalho é da empresa ou seu? Isso decide o que pode ir para ele (seção 9).

## 8. Segurança

- **Segredos:** `~/.ai_keys.env` e arquivos `.env` **não entram** em nenhum repositório. O `settings.json` vai como modelo sem segredo. Gitleaks antes de cada push.
- **Cofre de memória:** contém números de faturamento e dados da Destak, da Ápice e do HU em texto. A regra de 30/10 autoriza repositórios privados próprios. O repositório novo precisa de autorização expressa, porque vai conter mais do que os três que já existem.
- Repositório privado não é garantia de conformidade. Ativar autenticação em dois fatores na conta do GitHub (item que já estava pendente do CRM, E4).
- **Backup separado:** o GitHub não cobre `.env`, bancos Supabase nem o disco. Registrar, no README do `rafael-cerebro`, onde ficam essas cópias.

## 9. Dados da Destak em conta pessoal (precisa do Rafael)

O pedido diz que o contrato permite preservar o conhecimento e a metodologia. O que não está claro, e eu **não presumo**:

- código do CRM: está sendo organizado com a empresa (repositório `destak-crm` já é seu);
- dados pessoais de clientes e vendedores (LGPD) e números de faturamento: o que pode ficar na conta pessoal?
- PC de trabalho: se for da Destak, instalar a sua conta do GitHub nele e clonar o `rafael-cerebro` pode contrariar a política da empresa.

Proposta enquanto isso: o `rafael-cerebro` leva só regras e memória **sem** dado identificável de cliente; o conteúdo Destak fica onde já está (OneDrive e repositório do CRM), até o Rafael confirmar o que o contrato permite.

## 10. Plano em etapas (nada executado)

| # | Etapa | Reversível? | Depende do Rafael |
|---|---|---|---|
| 0 | **Backup imediato do cofre de memória** (zip no OneDrive, sem Git) | sim | só o OK |
| 1 | Criar o `rafael-cerebro` privado e fazer o primeiro commit do que é seguro, com gitleaks | sim (apagar o repo) | OK expresso (seção 9) |
| 2 | Escrever o `sync-cerebro.ps1` e testar com um PC só | sim | não |
| 3 | Ligar o pull no `SessionStart` e o push no `SessionEnd` | sim (remover o gancho) | OK |
| 4 | Atualizar o Maestri e testar o Wire entre os dois PCs | sim | acesso ao PC 2 |
| 5 | Restaurar em um diretório limpo do PC 2 (`restaura-pc.ps1`) | sim | acesso ao PC 2 |
| 6 | Dar remoto aos 3 repositórios sem remoto (decisão caso a caso) | sim | decisão do Rafael |
| 7 | Convenção `substitui:` nas decisões e registrar tudo no manual | sim | não |

Etapa 0 é barata e fecha o maior risco hoje, antes de qualquer arquitetura.

## 11. Testes (A a J, cada um com critério objetivo)

| Teste | Como | Passa quando |
|---|---|---|
| A. Continuidade | tarefa no PC 1, sync, abrir no PC 2 | o agente do PC 2 diz o que foi feito e a próxima ação, sem a conversa |
| B. Sem histórico | sessão nova só com os arquivos | reconstrói o contexto lendo `PROJETOS.md` e `CONTEXTO.md` |
| C. PC perdido | restaurar em pasta limpa | `restaura-pc.ps1` recria memória, regras e junctions |
| D. Tokens | medir bytes e tokens do início de sessão e de uma consulta ao grafo, antes e depois | contexto inicial não passa de ~61 KB e a resposta certa continua saindo |
| E. Conflito | mudar o mesmo arquivo nos dois PCs | as duas versões ficam; nada some |
| F. Sem rede | cortar a internet, trabalhar, religar | commit local; push depois |
| G. Isolamento | abrir uma pasta de cliente | não carrega CONTEXTO de outra área |
| H. Integridade | comparar hash do cofre antes e depois | 169 arquivos idênticos |
| I. Segurança | plantar um segredo falso | gitleaks barra o commit |
| J. Wire | desligar um PC | o outro recupera tudo pelo Git e OneDrive |

## 12. Decisões que dependem do Rafael

1. **Autoriza o repositório privado `rafael-cerebro`** com o cofre de memória (contém números de faturamento em texto)?
2. **O PC de trabalho é seu ou da Destak?** E o usuário do Windows é o mesmo?
3. **O que o contrato permite levar da Destak** para a conta pessoal (seção 9)?
4. **Etapa 0** (zip do cofre no OneDrive): pode fazer agora?
5. Os 3 repositórios sem remoto (`canal-dark`, `clube-poker`, `destak-crm-auditoria`): dar remoto privado ou manter só local?

## 13. Limites deste diagnóstico

- Não acessei o segundo PC. Tudo sobre ele é hipótese.
- O Wire foi lido na documentação pública; **não foi testado**. A versão instalada (0.31.3) é anterior à documentada (0.60.0).
- Ganchos do Codex: só vi `hook: Stop Completed` na saída. Os eventos aceitos não foram lidos na documentação.
- Não medi tokens reais de uma consulta ao grafo; os números de tokens desta página são bytes ÷ 4.
- Fontes: `themaestri.app/pt-br/docs/wire`, `/pt-br/changelog`, `/pt-br/terms`, `/pt-br` (lidas por um agente; a página do changelog foi lida só em parte).

## 14. Execução de 20/11/2026 (com prova)

| Etapa | Feito | Prova |
|---|---|---|
| 0 | Zip do cofre e das regras em `OneDrive/_backup-cerebro/cerebro-2026-11-20.zip` | 171 arquivos do cofre no zip = 171 no disco; hash do `MEMORY.md` igual depois de extrair |
| 1 | Repositório privado `rafa00oliveira/rafael-cerebro`, bare em `~/.cerebro.git` com pasta de trabalho na home | 1º commit `abe6636`, 200 arquivos; `git ls-remote` = local; `private: true` |
| 2 | `~/.claude/tools/cerebro/cerebro.py` (init, sync, restaura, agenda, status) | `teste_cerebro.py`: 10 casos em homes falsas, todos passaram |
| 3 | Tarefa "Claude - cerebro sync" a cada 10 min; o alerta entra no gancho SessionStart | a rodada da tarefa deu `LastTaskResult 0`; o sync manual subiu `0bf355d` |
| 6 | `canal-dark` e `clube-poker` privados no GitHub; `destak-crm-auditoria` fica local | `git cherry @{u}` vazio nos dois; gitleaks limpo no histórico |

O que os 10 testes cobrem:
- init: só a lista sobe, e uma home sem nenhum caminho da lista é recusada;
- restauração: o arquivo que já existia no PC novo é guardado; uma pasta no caminho de um arquivo é guardada; a falha
  no meio é desfeita e dá para repetir;
- sync: de B para A; apagar propaga;
- conflito: nada se perde e sobe um ramo;
- gitleaks barra o token;
- sem rede, o commit fica local.

O que a revisão achou:
- O Codex achou 2 defeitos: o pathspec vazio pegava a home inteira, e a restauração que falhava no meio deixava a home
  desmontada. Os dois foram corrigidos.
- Os testes acharam outros 2: o `checkout -f` apagava uma pasta que ocupasse um caminho do repositório, e o `rmtree`
  falhava calado nos objetos somente leitura. Os dois também foram corrigidos.

**Falta:**
- **Etapa 5, PC da Destak:** seguir `~/.claude/tools/cerebro/LEIA.md`. Se o usuário do Windows lá não for
  `Rafa00oliveira`, os caminhos absolutos dos ganchos no `settings.json` precisam de ajuste antes.
- **Etapa 4:** atualizar o Maestri e testar o Wire.
- **Etapa 7:** convenção `substitui:` nas decisões.
