# Cambridge

Site simples com acesso restrito, publicado pelo GitHub Pages.

O conteúdo da página é cifrado (AES-256-GCM, chave derivada do usuário e da
senha por PBKDF2-SHA256 com 600.000 iterações). O repositório guarda apenas o
texto cifrado; sem as credenciais o conteúdo não pode ser lido.

## Atualizar o site

1. Edite `fonte/index.html` (pasta local, fora do Git).
2. Gere a página cifrada:

   ```powershell
   $env:CAMBRIDGE_USUARIO = "<usuário>"; $env:CAMBRIDGE_SENHA = "<senha>"
   node ferramentas/gerar_site.mjs
   ```

3. Publique:

   ```powershell
   git add docs
   git commit -m "Atualiza conteúdo"
   git push
   ```

Para trocar a senha, gere de novo com a senha nova e publique.
