// Copie para scripts/alvo.test.mjs. Roda com: node --test scripts/alvo.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { conferirAlvo } from "./alvo.mjs";

const REF = "abcdefghijklmnopqrst";
const recusa = /PRODUÇÃO/;

test("recusa produção em toda forma de endereço sem --producao", () => {
  for (const alvo of [
    `https://${REF}.supabase.co`,
    `postgresql://postgres:senha@db.${REF}.supabase.co:5432/postgres`,
    `postgresql://postgres.${REF}:senha@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`,
    REF,
  ]) assert.throws(() => conferirAlvo(alvo, [], REF), recusa, alvo);
});

test("aceita produção com --producao", () => {
  assert.equal(conferirAlvo(`https://${REF}.supabase.co`, ["--producao"], REF), "producao");
});

test("aceita banco local e outro projeto", () => {
  assert.equal(conferirAlvo("http://127.0.0.1:54321", [], REF), "127.0.0.1");
  assert.equal(conferirAlvo("https://zzzzzzzzzzzzzzzzzzzz.supabase.co", [], REF), "zzzzzzzzzzzzzzzzzzzz.supabase.co");
});

test("recusa sem URL e com o ref de produção não preenchido", () => {
  assert.throws(() => conferirAlvo("", [], REF), /Sem a URL/);
  assert.throws(() => conferirAlvo("http://127.0.0.1:54321", [], "troque-pelo-ref"), /Preencha PRODUCAO/);
});
