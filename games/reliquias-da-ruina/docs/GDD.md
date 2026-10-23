# GDD — Relíquias da Ruína

Versão 0.2 · 23/10/2026 · nome provisório.

## Fontes e precedência

O [GDD original](../GDD_Roguelite_Pixel_Art_8_Direcoes.md) contém a proposta completa e as 68 respostas da pessoa idealizadora. O [prompt histórico](../PROMPT_Inicial_Codex_Roguelite.md) registra uma proposta anterior com Godot e um vertical slice amplo. Ambos permanecem íntegros como histórico. O pedido atual determina Phaser, JavaScript, Vite e uma primeira implementação limitada à sala de testes. Ver D001/D002 em [DECISIONS.md](DECISIONS.md).

## Decisões do usuário

- Roguelite de ação medieval, single-player para navegador, câmera fixa por sala e movimento top-down em oito direções.
- Combate rápido corpo a corpo e à distância, esquiva, habilidades, evolução e dificuldade desafiadora.
- Salas procedurais a partir de modelos; chefes com ataques distintos e legíveis; partidas de 5–15 minutos.
- Pixel art moderna, chibi aproximadamente 32×32, identidade própria. Moonlighter, Kingdom Two Crowns e Exit the Gungeon são referências de atmosfera e ritmo, não fontes de assets.
- Desenvolvimento e instalação de dependências no Codex Cloud, sem programas ou servidores no computador do usuário. Hospedagem pública, serviços pagos e infraestrutura externa exigem autorização.

## Pilares

1. Resposta rápida e leitura clara: diagonal não acelera, física independente da arte, antecipações visíveis no futuro combate.
2. Reutilização: corpo, armas e efeitos separados, manifest por conjunto, componentes pequenos.
3. Partidas curtas com escolhas de melhoria significativas. Progressão permanente sem crescimento ilimitado de atributos.
4. Expandir após validar uma sala e um ciclo de combate.

## Etapa 0 implementada nas fontes

Um pátio com chão, limites sólidos e cinco obstáculos. Personagem provisório com duas ações (`idle`, `move`), cinco bases desenhadas e oito orientações visuais. Movimento de 72 px/s normalizado, teclas WASD/setas, pausa, reinício e visualização das colisões. Renderização lógica 320×180 com ampliação inteira. Não há transição de sala.

A orientação acompanha o movimento; em repouso, conserva a última direção. Movimento bloqueado por parede ainda reproduz `move`, pois o estado representa intenção de locomoção. Mira por mouse, ataques e esquiva ficam para o próximo protótipo.

## Propostas para validar futuramente

- Região inicial: Bosque das Ruínas. Uma run por região, com 4–6 salas de combate, recompensa e chefe; duração depende de medição.
- Espada curta e arco, uma esquiva e uma habilidade ativa. Mouse com mira contínua; sprite representa a direção mais próxima sem quantizar a trajetória dos projéteis.
- Três arquétipos de inimigo: perseguidor, atirador e investidor. Sentinela do Bosque como proposta de chefe com investida, arco de projéteis e área com zona segura.
- Templates manuais ligados por seed; validar conectividade, portas e spawns antes de gerar runs.
- Cinco a oito melhorias na run, desbloqueios moderados e save local sem login.
- Arte de corpo em células de 48×48, tiles de 16×16; ambiente com contraste suficiente para telegraphs e projéteis.

Essas propostas não são funcionalidades entregues. A arquitetura inicial não inclui abstrações vazias de combate, geração procedural ou persistência.

## Aceitação desta etapa

- Fontes executáveis após instalação remota de dependências; build e navegador ainda precisam de validação no Cloud.
- Oito direções, idle persistente e velocidade diagonal equivalente, cobertos por testes de lógica.
- Colisões por Arcade Physics com caixa 12×8 nos pés; teste de integração preparado e ainda pendente.
- PNGs e manifests passam por validação automatizada. Qualidade estética e animação em movimento exigem revisão visual futura.

Referência de estudo: [SLYNYRD — Pixelblog 55](https://www.slynyrd.com/blog/2025/3/24/pixelblog-55-top-down-character-animation). Nenhum asset dessa referência foi importado.
