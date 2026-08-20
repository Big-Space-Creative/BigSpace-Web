# Documento do Projeto - BigSpace-Web
Site institucional Big Space, empresa focada em desenvolvimento web e web design.

- Data de início: 20 / 06 / 2026
- Tech Lead: Nathanael Bueno
- Equipe Responsável: Equipe 2<br>

## 1. Stack Tecnológica e Organização
### 1.1. Tecnologias
| Stack | Tecnologia |
| :---- | :------- |
| Linguagem principal | Vue(Javascrip) |
| Framework/Backend | Node.js + Express |
| Frontend (se houver) | Vue 3 + Vite (SPA) |
| Banco de dados | PostgreSQL |
| ORM | Sequelize + Sequelize-CLI |
| Infraestrutura/Deploy | Docker + Docker Compose |

### 1.2. Organização
| Branch | Função |
| :---- | :------- |
| `main` | Código em produção. Só recebe merge vindo de dev, sempre estável e deployável. |
| `dev` | Branch de integração. Todas as features são mescladas aqui primeiro. |
| `feature/nome-da-feature` | Uma branch por funcionalidade/tarefa, criada a partir de dev. |

## 2. Requisitos
### 2.1. Requisitos Funcionais
O que o sistema deve fazer
| ID | Requisito | Descrição(Opcional) |
| :--: | :------- | :------ |
| 1 | Formulario de Interesse |  |

<!--
### 2.2. Requisitos Não Funcionais
Desempenho, segurança, escalabilidade etc.
| ID | Requisito | Descrição(Opcional) |
| :--: | :------- | :------ |
| 1 | Tempo de resposta | Tempo de até 2 segundos |
| 2 | Criptografia de dados (AES-256) |  |


## 3. Funcionalidades Complexas
Para cada funcionalidade que exige lógica não trivial, preencha um bloco:
- Funcionalidade: [NOME]
- Descrição: [DESCRIÇÃO]
- Regras de negócio: [Condições que determinam como uma empresa conduz suas Operações, Processos e Decisões]
- Dependências (outras features, APIs externas): [DEPENDENCIAS]
- Riscos técnicos conhecidos: [RISCOS CONHECIDOS]
- Critério de aceite (quando considerar "pronto"):

(duplicar este bloco para cada funcionalidade complexa)
-->
