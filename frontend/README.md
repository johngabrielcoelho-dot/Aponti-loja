# Ache em Petrolina — Front-end

Aplicação Next.js (issue #4) com a interface web mobile-first do catálogo e da busca (issue #9),
em **Next.js 16 + TypeScript + Tailwind CSS 4**.

## Como rodar

Requer **Node.js 20.9 ou mais novo** (veja o `.nvmrc` na raiz).

```bash
npm install
cp .env.example .env.local
npm run dev           # http://localhost:3000
npm run build         # build de produção (o CI deve rodar este comando)
npm run lint          # ESLint (regras do Next.js)
npm run format        # formata tudo com o Prettier
npm run format:check  # só verifica a formatação (para o CI)
```

## Variáveis de ambiente

| Variável               | Para que serve                                                               | Padrão                  |
| ---------------------- | ---------------------------------------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_SITE_URL` | Endereço público do site, usado nos links canônicos e no SEO. Sem `/` no fim | `http://localhost:3000` |

Em produção, use o domínio real (ex.: `https://acheempetrolina.com`). Arquivos `.env*` não vão
para o Git, exceto o `.env.example`.

## Padronização de código

- **ESLint** (`eslint.config.mjs`): regras do Next.js para React, TypeScript e Core Web Vitals.
  O `eslint-config-prettier` desliga as regras de estilo que brigariam com o Prettier.
- **Prettier** (`.prettierrc.json`): linhas de até 100 colunas, aspas duplas e ponto e vírgula.
  O plugin `prettier-plugin-tailwindcss` ordena as classes do Tailwind automaticamente.
- No VS Code, instale as extensões ESLint e Prettier e ative "Format On Save".
- Rode `npm run format` antes de abrir um Pull Request.

## Páginas

| Rota                                            | O que tem                                                                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                             | Busca por termo + bairro, 9 categorias do MVP, bairros com lojas, destaques e "Como funciona"                                                           |
| `/busca?q=&categoria=&bairro=&estoque=1&ordem=` | Resultados com filtros por categoria, bairro, "só com estoque" e ordenação por preço                                                                    |
| `/produto/[slug]`                               | Fotos (galeria com deslize), preço, estoque, loja, endereço, horário/"aberto agora", **Falar com a loja** (WhatsApp), Ligar e Como chegar (Google Maps) |

A busca ignora acentos e plural simples (`tenis nike 42` encontra "Tênis Nike Revolution 7").
Os filtros ficam na URL, então os links podem ser compartilhados e funcionam sem JavaScript.

## Estrutura

```
src/
  app/               rotas (App Router)
  components/        componentes de UI (cards, formulário de busca, galeria...)
  lib/catalog.ts     camada de acesso aos dados  ← trocar pela API NestJS
  lib/search-params  leitura/escrita dos filtros na URL
  lib/format.ts      preço, horários, links de WhatsApp/telefone/mapa
  data/              lojas, produtos, bairros e categorias FICTÍCIOS
scripts/             gera as ilustrações de public/mock (npm run mock:images)
```

## Ligando na API (issues #5 e #11)

Hoje `src/lib/catalog.ts` lê os mocks de `src/data`. Quando a API existir, troque o corpo das
funções (`searchProducts`, `getProductBySlug`, ...) por `fetch` na API mantendo as assinaturas;
as páginas não precisam mudar. O projeto usa **Cache Components** (`cacheComponents: true`):
leituras com `fetch` precisam de `"use cache"` + `cacheLife(...)` ou ficar dentro de `<Suspense>`,
senão o `next build` falha. Veja `node_modules/next/dist/docs/` para a versão instalada.

As "fotos" atuais são ilustrações por categoria; fotos reais dos lojistas entram no campo `images`.

## Decisões

- **Dados fictícios.** Lojas, produtos e endereços em `src/data` são inventados. Os números de
  WhatsApp usam o prefixo `9 0000`, que não existe em celulares, para ninguém receber mensagens
  por engano. Os nomes de bairros são de Petrolina (`src/data/neighborhoods.ts`); confira se falta
  algum.
- **Fotos ilustrativas.** `npm run mock:images` gera 3 ilustrações por categoria em `public/mock`.
  Para fotos vindas de outro domínio (ex.: storage da API), libere o domínio em
  `images.remotePatterns` no `next.config.ts`.
- **Filtros na URL.** Os parâmetros são `q`, `categoria`, `bairro`, `estoque=1` e
  `ordem=menor-preco|maior-preco`. Valores vazios ficam fora da URL (`buildSearchHref`). O
  formulário de busca é recriado (via `key`) quando a URL muda, para os campos mostrarem os
  filtros atuais.
- **Busca.** Ignora acentos e maiúsculas, palavras como "de" e "para" e o plural simples.
  Todos os termos precisam aparecer; termos no nome ou na marca valem mais. Esgotados aparecem
  por último. Tudo isso está em `src/lib/catalog.ts`.
- **"Aberto agora".** Depende do relógio, então é calculado no navegador
  (`src/components/open-status.tsx`), no fuso `America/Recife`. No servidor o componente não
  mostra nada. Os horários de cada loja ficam em `hours`, com o índice `0` = domingo.
- **Cache Components** (`cacheComponents: true` no `next.config.ts`):
  - `/busca` envia o topo da página na hora e os resultados chegam depois, dentro de um
    `<Suspense>`, porque dependem da URL.
  - As páginas de produto são geradas no build (`generateStaticParams`) e `loading.tsx` aparece
    na navegação entre elas.
  - Um produto inexistente mostra a página "não encontrado" com status **200** e
    `noindex`, não 404: com Cache Components a opção `dynamicParams` não existe.
- **Preços** são números em reais (`399.9`). Se a API usar centavos ou `Decimal`, converta em
  `catalog.ts`.

## Pendências

- **#10 Reserva:** o botão "Reservar" entra no componente `ContactActions` em
  `src/app/produto/[slug]/page.tsx`, que é usado na coluna do desktop e na barra fixa do celular.
  Esconda ou desative o botão quando o produto estiver esgotado. A reserva precisa de aviso de que
  só vale após a loja confirmar, prazo de retirada e consentimento LGPD.
- **#5 e #11 API:** trocar os mocks em `src/lib/catalog.ts` por chamadas à API, levar a busca para
  o back-end e adicionar a URL da API no `.env.example`.
- **SEO local:** páginas próprias por categoria, bairro e loja (ex.: `/bairro/centro`) ainda não
  existem.
- **Página de status (Health Check)** que consulta a API: desafio de DevOps do front-end, ainda não
  feito.
- **`npm audit`** aponta 5 alertas "high" no `eslint-config-next` (ferramenta de lint, não vai para
  o site). Não rode `npm audit fix --force`: ele rebaixa o pacote para a versão 14. Aguarde uma
  atualização do Next.
