# Estado do projeto

23/10/2026 · Etapa 0 · modo Criação.

## Implementação preparada

- Phaser 3.90.0, JavaScript ESM, Vite e HTML/CSS; instalação das dependências ainda pendente.
- Cena Boot e sala de câmera fixa 320×180, template com cinco obstáculos, Arcade Physics e colisão nos pés.
- Movimento normalizado em oito direções; WASD/setas; idle conserva facing; pausa, perda de foco, reinício e debug de colisão.
- Pixel art configurada sem antialias, arredondamento visual e escala inteira de exibição.
- Spritesheets provisórios originais com 30 quadros em cinco bases direcionais, aliases seguros para oito orientações e FPS por ação.
- Corpo/sombra e slots separados de arma/efeitos; armas e efeitos de combate ainda não implementados.
- Ferramentas e testes de lógica/arte sem dependências; testes de integração Playwright preparados.
- AGENTS.md com modos automáticos Criação, Correção e Auditoria; GDD, decisões, pipeline, especificação e próximos passos.
- GDD e prompt históricos preservados na raiz.

## Validação desta sessão

Executor observado: Codex Desktop Windows, workspace local `mark10`, Node fornecido pelo Codex v24.22.1. Sem instalação de dependências/programas ou servidor local. Usuário autorizou o envio do código ao repositório público indicado, em branch separada.

| Verificação | Situação |
| --- | --- |
| Geração dos placeholders | executada; idle 96×240, move 192×240 |
| Validação dos spritesheets | executada; 30 quadros aprovados estruturalmente |
| Sintaxe JavaScript | passou; 22 arquivos via `node tools/check-source.mjs` |
| Testes Node de lógica/arte | 26 passaram, 0 falhas via `node --test tests/*.test.js` |
| Instalação Phaser/Vite/Playwright | pendente; somente no Cloud |
| Build de produção | bloqueado na pré-verificação: importação de Vite retorna `ERR_MODULE_NOT_FOUND`; instalação reservada ao Cloud |
| Testes de navegador e colisões reais | pendentes; sem servidor ou navegador de jogo iniciado |
| Revisão visual interativa | não realizada |

Aceitação de runtime e visual permanece aberta. A presença do código ou aprovação de testes puros não prova funcionamento do Phaser no navegador.

Os PNGs provisórios receberam uma inspeção estática preliminar. Isso não equivale a uma prévia interativa do jogo nem aprova animações em movimento.

## Ambiente Cloud informado

Usuário criou **TorricoDev** e indicou `https://github.com/TorricoDev/TorricoDev`, branch `main`. O conector confirmou acesso e repositório público contendo apenas README de perfil. Usuário autorizou enviar a base em branch de trabalho `codex/roguelite-bootstrap-2026-10-23`, subpasta `games/reliquias-da-ruina/`, preservando perfil/main e usando PR para revisão. Selecionar essa branch para continuar no Cloud. Ainda não houve execução nessa máquina remota; criar o ambiente não migra automaticamente a conversa ou a pasta local.

Envio realizado: **40 arquivos** na subpasta do jogo, disponíveis no [PR #1 em rascunho](https://github.com/TorricoDev/TorricoDev/pull/1). A árvore remota foi conferida: nenhum arquivo ausente, PNGs presentes e SHA do README de perfil idêntico ao original. Nenhuma exclusão; `main` não foi alterada. O PR aguarda build e validação do runtime no Cloud, sem merge automático.

## Fora desta etapa

Combate, esquiva, habilidades, mira de mouse, inimigos, chefes, proceduralidade, progressão, save, toque/gamepad, áudio e arte definitiva. O laboratório de animação está especificado, ainda não implementado. Nenhuma run de 5–15 minutos está disponível.

Próxima ação: concluir validação remota; depois construir o laboratório de animações. Ver [NEXT_STEPS.md](NEXT_STEPS.md).
