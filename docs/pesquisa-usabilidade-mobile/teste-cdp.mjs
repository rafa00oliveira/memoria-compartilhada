// Testa o mede-mobile.js em duas páginas no Edge sem cabeça, a 390x844.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';

const dir = mkdtempSync(join(tmpdir(), 'mede-'));
const ruim = `<!doctype html><meta name=viewport content="width=device-width, initial-scale=1, maximum-scale=1">
<button style="width:30px;height:30px">x</button><a href="#" style="display:inline-block;width:48px;height:48px">ok</a>
<input style="font-size:14px"><input type=number><input type=hidden><div style="width:600px">largo</div>
<a href="#main" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">pular</a>
<label style="display:inline-block;width:48px;height:48px"><input type=radio style="position:absolute;width:1px;height:1px;opacity:0">sim</label>`;
const boa = `<!doctype html><meta name=viewport content="width=device-width, initial-scale=1, maximum-scale=5">
<button style="width:48px;height:48px">ok</button><input style="font-size:16px;height:48px;width:200px">`;
writeFileSync(join(dir, 'ruim.html'), ruim);
writeFileSync(join(dir, 'boa.html'), boa);

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const proc = spawn(edge, ['--headless=new', '--remote-debugging-port=9333', `--user-data-dir=${join(dir, 'perfil')}`, 'about:blank']);
const script = readFileSync(new URL('./mede-mobile.js', import.meta.url), 'utf8');

let alvo;
for (let i = 0; i < 40 && !alvo; i++) {
  await new Promise((r) => setTimeout(r, 250));
  try { alvo = (await (await fetch('http://127.0.0.1:9333/json')).json()).find((t) => t.type === 'page'); } catch {}
}
const ws = new WebSocket(alvo.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const pend = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); pend.get(d.id)?.(d); });
const cdp = (method, params = {}) => new Promise((r) => { pend.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });

await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
const mede = async (arq) => {
  await cdp('Page.navigate', { url: 'file:///' + join(dir, arq).replaceAll('\\', '/') });
  await new Promise((r) => setTimeout(r, 800));
  const r = await cdp('Runtime.evaluate', { expression: script, returnByValue: true });
  return r.result.result.value;
};
const r1 = await mede('ruim.html');
const r2 = await mede('boa.html');
console.log('ruim', r1, '\nboa', r2);
assert.equal(r1.largura, 390);
assert.equal(r1.rolagemHorizontal, true);
assert.equal(r1.zoomTravado, true);
assert.equal(r1.alvosAbaixoDe44, '3 de 5'); // botão de 30 px, input de fonte 14 (altura < 44) e input number; link de 48 e rótulo de 48 passam; o sr-only, o rádio do rótulo e o hidden não entram
assert.equal(r1.camposComFonteAbaixoDe16, 2);
assert.equal(r1.inputTypeNumber, 1);
assert.equal(r2.rolagemHorizontal, false);
assert.equal(r2.zoomTravado, false);
assert.equal(r2.alvosAbaixoDe44, '0 de 2');
assert.equal(r2.camposComFonteAbaixoDe16, 0);
console.log('OK: todas as checagens passaram');
ws.close();
proc.kill();
process.exit(0);
