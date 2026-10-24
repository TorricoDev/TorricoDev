# Etapa 1 — evidência de auditoria parcial

Data: 23/10/2026, fuso America/Sao_Paulo. Modo Auditoria. Este relatório **não é evidência de execução Cloud nem de aprovação visual**.

## Origem das fontes

- Repositório: `TorricoDev/TorricoDev`.
- PR #1 aberto e em rascunho, destino `main`, origem `codex/roguelite-bootstrap-2026-10-23`.
- Commit remoto auditado: `0a5c973ce4c9ed6bc293b45b86ec9f3752a973dc`.
- Diretório remoto: `games/reliquias-da-ruina/`.
- Comparação: os 40 blobs locais tinham exatamente as mesmas somas Git SHA-1 que os arquivos remotos. Nenhuma divergência. A comparação precede as atualizações de documentação deste relatório.
- Sem `package-lock.json` na árvore auditada.

## Executor observado

Consulta executada com o Node já incluído no Codex:

```text
platform: win32
cwd: C:\Users\caio.torrico\Downloads\mark10
version: v24.22.1
executable: runtime Node fornecido pelo Codex
.git: ausente
node_modules: ausente
package-lock.json: ausente
```

Portanto, não foi confirmada execução no Cloud nem checkout local da branch. A branch foi verificada no GitHub. Não foram instalados programas ou dependências nem iniciados servidores locais.

## Comandos executados

Os scripts foram invocados diretamente pelo Node, sem npm ou dependências externas:

```text
node tools/check-source.mjs
22 arquivos JavaScript verificados sintaticamente.

node --test tests/*.test.js
tests 26
pass 26
fail 0
cancelled 0
skipped 0
todo 0

node tools/validate-assets.mjs
OK traveler.json/idle: 96×240, 10 quadros
OK traveler.json/move: 192×240, 20 quadros
30 quadros validados: RGBA, dimensões, margens, alpha e alinhamento.
```

O processo terminou com código 0. Cobertura: normalização e direção, idle/facing, teclas opostas, escala inteira calculada, geometria do template, manifests, espelhamento seguro, FPS/frames, PNG e validação estrutural de arte. Esses testes não inicializam Phaser.

## Verificação de acesso remoto

O CLI Codex já instalado expõe `cloud exec`, `cloud list`, `cloud status` e `cloud diff`. A consulta autenticada de tarefas retornou:

```json
{ "tasks": [], "cursor": null }
```

O seletor de ambientes não mostrou TorricoDev. O navegador disponível nesta sessão abriu a página pública do Codex com opção de login, sem um workspace remoto autenticado. Essas verificações não demonstram inexistência do ambiente informado pelo usuário. O usuário autorizou explicitamente criar uma tarefa Cloud; falta o link/identificador do ambiente para selecionar o destino correto. Nenhuma tarefa Cloud foi criada durante esta auditoria.

Depois, o usuário informou a mudança de nome para **Mark10**. O seletor foi aberto novamente e mostrou apenas `All Environments (Global)`, sem ambientes nomeados. A documentação oficial recomenda verificar a publicação de ambientes indisponíveis, mas o status Published/Unpublished do Mark10 não foi confirmado nesta sessão. Não foi usado o nome do repositório como se fosse o identificador do ambiente.

## Verificações não executadas

| Verificação | Resultado real |
| --- | --- |
| `npm install` remoto | não executado; sem executor Cloud acessível |
| Preservar/gerar lockfile por npm | pendente; nenhum arquivo fabricado |
| `npm run check`, `npm test`, `npm run validate:assets` no Cloud | não executados; scripts equivalentes passaram no Node Desktop |
| `npm run build` | não executado nesta auditoria; Vite ausente localmente, instalação remota necessária |
| Prévia Vite | não iniciada |
| Playwright | não executado |
| Controle e colisões reais no navegador | não testados |
| Animação, alinhamento e pixels em movimento | não validados visualmente |
| Escalonamento real em diferentes viewports/DPRs | não testado |

## Lacunas da aceitação visual

Os quatro testes Playwright preparados não constituem resultado: ainda precisam ser executados. Eles verificam boot/canvas em uma viewport, orientação e idle, limite direito/altar, pausa/reset/perda de foco. A checklist do usuário também exige deslocamento efetivo nas oito direções, velocidade diagonal em execução, demais limites e obstáculos, posicionamento, nitidez e resize. Validar esses itens no Cloud e anexar evidências reais.

## Conclusão

Nenhuma falha encontrada nos checks executados; nenhuma correção de código foi feita. Etapa 1 permanece incompleta, PR #1 deve continuar em rascunho e o avanço para Laboratório de Animações ainda não está liberado. Retomar a partir de uma tarefa no executor Cloud correto, sem instalar dependências ou iniciar servidores no computador do usuário.
