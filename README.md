# Finanças Backend

Este é um backend mínimo em Node.js para persistir dados de usuários no repositório GitHub Pages via API do GitHub.

## Passos

1. Crie um token de acesso pessoal no GitHub (fine-grained) com permissão de Contents: Read/Write apenas para `brunoestevesti/brunoestevesti.github.io`.
2. Configure as variáveis no `.env` (baseado no `.env.example`).
3. Deploy no [Render](https://render.com) ou [Railway](https://railway.app).
4. Use os endpoints:
   - `POST /save` → salva os dados do usuário
   - `GET /load/:username` → carrega dados do usuário

Proteja os endpoints com o cabeçalho `x-api-key`.
