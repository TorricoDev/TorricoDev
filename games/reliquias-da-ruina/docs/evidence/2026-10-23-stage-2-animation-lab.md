# Etapa 2 — Laboratório de Animações no Codex Cloud

23/10/2026 (America/Sao_Paulo). Modos Criação, Correção e Auditoria.

## Versão e escopo

Repositório `TorricoDev/TorricoDev`, branch `codex/roguelite-bootstrap-2026-10-23`, checkout remoto `/workspace/TorricoDev`, jogo em `games/reliquias-da-ruina/`. Base inicial: `832fec06b48248e0fdea5044859d596bd945653e`, igual ao head remoto do PR #1 na entrada. Foi testado o frontend incluído nesta entrega; depois da suíte final, os ajustes foram documentais e de organização das evidências.

O laboratório abre em `?view=animations`, pelo menu **02 / Laboratório de animações**. A sala abre na entrada padrão ou em `?view=room`. O Boot usa o catálogo comum; `AnimationLabScene` reutiliza `AnimationDriver`, `validateManifest` e `resolveAnimation`. A física da sala, o manifest, os PNGs e o lockfile não foram alterados. Nenhum combate, inimigo ou arte definitiva foi implementado.

Não houve nova instalação de dependências: as versões já resolvidas no lockfile estavam disponíveis. SHA-256 preservado do lockfile: `62979c25194a2923a6de802f73611843baacb0325fd7f9e874fd1a7d1d02d71c`. [Metadados reais do runtime](2026-10-23-animation-lab/runtime.json).

## Resultados finais

| Comando | Resultado | Evidência |
| --- | --- | --- |
| `npm run check` | 27 arquivos JS; exit 0 | [log](2026-10-23-animation-lab/check.txt) |
| `npm test` | 31 passaram; 0 falhas/skips/cancelados; exit 0 | [log](2026-10-23-animation-lab/test.txt) |
| `npm run validate:assets` | 30 quadros aprovados; exit 0 | [log](2026-10-23-animation-lab/validate-assets.txt) |
| `npm run build` | passou; aviso não bloqueante do chunk Phaser >500 kB | [log](2026-10-23-animation-lab/build.txt) |
| `npm run test:browser` sobre produção | 18 passaram; 0 falhas, skips ou flaky; exit 0; 46,0 s | [log](2026-10-23-animation-lab/browser-production.txt), [JSON](2026-10-23-animation-lab/browser-production.json) |

Os 31 testes Node incluem 26 existentes e cinco novos: circulação/rejeição de frames, zoom inteiro, geometria das oito células, pivô/baseline e referência do corpo, além de perfil ausente. Os 18 testes de navegador incluem 11 da sala e sete do laboratório. Não houve erro de JavaScript ou console nos casos finais.

A suíte final começou em `2026-10-24T00:35:52.362Z`, correspondente a **23/10/2026 às 21:35:52** em America/Sao_Paulo. As saídas dos testes pertencem a essa execução. Os anexos binários do JSON foram extraídos ao lado do relatório e substituídos por caminhos relativos; contagens, estados e tempos foram preservados. Apenas espaços finais dos logs foram normalizados para versionamento.

## Comportamentos observados no navegador

- Catálogo real com `traveler-placeholder`, seleção de idle/move e metadados corretos de 48×48, sheet 96×240 ou 192×240, alpha e FPS.
- Oito instâncias de sprites animados, com frames do Phaser e aliases NW←NE, W←E, SW←SE. Os testes leem índice atual, frame de textura e `flipX` reais, expostos como informação de inspeção na UI.
- Pausa congela frames e pixels; avançar/voltar circula corretamente; timeline seleciona os frames de sheet de cada linha. Retomar volta a animar. Trocar ação durante pausa mantém a pausa e reinicia no primeiro quadro.
- Velocidade 0,25× e 2× produz progressão diferente no mesmo tempo de teste, com as oito direções sincronizadas. FPS original permanece 10 para move; efetivo muda para 2,5 ou 20. O seletor oferece ainda 0,5×, 1×, 1,5× e 4×; a progressão temporal desses quatro valores não foi medida separadamente.
- Grade, pivô, baseline e hitbox mudam os pixels da galeria; desativar uma guia restaura a imagem anterior. Fundos claro/escuro/quadriculado geram capturas distintas.
- Todos os oito valores de zoom foram exercitados por teclado no slider, mantendo canvas lógico 320×180; zoom 8× resulta em 2560×1440 CSS e rolagem nos dois eixos. Resize preserva o valor manual. DPR 2 em viewport 400×800 foi exercitado a 1×, com captura completa de 640×360 pixels.
- A navegação retorna a uma sala controlável por teclado e reabre o laboratório independente. A suíte completa da sala também repetiu deslocamento/diagonal, quatro paredes, cinco obstáculos, pausa/reset/foco, hitbox nos pés e resize em DPR 1/2.

O navegador foi Chromium 154.0.8037.57 com Playwright 1.64.1, Node v24.19.0 e npm 11.9.0. `npm run preview -- --host 127.0.0.1 --port 4173` serviu o build exclusivamente no loopback remoto; a escuta foi conferida com `ss`. Nenhum servidor foi iniciado no computador do usuário nem houve hospedagem pública.

## Correções durante a implementação

A primeira rodada de integração encontrou ambiguidade de identificação dos selects: o rótulo envolvia o controle e seus textos de opções, e a busca de personagem também encontrava a telemetria oculta da sala. A rodada foi interrompida após o diagnóstico, sem resultado total de aprovação. Labels explícitos e seleção exata resolveram a identificação. [Saída inicial, interrompida](2026-10-23-animation-lab/browser-initial.txt).

Depois, a rodada isolada do laboratório passou nos sete testes: [log](2026-10-23-animation-lab/browser-lab-check.txt). A inspeção visual revelou que a captura da tela pequena cortava a segunda linha por enquadramento da página. O helper agora enquadra o canvas e testa as dimensões da imagem. A referência de aprovação continua sendo a suíte completa final de 18 casos, com essa verificação adicional.

## Evidências visuais reais

Capturas obtidas do build no Chromium remoto e inspecionadas:

- [Interface completa em 3×](2026-10-23-animation-lab/lab-overview-3x.png).
- [Move, quadro 3, oito direções](2026-10-23-animation-lab/lab-move-frame-3.png).
- [Guias em fundo escuro](2026-10-23-animation-lab/lab-guides-dark.png), [claro](2026-10-23-animation-lab/lab-guides-light.png) e [quadriculado](2026-10-23-animation-lab/lab-guides-checker.png).
- [Galeria completa em 1×, DPR 2](2026-10-23-animation-lab/lab-1x-dpr-2.png).
- [Sala jogável após a integração](2026-10-23-animation-lab/room-3x.png).

As capturas mostram transparência, contornos, aliases, pivô/baseline e corpo de referência. São imagens de execução real, sem composição ou edição. A arte segue provisória. O navegador foi controlado por eventos Playwright; não houve uma pessoa avaliando a fluidez por prévia encaminhada. Outros personagens, navegadores, DPRs fracionários e dispositivos físicos permanecem sem validação.

## Continuação

O [PR #1](https://github.com/TorricoDev/TorricoDev/pull/1) continua sendo o destino da branch; preservar seu rascunho para revisão, sem merge automático. A API GitHub voltou a responder nesta etapa, permitindo atualizar título/descrição com resultados atuais; a entrega deve conferir o sucesso dessas operações separadamente do push.

O laboratório está preparado para a revisão humana e para receber outro manifest corporal compatível quando esse trabalho for solicitado. [Guia de uso](../ANIMATION_LAB.md). Próximo escopo de gameplay depende de novo pedido; não foi iniciado nesta entrega.
