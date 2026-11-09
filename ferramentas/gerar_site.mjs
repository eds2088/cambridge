// Gera docs/index.html (o que vai para o GitHub Pages) a partir de fonte/index.html.
// O conteúdo é cifrado com AES-256-GCM; a chave vem de PBKDF2-SHA256(usuário + senha).
//
// Uso (PowerShell):
//   $env:CAMBRIDGE_USUARIO = "..."; $env:CAMBRIDGE_SENHA = "..."
//   node ferramentas/gerar_site.mjs
//
// O usuário e a senha NÃO ficam gravados em nenhum arquivo.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const ITERACOES = 600000;

const usuario = process.env.CAMBRIDGE_USUARIO;
const senha = process.env.CAMBRIDGE_SENHA;
if (!usuario || !senha) {
  console.error("Defina CAMBRIDGE_USUARIO e CAMBRIDGE_SENHA antes de gerar o site.");
  process.exit(1);
}

const b64 = (bytes) => Buffer.from(bytes).toString("base64");

async function derivarChave(sal) {
  const frase = new TextEncoder().encode(usuario.trim().toLowerCase() + "\n" + senha);
  const base = await crypto.subtle.importKey("raw", frase, "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: sal, iterations: ITERACOES },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

const claro = readFileSync(join(raiz, "fonte", "index.html"), "utf8");
const sal = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const chave = await derivarChave(sal);
const cifrado = new Uint8Array(
  await crypto.subtle.encrypt({ name: "AES-GCM", iv }, chave, new TextEncoder().encode(claro)));

// Conferência: decifra de volta e compara antes de gravar.
const volta = new TextDecoder().decode(
  await crypto.subtle.decrypt({ name: "AES-GCM", iv }, chave, cifrado));
if (volta !== claro) throw new Error("Conferência falhou: o conteúdo decifrado difere da fonte.");

const dados = { iteracoes: ITERACOES, sal: b64(sal), iv: b64(iv), cifrado: b64(cifrado) };
const pagina = readFileSync(join(raiz, "ferramentas", "login.html"), "utf8")
  .replace("__DADOS__", JSON.stringify(dados));

// Nada legível pode vazar para a página publicada.
for (const proibido of [senha, "Planejador de Aulas", "Unidades do livro"]) {
  if (pagina.includes(proibido)) throw new Error("A página publicada contém texto que deveria estar cifrado.");
}

mkdirSync(join(raiz, "docs"), { recursive: true });
writeFileSync(join(raiz, "docs", "index.html"), pagina);
writeFileSync(join(raiz, "docs", ".nojekyll"), "");
console.log(`docs/index.html gerado (${cifrado.length} bytes cifrados, conferência OK).`);
