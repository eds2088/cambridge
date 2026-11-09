# Cambridge — Planejador de Aulas de Inglês

Site de uso restrito, publicado pelo GitHub Pages em
<https://eds2088.github.io/cambridge/>.

Atrás do login há um **planejador de aulas**: a professora informa a turma,
os dias de inglês, o período letivo (com feriados, recessos e datas sem aula),
as regras de avaliação e projeto e as unidades do livro (páginas do Student's
Book e do Workbook). O planejador distribui o conteúdo pelos dias letivos, na
ordem, encaixando projeto, revisão, prova e devolutiva de cada unidade, e
mostra o calendário completo com o saldo de aulas. Tudo roda no navegador e
fica salvo nele; dá para salvar/abrir arquivo, copiar como texto, baixar
planilha e imprimir em PDF. Passe o mouse sobre qualquer botão para ver o
que ele faz.

## Proteção

O conteúdo da página é cifrado (AES-256-GCM, chave derivada do usuário e da
senha por PBKDF2-SHA256 com 600.000 iterações). O repositório guarda apenas o
texto cifrado; sem as credenciais o conteúdo não pode ser lido.

## Estrutura

```
fonte/index.html        o planejador (NÃO vai para o Git; faça backup)
ferramentas/login.html  tela de login (modelo)
ferramentas/gerar_site.mjs  cifra fonte/ -> docs/index.html
docs/                   o que o GitHub Pages publica
```

## Atualizar o site

1. Edite `fonte/index.html`.
2. Gere a página cifrada:

   ```powershell
   $env:CAMBRIDGE_USUARIO = "<usuário>"; $env:CAMBRIDGE_SENHA = "<senha>"
   node ferramentas/gerar_site.mjs
   ```

3. Publique:

   ```powershell
   git add -A
   git commit -m "Atualiza o planejador"
   git push
   ```

Para trocar a senha, gere de novo com a senha nova e publique.
