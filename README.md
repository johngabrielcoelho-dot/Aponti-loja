# Ache em Petrolina

> Encontre o produto em lojas de Petrolina, veja onde tem, reserve sem pagar online e retire ou
> fale direto com a loja.

Catálogo de estoque local para o comércio de Petrolina (PE). O cliente busca um produto, vê quais
lojas têm, reserva informando só nome, WhatsApp e quantidade, e paga na retirada. A loja confirma
pelo WhatsApp.

Projeto da **Academia Softex DevOps**. Equipe: Pedro Ezequiel, Lívia Christina, Jamilly, João,
Elder, Luan e Daniel.

## Situação atual (23/10/2026)

- **Feito:** issues **#4** (projeto Next.js com TypeScript, Tailwind, ESLint e Prettier) e **#9**
  (tela inicial, busca com filtros e página de produto), em `apps/frontend`.
- **Onde está o código:** na branch `main` do repositório
  [pedroezequiellima/Ache-em-Petrolina](https://github.com/pedroezequiellima/Ache-em-Petrolina).
- **Próximos passos:** #10 (reserva), #5 e #11 (API em `apps/backend`), `docker-compose.yml` e
  Dockerfiles, e o CI em `.github/workflows`. As pendências do front-end estão em
  [apps/frontend/README.md](apps/frontend/README.md#pendências).

## Estrutura do repositório

```
.github/workflows/   GitHub Actions (CI/CD); vazio por enquanto
apps/
  frontend/          interface web em Next.js 16 + TypeScript + Tailwind CSS 4 (#4, #9)
  backend/           API REST em NestJS + Prisma + PostgreSQL; a criar (#5, #11)
packages/            pacotes compartilhados entre os apps (ex.: shared); vazio por enquanto
.dockerignore        arquivos que o Docker ignora ao montar as imagens
.gitignore           arquivos que não vão para o Git
package.json         workspaces do npm e scripts globais
README.md            este arquivo
```

Cada app terá seu próprio código, `package.json` e `Dockerfile`. O `docker-compose.yml` ficará na
raiz, para subir o projeto todo com um comando; ele e os Dockerfiles ainda serão criados, junto com
o back-end e o PostgreSQL. O andamento das tarefas fica no GitHub Projects **Ache-em-Petrolina**.

## Requisitos

- **Node.js 20.9 ou mais novo** (usamos o 24; veja `.nvmrc`)
- npm (vem com o Node)
- Git

## Como rodar o front-end

Os comandos `npm` rodam na **raiz** do repositório: ela usa npm workspaces e instala as
dependências de todos os apps de uma vez.

```bash
git clone https://github.com/pedroezequiellima/Ache-em-Petrolina.git
cd Ache-em-Petrolina
npm install
cp apps/frontend/.env.example apps/frontend/.env.local
npm run dev
```

No **Prompt de Comando (cmd)** do Windows, troque o `cp` por
`copy apps\frontend\.env.example apps\frontend\.env.local`. No PowerShell e no Git Bash o `cp`
funciona.

Acesse http://localhost:3000. Scripts disponíveis na raiz: `npm run dev`, `build`, `start`,
`lint`, `format` e `format:check`. Mais detalhes, decisões e pendências em
[apps/frontend/README.md](apps/frontend/README.md).

## Fluxo de trabalho

- **Branches:** por enquanto só existe a `main`. Para cada nova tarefa, crie uma branch a partir
  dela e abra um Pull Request. Combinem o padrão de nomes antes de criar.
- **Pull Requests** com pelo menos **1 revisão** de outro integrante. Escreva `Closes #<número>`
  na descrição: a issue fecha sozinha quando o PR entra na `main`.
- **Antes de abrir o PR**, na raiz: `npm run format`, `npm run lint` e `npm run build` precisam
  passar.
- **Commits** no padrão Conventional Commits: `feat: ...`, `fix: ...`, `refactor: ...`,
  `docs: ...`, `chore: ...`.

## Segurança

Revisão feita em 23/10/2026. O front-end ainda não tem back-end, login nem dados pessoais, então o
risco hoje é baixo: a busca escapa código injetado, não há segredos no repositório e as
dependências de produção não têm vulnerabilidades conhecidas (`npm audit --omit=dev`).

Pendências de configuração:

- **Cabeçalhos HTTP de segurança** no front-end: veja
  [apps/frontend/README.md](apps/frontend/README.md#pendências).
- **Proteção da `main`** no GitHub (**Settings → Branches**): exigir Pull Request com 1 revisão.
- **Dependabot alerts** e **Secret scanning** (**Settings → Code security**), gratuitos em
  repositórios públicos.
- **E-mail nos commits:** o repositório é público e os commits mostram o e-mail de quem os fez.
  Para esconder nos próximos, ative **Settings → Emails → "Keep my email addresses private"** no
  GitHub e configure no Git o e-mail `...@users.noreply.github.com` mostrado nessa página.
- **Nunca** coloque senhas, tokens ou chaves no código. Use `.env.local`, que não vai para o Git.
