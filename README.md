# memoria-compartilhada

Memória de trabalho versionada e **privada** do Rafael, para alternar entre **Claude** e **Codex** sem perder contexto.

## Arquivos

- **`CONTEXTO.md`** — fonte de verdade de longo prazo: perfil, projetos ativos, preferências, decisões e próximos passos. Editar aqui quando algo mudar de forma duradoura.
- **`HANDOFF.md`** — estado **temporário** da tarefa em andamento (decisões, próximos passos, comandos de validação, arquivos alterados, riscos). Atualizar antes de encerrar cada sessão.
- **`SESSION_LOG.md`** — histórico resumido das sessões (o que foi feito, decisões, pendências).
- **`docs/`** — notas e referências mais longas.
- **`work/`** — rascunhos e trabalho em andamento.
- **`outputs/`** — entregáveis gerados.

## Regras

- **Nunca** commitar senhas, tokens, chaves de API, `.env` ou dados pessoais/bancários.
- Repositório **privado**.
- Commits pequenos, mensagens em português.

## Fluxo

Antes de trabalhar: `git pull`
Ao salvar: `git add -A && git commit -m "mensagem" && git push`
