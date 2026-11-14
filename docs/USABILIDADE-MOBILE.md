# Usabilidade no celular: catálogo para app de campo

Versão 1, 14/11/2026. Para app web usado no celular por quem trabalha fora do escritório: fiscal em vistoria, vendedor
na rua. A meta é a pessoa fazer a tarefa sem treino, sem erro e rápido, com uma mão, no sol e com internet ruim.

Base: 129 regras em três pesquisas de 13/11/2026, cada uma com número, fonte (URL e seção) e como testar, todas em
`docs/pesquisa-usabilidade-mobile/`:

- `R1-padroes.md`, regras P01 a P42: Apple HIG, Material 3, WCAG 2.2, MDN e web.dev.
- `R2-comportamento.md`, regras U01 a U43: NN/g, Hoober, Baymard, Luke Wroblewski e uso em campo.
- `R3-tecnica.md`, regras T01 a T44: viewport, formulário, PWA, offline, desempenho, câmera, GPS e teste em aparelho.

Conferência: 10 citações abertas na fonte original, 10 conferem (3 do R2, 3 do R1, 4 do R3). O que a pesquisa não
conseguiu abrir está marcado `[NAO CONFERIDO]` nos arquivos e não virou regra aqui sem aviso.

## 1. Como usar

- **Tela nova ou mudada:** checklist da seção 3 (só a parte MVP), mais a seção 6 do `POKA-YOKE-DIGITAL.md`. Quem usa
  Claude Code roda a skill `impeccable` (`audit` para medir, `adapt` para ajustar ao celular).
- **App que já existe:** levantamento pelo roteiro da seção 4, sem mudar código. O conserto vem depois, em PR pequeno
  (seção 5).
- **Dúvida sobre uma regra:** o ID (P, U ou T) leva à linha completa no arquivo da pesquisa, com a fonte e o teste.
- Regra que não serve para o seu app: diga qual e por quê no levantamento. O catálogo muda com o teste em campo.

## 2. Os números que valem

Onde as fontes discordam, a escolha está na coluna "Por quê".

| Assunto | Número | Por quê | IDs |
|---|---|---|---|
| Área de toque | 48×48 CSS px em todo controle novo; abaixo de 44 é falha; 24×24 é só o mínimo legal (WCAG 2.5.8) | Android pede 48 dp, web.dev 48 px, Apple 44 pt; os 24 da WCAG são piso de acessibilidade, não de uso andando | P01, P03, U04 |
| Ação principal e ação feita andando | botão de pelo menos 1 cm físico, medido com régua no aparelho | NN/g: dedo de 1,6 a 2 cm; Hoober: alvo de 8 mm em movimento | P04, U05 |
| Espaço entre alvos | 8 px livres entre áreas de toque; ação perigosa a 8 mm ou mais (centro a centro) das frequentes | web.dev e Google pedem 8; Hoober pede 8 a 10 mm para separar erro caro | P02, U06 |
| Contraste | 4,5:1 no texto (3:1 no texto grande); 3:1 em borda de campo, ícone e foco; 7:1 em prazo, status e valor | WCAG AA é o portão; o 7:1 vem da Apple ("especially in small text") e do uso no sol: escolha deste catálogo | P15, P16, P17, U36 |
| Fonte | campo de formulário com 16 px ou mais; no teste ao sol, conferir 18 a 20 px | web.dev: 20 px "is about right on mobile". O zoom do iPhone abaixo de 16 px só tem relato de desenvolvedor, sem documento da Apple | T11, P12 |
| Largura | toda tela funciona em 320 px sem rolagem horizontal; teste principal em 390×844 e 360×800 | WCAG 1.4.10 usa 320 px. O manual de construção dizia 360: o catálogo desce para 320 | P09 |
| Zoom e texto grande | zoom liberado (pelo menos 2×); texto a 200% sem cortar | WCAG 1.4.4. O exemplo de viewport da doc do Next trava o zoom: não copiar | P08, P13, T02 |
| Barra inferior | 3 a 5 destinos, cada um com ícone e rótulo; 4 é o confortável | Material: 3 a 5; NN/g: 4 a 5; Hoober: mais de 4 aperta o alvo da borda | P21, U09 |
| Resposta ao toque | mudança visual em até 0,1 s; INP até 200 ms no p75 | NN/g: 0,1 s parece instantâneo; o INP é a meta atual do Google (o RAIL saiu) | U30, T25 |
| Espera | menos de 1 s: nada; tela inteira até 10 s: esqueleto; ação de 2 a 10 s: spinner num bloco; total conhecido (fotos) ou 10 s ou mais: barra real com Cancelar | NN/g 2014 e 2023; Apple pede progresso determinado quando se sabe o total | U31, P35, P36 |
| Carga da página | LCP até 2,5 s, CLS até 0,1, no p75 do celular; JS inicial até 170 KB comprimido; página até 1.600 KiB | web.dev e Lighthouse. O teto de 170 KB é ponto de partida; o INP e o LCP medidos em campo valem mais | T25, T29, T30 |
| Atenção | cada passo cabe numa olhada de 4 a 8 s | na rua, a atenção ao celular cai para rajadas de 4 a 8 s (no laboratório, 8 a 16) | U33 |
| Formulário | uma coluna; rótulo acima do campo; no máximo 1 ou 2 campos opcionais | Baymard e NN/g | U13, U14, U15 |
| Dado guardado no aparelho | contar com a perda: o Safari pode apagar dado de script depois de 7 dias sem uso | MDN; o web.dev diz que o app instalado escapa, o WebKit não dá número. Vale o pior caso | T23 |
| Teste com gente | 5 pessoas por rodada; 40 só quando a decisão pedir número | 5 pessoas acham cerca de 85% dos problemas (NN/g) | U40, U42 |

## 3. Checklist

MVP primeiro. Cada item cita os IDs da pesquisa.

### 3.1 Toque e alcance

- [ ] Todo controle com área de toque de 48 px; ícone pequeno ganha padding até 48 (P01, U04).
- [ ] 8 px livres entre áreas de toque; Excluir e Cancelar longe de Salvar e Próximo (P02, U06).
- [ ] Conteúdo e toque frequente no centro da tela; barra e ação secundária no topo e no rodapé (U02).
- [ ] Ação dispara ao soltar o dedo (`click`), nunca em `touchstart` ou `pointerdown` (P05).
- [ ] Botão customizado com estado pressionado visível (`:active`) (P06).
- [ ] Todo gesto (deslizar, pinça, arrastar) tem um caminho de um toque: botão, menu ⋮, setas (P37, P38).
- [ ] Ícone de navegação e de ação com rótulo escrito (U08).
- [ ] Hover só dentro de `@media (hover: hover) and (pointer: fine)`; nenhuma ação escondida atrás dele (T06).

### 3.2 Leitura no sol

- [ ] Contraste de 4,5:1 no texto, 3:1 em borda, ícone e foco, 7:1 em prazo, status e valor (P15 a P17, U36).
- [ ] Status nunca só por cor: ícone e texto ("Vencida", "Conforme"); o print em tons de cinza continua legível (P18, U37).
- [ ] Zoom liberado: nada de `user-scalable=no`, `userScalable: false` ou `maximum-scale` abaixo de 2 (P08, T02).
- [ ] Texto a 200% sem corte; dado crítico não vira "…"; o card vira uma coluna (P13, P14).
- [ ] 320 px sem rolagem horizontal; retrato e paisagem funcionam (P09, P10).
- [ ] `color-scheme` igual ao tema entregue (`only light` se só houver o claro) (P19).

### 3.3 Navegação e botões

- [ ] Barra inferior com 3 a 5 destinos, sempre visível, só para navegar, sem item desativado (P21, P22, U09).
- [ ] Nada de menu hambúrguer como navegação principal (U09).
- [ ] Barra superior com o título e até 2 ações; o resto no ⋮ (P23).
- [ ] No máximo 1 ou 2 botões em destaque por tela; ação destrutiva nunca no estilo principal (P25).
- [ ] Botão de envio fixo no rodapé, dentro da área segura (`env(safe-area-inset-bottom)`) (P07, T04).
- [ ] Padrões que a pessoa já usa em outros apps; nenhum controle inventado (U10).

### 3.4 Formulário

- [ ] Só o campo que a tarefa exige; no máximo 1 ou 2 opcionais (U13).
- [ ] Rótulo acima e sempre visível; placeholder nunca no lugar do rótulo; dica de formato em texto fixo (U14).
- [ ] Uma coluna; um valor, um campo (telefone com DDD, CNPJ, data) (U15, U18).
- [ ] Teclado certo: `type="email"`, `tel`, `search`; CEP, CNPJ e código com `type="text" inputmode="numeric"`;
      peso e valor com `inputmode="decimal"`; `type="number"` só para quantidade (T07, T08, U16).
- [ ] `autocomplete` em nome, endereço, telefone e login (`username`, `current-password`, `one-time-code`); nunca
      `off` no login (T09).
- [ ] `enterkeyhint`: `next` no meio, `done` ou `send` no último, `search` na busca (T10).
- [ ] Autocorreção desligada em nome, e-mail, código e endereço (U17).
- [ ] Aceita qualquer formato colado ("(87) 99999-0000", "56.300-000") e formata sozinho (U19).
- [ ] Preenche pela pessoa: padrão bom, histórico, GPS e o que ela já digitou no fluxo; nada se pede duas vezes (U20, P41).
- [ ] Busca de cliente e produto pelas primeiras letras, tolerando erro de grafia (U21).
- [ ] Valida ao sair do campo; o erro some assim que o campo fica certo (U25).
- [ ] Erro específico ao lado do campo, com texto e ícone, dizendo como corrigir (U26).
- [ ] Campo em foco nunca coberto pelo teclado nem por barra fixa (`scroll-padding`); Salvar alcançável com o teclado
      aberto (P11, T05).
- [ ] Login aceita colar e o gerenciador de senhas (P40).

### 3.5 Retorno e espera

- [ ] Todo toque muda algo na tela na hora, e o botão trava enquanto envia (U30).
- [ ] Indicador pela duração da espera (seção 2); esqueleto na carga de tela, nunca tela branca (U31, P35).
- [ ] Envio de fotos com progresso real ("3 de 8") e Cancelar (P36).
- [ ] Confirmação em snackbar curta, uma por vez, acima da barra inferior, com no máximo uma ação ("Desfazer") (P32).
- [ ] Erro e falha de envio não somem sozinhos e dizem se o dado ficou no aparelho (P33).
- [ ] Leitor de tela anuncia sem mover o foco: `role="status"` no sucesso, `role="alert"` no erro (P34).

### 3.6 Modal e confirmação

- [ ] Modal só para tarefa curta; fluxo longo em tela própria (P26).
- [ ] Botão Fechar ou Cancelar visível, além do gesto (P27).
- [ ] Fechar com dado não salvo (arrastar, voltar do Android, tocar fora) pergunta e oferece Salvar (P28).
- [ ] Um modal por vez (P29).
- [ ] Confirmação só no grave e sem volta; no resto, Desfazer; nenhum alerta ao abrir o app (P30, U27).
- [ ] Botão de diálogo com verbo ("Excluir pedido"), "Cancelar" com esse nome, nunca "OK" ou "Sim" em ação (P31).

### 3.7 Internet ruim e offline

- [ ] Rascunho salvo a cada campo; volta ao mesmo ponto depois de trocar de app, recarregar, cair a rede ou expirar a
      sessão (U34).
- [ ] Toda gravação de campo (vistoria, foto, pedido, visita) entra primeiro numa fila no IndexedDB e depois vai ao
      Supabase (T19).
- [ ] A fila reenvia no evento `online`, ao abrir o app, ao voltar para a aba e por um botão "Enviar agora". O
      Background Sync não serve de base: o iPhone e o Firefox não têm (T20).
- [ ] Cada item da fila tem um UUID gerado no celular, e o servidor grava com upsert por ele: reenvio não duplica (T21).
- [ ] "Enviado" só com a resposta do servidor; `navigator.onLine` é só dica na tela (T22).
- [ ] Estado da conexão e da fila à vista, em linguagem de ação ("2 pendentes. Enviar agora") (U35).
- [ ] `navigator.storage.persist()` pedido; instalar na tela de início orientado (T23).
- [ ] Atualização do app pergunta antes ("Nova versão. Atualizar?"), nunca recarrega sozinha: no Vite,
      `registerType: 'prompt'`; no Serwist, sem `skipWaiting` automático (T17).
- [ ] Leitura do dia (carteira, roteiro, checklist, prazos) guardada no aparelho; o que é grande, só a pedido (T18).

### 3.8 Câmera, localização e permissão

- [ ] "Tirar foto" com `<input type="file" accept="image/*" capture="environment">` e um segundo botão para a galeria (T36, U24).
- [ ] Foto comprimida no celular antes da fila, em JPEG, com a orientação certa (`createImageBitmap` com
      `imageOrientation: 'from-image'` e `canvas.toBlob(cb, 'image/jpeg', q)`); nunca PNG (T37).
- [ ] Permissão pedida no toque da tarefa que precisa dela, com uma frase antes; nunca ao abrir o app (T38).
- [ ] Antes de pedir, `navigator.permissions.query()`; se negada, instrução de como reativar (T39).
- [ ] GPS com `timeout` explícito e opção de salvar sem coordenada: o padrão espera para sempre (T40).

### 3.9 Desempenho

- [ ] Core Web Vitals medidos em uso real no celular (`web-vitals/attribution` gravando numa tabela) (T25, T44).
- [ ] Trabalho acima de 50 ms quebrado em partes (T26).
- [ ] `width` e `height` em toda imagem; lista com esqueleto de altura fixa (T27).
- [ ] Miniatura no tamanho exibido (`sizes` no next/image; `srcset` ou transformação do Storage no Vite) (T31).
- [ ] Lighthouse no modo mobile a cada entrega, nas 3 telas principais, comparado com a anterior (T32).

### 3.10 Primeiro uso

- [ ] Sem tutorial nem carrossel de abertura; ensina no contexto (U28).
- [ ] Todo estado vazio diz por que está vazio e qual é o próximo passo (U29).

### 3.11 Depois do MVP

Modo escuro pelo sistema (P20); `prefers-reduced-motion` (P42); gestos sem conflito com a borda do sistema (P39);
opções abertas perto do último toque (U07); campo do tamanho do valor (U22); interface otimista com aviso na reversão
(U32); `fetchpriority` e `preload` na imagem do LCP (T28); `useOffline` do Next só para a faixa "Sem conexão" (T24);
push no iPhone só com o app instalado (T41); SUS no fim de cada rodada (U43).

### 3.12 Por stack

- **Next.js 16:** `export const viewport` no `app/layout.tsx` (T01); manifest em `app/manifest.ts` e service worker com
  Serwist, `@serwist/turbopack` ou `@serwist/next` conforme o bundler (T15); `preload` no lugar de `priority` no
  next/image (T28).
- **Vite:** `<meta name="viewport">` no `index.html` (T01); `vite-plugin-pwa` 2.x, que pede Node 20.19 ou mais, com
  `registerType: 'prompt'` (T16, T17); cabeçalhos e PWA servidos pela Vercel (`vercel.json`).
- **Os dois:** `100svh` na página que rola, `100dvh` só na casca fixa, nunca `100vh` (T03); ícones de 192 e 512 px,
  `apple-touch-icon` de 180 e instrução manual de instalação no iPhone, onde não existe `beforeinstallprompt` (T12 a T14).

## 4. Roteiro de levantamento (sem mudar código)

1. **Tarefas.** Liste as 3 a 5 tarefas que a pessoa mais faz no celular (por exemplo: abrir a vistoria do dia,
   preencher um item com foto, enviar; achar o cliente, lançar o pedido, fechar a visita).
2. **Bancada.** DevTools, modo dispositivo em 390×844 e depois em 360×800, rede "Slow 4G" e CPU 4× mais lenta. Faça
   cada tarefa e anote o tempo, o número de toques e onde travou.
3. **Medição.** Em cada tela das tarefas, cole no console o script abaixo. Ele lista os alvos abaixo de 44 px, os
   campos com fonte abaixo de 16 px, a rolagem horizontal, o zoom travado e os `type="number"`. Link dentro de texto
   corrido é exceção ao tamanho; checkbox dentro de um rótulo grande passa, confira cada caso da lista.

   ```js
   (() => {
     // clientWidth, não innerWidth: no celular, página larga demais aumenta o innerWidth e esconde a rolagem.
     const vw = document.documentElement.clientWidth;
     const visivel = (e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
     const alvos = [...document.querySelectorAll(
       'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab], [role=link], [onclick]'
     )].filter(visivel);
     const pequenos = alvos.filter((e) => {
       const b = e.getBoundingClientRect();
       return b.width < 44 || b.height < 44;
     });
     const campos = [...document.querySelectorAll(
       'input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]), select, textarea'
     )].filter(visivel);
     const fonteMiuda = campos.filter((e) => parseFloat(getComputedStyle(e).fontSize) < 16);
     const vp = document.querySelector('meta[name=viewport]')?.content ?? '';
     const max = vp.match(/maximum-scale\s*=\s*([\d.]+)/i);
     const resumo = {
       largura: vw,
       rolagemHorizontal: document.documentElement.scrollWidth > vw,
       zoomTravado: /user-scalable\s*=\s*(no|0)/i.test(vp) || (max !== null && parseFloat(max[1]) < 2),
       semViewport: vp === '',
       alvosAbaixoDe44: `${pequenos.length} de ${alvos.length}`,
       camposComFonteAbaixoDe16: fonteMiuda.length,
       inputTypeNumber: document.querySelectorAll('input[type=number]').length,
     };
     console.table(resumo);
     console.log('Alvos abaixo de 44 px (link dentro de texto corrido é exceção):', pequenos);
     console.log('Campos com fonte abaixo de 16 px:', fonteMiuda);
     return resumo;
   })();
   ```

   O mesmo script está em `docs/pesquisa-usabilidade-mobile/mede-mobile.js`, com o teste que o confere numa página
   boa e numa ruim (`teste-cdp.mjs`, Edge sem cabeça a 390×844; passou em 14/11/2026).
4. **Contraste.** No DevTools, inspecione cada cor de texto do tema (legenda cinza, texto sobre botão, badge de
   status) e anote a razão.
5. **Aparelho real.** Uma volta das tarefas no seu celular, com uma mão, ao ar livre, e outra em modo avião (o que
   acontece com a gravação?). Android: depuração remota em `chrome://inspect` (T33). iPhone: Web Inspector, que pede
   um Mac (T34).
6. **Resultado.** Cada regra MVP da seção 3 recebe `atende`, `falha` ou `não se aplica`, com a prova: a saída do
   script, a razão de contraste, o print a 390 px ou o passo que falhou.

## 5. Plano

| Fase | O quê | Quem decide | Prova |
|---|---|---|---|
| 1. Levantamento | roteiro da seção 4 em cada app, sem código | o dev do app | `docs/USABILIDADE-MOBILE-levantamento-<data>.md` no repositório do app |
| 2. Conserto | as 10 correções de mais retorno por esforço, em PRs pequenos | Rafael aprova a lista antes; no Selo, o professor do HU vê antes | print a 390 px antes e depois, saída do script, Lighthouse mobile |
| 3. Teste com gente | 5 usuários reais (fiscais ou vendedores), no celular deles, filmando tela e dedos | Rafael marca com os usuários | sucesso por tarefa (completo, com problema, falhou), tempo, erros e SUS como tendência |

Mudança que altera o que o vendedor da Destak vê: aviso aos vendedores no dia em que vai ao ar. O que o teste da
fase 3 mostrar que está errado neste catálogo volta para cá.

## 6. Não copiar

- Zoom travado "para parecer app", mesmo vindo do exemplo oficial do Next (T02).
- 24 px da WCAG ou 28 pt da Apple como meta de tamanho: são pisos (P03).
- Mapa de calor da "zona do polegar" como regra de layout: Hoober mostrou que está errado; toque e olhar ficam no centro (U02).
- Menu hambúrguer na navegação principal, aba "Mais" e botão "+" no meio da barra inferior (U09, P22).
- Tutorial e carrossel de boas-vindas; escolher tema no primeiro acesso (U28).
- Placeholder ou rótulo flutuante no lugar do rótulo fixo (U14).
- "Tem certeza?" em toda ação; erro mostrado enquanto a pessoa digita ou só no topo (U27, U25).
- Telefone, CNPJ ou data em vários campos; `type="number"` em código (U18, T07).
- Spinner em espera de menos de 1 s; barra de progresso falsa ou parada; spinner no envio de fotos (U31, P36).
- Erro em snackbar que some sozinha (P33).
- `registerType: 'autoUpdate'` ou `skipWaiting` automático: apaga formulário em preenchimento (T17).
- Background Sync ou `navigator.onLine` como prova de envio (T20, T22).
- Pedido de permissão ou de push ao abrir o app (T38).
- `100vh` em tela cheia; `loading="lazy"` na imagem da primeira tela; `canvas.toBlob` sem tipo (T03, T28, T37).
- "Passar no audit de PWA do Lighthouse": a categoria saiu no Lighthouse 12 (abril de 2024).
- Chamar de "testado no celular" o teste só no modo dispositivo do DevTools ou no Playwright (T33).
- Testar só no escritório, no Wi-Fi e sentado; ler o SUS como porcentagem ou tirar meta de 5 pessoas (U39, U42).

## 7. Fontes principais

Lista completa, com a seção de cada uma, nos três arquivos da pesquisa.

- Apple HIG: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Android, acessibilidade: https://developer.android.com/guide/topics/ui/accessibility/apps
- WCAG 2.2, documentos Understanding: https://www.w3.org/WAI/WCAG22/Understanding/
- web.dev: alvos de toque https://web.dev/articles/accessible-tap-targets · unidades de viewport
  https://web.dev/blog/viewport-units · Core Web Vitals https://web.dev/articles/vitals
- MDN, viewport: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
- NN/g, tamanho do alvo: https://www.nngroup.com/articles/touch-target-size/
- Hoober, como as pessoas seguram o celular (UXmatters): https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php
- vite-plugin-pwa, atualização: https://github.com/vite-pwa/docs/blob/main/guide/auto-update.md
- Next.js, PWA: https://nextjs.org/docs/app/guides/progressive-web-apps
- Lighthouse, peso da página: https://developer.chrome.com/docs/lighthouse/performance/total-byte-weight
