# Etapa 1 — auditoria e correções no Codex Cloud

23/10/2026. Repositório `TorricoDev/TorricoDev`, branch `codex/roguelite-bootstrap-2026-10-23`, diretório `games/reliquias-da-ruina/`. Modos Auditoria e Correção; nenhuma nova mecânica.

## Identificação e instalação

A ferramenta de configuração vinculou esta tarefa ao ambiente **TorricoDev**, e o terminal remoto respondeu em `/workspace`. A interrupção temporária do executor foi confirmada pelo erro “No usable execution environment”; o trabalho só continuou depois que o executor remoto voltou. Nenhuma execução foi transferida ao computador do usuário.

A base inicial `9afa5e0e87c9274268b05877f494ecc5da8052ed` coincidiu com a branch remota e `refs/pull/1/head`. O checkout foi trocado para a branch solicitada antes da instalação. A configuração inicialmente selecionava main; isso não foi usado como evidência de que a branch do jogo já estava ativa. [Metadados do runtime](2026-10-23-cloud/runtime.json).

Node v24.19.0, npm 11.9.0, Phaser 3.90.0, Vite 7.3.7, Playwright 1.64.1 e Chromium 154.0.8037.57. Não havia lockfile nessa branch: `npm install --cache /workspace/.cache/npm` passou e o gerou. `npm ci` passou com SHA-256 idêntico antes/depois: `62979c25194a2923a6de802f73611843baacb0325fd7f9e874fd1a7d1d02d71c`. [Log de repetibilidade](2026-10-23-cloud/install-repeatability.txt).

## Comandos e resultados finais

| Comando | Evidência | Resultado |
| --- | --- | --- |
| `npm run check` | [log](2026-10-23-cloud/check.txt) | 22 arquivos; exit 0 |
| `npm test` | [log](2026-10-23-cloud/test.txt) | 26 passaram, 0 falhas/skips; exit 0 |
| `npm run validate:assets` | [log](2026-10-23-cloud/validate-assets.txt) | 30 quadros; exit 0 |
| `npm run build` | [log](2026-10-23-cloud/build.txt) | exit 0; aviso de chunk Phaser >500 kB |
| `npm run test:browser` sobre produção | [log](2026-10-23-cloud/browser-production.txt), [JSON](2026-10-23-cloud/browser-production.json) | 11 passaram; 0 falhas, skips ou flaky; 34,3 s; exit 0 |

O build final foi servido exclusivamente por `npm run preview -- --host 127.0.0.1 --port 4173`. `ss` confirmou escuta em 127.0.0.1, sem servidor na porta de desenvolvimento após seu encerramento. Playwright recebeu `GAME_TEST_URL` interno e `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. As instruções de início precisam ser executadas novamente em outra tarefa; um processo não faz parte de um snapshot persistente.

A execução final do navegador começou em `2026-10-23T21:40:07.391Z` (18:40:07 em America/Sao_Paulo). Os logs tiveram apenas espaços finais normalizados para versionamento. O JSON registra contagens, duração, testes e anexos. Os corpos binários dos anexos foram extraídos para PNG/JSON ao lado do relatório, com caminhos relativos, sem alterar os resultados.

## Achados e correções

1. **Teste de diagonal instável (automação):** resultado inicial 3 passaram/1 falhou, esperando NE e obtendo E. Soltar duas teclas com chamadas separadas permitia um frame cardinal entre elas. O teste usa agora relógio controlado e mede deslocamento efetivo nas oito direções, além de orientação e idle. [Log inicial](2026-10-23-cloud/browser-initial.txt).
2. **Favicon ausente (baixo impacto):** o monitoramento adicional do console encontrou HTTP 404 em `/favicon.ico`. O trace confirmou o endereço, também verificado por HTTP. `index.html` declara um favicon vazio para impedir a solicitação implícita, sem adicionar arte. [Execução anterior à correção](2026-10-23-cloud/browser-before-favicon-fix.txt). O console é verificado em todos os testes finais.
3. **Hitbox deslocada após reiniciar em pausa (médio impacto):** a inspeção de F1 mostrou o corpo acima/esquerda dos pés, apesar do sprite em [160,116]. O Phaser 3.90 aplica `reset()` sem o offset até o próximo passo físico. `Player.reset()` agora chama `updateFromGameObject()` e sincroniza `prev`/`prevFrame`. A regressão visual compara os pixels da região dos pés com/sem F1 em pausa: [falha reproduzida antes](2026-10-23-cloud/browser-foot-offset-before-fix.txt), aprovada na suíte final. [Antes](2026-10-23-cloud/foot-collider-before-fix.png) e [depois](2026-10-23-cloud/foot-collider.png).

A suíte ampliada passou também na prévia de desenvolvimento antes da correção final da hitbox: [log de desenvolvimento](2026-10-23-cloud/browser-development.txt). Esse resultado parcial não aprova a versão final; a referência final é a suíte de produção com a regressão adicional.

## Comportamentos efetivamente verificados

- Oito deslocamentos e orientações, idle preservando facing, WASD e setas, teclas opostas sem deslocamento. [Medições](2026-10-23-cloud/displacement.json): distâncias de aproximadamente 32,4–33,6 pixels em 480 ms de relógio controlado, com variação de um passo físico; a maior razão ficou abaixo de 1,04. A diagonal não recebeu o ganho de √2, e os testes puros verificam o vetor unitário.
- Quatro paredes; cinco obstáculos por aproximação; limites do corpo nos pés. O teste de obstáculos confirma bloqueio por uma face de cada objeto, não todas as combinações de aproximação.
- Idle e movimento mudam os pixels dos quadros; movimento é mantido contra uma parede para isolar a animação do deslocamento. Pausa congela posição e imagem, com e sem intenção de movimento.
- P, Escape, R, botões, reinício durante pausa, perda de foco e F1. Spawn [160,116], idle/S e corpo alinhado imediatamente após reinício pausado.
- Canvas lógico 320×180, zoom 1×/2×/3×, `image-rendering` sem suavização, DPR 1/2 e viewport menor que o canvas sem compressão fracionária. Nenhum erro JavaScript/console nos 11 casos finais.

## Inspeção visual e seus limites

Capturas reais inspecionadas: [sala 3×](2026-10-23-cloud/room-3x.png), [1× DPR 1](2026-10-23-cloud/room-1x-dpr-1.png), [1× DPR 2](2026-10-23-cloud/room-1x-dpr-2.png), [idle](2026-10-23-cloud/idle-frame.png), [movimento](2026-10-23-cloud/move-frame.png) e [hitbox corrigida](2026-10-23-cloud/foot-collider.png). Personagem visível no spawn, pés/hitbox alinhados após a correção, bordas dos sprites nítidas nas escalas observadas e cenário sem recorte inesperado no canvas.

Houve controle real por eventos de teclado do navegador via Playwright. Não houve pessoa jogando por uma prévia encaminhada nem avaliação humana contínua da fluidez/oclusão. Outros navegadores, DPRs fracionários e dispositivos físicos permanecem sem teste. Isso não aprova arte definitiva ou qualidade estética final.

## PR e continuação

O [PR #1](https://github.com/TorricoDev/TorricoDev/pull/1) foi confirmado como `DRAFT` pela página pública. O destino das correções, lockfile, documentos e evidências é sua branch; nenhum merge foi autorizado. A API REST/GraphQL do GitHub foi bloqueada com CONNECT HTTP 403 no proxy para `api.github.com`, portanto não alegar comentário ou descrição atualizados por API. O envio do commit e sua correspondência com o head remoto devem ser conferidos por Git.

**Parecer:** critérios técnicos da Etapa 1 atendidos; podemos iniciar o Laboratório de Animações quando solicitado. Manter o rascunho para revisão humana, sem hospedagem pública nem novas mecânicas nesta entrega.
