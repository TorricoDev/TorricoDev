# Prompt inicial para o Codex — Roguelite Pixel Art 8 Direções

Você atuará como arquiteto de jogo, game designer, programador de Godot e responsável pela pipeline de pixel art, mantendo o projeto enxuto, testável e orientado a publicação Web.

## Fonte da verdade

Leia integralmente `GDD_Roguelite_Pixel_Art_8_Direcoes.md` (ou o texto equivalente fornecido pelo usuário). Separe explicitamente **decisões tomadas pelo usuário** de **propostas técnicas ainda sujeitas a validação**. Não substitua escolhas sem documentar o motivo. Caso o repositório já contenha código, audite-o e preserve as funcionalidades existentes; faça alterações incrementais. Não apague arquivos, históricos, artes nem refatore amplamente sem necessidade.

## Missão inicial

Prepare e implemente um **vertical slice** do roguelite de fantasia medieval descrito no GDD, com visual top-down, 8 orientações de personagem, mira 360°, salas fixas e proceduralidade baseada em templates. O foco é provar a jogabilidade e o fluxo de spritesheets, não criar dezenas de assets.

## Restrições essenciais

- Engine Godot 4.x estável; GDScript; renderer Compatibility; exportação HTML5 single-thread inicialmente. Sem C#.
- Resolução lógica inicial 320×180 e pixels nítidos (nearest-neighbor, escala inteira quando possível).
- Personagem chibi com alvo 32×32 px em célula de 48×48 px; tiles 16×16 px.
- Oito orientações visuais por espelhamento de cinco bases quando adequado. Ordem `N, NE, E, SE, S, SW, W, NW`.
- Sprite de personagem, efeitos e armas são componentes separados quando isso economizar animações sem afetar leitura.
- Ataques corpo a corpo e à distância usam mira exata de mouse; sprites representam a direção visual mais próxima, sem limitar projéteis a oito ângulos.
- Animações devem ser data-driven com `manifest` e verificadas automaticamente; não codificar posição/offset de cada animação diretamente no PlayerController.
- A arte é criada com IA como apoio, mas só aprovada após revisão humana em pixel-grid. Enquanto não existir arte final, usar placeholders legíveis, sem bloquear desenvolvimento.
- Escopo inicial: 1 bioma, 1 personagem, 2 armas, esquiva, 1 habilidade, 3 inimigos, 1 chefe, 6 salas manuais combinadas proceduralmente, upgrades básicos, vitória/derrota, salvamento local.

## Primeira entrega (prioritária)

1. Audite o diretório. Identifique estrutura, dependências e comandos que funcionam; registre problemas sem destruir nada.
2. Crie/atualize `AGENTS.md`, `docs/GDD.md`, `docs/ART_BIBLE.md`, `docs/ANIMATION_SPEC.md`, `docs/DECISIONS.md` respeitando documentação que já existir.
3. Faça um projeto Godot executável com uma sala-teste e placeholders, movimentação normalizada em oito direções, mouse aim e escolha visual de facing.
4. Adicione uma implementação simples de `direction_resolver` e `animation_driver`, com espelhamento determinístico.
5. Defina contrato JSON de spritesheets (célula, pivô, frames, direções, FPS, flip, eventos). Crie scripts de montagem e validação em `tools/` com testes.
6. Construa um visualizador de animações com seleção de ação, velocidade, orientação, zoom inteiro e fundo claro/escuro; incluir visualização das oito orientações.
7. Teste uma arma melee, uma ranged, hitbox independente, cooldown e esquiva.
8. Inclua um inimigo de teste com telegraph, uma sala e menu mínimo de reinício.
9. Gere/exporte o build Web e documente o teste real de compatibilidade ou impedimentos do ambiente.
10. Rode testes automatizados, revisão visual e reporte bugs encontrados, correções e lacunas.

## Qualidade e disciplina

- Não considere imagens geradas por IA prontas para uso só porque são bonitas; verifique consistência entre frames/direções, transparência, tamanho, paleta, pivô e clipping.
- Cada correção de pipeline inclui teste de regressão para o problema encontrado.
- Não duplicar lógica entre inimigos, armas ou salas; preferir componentes e recursos configuráveis.
- Não usar arte de referência dos jogos inspiradores nem do tutorial como asset do projeto.
- Apresente um checklist de aceitação por etapa e não marque passos incompletos como concluídos.
- Priorize uma única sala divertida antes de expandir proceduralidade, biomas e chefes.

Comece inspecionando o projeto atual (ou criando a estrutura mínima caso esteja vazio). Produza um plano curto, uma lista clara de decisões e implemente a primeira etapa sem aguardar novas confirmações, exceto se a ação exigida for destrutiva ou houver bloqueio técnico incontornável.
