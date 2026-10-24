# Laboratório de Animações

## Abrir no Cloud

No executor remoto, entre em `games/reliquias-da-ruina/` e inicie `npm run dev -- --host 127.0.0.1 --port 5173`. Na aplicação, selecione **02 / Laboratório de animações**. A rota é `?view=animations`; **01 / Sala jogável** retorna à sala em `?view=room`. As rotas escolhem cenas separadas e recarregam a aplicação, sem manter entrada ou física da outra cena.

Para testar o build, use `npm run build` e `npm run preview -- --host 127.0.0.1 --port 4173` no Cloud. URLs de loopback são destinos internos do executor; não são prévias públicas. O acesso interativo pela interface depende do encaminhamento de portas oferecido pelo ambiente. Nesta tarefa, a validação visual usa Chromium remoto via Playwright; nenhum servidor deve ser iniciado no computador do usuário.

## Controles

| Controle | Comportamento |
| --- | --- |
| Personagem | Lista manifests corporais do catálogo compartilhado; atualmente existe apenas `traveler-placeholder` |
| Animação | Lista as ações do manifest selecionado: hoje `idle` e `move` |
| Pausar / Reproduzir | Congela ou retoma os oito sprites juntos |
| ← / → | Volta ou avança exatamente um quadro e pausa; os extremos circulam |
| Quadro | Seleciona diretamente um quadro; também pausa |
| Velocidade | 0,25×, 0,5×, 1×, 1,5×, 2× ou 4×; altera apenas a instância em inspeção |
| Zoom | Escala inteira de 1× a 8×; permanece escolhida após redimensionar a janela |
| Fundo | Claro, escuro ou quadriculado para conferir silhueta, contraste e alpha |
| Grade de 8 px | Exibe o limite da célula e divisões a cada oito pixels |
| Pivô | Cruz coral no `footAnchor` |
| Baseline | Linha verde no último pixel de pé definido por `baselineY` |
| Hitbox | Retângulo dourado que referencia o corpo configurado no jogo; não cria física |

As oito direções aparecem sempre na ordem **N, NE, E, SE / S, SW, W, NW**, sincronizadas no mesmo quadro. Abaixo da galeria, cada direção informa sua base e se é espelhada. O quadro exibido vem da animação real do Phaser, não de um contador independente. Ao trocar de personagem/animação, o quadro volta ao primeiro, mantendo o estado de pausa e a velocidade escolhida.

Em zoom alto, use as barras de rolagem da galeria; a imagem não é reduzida para caber. Telas menores também podem exigir rolagem da página para acessar controles e dados.

## Inspecionar arte

1. Pause, selecione a ação e avance quadro a quadro. Compare as oito silhuetas e as direções espelhadas.
2. Ative pivô e baseline para identificar deslocamento dos pés entre quadros; a geometria vem do manifest.
3. Ative a grade e use zoom alto para observar margens e pixels cortados nas bordas da célula.
4. Alterne entre os três fundos: o quadriculado evidencia transparência, e os sólidos ajudam a conferir contornos e contraste.
5. Compare FPS original/efetivo, dimensões de célula/sheet, quantidade de quadros, loop, alpha e aliases no painel. A velocidade de teste não salva alterações na arte ou no manifest.

O laboratório facilita a inspeção; não aprova automaticamente fluidez, mão dominante, autoria/licença ou qualidade estética. `npm run validate:assets` continua verificando PNG RGBA, dimensões, margens, alpha e alinhamento estrutural. Slots de arma/efeitos não foram adicionados à visualização nesta etapa, e nenhuma arte definitiva foi criada.

## Catálogo e contratos

`src/assets/actor-catalog.js` descobre os JSONs em `src/assets/`, aplica `validateManifest` e inclui os de categoria `body`, com IDs únicos. O Boot carrega os sheets e registra suas animações com a mesma função usada pela sala. Para incluir outro personagem, adicionar seu manifest v1 e PNGs compatíveis, validar os assets e reconstruir. A seleção não importa arquivos arbitrários do computador nem cria personagens novos.

`AnimationLabScene` cria sprites visuais sem Arcade Bodies. Reutiliza `AnimationDriver` para reprodução, pausa, tempo local e seleção de quadros; não mantém um segundo relógio de animação. O `timeScale` pertence a cada sprite, sem alterar `frameRate`, o manifest ou a velocidade física.

A hitbox provisória do viajante referencia `PLAYER_BODY`, que a sala já utiliza. Um personagem sem perfil de corpo exibe **Não configurada** e tem a guia de hitbox desabilitada. Não inferir corpo a partir do alpha nem adicionar campos ao schema para contornar essa ausência. O espelhamento visual segue o manifest e não altera a hitbox de referência.

## Verificar

Execute check, testes Node, validação de assets e build conforme o README. Com o build servido no Cloud:

```sh
GAME_TEST_URL=http://127.0.0.1:4173 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

`tests/browser/animation-lab.spec.js` cobre os controles, os frames e aliases reais, velocidade, pixels das guias/fundos, zoom, navegação e captura completa em DPR 2. A suíte existente da sala permanece como regressão. Os resultados e capturas desta entrega ficam em `docs/evidence/2026-10-23-animation-lab/`; consulte o estado atual para as contagens efetivamente executadas.
