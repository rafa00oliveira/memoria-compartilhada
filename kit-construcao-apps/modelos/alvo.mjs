// Trava de alvo (MANUAL-CONSTRUCAO.md, P3). Copie para scripts/alvo.mjs.
//
// Todo script que GRAVA no banco (seed, carga, prova de permissão, migration) chama conferirAlvo() com a URL
// ou a string de conexão que ele VAI usar, antes de criar o cliente:
//
//   import { conferirAlvo } from "./alvo.mjs";
//   conferirAlvo(process.env.NEXT_PUBLIC_SUPABASE_URL);   // ou a string de conexão do Postgres
//
// O ref de produção fica escrito aqui de propósito. Ele não é segredo (está na URL pública do site), e uma trava
// que lesse o .env.local viria do mesmo arquivo que aponta o banco: quem copia um, copia o outro.
export const PRODUCAO = "troque-pelo-ref"; // os 20 caracteres de https://<ref>.supabase.co do banco de produção

export function conferirAlvo(urlOuConexao, argv = process.argv, producao = PRODUCAO) {
  if (!urlOuConexao) throw new Error("Sem a URL do banco: o script não sabe onde ia gravar.");
  if (producao === "troque-pelo-ref") throw new Error("Preencha PRODUCAO em scripts/alvo.mjs antes de usar.");
  // Procura o ref em qualquer forma: https://<ref>.supabase.co, db.<ref>.supabase.co e postgres.<ref>@...pooler.
  // Ler só o primeiro pedaço do endereço deixava passar a conexão direta (db.<ref>), que começa por "db".
  const ehProducao = urlOuConexao.toLowerCase().includes(producao.toLowerCase());
  if (ehProducao && !argv.includes("--producao"))
    throw new Error("Este script ia gravar em PRODUÇÃO. Se é isso mesmo, rode de novo com --producao.");
  // Mostra só o host: a string de conexão traz a senha.
  const host = urlOuConexao.includes("://") ? new URL(urlOuConexao).hostname : urlOuConexao;
  console.error(`alvo: ${ehProducao ? "PRODUÇÃO" : host}`);
  return ehProducao ? "producao" : host;
}
