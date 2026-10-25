# Etapa 3 — acesso interativo e revisão visual

25/10/2026. Repositório `TorricoDev/TorricoDev`, branch `codex/roguelite-bootstrap-2026-10-23`, diretório `games/reliquias-da-ruina/`, executor remoto Linux. Base inicial e head do PR #1 confirmados em `8fdf0f0e950fa32ecf543e595d69d00c459f1631`. Modos Auditoria, Criação e Correção.

## Conclusão de acesso

**Não foi obtida uma URL remota de prévia privada nesta sessão.** As ferramentas não expõem encaminhamento autenticado de portas e a configuração não fornece um endereço de preview. A resposta mais recente do usuário informa ausência do recurso na interface. A consulta à documentação oficial de ambientes retornou HTTP 403; isso limita a consulta, não demonstra ausência global de previews no produto. [Registro de capacidades](2026-10-25-interactive-review/preview-capabilities.json).

**Alternativa técnica preparada:** um HTML único para salvar e abrir no navegador do usuário, sem instalar software, iniciar servidor local ou publicar o jogo. O arquivo foi gerado e copiado para o workspace de artefatos privado; não foi enviado ao repositório público. A solicitação de abertura de arquivo no painel do Codex retornou `queued`, não confirmação de execução. O usuário informou que não via a interface; foi orientado a salvar o HTML e abri-lo com o navegador. A transferência/download pelo cliente e o uso humano não foram confirmados.

Portanto, não declarar acesso humano concluído nem confundir as capturas abaixo com uma prévia acessível ao usuário. [Instruções e limites](../INTERACTIVE_REVIEW.md).

## Artefato preparado

- Arquivo privado: `/workspace/artifacts/reliquias-da-ruina-2026-10-25-4810600a/reliquias-da-ruina.html`.
- Saída reproduzível do projeto: `dist-review/reliquias-da-ruina.html`, ignorada pelo Git.
- Tamanho: **1.246.660 bytes**.
- SHA-256: `4810600a6973450e8c3fdfdd406b837b44de306e1369d9fb68340f70618b8861`.
- [Metadados e hashes dos PNGs](2026-10-25-interactive-review/artifact.json).

O script `build:review` usa Vite/Rollup já instalados, sem dependências novas, produzindo um IIFE clássico e incorporando CSS e PNGs `data:`. O mesmo Boot/catálogo/controlador/cenas é compilado. O build normal permanece em `dist/`. A segunda geração do HTML produziu o mesmo SHA-256 e preservou todos os arquivos/hash de `dist/`: [repetibilidade](2026-10-25-interactive-review/repeatability.json), [log](2026-10-25-interactive-review/build-review-repeat.txt).

Não houve alteração de identidade visual, sprites, manifest, Player, AnimationDriver ou física. O lockfile manteve SHA-256 `62979c25194a2923a6de802f73611843baacb0325fd7f9e874fd1a7d1d02d71c`. A origem `.invalid` dos fixtures só identifica documentos fornecidos em memória; ela não existe como serviço de prévia e não foi entregue como endereço de acesso.

## Comandos solicitados

| Comando | Resultado final | Evidência |
| --- | --- | --- |
| `npm ci` | passou; 20 pacotes; lockfile inalterado | [log](2026-10-25-interactive-review/npm-ci.txt) |
| `npm run check` | 34 arquivos JS; exit 0 | [log](2026-10-25-interactive-review/check.txt) |
| `npm test` | 36 passaram; 0 falhas/skips/cancelados | [log](2026-10-25-interactive-review/test.txt) |
| `npm run validate` | 30 quadros aprovados; exit 0 | [log](2026-10-25-interactive-review/validate.txt) |
| `npm run build` | passou; aviso de chunk Phaser >500 kB | [log](2026-10-25-interactive-review/build.txt) |
| `npm run build:review` | HTML único gerado; exit 0 | [log](2026-10-25-interactive-review/build-review.txt) |

`validate` não existia inicialmente. Foi adicionado como alias de `validate:assets`, preservando o validador e a declaração de dependências. O `npm ci` utilizou cache em `/workspace/.cache/npm`; nenhuma instalação ocorreu no computador do usuário. [Runtime e versões](2026-10-25-interactive-review/runtime.json).

## Navegador: resultados separados por alvo

| Alvo | Resultado | Significado |
| --- | --- | --- |
| Vite/HTTP no loopback remoto | **19 passaram**, 0 falhas/skips/flaky, 54,4 s | Build normal e recursos HTTP verificados |
| Conteúdo do HTML, resposta em memória e contexto offline | **21 passaram**, 0 falhas/skips/flaky, 53,9 s | Conteúdo autossuficiente e controles exercitados, sem conexão externa |
| Navegação direta `file://` no Chromium gerenciado | **20 bloqueados**, 1 check de integridade passou | Bloqueio administrativo antes da aplicação; não aprova abertura direta |
| Download e abertura no computador do usuário | **Não confirmado** | Depende de transferência pelo cliente e teste humano |

[Log Vite](2026-10-25-interactive-review/vite-http.txt), [JSON Vite](2026-10-25-interactive-review/vite-http.json); [log HTML em memória](2026-10-25-interactive-review/html-offline.txt), [JSON HTML em memória](2026-10-25-interactive-review/html-offline.json); [bloqueio direto](2026-10-25-interactive-review/file-policy.json), [saída inicial](2026-10-25-interactive-review/file-initial.txt).

O Chromium 154.0.8037.57 retornou `ERR_BLOCKED_BY_ADMINISTRATOR` ao navegar em `file://`, tanto no original como na cópia. Nenhuma política, sandbox, TLS ou flag de segurança foi alterada. O modo alternativo usa `route.fulfill` e `offline: true`, não uma exceção à política de arquivos. Os 36 testes Node são uma execução separada; importações de testes Node que apareceram na primeira descoberta não foram contabilizadas como Playwright. `testMatch` agora seleciona explicitamente apenas `*.spec.js`.

Os casos finais verificaram os 18 cenários existentes, carregamento adicional e integridade/portabilidade do conteúdo. Scripts JavaScript, CSS e os dois PNGs retornaram corretamente no Vite, sem HTTP >=400 nem erros de console/JavaScript. No HTML, não há tags externas de script/stylesheet; somente o documento sintético de teste foi fornecido, com rede desativada. [Recursos Vite](2026-10-25-interactive-review/vite/loading-network.json), [recursos HTML](2026-10-25-interactive-review/html/loading-network.json).

Movimentação/diagonal, quatro paredes/cinco obstáculos, pausa/reset/foco, oito orientações, quadros, velocidade, zoom 1×–8×, guias, fundos e resize/DPR 1/2 continuam cobertos. Uma cópia renomeada em outra pasta foi lida e seu conteúdo exercitado em memória; isso não equivale a navegar diretamente ao arquivo nessa pasta.

## Correção necessária da embalagem

A primeira execução do conteúdo revelou `Cannot read properties of undefined (reading 'style')` em `ResizeObserver -> ScaleManager.setZoom`: o script clássico iniciava durante o parsing do HTML, antes do boot do Phaser. Essa rodada teve 7 aprovações e 14 falhas. A embalagem agora aguarda DOM pronto, equivalente ao momento de inicialização do módulo original. Foi incluída regressão de inicialização; os erros de console permaneceram habilitados. [Antes da correção](2026-10-25-interactive-review/html-before-ready-fix.txt), [resumo](2026-10-25-interactive-review/html-before-ready-fix.json).

## Inspeção visual possível

Capturas reais do build/controladas por Playwright, não imagens geradas:

- [Sala pelo conteúdo HTML](2026-10-25-interactive-review/html/room-3x.png).
- [Laboratório pelo conteúdo HTML](2026-10-25-interactive-review/html/lab-overview-3x.png).
- [Galeria 1×, DPR 2, no Vite](2026-10-25-interactive-review/vite/lab-1x-dpr-2.png).

Foram inspecionadas essas capturas: interface e navegação preservadas, sprites carregados e bordas nítidas nas condições observadas. Os anexos binários dos JSONs foram extraídos para subpastas `html/` e `vite/`, mantendo resultados/tempos e caminhos relativos. Espaços finais dos logs foram normalizados para versionamento.

Não houve pessoa jogando, avaliação contínua de fluidez, teste de download no cliente ou confirmação de abertura direta em navegador pessoal. Outros navegadores, sistemas, DPRs fracionários e dispositivos físicos continuam sem teste.

## Entrega e próxima etapa

As alterações de código/testes/documentação pertencem à mesma branch e ao [PR #1](https://github.com/TorricoDev/TorricoDev/pull/1), que deve permanecer em rascunho, sem merge automático. O HTML gerado permanece privado, fora do Git. Nenhum túnel, hospedagem pública, serviço pago ou infraestrutura externa foi criado.

**Recomendação:** concluir a transferência/abertura e a revisão humana com o roteiro antes de iniciar combate. A preparação técnica está testada, mas não supre o objetivo humano enquanto esse acesso não estiver confirmado.
