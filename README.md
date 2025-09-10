# Finanças Backend (v2)

Correções importantes para Render:
- Usa `process.env.PORT` dinâmico (não defina PORT manualmente).
- `app.listen(..., "0.0.0.0")` para bind público.
- Endpoint de saúde: `/healthz` (retorna `ok`).
- `engines.node >= 18`.

## Deploy no Render
- Build: `npm install`
- Start: `npm start`
- Variáveis (Environment):
  - `GITHUB_TOKEN` (fine-grained, Contents: Read/Write no repo do Pages)
  - `API_KEY` (sua chave)
  - `GITHUB_OWNER=brunoestevesti`
  - `GITHUB_REPO=brunoestevesti.github.io`
  - `GITHUB_BRANCH=main`
  - **Não** defina `PORT`.

Teste: `https://SEU.onrender.com/healthz` → `ok`
