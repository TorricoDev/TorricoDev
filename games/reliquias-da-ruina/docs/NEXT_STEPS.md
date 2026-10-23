# Próximos passos

## 1. Iniciar o Laboratório de Animações

A Etapa 1 cumpriu os critérios técnicos no Cloud: instalação reproduzível, lockfile, check, 26 testes de lógica/arte, 30 quadros validados, build e 11 testes de navegador sobre o build final. O personagem foi controlado por Playwright em Chromium remoto. Ver [estado atual](PROJECT_STATUS.md) e [evidências](evidence/2026-10-23-stage-1-cloud.md).

Após o pedido do usuário, criar uma cena com seleção de ator/ação/direção, galeria das oito orientações, grade/pivô/hitbox, frame stepping, playback, zoom inteiro e fundos variados. Reutilizar manifest e AnimationDriver. Não implementar combate ou substituir os placeholders por arte definitiva nessa tarefa inicial.

## 2. Revisão humana e PR #1

- Manter o PR #1 em rascunho e sem merge automático até a revisão. Correções, lockfile e resultados ficam versionados na branch `codex/roguelite-bootstrap-2026-10-23`.
- As ferramentas atuais não oferecem prévia encaminhada para uma pessoa jogar. Quando disponível no Cloud, rever resposta dos controles, fluidez, silhueta e oclusão ao passar diante/atrás dos pilares. Essa revisão humana não foi realizada pela automação.
- Outros navegadores, DPRs fracionários e dispositivos físicos permanecem sem teste. Toque e gamepad não pertencem ao escopo atual.
- A API GitHub retornou CONNECT HTTP 403 para `api.github.com`; comentários e descrição do PR precisam desse destino liberado nas configurações de rede. O acesso Git à branch é uma operação distinta.
- Não otimizar ou reestruturar o bundle apenas pelo aviso do Phaser de chunk >500 kB; medir necessidades antes de uma tarefa específica de desempenho.

## 3. Reproduzir a validação no Cloud

Usar o checkout existente `/workspace/TorricoDev`, sem criar worktree: cada tarefa Cloud já é isolada. Confirmar a branch acima, entrar em `games/reliquias-da-ruina/`, ler AGENTS.md e usar Node >=22.12.

```sh
npm ci --cache /workspace/.cache/npm
npm run check
npm test
npm run validate:assets
npm run build
```

Para testar o build no executor remoto, iniciar separadamente:

```sh
npm run preview -- --host 127.0.0.1 --port 4173
```

Com o Chromium remoto instalado no caminho verificado nesta tarefa:

```sh
GAME_TEST_URL=http://127.0.0.1:4173 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

`GAME_TEST_URL` é obrigatório; os testes não iniciam servidor automaticamente. As URLs de loopback são internas ao Cloud, não links públicos ou prévias encaminhadas. O processo precisa ser reiniciado em novas tarefas. Preservar o lockfile e alterações existentes; não repetir geração dos placeholders sem motivo.

## 4. Primeiro experimento de combate

Somente após novo pedido e aceitação da base/laboratório: mira contínua, uma espada, um alvo e uma esquiva. Hitboxes e janelas de ataque independentes da arte, arma e VFX em camadas separadas. Medir resposta e legibilidade antes de adicionar arma à distância.

## 5. Vertical slice posterior

Inimigos, chefe, templates e geração por seed, recompensas, vitória/derrota e save local entram incrementalmente após uma sala de combate validada. Run de 5–15 minutos continua sendo alvo de design; nenhum tempo de partida foi medido nesta entrega.
