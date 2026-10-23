# Registro de decisões

23/10/2026. Diferenciar requisitos do usuário, escolhas provisórias e validações ainda pendentes.

## D001 — Phaser 3, JavaScript e Vite

**Origem:** pedido atual do usuário. Substitui Godot/GDScript sugeridos nos documentos históricos. Phaser 3.90.0 foi escolhido explicitamente para esta base; a documentação geral online já apresenta Phaser 4, então conferir a versão ao consultar APIs. Vite usa a linha 7.3 com atualizações compatíveis. Node mínimo 22.12. O primeiro setup Cloud deve gerar e guardar o lockfile; não foi fabricado um lockfile sem resolução npm.

## D002 — Entrega limitada à sala de testes

**Origem:** pedido atual. O prompt histórico propunha um vertical slice inteiro; esta entrega implementa somente movimento, colisão, estados de locomoção e pipeline básica. Não inclui combate, esquiva, habilidades, inimigos, run, geração procedural nem arte definitiva. Laboratório de animações fica planejado.

## D003 — Resolução e escala

**Origem:** GDD existente e requisito pixel-perfect. Manter 320×180 lógicos, escala inteira via ScaleManager, `pixelArt`, antialias desativado, câmera com `roundPixels`, CSS `image-rendering`. Física continua fracionária. Viewports menores que 320×180 usam rolagem em 1×; não comprimem a arte. Verificação visual em diferentes DPRs ainda pendente.

## D004 — Direção e estado desacoplados da engine

**Escolha de implementação:** funções puras calculam vetor normalizado, orientação e estado; adaptador de teclado e AnimationDriver traduzem para Phaser. Idle conserva facing. O estado `move` corresponde à intenção, mesmo ao pressionar uma parede. Mira e estados de ação serão adicionados com regras explícitas, sem vincular dano ao FPS da animação.

## D005 — Sprites e espelhamento declarativos

**Origem:** GDD e pedido de pipeline. Corpo 48×48, pivô [24,40], base dos pés y=39. PNGs separados para idle e move; cada linha é uma direção-base. Placeholder usa N/NE/E/SE/S e aliases horizontais NW/W/SW. `mirrorSafe: true` é obrigatório para aliases; pivô X central e fontes diretas são validados. Armas assimétricas terão oito direções reais ou outra configuração própria, sem herdar automaticamente o flip do corpo.

## D006 — Colisão nos pés e camadas

**Escolha provisória:** hitbox 12×8, offset [18,32] na célula. Não inferir colisão do alpha. Corpo, sombra, slot de arma e slot de efeitos são objetos separados, ordenados pela altura dos pés. Slots estão vazios nesta etapa. Obstáculos físicos pertencem ao template da sala.

## D007 — Ferramentas de arte sem dependências extras

**Escolha de implementação:** gerar PNGs originais com Node e zlib; validar RGBA 8-bit sem entrelaçamento, CRC, dimensões, margens, alpha e baseline por quadro. O codec suporta filtros PNG 0–4 e falha para paleta/indexado ou RGB sem alpha: reexportar em RGBA. Validação estrutural não aprova silhueta, direção, fluidez ou consistência estética.

## D008 — Limite do executor e destino remoto

**Fato observado:** esta conversa usa Codex Desktop, Windows, pasta local sem `.git`. Usuário informou o ambiente Cloud **TorricoDev**, repositório **TorricoDev/TorricoDev**, branch **main**. O conector confirmou que o repositório é público e contém somente README de perfil. A criação do ambiente não migra automaticamente o executor desta conversa nem seus arquivos.

Não instalar dependências nem iniciar servidores locais. Usar apenas o Node incluído no Codex para verificações sem dependências; build e runtime ficam pendentes para Cloud. Usuário autorizou explicitamente esse destino público. A base será enviada na branch `codex/roguelite-bootstrap-2026-10-23`, em `games/reliquias-da-ruina/`, para revisão por PR, preservando README e main. Não confundir publicação de ambiente de desenvolvimento com publicação pública do jogo.

## Fontes técnicas consultadas

- [Phaser 3.90.0 — package](https://github.com/phaserjs/phaser/blob/v3.90.0/package.json), [BaseCamera](https://github.com/phaserjs/phaser/blob/v3.90.0/src/cameras/2d/BaseCamera.js), [ScaleManager](https://github.com/phaserjs/phaser/blob/v3.90.0/src/scale/ScaleManager.js).
- [Vite — guia](https://vite.dev/guide/), [linha 7.3.1](https://github.com/vitejs/vite/blob/v7.3.1/packages/vite/package.json).
- [Codex Cloud — documentação oficial](https://learn.chatgpt.com/docs/cloud).
