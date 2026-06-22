# Documentação Técnica — Big Space

> Landing page institucional · Tech Lead: Sávio Sales
> Última atualização: junho/2026

## 1. Visão Geral

Site institucional (landing page) com formulário de contato e conteúdo dinâmico simples (ex: seções editáveis, posts, novidades).

## 2. Stack Tecnológica

| Camada | Tecnologia | Motivo |
| --- | --- | --- |
| Frontend | Vue 3 + Vite (SPA) | Build rápido, DX boa, leve para uma landing page sem necessidade de SSR/SEO pesado |
| Backend | Node.js + Express | API enxuta para formulário de contato e endpoints simples; baixo overhead |
| ORM | Sequelize + Sequelize-CLI | Migrations versionadas e seeders, evita alterar schema do Postgres na mão |
| Banco de dados | PostgreSQL | Robusto, relacional, suficiente mesmo sem alta carga; fácil de gerenciar via Docker |
| Containerização | Docker + Docker Compose | Padroniza ambiente dev/prod, facilita deploy e reprodutibilidade na VPS |
| Reverse proxy | Nginx | Serve o build estático do Vue, faz proxy `/api` para o backend, termina SSL |

## 3. Fluxo de Trabalho (Git)

### Branches

| Branch | Função |
| --- | --- |
| `main` | Código em produção. Só recebe merge vindo de `dev`, sempre estável e deployável. |
| `dev` | Branch de integração. Todas as features são mescladas aqui primeiro. |
| `feature/nome-da-feature` | Uma branch por funcionalidade/tarefa, criada a partir de `dev`. |

**Fluxo:**

1. Criar a branch a partir de `dev`: `git checkout -b feature/formulario-contato dev`
2. Desenvolver e commitar seguindo o padrão abaixo.
3. Abrir PR de `feature/...` para `dev`.
4. Após revisão, merge em `dev`.
5. Quando `dev` estiver estável e pronta pra ir ao ar, merge de `dev` em `main` -> deploy.

### Padrão de Commits

Baseado em [Conventional Commits](https://www.conventionalcommits.org/), simplificado:

```text
tipo: descrição curta no imperativo
```

| Tipo | Quando usar |
| --- | --- |
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Mudança em documentação |
| `style` | Formatação, sem mudança de lógica (espaços, ponto e vírgula etc.) |
| `refactor` | Refatoração de código sem mudar comportamento |
| `test` | Adição ou ajuste de testes |
| `chore` | Tarefas de manutenção (deps, configs, build) |

**Exemplos:**

```text
feat: adiciona formulário de contato na landing page
fix: corrige validação de e-mail no backend
docs: atualiza ARCHITECTURE.md com fluxo de branches
chore: configura sequelize-cli no backend
```

Se a mudança for grande, pode complementar com uma linha em branco e uma descrição mais detalhada abaixo do título.
