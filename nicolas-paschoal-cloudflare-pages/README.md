# Nicolas Paschoal Cinema — Cloudflare Pages

Este projeto foi preparado para **Cloudflare Pages**. As páginas públicas são arquivos estáticos em `public/`. O painel em `/admin/` também é HTML estático; apenas as rotas que precisam gravar ou proteger dados usam Pages Functions e o bucket R2.

O conteúdo atual está incluído: 16 casamentos, 21 filmes/capítulos, textos, investimentos e duas imagens usadas no site. Os filmes continuam hospedados no YouTube. Nenhuma senha, cookie ou token está no projeto.

## Publicação

1. Envie este projeto para um repositório GitHub.
2. Na Cloudflare, crie um bucket R2 chamado `nicolas-paschoal-cinema`. Se preferir outro nome, altere `bucket_name` em `wrangler.jsonc` e defina `R2_BUCKET` antes da importação inicial.
3. Em **Workers & Pages**, crie um projeto Pages conectado ao repositório. Use `public` como diretório de saída; não é necessário comando de build.
4. Em **Settings → Bindings**, conecte o bucket R2 com o nome da variável `BUCKET` e faça uma nova publicação. A Cloudflare documenta essa ligação de R2 ao Pages [aqui](https://developers.cloudflare.com/pages/functions/bindings/).
5. Na sua máquina, com Node 22+ instalado, execute `npm install`, depois `npx wrangler login`.
6. No diretório deste projeto, execute `npm run seed`. Isso envia o conteúdo inicial e as imagens a R2. Execute uma vez, antes da primeira edição no painel; executar novamente substitui conteúdo já editado.
7. Execute `npm run access`, copie cada valor gerado e grave como segredo de produção do Pages: `ADMIN_USER`, `ADMIN_SALT` e `ADMIN_HASH`. Pelo terminal: `npx wrangler pages secret put NOME_DO_SEGREDO --project-name nicolas-paschoal-cinema`. Não copie a senha para arquivos ou Git.
8. Faça uma nova publicação depois de configurar os segredos. Abra `https://seu-projeto.pages.dev/admin/`, entre e confirme uma prévia e publicação.

O comando de envio direto é `npm run deploy -- --project-name nicolas-paschoal-cinema`. Para usar GitHub, a Cloudflare publica automaticamente a cada alteração enviada ao repositório.

## Domínio e operação

Em Pages → Custom domains, conecte o domínio e siga os registros DNS indicados pela Cloudflare. Depois, use sempre o domínio final para o painel: os cookies administrativos usam HTTPS, HttpOnly e SameSite estrito.

Após publicar pelo painel, o conteúdo atualizado é guardado em R2 e as páginas estáticas carregam a versão publicada imediatamente. O rascunho permanece visível somente em `/admin/` e na prévia autenticada. As imagens e o vídeo MP4 enviados pelo painel também ficam no R2. O limite configurado para vídeo de abertura é 100 MB.

## Segurança e backup

O bucket contém o conteúdo do painel, imagens e sessões. Faça backup do objeto `cms/state.json` e da pasta `media/` antes de alterações grandes. Não deixe o bucket público: as mídias são servidas somente pela rota `/media/` do site. Os filmes do YouTube não são copiados para R2.

## Desenvolvimento local

```sh
npm install
npm run dev
```

Para testar o login localmente, crie `.dev.vars` com `ADMIN_USER`, `ADMIN_SALT` e `ADMIN_HASH`, usando os valores gerados por `npm run access`. Esse arquivo já está ignorado pelo Git.
