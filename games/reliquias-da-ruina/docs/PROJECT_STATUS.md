# Estado do projeto

25/10/2026 · Etapa 3: HTML preparado; entrega pelo cliente bloqueada · modos Auditoria, Criação e Correção.

## Resultado atual — Etapa 3

**Prévia remota por URL: não disponibilizada nesta sessão.** Não há ferramenta/URL de encaminhamento privado, a configuração não expõe esse recurso e a resposta mais recente do usuário informa que ele não aparece na interface. A ferramenta de abrir um painel do Codex apenas enfileirou a abertura do arquivo; isso não comprova download nem execução pelo usuário. Não foi criada URL pública, túnel ou hospedagem.

**Alternativa preparada:** HTML único de 1.246.660 bytes, com código, Phaser, CSS e PNGs incorporados. O artefato privado foi colocado no workspace para ser salvo/exportado pela conversa; não integra o Git público. O cliente precisa permitir essa transferência. O usuário confirmou que o link do workspace não abre ou não aparece no cliente. A captura enviada mostra a visualização “Index” sem estilos, parada em CARREGANDO e com erro do visualizador; ela não comprova execução do pacote completo. O botão de download da captura ainda precisa ser identificado quanto ao arquivo entregue. A lista atual de ferramentas não permite anexar HTML/ZIP diretamente: somente PR é aceito por attach_artifact. A entrega privada do arquivo e a revisão humana continuam bloqueadas.

**Limitação de validação direta:** o Chromium gerenciado bloqueia `file://` com `ERR_BLOCKED_BY_ADMINISTRATOR`. Foram preservadas suas políticas. A execução do conteúdo do HTML foi verificada por resposta em memória com contexto offline; esse resultado não deve ser declarado como aprovação da abertura direta de arquivo ou da experiência humana.

| Verificação da Etapa 3 | Resultado |
| --- | --- |
| `npm ci` | passou; lockfile preservado |
| `npm run check` | 34 arquivos JS |
| `npm test` | 36 passaram, 0 falhas/skips |
| `npm run validate` | novo alias do validador existente; 30 quadros aprovados |
| `npm run build` | passou; aviso não bloqueante do bundle Phaser |
| `npm run build:review` | HTML único gerado; reconstrução idêntica; `dist/` preservado |
| Playwright Vite/HTTP interno | 19 passaram, 0 falhas/skips/flaky; 54,4 s |
| Playwright conteúdo HTML em memória, sem rede | 21 passaram, 0 falhas/skips/flaky; 53,9 s |
| Navegação real `file://` no executor | bloqueada por política; não aprovada |
| Download pelo link de workspace | usuário confirmou que o link não abre/aparece |
| Arquivo entregue pelo botão do visualizador e revisão humana | ainda não identificados/concluídos |

Os casos finais não registraram erros de JavaScript/console. Foram conferidos scripts, CSS, os dois PNGs, navegação sala/laboratório, controles, colisões, pausa/reset, quadros, velocidade, zoom/guias e responsividade em DPR 1/2. A correção de boot do HTML aguarda DOM pronto, sem alterar física, animações ou identidade visual.

SHA-256 do HTML: `4810600a6973450e8c3fdfdd406b837b44de306e1369d9fb68340f70618b8861`. O build normal Vite permanece o fluxo de desenvolvimento. Não houve novas dependências; lockfile, manifest, sprites, Player e AnimationDriver foram preservados.

[Instruções para salvar e abrir](INTERACTIVE_REVIEW.md) · [evidências e limites](evidence/2026-10-25-stage-3-interactive-review.md).

**Combate:** aguardar a entrega efetiva do arquivo e a revisão humana da base antes de iniciar. Manter PR #1 em rascunho, sem merge automático.

## Etapa 2 — histórico

O laboratório está disponível pelo menu **02 / Laboratório de animações**, na rota `?view=animations`, separado da sala jogável. Reutiliza `AnimationDriver`, `validateManifest`, `resolveAnimation` e o catálogo que o Boot também utiliza. A cena de inspeção cria sprites sem corpos físicos.

- Seletor de personagem e ação; atualmente há um personagem provisório e as ações idle/move.
- Oito direções sincronizadas, com informação de base original/espelhada e quadro real do Phaser.
- Reprodução, pausa, avanço/retorno de um quadro, seleção direta na timeline e velocidade local 0,25×–4× sem alterar o FPS original.
- Zoom inteiro 1×–8× preservado ao redimensionar, com rolagem em escalas grandes.
- Grade/célula, pivô, baseline e hitbox de referência; fundos claro, escuro e quadriculado.
- Dimensões de célula/sheet, quadros, loop, FPS original/efetivo, alpha e espelhamentos visíveis na interface.

**Verificação final da Etapa 2:** check de 27 arquivos JS; 31 testes Node (26 existentes + 5 novos); validação dos 30 quadros; build de produção aprovado; 18 testes Chromium (11 da sala + 7 do laboratório), sem falhas, skips, flaky ou erros de JavaScript/console. Duração da suíte de navegador: 46,0 s. O aviso do bundle Phaser >500 kB permanece não bloqueante. Lockfile, PNGs e manifest do viajante foram preservados.

[Como abrir e usar](ANIMATION_LAB.md) · [relatório e resultados reais](evidence/2026-10-23-stage-2-animation-lab.md) · [captura do laboratório](evidence/2026-10-23-animation-lab/lab-overview-3x.png).

As capturas foram produzidas e inspecionadas no navegador remoto. Isso não equivale a uma pessoa usando a prévia encaminhada nem aprova a fluidez estética final. Outros personagens, navegadores e dispositivos físicos não foram testados. O PR #1 deve permanecer em rascunho, sem merge automático. O acesso atual à API GitHub voltou a responder; o bloqueio registrado abaixo pertence à Etapa 1.

## Resultado da Etapa 1 — histórico

**Pré-requisitos técnicos da Etapa 2 atendidos naquela entrega.** A sala foi instalada, compilada e controlada por teclado automatizado em Chromium real no executor remoto. Não se trata mais apenas dos checks sem dependências do Desktop. Evidências: [relatório Cloud](evidence/2026-10-23-stage-1-cloud.md), [resultados Playwright](evidence/2026-10-23-cloud/browser-production.json) e [captura da sala](evidence/2026-10-23-cloud/room-3x.png).

O executor associado à configuração **TorricoDev** é Linux x86_64; checkout `/workspace/TorricoDev`, branch `codex/roguelite-bootstrap-2026-10-23`, jogo em `games/reliquias-da-ruina/`. A base auditada foi `9afa5e0e87c9274268b05877f494ecc5da8052ed`, correspondente ao head remoto do PR #1 na entrada. O conector não expõe a URL da página do ambiente. As referências a Windows/Mark10 pertencem à [auditoria histórica do Desktop](evidence/2026-10-23-stage-1-desktop.md).

## Verificações executadas na Etapa 1 — histórico

| Verificação | Resultado final |
| --- | --- |
| `npm install` | passou no Cloud; gerou o lockfile que faltava |
| `npm ci` | passou; SHA-256 do lockfile permaneceu idêntico |
| `npm run check` | 22 arquivos JavaScript verificados |
| `npm test` | 26 passaram; 0 falhas, cancelados ou skips |
| `npm run validate:assets` | 30 quadros; RGBA, dimensões, alpha, margens e baseline aprovados |
| `npm run build` | passou; aviso não bloqueante sobre tamanho do chunk Phaser |
| Playwright em desenvolvimento | 11 passaram antes da correção final da hitbox; não substitui a revalidação de produção |
| Playwright no build final de produção | 11 passaram; 0 falhas, skips ou testes instáveis; 34,3 s |
| Console/JavaScript no build final | nenhum erro nos 11 casos |
| Capturas do navegador remoto | sala 3×, 1× em DPR 1/2, quadros idle/move e F1 inspecionados |

Runtime: Node v24.19.0, npm 11.9.0, Phaser 3.90.0, Vite 7.3.7, Playwright 1.64.1 e Chromium 154.0.8037.57. O lockfile foi gerado pelo npm, não manualmente.

## Correções e cobertura

- Corrigido o reinício em pausa: `Body.reset()` do Phaser 3.90 deixava a hitbox sem o offset até o próximo passo físico. Agora o corpo e suas posições anteriores são sincronizados imediatamente. A regressão visual falhou antes da correção e passou depois; há capturas antes/depois.
- Removida a solicitação implícita de favicon inexistente, que provocava HTTP 404 no console do build. Nenhuma arte foi adicionada.
- Corrigida uma instabilidade do teste de diagonal por soltura de teclas em frames diferentes, usando o relógio controlado do Playwright.
- Verificados deslocamento e orientação nas oito direções, normalização diagonal, WASD/setas, teclas opostas, idle/move, avanço de quadros, pausa da física/playback, reinício por tecla/botão, Escape, perda de foco e F1.
- Verificadas colisões nos quatro limites e nos cinco obstáculos, spawn [160,116], hitbox nos pés e escalas inteiras 1×/2×/3×, inclusive DPR 1/2 e viewport menor que a resolução lógica.

## Limitações e revisão

O navegador é Chromium headless remoto. As capturas foram inspecionadas, e os controles foram efetivamente acionados por Playwright; não houve uma pessoa jogando por prévia encaminhada nem avaliação humana contínua da fluidez. As ferramentas desta tarefa não oferecem essa prévia interativa. Não foram testados outros navegadores, dispositivos físicos ou controles de toque/gamepad.

O commit de implementação e evidências `b63804192f3b0dd27e28588e69981db41d3e6b41` foi enviado à branch do PR #1. O head da branch e `refs/pull/1/head` coincidiram após o envio, e a página pública confirmou `DRAFT`. Mantê-lo em rascunho para revisão humana, sem merge automático; a API de comentários/descrição foi bloqueada pelo proxy (CONNECT HTTP 403 para `api.github.com`). Os resultados estão nos arquivos versionados do PR; não houve alteração de sua descrição ou comentário por API.

## Escopo preservado

A sala fixa, os 30 quadros provisórios, o manifest, a ordem das direções, o espelhamento, o pivô, o corpo 12×8 e as camadas continuam sendo a base. Nenhum combate, inimigo, geração procedural ou arte definitiva foi implementado. Nenhum servidor foi iniciado no computador do usuário; as prévias usadas pelos testes ficaram no loopback do executor remoto, sem hospedagem pública.

Próxima ação: revisar o laboratório e suas evidências e escolher o próximo escopo com o usuário; ver [NEXT_STEPS.md](NEXT_STEPS.md). A aceitação humana da arte e da fluidez continua separada da aprovação técnica.
