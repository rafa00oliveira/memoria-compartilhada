# CONTEXTO: <nome do projeto>
- **É:** <o que é, em uma linha>.
- **Para:** <quem usa e com qual papel>.
- **Nível:** <N1 | N2 | N3>, porque <motivo>.
- **No ar:** <URL de produção> · repositório <dono/nome> · branch principal `main`.
- **Banco:** Supabase, ref de produção `<ref>` (não é segredo: está na URL do site). Banco de teste: <local | ref>.
- **Estado:** <o que funciona hoje, em uma linha>.
- **Próxima ação:** <a próxima coisa a fazer>.
- **Atualizado:** AAAA-MM-DD | provado: <o que foi conferido e como> | NÃO provado: <o que não foi>.

## Como publicar

- Código: <ex.: merge na `main` publica pela Vercel; prova no ar com `curl -s <url> | grep <texto>`>.
- Migration: <ex.: `npx supabase db push`; conferir com `npx supabase migration list`>.
- Backup: <comando do dump e onde o arquivo fica>. RPO <x> · RTO <y>.
- Configuração fora do código: variáveis da Vercel (<nomes>), Auth (`site_url`, cadastro público desligado, senha
  mínima), Storage, cron, domínio.

## Estado

Cada item com a data e o comando que o confere. Item sem prova começa com `~`.

- [AAAA-MM-DD · `npm run check`] <o que está verde>
- ~ [AAAA-MM-DD · sem prova] <o que se acredita e ainda não foi conferido>

## Armadilhas

O que já custou tempo ou dado e como não repetir (registro sem culpa, até dez linhas cada).

## Log

Uma linha por marco, a mais recente no topo, no máximo dez.

- AAAA-MM-DD · <quem> · <o quê> · <onde> · pendente: <...>
