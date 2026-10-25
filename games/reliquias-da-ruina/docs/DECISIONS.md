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

**Fato histórico do bootstrap Desktop:** aquela execução usou Windows, pasta local sem `.git`. Usuário informou o ambiente Cloud **TorricoDev**, repositório **TorricoDev/TorricoDev**, branch **main**. O conector confirmou que o repositório é público e continha somente README de perfil. A criação do ambiente não migrou automaticamente aquele executor nem seus arquivos. A execução Cloud posterior está registrada em D010.

Não instalar dependências nem iniciar servidores locais. Usar apenas o Node incluído no Codex para verificações sem dependências; build e runtime ficam pendentes para Cloud. Usuário autorizou explicitamente esse destino público. A base foi enviada na branch `codex/roguelite-bootstrap-2026-10-23`, em `games/reliquias-da-ruina/`, no [PR #1](https://github.com/TorricoDev/TorricoDev/pull/1), preservando README e main. Não confundir publicação de ambiente de desenvolvimento com publicação pública do jogo.

## D009 — Aceitação da Etapa 1 exige evidência do executor remoto

**Origem:** pedido de validação do usuário em 23/10/2026. A auditoria confirmou novamente `win32`, workspace local sem `.git` e Node do runtime Codex. A branch foi confirmada remotamente no PR #1 e os 40 arquivos locais coincidiram por SHA Git com o commit auditado; isso permite relacionar os checks puros às fontes do PR, mas não transforma a sessão em checkout Cloud.

Não executar `npm install`, Vite ou Playwright localmente para contornar esse limite. Não produzir lockfile manual nem considerar build aprovado por ausência de falhas nos testes de lógica. O CLI Cloud disponível não apresentou o ambiente TorricoDev, e o navegador acessível não tinha sessão autenticada. O usuário autorizou explicitamente uma tarefa Cloud separada; é necessário identificar o ambiente correto antes de criá-la. Depois de acessá-la, confirmar plataforma, diretório, branch e commit antes da instalação remota.

**Critério de avanço:** obter instalação remota e lockfile, checks e build de produção aprovados. Se houver navegador, validar controles e ausência de erros em execução. Se não houver prévia, registrar exatamente essa limitação após compilar. Até esses critérios serem atendidos, manter PR #1 em rascunho, sem merge, e não declarar o Laboratório de Animações liberado. Ver [evidências da auditoria](evidence/2026-10-23-stage-1-desktop.md).

**Atualização de identificação:** usuário renomeou o ambiente Cloud para **Mark10**. O repositório permanece `TorricoDev/TorricoDev`. Uma nova consulta ao seletor do CLI não apresentou ambientes nomeados. Conforme a documentação oficial de ambientes, conferir em Settings → Codex Cloud → Environments se Mark10 está publicado; o nome ou o link do GitHub não substitui o identificador do executor.

## D010 — Execução remota e instalação reproduzível na Etapa 1

**Evidência de 23/10/2026:** tarefa associada à configuração Cloud **TorricoDev**, executor Linux x86_64, checkout `/workspace/TorricoDev`, branch `codex/roguelite-bootstrap-2026-10-23`, base `9afa5e0e87c9274268b05877f494ecc5da8052ed` igual ao head remoto do PR #1 na entrada. O nome Mark10 em D009 pertence ao registro histórico informado no Desktop; a leitura atual da configuração retorna TorricoDev, sem fornecer URL da página de configurações.

Node v24.19.0 atende ao mínimo >=22.12. O primeiro `npm install` resolveu as dependências e gerou `package-lock.json`, que deve ser versionado. A reexecução com `npm ci` passou sem alterar seu SHA-256. Resoluções: Phaser 3.90.0, Vite 7.3.7 e Playwright 1.64.1. Usar o lockfile nas próximas execuções. O aviso de chunk >500 kB é causado pelo Phaser; não bloqueia o build e não justifica reestruturação nesta validação.

## D011 — Navegador remoto e relógio controlado nos testes

**Escolha de validação:** reutilizar `/usr/bin/chromium` no executor Cloud (Chromium 154.0.8037.57), configurando opcionalmente `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Sem essa variável, manter a resolução padrão do Playwright. Não instalar nem iniciar nada no computador do usuário. Servidores de desenvolvimento/produção escutam exclusivamente o loopback remoto durante a auditoria.

O teste original de orientação falhou NE→E: as duas chamadas de soltura de teclas chegavam em tarefas diferentes, permitindo um frame cardinal antes de idle. O relógio do Playwright agora controla os frames e permite soltar a diagonal sem inserir uma direção intermediária. Isso corrige a automação, preservando a regra D004 do jogo. Os testes também medem deslocamento real, paredes/obstáculos, quadros visíveis, congelamento da animação, controles e escalas em DPR 1/2. Erros de JavaScript e do console são verificados em todos os casos, desde o carregamento.

**Correção localizada de runtime:** o console do build reportou HTTP 404 para `/favicon.ico`, confirmado no trace e por requisição HTTP. O HTML agora declara `rel="icon" href="data:,"` para não solicitar um ícone inexistente. Não foi adicionada arte nem alterada mecânica. A validação final e seus resultados ficam no relatório Cloud; a aprovação visual corresponde às capturas efetivamente inspecionadas, sem alegar revisão humana de fluidez ou acesso interativo encaminhado.

## D012 — Reinício alinha a hitbox imediatamente, inclusive em pausa

**Bug reproduzido por inspeção visual e teste de regressão:** após reiniciar pausado, o personagem aparecia no spawn, mas F1 mostrava a hitbox acima e à esquerda dos pés. `Body.reset()` do Phaser 3.90 usa o canto do sprite sem aplicar o offset personalizado; o alinhamento só era restaurado no próximo passo físico, ausente durante a pausa.

`Player.reset()` agora chama a API `updateFromGameObject()` depois de `reset()`, sincronizando as posições públicas `prev` e `prevFrame` para não acrescentar um deslocamento artificial em `postUpdate`. Preserva o corpo 12×8, offset [18,32], pivô, velocidades e animações. A regressão compara o recorte dos pés antes/depois de F1 com o jogo pausado: deve haver o traço da hitbox em [154,108]–[166,116] no spawn. O teste falhou na versão anterior; a revalidação final está registrada no relatório Cloud.

## D013 — Laboratório em cena e rota próprias

**Origem:** Etapa 2 solicitada pelo usuário. `?view=animations` abre `AnimationLabScene`; `?view=room` ou a entrada padrão abre `TestRoomScene`. Navegação explícita recarrega a aplicação e ativa somente a cena escolhida. O laboratório cria sprites comuns, não corpos Arcade. A resolução continua 320×180, com galeria de quatro colunas/duas linhas na ordem canônica. O zoom manual 1×–8× é independente do ajuste automático da sala e permanece inteiro após resize; escalas grandes usam rolagem.

## D014 — Controles de inspeção estendem o driver existente

**Escolha de implementação:** `AnimationDriver` ganhou pausa, retomada, quadro atual, seleção/avanço de quadro e `timeScale` por instância. Phaser continua sendo o único relógio de animação. Não se duplicam playback, linhas de sheet ou resolução de aliases na cena. `play(action, facing)` mantém a semântica anterior, e a regressão da sala foi executada.

A timeline e o avanço manual pausam, circulam nos extremos e mantêm as oito orientações sincronizadas. Trocar de ação/personagem volta ao primeiro quadro, preservando pausa e multiplicador. Os FPS originais e loops do manifest/registro global permanecem inalterados; a UI mostra original e efetivo. A hitbox é uma guia que referencia `PLAYER_BODY`; não altera física ou alpha. Grade, pivô e baseline vêm da geometria declarada no manifest.

## D015 — Catálogo compartilhado preserva o schema v1 e a arte existente

`actor-catalog.js` descobre e valida os manifests JSON e seleciona a categoria corporal, com IDs únicos. Boot e laboratório usam os mesmos objetos e o mesmo registro de animações. O seletor está implementado, mas há apenas `traveler-placeholder` disponível: não criar cópias de arte para simular variedade. Novos personagens exigem novos assets compatíveis e validação, sem duplicar o controlador. Um ator sem perfil físico conhecido exibe essa ausência e não desenha hitbox.

**Evidência da Etapa 2:** 31 testes Node, 30 quadros e build aprovados; 18 testes de navegador sobre produção (7 do laboratório + 11 da sala) sem erros de console/JavaScript. Os testes conferem quadros reais, aliases, velocidade, guias por diferença de pixels, fundos, zoom e navegação. A primeira execução foi interrompida após diagnosticar rótulos ambíguos nos selects; labels explícitos corrigiram a associação. A captura DPR 2 também ganhou enquadramento/checagem de dimensões para evitar evidência cortada. Ver [relatório da Etapa 2](evidence/2026-10-23-stage-2-animation-lab.md).

## D016 — Acesso humano depende de recurso real de entrega

**Etapa 3, 25/10/2026:** as ferramentas/configuração desta sessão não fornecem encaminhamento privado nem URL de preview. A resposta mais recente do usuário informa ausência desse botão. A consulta à documentação oficial de ambientes retornou HTTP 403; não usar essa falha como prova de inexistência global do recurso. `open_in_codex` apenas enfileirou a abertura do arquivo e não estabelece transferência ou execução no cliente. Não criar URLs, túneis ou publicação pública.

A alternativa é um HTML autossuficiente privado. Salvar/exportar esse arquivo e abri-lo no navegador do usuário é um passo separado, ainda sem confirmação. Recomendar revisão humana antes do combate; não registrar resultados humanos baseados em automação.

## D017 — Exportação HTML opcional preserva o build Vite

`build:review` usa o Vite existente, sem dependência adicional, e produz script IIFE, CSS e PNGs incorporados em `dist-review/`. A saída é ignorada pelo Git; a cópia entregue fica no workspace privado. O Boot usa um mapa de imagens `data:` somente nesse build e mantém URLs normais nos demais. Pivôs, sprites, FPS, física, controlador e arquitetura de cenas continuam compartilhados. O HTML inclui os avisos MIT, sem requisições externas necessárias.

**Correção comprovada:** o script clássico incorporado inicialmente rodava enquanto o documento ainda carregava, antecipando o ResizeObserver/ScaleManager em relação ao boot Phaser. A embalagem agora aguarda `DOMContentLoaded`, preservando a semântica de inicialização do módulo original. A regressão em memória passou de 7/21 para 21/21 sem suprimir os erros de console. Reconstrução gerou o mesmo hash e não modificou `dist/`.

## D018 — Separar arquivo, conteúdo e acesso humano na validação

O Chromium remoto bloqueou `file://` com `ERR_BLOCKED_BY_ADMINISTRATOR`: 20 testes de navegação foram impedidos antes da aplicação; um check de checksum passou. Nenhuma política ou verificação de segurança foi desativada. Para verificar o conteúdo, `GAME_TEST_FILE` fornece o HTML por roteamento em memória com contexto offline, usando origem reservada `.invalid` exclusivamente de teste. Isso não é prévia web e não certifica abertura real de arquivo no computador do usuário.

A validação final separa: 19 casos Vite/HTTP, 21 do HTML em memória, e a abertura direta/humana ainda pendente. `npm run validate` foi adicionado como alias do validador de assets para corresponder ao comando pedido, sem duplicar lógica ou alterar lockfile. Ver [evidências da Etapa 3](evidence/2026-10-25-stage-3-interactive-review.md).

## Fontes técnicas consultadas

- [Phaser 3.90.0 — Arcade Body](https://github.com/phaserjs/phaser/blob/v3.90.0/src/physics/arcade/Body.js), conferido também no pacote instalado para `reset`, `updateFromGameObject` e `postUpdate`.
- [Phaser 3.90.0 — package](https://github.com/phaserjs/phaser/blob/v3.90.0/package.json), [BaseCamera](https://github.com/phaserjs/phaser/blob/v3.90.0/src/cameras/2d/BaseCamera.js), [ScaleManager](https://github.com/phaserjs/phaser/blob/v3.90.0/src/scale/ScaleManager.js).
- [Vite — guia](https://vite.dev/guide/), [linha 7.3.1](https://github.com/vitejs/vite/blob/v7.3.1/packages/vite/package.json).
- [Codex Cloud — documentação oficial](https://learn.chatgpt.com/docs/cloud).
