# Relíquias da Ruína

Protótipo inicial de roguelite medieval em **Phaser 3 + JavaScript + Vite**. Uma sala fixa, personagem provisório, movimento em oito direções, colisões e animações configuradas por manifest. Etapa 0; combate e progressão ainda não implementados.

## Situação da entrega

As fontes foram preparadas no workspace do Codex Desktop. O executor desta conversa é Windows local, não o ambiente Cloud **TorricoDev** informado pelo usuário. Não foram instaladas dependências nem iniciados servidores nesse computador. Verificações sem dependências usam o Node já incluído no Codex. Consulte [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) para resultados e pendências, inclusive build e prévia.

O usuário autorizou o envio ao repositório público `TorricoDev/TorricoDev`. Destino desta base: branch `codex/roguelite-bootstrap-2026-10-23`, pasta `games/reliquias-da-ruina/`, com revisão por pull request e preservação do README de perfil e da `main`. Selecionar essa branch no Cloud enquanto o PR não estiver integrado. Criar um ambiente Cloud não sincroniza automaticamente arquivos locais nem troca o executor desta conversa.

## Executar no Codex Cloud

1. No ambiente associado ao repositório acima, selecionar a branch `codex/roguelite-bootstrap-2026-10-23` (ou `main` depois da integração do PR). O projeto fica em `games/reliquias-da-ruina/`.
2. Selecionar **Work in → Cloud → TorricoDev** e iniciar o trabalho nesse repositório/branch. Executar `cd games/reliquias-da-ruina` a partir da raiz clonada.
3. Usar Node **22.12 ou superior**. No setup remoto, executar `npm install` e guardar o `package-lock.json` gerado; nas próximas execuções, usar `npm ci`. Liberar acesso ao registro npm no setup se necessário.
4. Pedir ao Codex para executar:

```sh
npm run check
npm test
npm run validate:assets
npm run build
```

5. Se o ambiente oferecer prévia de portas, executar **somente no Cloud**:

```sh
npm run dev -- --port 5173
```

Abrir a prévia da porta 5173 pela interface do ambiente. Uma URL de localhost do executor remoto não abre diretamente no celular/computador sem um recurso de encaminhamento. A disponibilidade dessa prévia deve ser confirmada em cada ambiente. Sem suporte, registrar a limitação; não publicar o site para contorná-la.

Para os testes de integração, no Cloud instalar Chromium via `npx playwright install chromium` (e dependências do sistema, se exigidas pelo container). Com a prévia remota em execução:

```sh
GAME_TEST_URL=http://127.0.0.1:5173 npm run test:browser
```

O Playwright não inicia servidor automaticamente. Para validar o build, usar `npm run preview -- --port 4173` no Cloud e apontar `GAME_TEST_URL` para a porta 4173. Os testes de navegador ainda não foram executados nesta sessão.

Para continuar pelo celular, selecionar o ambiente Cloud já configurado e enviar tarefas. O computador pode ficar desligado. A sincronização com arquivos locais depende do Git. [Documentação oficial do Codex Cloud](https://learn.chatgpt.com/docs/cloud).

## Controles

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
  scenes/                 carregamento e sala de testes
  core/                   direção, estados e contrato de animação (sem Phaser)
  input/                  adaptador de teclado
  entities/               jogador e camadas visuais
  animation/              registro e reprodução por manifest
  rooms/                  template e colisores da sala
  assets/traveler.json    contrato dos spritesheets provisórios
public/assets/actors/     PNGs RGBA originais gerados no projeto
tools/                    geração, codec PNG e validadores sem dependências
tests/                    testes de lógica/arte e integração de navegador
docs/                     design, decisões, estado e próximas etapas
```

`npm run generate:placeholders` regenera apenas os PNGs provisórios a partir de código. Não executar sobre artes definitivas: elas terão manifest e arquivos próprios.

Documentação principal: [GDD](docs/GDD.md), [pipeline artística](docs/ART_PIPELINE.md), [animações](docs/ANIMATION_SPEC.md), [próximos passos](docs/NEXT_STEPS.md). Os dois documentos históricos da raiz foram preservados.
