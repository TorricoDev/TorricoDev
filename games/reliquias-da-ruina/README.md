# Relíquias da Ruína

Protótipo inicial de roguelite medieval em **Phaser 3 + JavaScript + Vite**. Uma sala fixa e um laboratório de animações separado, com personagem provisório e contratos compartilhados. Movimento em oito direções, colisões e animações configuradas por manifest; combate e progressão ainda não implementados.

## Situação da entrega

A sala e o Laboratório de Animações foram executados no Codex Cloud, na branch `codex/roguelite-bootstrap-2026-10-23`. Na Etapa 3 passaram 36 testes Node, 19 de navegador sobre Vite e 21 sobre o conteúdo HTML com rede desativada, além de check, assets e build. A abertura direta `file://` foi bloqueada pelo navegador gerenciado e continua separada desses resultados. Veja [acesso e revisão interativa](docs/INTERACTIVE_REVIEW.md), [estado atual](docs/PROJECT_STATUS.md) e [evidências da Etapa 3](docs/evidence/2026-10-25-stage-3-interactive-review.md).

Destino: repositório `TorricoDev/TorricoDev`, pasta `games/reliquias-da-ruina/`, [PR #1](https://github.com/TorricoDev/TorricoDev/pull/1). O conector desta tarefa identifica o ambiente como **TorricoDev**; documentos históricos registram também o nome Mark10. Confira o vínculo do executor e a branch, sem depender apenas do nome exibido. O README de perfil e a `main` continuam preservados.

## Executar no Codex Cloud

**Para a pessoa revisar sem instalar software:** usar o HTML único entregue na conversa, conforme [este roteiro](docs/INTERACTIVE_REVIEW.md). Não há URL de prévia privada confirmada nesta sessão; salvar/exportar o arquivo pelo cliente é um pré-requisito. Os comandos abaixo são para o executor Cloud, não para o computador do usuário.

1. No ambiente associado ao repositório acima, selecionar a branch `codex/roguelite-bootstrap-2026-10-23` (ou `main` depois da integração do PR). O projeto fica em `games/reliquias-da-ruina/`.
2. Selecionar o executor **Cloud** associado a esse repositório e iniciar o trabalho na branch do jogo. Executar `cd games/reliquias-da-ruina` a partir da raiz clonada. Se o ambiente estiver Unpublished, concluir sua preparação e publicar o ambiente antes de iniciar a tarefa. Essa publicação disponibiliza o executor de desenvolvimento.
3. Usar Node **22.12 ou superior**. O `package-lock.json` já foi gerado pelo npm e validado. Usar `npm ci` para instalar as versões resolvidas; `npm install` fica reservado a atualizações intencionais, preservando o lockfile. Liberar acesso ao registro npm no setup se necessário.
4. Pedir ao Codex para executar:

```sh
npm run check
npm test
npm run validate
npm run build
```

5. Para desenvolvimento e testes internos, executar **somente no Cloud**:

```sh
npm run dev -- --host 127.0.0.1 --port 5173
```

O endereço de loopback fica restrito ao executor. Não instruir o usuário a abrir essa porta no computador nem presumir um botão de encaminhamento que esta sessão não oferece. Não publicar o site para contornar a limitação. `npm run build:review` gera a alternativa HTML em `dist-review/`, sem modificar `dist/` ou iniciar servidor.

Para integração, usar o Chromium já instalado no executor com `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`, quando esse caminho existir. Caso contrário, instalar o navegador no Cloud com `npx playwright install chromium` e usar o padrão do Playwright. Com o servidor remoto em execução:

```sh
GAME_TEST_URL=http://127.0.0.1:5173 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

O Playwright não inicia servidor automaticamente. Para validar o build, usar `npm run preview -- --host 127.0.0.1 --port 4173` no Cloud e apontar `GAME_TEST_URL` para a porta 4173. A suíte foi executada em desenvolvimento e no build de produção. O acesso interativo por encaminhamento de porta não está disponível nas ferramentas desta tarefa; as URLs de loopback são apenas destinos internos dos testes remotos.

Para continuar pelo celular, selecionar o ambiente Cloud já configurado e enviar tarefas. O computador pode ficar desligado. A sincronização com arquivos locais depende do Git. [Documentação oficial do Codex Cloud](https://learn.chatgpt.com/docs/cloud).

## Controles

Na aplicação, **01 / Sala jogável** abre a sala; **02 / Laboratório de animações** abre a galeria em `?view=animations`. O laboratório oferece as oito direções simultâneas, pausa, seleção/avanço de quadros, velocidade local, zoom inteiro de 1× a 8×, três fundos e guias de grade/pivô/baseline/hitbox. Existe hoje apenas um personagem no catálogo. Veja [como abrir e usar o laboratório](docs/ANIMATION_LAB.md).

| Entrada | Ação |
| --- | --- |
| WASD ou setas | Movimento normalizado em oito direções |
| P / Escape / botão | Pausar ou continuar |
| R / botão | Voltar ao spawn, olhando para sul |
| F1 | Mostrar colisões |
| Perder foco da janela | Limpar teclas e pausar; P continua |

Nesta etapa o jogo exige teclado. Desenvolvimento pelo celular é possível no Cloud; controles de toque para jogar são uma etapa futura.

## Estrutura

```text
src/
  main.js                 inicialização e escala inteira
  scenes/                 carregamento, sala de testes e laboratório separado
  core/                   direção, estados e contrato de animação (sem Phaser)
  input/                  adaptador de teclado
  entities/               jogador e camadas visuais
  animation/              registro e reprodução por manifest
  rooms/                  template e colisores da sala
  assets/                 manifests e catálogo compartilhado de personagens
public/assets/actors/     PNGs RGBA originais gerados no projeto
tools/                    geração, codec PNG e validadores sem dependências
tests/                    testes de lógica/arte e integração de navegador
docs/                     design, decisões, estado e próximas etapas
```

`npm run generate:placeholders` regenera apenas os PNGs provisórios a partir de código. Não executar sobre artes definitivas: elas terão manifest e arquivos próprios.

Documentação principal: [GDD](docs/GDD.md), [pipeline artística](docs/ART_PIPELINE.md), [animações](docs/ANIMATION_SPEC.md), [próximos passos](docs/NEXT_STEPS.md). Os dois documentos históricos da raiz foram preservados.
