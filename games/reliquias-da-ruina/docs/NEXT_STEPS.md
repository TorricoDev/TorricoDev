# Próximos passos

## 1. Concluir validação no Cloud

- Destino autorizado: repositório público `TorricoDev/TorricoDev`, branch `codex/roguelite-bootstrap-2026-10-23`, subpasta `games/reliquias-da-ruina/`. O ambiente informado se chama TorricoDev.
- Abrir tarefa nesse ambiente e selecionar a branch do jogo, entrando na subpasta. Instalar dependências remotamente, gerar/guardar `package-lock.json` e repetir check, testes, validação de assets e build do README.
- Confirmar suporte a prévia de porta. Executar testes Playwright remotos e revisão visual da sala. Sem suporte a visualização, registrar o impedimento com os resultados disponíveis.
- Verificar WASD/setas, teclas opostas, oito direções, diagonal, colisões nos cinco obstáculos e nos quatro limites, F1, reset, pausa, perda/retorno de foco e resize 1×/2×/3×.
- Verificar camadas e oclusão ao passar à frente/atrás dos pilares, pés e baseline, nitidez e legibilidade a 100% de escala lógica. Capturar evidência apenas de execução real.

## 2. Construir o laboratório de animações

Prioridade depois do primeiro build aprovado: cena com seleção de ação/direção, galeria das oito orientações, grade/pivô/hitbox, frame stepping, zoom inteiro e fundos variados. Reutilizar os mesmos contratos e controlador de animações. Depois validar uma única base artística real antes de produzir muitos quadros.

## 3. Primeiro experimento de combate

Somente após pedido/aceitação da base: mira contínua, uma espada, um alvo e uma esquiva. Hitboxes e janelas de ataque independentes da arte, arma e VFX em camadas separadas. Medir resposta e legibilidade antes de adicionar arma à distância.

## 4. Vertical slice posterior

Inimigos, chefe, templates e geração por seed, recompensas, vitória/derrota e save local entram incrementalmente após uma sala de combate validada. Run de 5–15 minutos é alvo de design; nenhum tempo de partida foi medido nesta entrega.

## Prompt para continuar no ambiente TorricoDev

> No ambiente Cloud TorricoDev, use o repositório TorricoDev/TorricoDev e a branch codex/roguelite-bootstrap-2026-10-23. Entre em games/reliquias-da-ruina e leia AGENTS.md e docs/PROJECT_STATUS.md. Confirme que o executor é Cloud. Preserve arquivos existentes e não configure hospedagem pública, serviços pagos ou infraestrutura externa. Execute a instalação remota de package.json, guarde o lockfile e rode npm run check, npm test, npm run validate:assets e npm run build. Se houver navegador/prévia disponível, execute os testes de integração e valide visualmente a sala. Corrija os problemas encontrados e atualize o status com evidências reais. Não amplie o escopo para combate ou arte final nesta validação.
