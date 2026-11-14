// Bancada do levantamento de usabilidade: Edge sem cabeça, celular emulado, Slow 4G e CPU 4x.
// Uso: node bancada.mjs <tarefa> <largura> <altura>   (tarefas em tarefas.mjs). Só lê; não grava nada que a tarefa não peça.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { TAREFAS } from "./tarefas.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const [nomeTarefa, W = "390", H = "844"] = process.argv.slice(2);
const largura = Number(W), altura = Number(H);
const BASE = process.env.BASE ?? "http://localhost:3100";
const SAIDA = join(AQUI, "saida", `${nomeTarefa}-${largura}`);
mkdirSync(SAIDA, { recursive: true });
const MEDE = readFileSync(join(process.env.USERPROFILE, "Claude/memoria-compartilhada/docs/pesquisa-usabilidade-mobile/mede-mobile.js"), "utf8");

// Contraste na cor pintada: o canvas converte qualquer formato (oklch, rgb, alfa) para sRGB sobre o fundo de baixo.
const CONTRASTE = `(() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
  const px = (cor, sobre) => { cx.clearRect(0,0,1,1); cx.fillStyle = sobre ?? '#fff'; cx.fillRect(0,0,1,1); cx.fillStyle = cor; cx.fillRect(0,0,1,1); const d = cx.getImageData(0,0,1,1).data; return 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')'; };
  const lum = (rgb) => { const [r,g,b] = rgb.match(/\\d+/g).map(Number).map(v => { v /= 255; return v <= 0.03928 ? v/12.92 : ((v+0.055)/1.055) ** 2.4; }); return 0.2126*r + 0.7152*g + 0.0722*b; };
  let comImagem = false;
  const fundo = (el) => { comImagem = false; const pilha = []; for (let e = el; e; e = e.parentElement) { if (!pilha.length && getComputedStyle(e).backgroundImage !== 'none') { comImagem = true; break; } const c = getComputedStyle(e).backgroundColor; if (c && !/rgba\\(0, 0, 0, 0\\)|transparent/.test(c)) pilha.push(c); if (pilha.length && !/rgba|\\/ /.test(c)) break; } let cor = '#fff'; for (const c of pilha.reverse()) cor = px(c, cor); return cor; };
  const vis = (e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).opacity !== '0';
  const vistos = new Map();
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    const t = n.textContent.trim(); const el = n.parentElement; if (!t || !el || !vis(el)) continue;
    const s = getComputedStyle(el); const bg = fundo(el); if (comImagem) continue; // fundo com imagem ou degradê: confere no print
    const fg = px(s.color, bg);
    const r = (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);
    const tam = parseFloat(s.fontSize), peso = Number(s.fontWeight); const grande = tam >= 24 || (tam >= 18.66 && peso >= 700);
    const chave = fg + '|' + bg + '|' + tam + '|' + peso;
    if (!vistos.has(chave)) vistos.set(chave, { razao: Math.round(r * 100) / 100, fg, bg, tam, peso, grande, exemplo: t.slice(0, 40), minimo: grande ? 3 : 4.5 });
  }
  return [...vistos.values()].sort((a, b) => a.razao - b.razao);
})()`;

const dir = mkdtempSync(join(tmpdir(), "bancada-"));
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const porta = 9400 + Math.floor(Math.random() * 400);
const proc = spawn(edge, ["--headless=new", `--remote-debugging-port=${porta}`, `--user-data-dir=${join(dir, "perfil")}`, "--no-first-run", "about:blank"]);
let alvo;
for (let i = 0; i < 60 && !alvo; i++) {
  await new Promise((r) => setTimeout(r, 250));
  try { alvo = (await (await fetch(`http://127.0.0.1:${porta}/json`)).json()).find((t) => t.type === "page"); } catch {}
}
const ws = new WebSocket(alvo.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pend = new Map(); const ouvintes = [];
let emVoo = 0;
ws.addEventListener("message", (m) => {
  const d = JSON.parse(m.data);
  if (d.id) return pend.get(d.id)?.(d);
  if (d.method === "Network.requestWillBeSent") emVoo++;
  if (d.method === "Network.loadingFinished" || d.method === "Network.loadingFailed") emVoo = Math.max(0, emVoo - 1);
  if (d.method === "Fetch.requestPaused") trava(d.params);
  for (const f of ouvintes) f(d);
});
const cdp = (method, params = {}) => new Promise((r, j) => { pend.set(++id, (d) => d.error ? j(new Error(method + ": " + d.error.message)) : r(d.result)); ws.send(JSON.stringify({ id, method, params })); });
// Trava do professor (14/11): nada grava. Aborta POST de Server Action (menos o login), envio ao Storage e escrita
// direta no PostgREST; o resto segue. Cada abortado vira "falha simulada" no resultado.
const bloqueados = [];
function trava({ requestId, request }) {
  const u = new URL(request.url); const h = Object.fromEntries(Object.entries(request.headers).map(([k, v]) => [k.toLowerCase(), v]));
  const acao = request.method === "POST" && "next-action" in h;
  const login = acao && u.pathname === "/login";
  const storage = u.pathname.includes("/storage/v1/object/") && request.method !== "GET" && request.method !== "HEAD";
  const rest = u.pathname.includes("/rest/v1/") && !["GET", "HEAD", "OPTIONS"].includes(request.method);
  if ((acao && !login) || storage || rest) {
    bloqueados.push({ t: Date.now(), metodo: request.method, caminho: u.pathname, acao: acao ? "server action" : storage ? "storage" : "rest", tamanho: request.postData?.length ?? null });
    cdp("Fetch.failRequest", { requestId, errorReason: "InternetDisconnected" }).catch(() => {});
  } else cdp("Fetch.continueRequest", { requestId }).catch(() => {});
}
const avalia = async (expr) => (await cdp("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result.value;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

await cdp("Fetch.enable", { patterns: [{ urlPattern: "*", requestStage: "Request" }] });
await cdp("Page.setInterceptFileChooserDialog", { enabled: true });
await cdp("DOM.enable");
await cdp("Network.enable"); await cdp("Page.enable"); await cdp("Runtime.enable");
await cdp("Emulation.setDeviceMetricsOverride", { width: largura, height: altura, deviceScaleFactor: 3, mobile: true });
await cdp("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await cdp("Network.setUserAgentOverride", { userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36" });
// Slow 4G do DevTools: 562,5 ms de latência, 1,44 Mbps de descida, 675 kbps de subida (em bytes por segundo).
await cdp("Network.emulateNetworkConditions", { offline: false, latency: 562.5, downloadThroughput: 180000, uploadThroughput: 84375 });
await cdp("Emulation.setCPUThrottlingRate", { rate: 4 });
// Interação (toque até a próxima pintura, a base do INP) e tarefa longa, desde o começo de cada documento.
await cdp("Page.addScriptToEvaluateOnNewDocument", { source: `window.__ev = []; window.__lt = [];
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.interactionId) window.__ev.push(Math.round(e.duration)); }).observe({ type: 'event', durationThreshold: 16 }); } catch {}
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(Math.round(e.duration)); }).observe({ type: 'longtask' }); } catch {}` });

// Espera a tela assentar: nenhum pedido em voo por 700 ms e o texto esperado na página.
async function assenta(texto, limite = 60000) {
  const t0 = Date.now(); let quieto = 0;
  while (Date.now() - t0 < limite) {
    await espera(100);
    const temTexto = !texto || (await avalia(texto.startsWith("js:") ? texto.slice(3) : `document.body?.innerText.includes(${JSON.stringify(texto)})`));
    quieto = emVoo === 0 && temTexto ? quieto + 100 : 0;
    if (quieto >= 700) return Date.now() - t0 - 700;
  }
  throw new Error(`não assentou em ${limite} ms esperando "${texto}"`);
}

// Acha o elemento pelo texto visível (ou seletor) e devolve o centro dele.
async function centro(alvoTxt) {
  const r = await avalia(`(() => {
    const q = ${JSON.stringify(alvoTxt)};
    const vis = (e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
    let el = q.startsWith('css:') ? [...document.querySelectorAll(q.slice(4))].find(vis) : null;
    if (!el) el = [...document.querySelectorAll('a,button,label,[role=button],[role=radio],summary,input,textarea,select')].filter(vis)
      .find((e) => (e.innerText || e.value || e.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ').includes(q));
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const b = el.getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: Math.round(b.width), h: Math.round(b.height), tag: el.tagName };
  })()`);
  if (!r) throw new Error(`não achei "${alvoTxt}"`);
  return r;
}

const passos = []; let toques = 0; const t0Total = Date.now();
const api = {
  async abre(caminho, texto) {
    const t = Date.now(); await cdp("Page.navigate", { url: BASE + caminho }); const ms = await assenta(texto);
    passos.push({ passo: `abre ${caminho}`, ms: Date.now() - t, toques: 0 }); return ms;
  },
  async toca(alvoTxt, texto, rotulo) {
    const c = await centro(alvoTxt); await espera(150);
    const t = Date.now();
    await cdp("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: c.x, y: c.y }] });
    await cdp("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    toques++;
    await assenta(texto);
    passos.push({ passo: rotulo ?? `toca "${alvoTxt}"`, ms: Date.now() - t, toques: 1, alvo: `${c.w}x${c.h} ${c.tag}` });
  },
  async digita(alvoTxt, valor, rotulo) {
    const c = await centro(alvoTxt);
    await cdp("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: c.x, y: c.y }] });
    await cdp("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    toques++;
    await espera(200); await cdp("Input.insertText", { text: valor });
    passos.push({ passo: rotulo ?? `digita em "${alvoTxt}"`, ms: 0, toques: 1, alvo: `${c.w}x${c.h} ${c.tag}` });
  },
  async mede(tela) {
    const m = await avalia(MEDE);
    const pequenos = await avalia(`[...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab], [role=link], [onclick]')]
      .filter((e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden')
      .map((e) => [e, e.getBoundingClientRect()]).filter(([, b]) => b.width < 44 || b.height < 44)
      .map(([e, b]) => Math.round(b.width) + 'x' + Math.round(b.height) + ' ' + e.tagName.toLowerCase() + ' "' + (e.innerText || e.getAttribute('aria-label') || e.type || '').trim().replace(/\\s+/g, ' ').slice(0, 30) + '"')`);
    const contraste = await avalia(CONTRASTE);
    const extra = await avalia(`(() => {
      const vis = (e) => { const b = e.getBoundingClientRect(); return e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden' && b.width > 2 && b.height > 2; };
      const nome = (e) => e.tagName.toLowerCase() + ' "' + (e.innerText || e.getAttribute('aria-label') || e.id || e.type || '').trim().replace(/\\s+/g, ' ').slice(0, 25) + '"';
      const fonteMiuda = [...document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]), select, textarea')].filter(vis)
        .filter((e) => parseFloat(getComputedStyle(e).fontSize) < 16).map((e) => nome(e) + ' ' + getComputedStyle(e).fontSize);
      const alvos = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], label:has(input[type=radio]), label:has(input[type=checkbox])')].filter(vis)
        .filter((e) => !e.matches('input[type=radio], input[type=checkbox]'));
      const r = alvos.map((e) => e.getBoundingClientRect());
      const perto = [];
      for (let i = 0; i < alvos.length; i++) for (let j = i + 1; j < alvos.length; j++) {
        if (alvos[i].contains(alvos[j]) || alvos[j].contains(alvos[i])) continue;
        const a = r[i], b = r[j];
        const dx = Math.max(0, Math.max(a.left, b.left) - Math.min(a.right, b.right)), dy = Math.max(0, Math.max(a.top, b.top) - Math.min(a.bottom, b.bottom));
        const gap = Math.max(dx, dy);
        if (gap < 8 && (dx === 0 || dy === 0)) perto.push(Math.round(gap) + 'px: ' + nome(alvos[i]) + ' | ' + nome(alvos[j]));
      }
      const ev = window.__ev || [], lt = window.__lt || []; window.__ev = []; window.__lt = [];
      return { fonteMiuda, perto: perto.slice(0, 12), totalPerto: perto.length, interacoesMs: ev, tarefasLongasMs: lt };
    })()`);
    const shot = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    const arq = join(SAIDA, `${String(passos.length).padStart(2, "0")}-${tela}.png`);
    writeFileSync(arq, Buffer.from(shot.data, "base64"));
    passos.push({ passo: `mede ${tela}`, ms: 0, toques: 0, mede: m, pequenos, extra, contraste: contraste.filter((c) => c.razao < 7), print: arq });
  },
  // Toca no botão que abre a câmera e entrega a foto pelo seletor interceptado (os toques na câmera do aparelho não contam aqui).
  async foto(alvoTxt, arquivo, texto, rotulo) {
    const aberto = new Promise((ok) => { const f = (d) => { if (d.method === "Page.fileChooserOpened") { ouvintes.splice(ouvintes.indexOf(f), 1); ok(d.params); } }; ouvintes.push(f); });
    const c = await centro(alvoTxt);
    await cdp("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: c.x, y: c.y }] });
    await cdp("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    toques++;
    const p = await aberto; const t = Date.now();
    await cdp("DOM.setFileInputFiles", { files: [arquivo], backendNodeId: p.backendNodeId });
    await assenta(texto, 120000);
    passos.push({ passo: rotulo ?? `foto por "${alvoTxt}"`, ms: Date.now() - t, toques: 1, alvo: `${c.w}x${c.h} ${c.tag}` });
  },
  // <select> nativo: um toque abre a lista, outro escolhe a opção.
  async escolhe(seletor, valor, texto, rotulo) {
    const c = await centro("css:" + seletor); const t = Date.now();
    await avalia(`(() => { const s = document.querySelector(${JSON.stringify(seletor)}); const set = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set; set.call(s, ${JSON.stringify(valor)}); s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
    toques += 2; await assenta(texto);
    passos.push({ passo: rotulo ?? `escolhe ${valor}`, ms: Date.now() - t, toques: 2, alvo: `${c.w}x${c.h} ${c.tag}` });
  },
  // Carga fria da tela (sem cache, como no primeiro uso): tempo até assentar, LCP, CLS e bytes transferidos (total e JS).
  async carga(caminho, texto) {
    await cdp("Network.setCacheDisabled", { cacheDisabled: true });
    const tipos = new Map(); let total = 0, js = 0;
    const f = (d) => {
      if (d.method === "Network.responseReceived") tipos.set(d.params.requestId, d.params.type);
      if (d.method === "Network.loadingFinished") { total += d.params.encodedDataLength; if (tipos.get(d.params.requestId) === "Script") js += d.params.encodedDataLength; }
    };
    ouvintes.push(f);
    const t = Date.now(); await cdp("Page.navigate", { url: BASE + caminho }); await assenta(texto); const ms = Date.now() - t;
    ouvintes.splice(ouvintes.indexOf(f), 1);
    const vitais = await avalia(`new Promise((ok) => { let lcp = 0, cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      const n = performance.getEntriesByType('navigation')[0];
      setTimeout(() => ok({ lcpMs: Math.round(lcp), cls: Math.round(cls * 1000) / 1000, ttfbMs: Math.round(n ? n.responseStart : -1) }), 300); })`);
    await cdp("Network.setCacheDisabled", { cacheDisabled: false });
    passos.push({ passo: `carga ${caminho}`, ms, toques: 0, carga: { ...vitais, totalKB: Math.round(total / 1024), jsKB: Math.round(js / 1024) } });
  },
  registra(nome, dado) { passos.push({ passo: nome, ms: 0, toques: 0, t: Date.now(), reacao: dado }); },
  marca(nome) { passos.push({ passo: `marca ${nome}`, ms: 0, toques: 0, t: Date.now() }); },
  async texto() { return avalia("document.body.innerText"); },
  espera,
  avalia,
};

let erro = null;
try { await TAREFAS[nomeTarefa](api); } catch (e) { erro = String(e.message ?? e); }
const resultado = { tarefa: nomeTarefa, largura, altura, rede: "Slow 4G", cpu: "4x", totalMs: Date.now() - t0Total, toques, erro, bloqueados, passos };
writeFileSync(join(SAIDA, "resultado.json"), JSON.stringify(resultado, null, 1));
console.log(JSON.stringify({ tarefa: nomeTarefa, largura, totalMs: resultado.totalMs, toques, erro, bloqueados: bloqueados.length }, null, 0));
ws.close(); proc.kill(); process.exit(0);
