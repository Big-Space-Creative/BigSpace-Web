# BigSpace-Web
Site institucional Big Space, empresa focada em desenvolvimento web e web design.

## Estrutura do repositório

- `client/` — aplicação Vue 3 + Vite (frontend do site).

## Fluxo de trabalho Git

- **Branch principal:** `main`. Sempre estável, protegida contra push direto.
- **Branches de trabalho:** criadas a partir da `main`, seguindo o padrão:
  - `feature/nome-da-feature` — novas funcionalidades
  - `fix/nome-do-bug` — correções de bugs
  - `docs/assunto` — alterações de documentação
  - `chore/assunto` — manutenção, configs, dependências
- **Commits:** seguir [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, etc.), em português, descrevendo o quê e o porquê.
- **Pull Requests:**
  1. Abrir a PR contra `main` assim que a branch estiver pronta.
  2. Descrever o que foi feito e referenciar a issue relacionada (ex: `Closes #5`).
  3. Aguardar revisão/aprovação antes do merge.
  4. Preferir squash merge para manter o histórico da `main` limpo.
- **Issues e Milestones:** o trabalho é organizado em issues vinculadas a milestones no GitHub; ao concluir os critérios de aceite de uma issue, fechá-la referenciando o commit/PR correspondente.
