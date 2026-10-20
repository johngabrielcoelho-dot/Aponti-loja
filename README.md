# Ache em Petrolina

> Encontre o produto em lojas de Petrolina, veja onde tem, reserve sem pagar online e retire ou
> fale direto com a loja.

Catálogo de estoque local para o comércio de Petrolina (PE). O cliente busca um produto, vê quais
lojas têm, reserva informando só nome, WhatsApp e quantidade, e paga na retirada. A loja confirma
pelo WhatsApp.

Projeto da **Academia Softex DevOps**. Equipe: Pedro Ezequiel, Lívia Christina, Jamilly, João,
Elder, Luan e Daniel.

## Estrutura do repositório

| Pasta       | Conteúdo                                                    | Situação                     |
| ----------- | ----------------------------------------------------------- | ---------------------------- |
| `frontend/` | Next.js 16 + TypeScript + Tailwind CSS 4 (catálogo e busca) | Pronto para revisão (#4, #9) |
| `backend/`  | API REST em NestJS + Prisma + PostgreSQL                    | A criar (#5, #11)            |

Ainda virão: `docker-compose.yml`, Dockerfiles, pipelines em `.github/workflows`, Terraform e
Nginx, conforme as etapas de DevOps do projeto. O andamento das tarefas fica no GitHub Projects
**Ache-em-Petrolina**.

## Requisitos

- **Node.js 20.9 ou mais novo** (usamos o 24; veja `.nvmrc`)
- npm (vem com o Node)
- Git

## Como rodar o front-end

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Acesse http://localhost:3000. Mais detalhes, decisões e pendências em
[frontend/README.md](frontend/README.md).

## Fluxo de trabalho

- **Branches:** `main` (produção), `develop` (integração) e `feat/<nome-da-tarefa>` para cada
  tarefa, criada a partir da `develop`.
- **Pull Requests** sempre para a `develop`, com pelo menos **1 revisão** de outro integrante.
  Escreva `Closes #<número>` na descrição para ligar o PR à issue.
- **Antes de abrir o PR**, dentro de `frontend/`: `npm run format`, `npm run lint` e
  `npm run build` precisam passar.
- **Commits** no padrão Conventional Commits: `feat: ...`, `fix: ...`, `docs: ...`,
  `chore: ...`.
- As issues só fecham sozinhas quando o código chega na `main`. Depois do merge na `develop`,
  mova o card para **Done** e feche a issue manualmente.
