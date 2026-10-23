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
  (tela inicial, busca com filtros e página de produto). Tudo está na branch **`frontend`**.
- **Onde está o código:** em
  [johngabrielcoelho-dot/Aponti-loja](https://github.com/johngabrielcoelho-dot/Aponti-loja), na
  branch `frontend`. O repositório oficial,
  [pedroezequiellima/Ache-em-Petrolina](https://github.com/pedroezequiellima/Ache-em-Petrolina),
  ainda não recebeu o push, porque falta liberar o acesso de escrita.
- **As branches `main` e `develop` só têm o commit inicial.** Por isso a página do repositório no
  GitHub parece vazia. Para ver o código e esta documentação, escolha a branch `frontend` no
  seletor de branches. Isso muda quando o Pull Request `frontend` → `develop` for aprovado.
- **Próximos passos:** abrir e revisar o Pull Request da `frontend`; depois, #10 (reserva) e #5/#11
  (API). As pendências do front-end estão em
  [frontend/README.md](frontend/README.md#pendências).

## Estrutura do repositório

| Pasta       | Conteúdo                                                    | Situação                                          |
| ----------- | ----------------------------------------------------------- | ------------------------------------------------- |
| `frontend/` | Next.js 16 + TypeScript + Tailwind CSS 4 (catálogo e busca) | Pronto para revisão na branch `frontend` (#4, #9) |
| `backend/`  | API REST em NestJS + Prisma + PostgreSQL                    | A criar (#5, #11)                                 |

Ainda virão: `docker-compose.yml`, Dockerfiles, pipelines em `.github/workflows`, Terraform e
Nginx, conforme as etapas de DevOps do projeto. O andamento das tarefas fica no GitHub Projects
**Ache-em-Petrolina**.

## Requisitos

- **Node.js 20.9 ou mais novo** (usamos o 24; veja `.nvmrc`)
- npm (vem com o Node)
- Git

## Como rodar o front-end

```bash
git clone https://github.com/johngabrielcoelho-dot/Aponti-loja.git
cd Aponti-loja
git switch frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

No **Prompt de Comando (cmd)** do Windows, troque o `cp` por `copy .env.example .env.local`. No
PowerShell e no Git Bash o `cp` funciona.

Acesse http://localhost:3000. Mais detalhes, decisões e pendências em
[frontend/README.md](frontend/README.md).

## Fluxo de trabalho

- **Branches:**
  - `main`: produção.
  - `develop`: integração; recebe os Pull Requests.
  - `frontend`: trabalho do front-end (hoje, #4 e #9), criada a partir da `develop`.
  - Outras áreas seguem o mesmo padrão, com o nome da área (ex.: `backend` para a API). Combine
    com o grupo antes de criar.
- **Pull Requests** sempre para a `develop`, com pelo menos **1 revisão** de outro integrante.
  Escreva `Closes #<número>` na descrição para ligar o PR à issue.
- **Antes de abrir o PR**, dentro de `frontend/`: `npm run format`, `npm run lint` e
  `npm run build` precisam passar.
- **Commits** no padrão Conventional Commits: `feat: ...`, `fix: ...`, `refactor: ...`,
  `docs: ...`, `chore: ...`.
- As issues só fecham sozinhas quando o código chega na `main`. Depois do merge na `develop`,
  mova o card para **Done** e feche a issue manualmente.
- **Atenção ao nome `frontend`:** existe uma pasta com o mesmo nome, então alguns comandos do Git
  precisam de `--` no fim para indicar a branch, por exemplo `git log frontend --`. O push, o
  `git switch frontend` e os Pull Requests funcionam normalmente.

## Segurança

Revisão feita em 23/10/2026. O front-end ainda não tem back-end, login nem dados pessoais, então o
risco hoje é baixo: a busca escapa código injetado, não há segredos no repositório e as
dependências de produção não têm vulnerabilidades conhecidas (`npm audit --omit=dev`).

Pendências de configuração:

- **Cabeçalhos HTTP de segurança** no front-end: veja
  [frontend/README.md](frontend/README.md#pendências).
- **Proteção da `main`** no GitHub (**Settings → Branches**): exigir Pull Request com 1 revisão.
- **Dependabot alerts** e **Secret scanning** (**Settings → Code security**), gratuitos em
  repositórios públicos.
- **E-mail nos commits:** o repositório é público e os commits mostram o e-mail de quem os fez.
  Para esconder nos próximos, ative **Settings → Emails → "Keep my email addresses private"** no
  GitHub e configure no Git o e-mail `...@users.noreply.github.com` mostrado nessa página.
- **Nunca** coloque senhas, tokens ou chaves no código. Use `.env.local`, que não vai para o Git.
