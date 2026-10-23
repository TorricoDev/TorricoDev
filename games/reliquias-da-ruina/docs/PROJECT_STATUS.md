# Estado do projeto

23/10/2026 · Etapa 1: auditoria iniciada; validação Cloud pendente · modo Auditoria.

## Resultado da Etapa 1

**Ainda não aprovada para iniciar o Laboratório de Animações.** Esta conversa continua no executor Desktop Windows; a criação do ambiente Cloud não alterou esse executor. O usuário renomeou o ambiente de TorricoDev para **Mark10**. Não foi possível confirmar um checkout Cloud, instalar dependências remotamente, compilar nem controlar o jogo no navegador.

A branch remota do PR #1 foi confirmada como `codex/roguelite-bootstrap-2026-10-23`, no commit `0a5c973ce4c9ed6bc293b45b86ec9f3752a973dc`, antes desta atualização documental. As somas Git dos **40 arquivos locais** eram idênticas às dos arquivos sob `games/reliquias-da-ruina/` nesse commit. A pasta local não é um checkout Git; essa confirmação é da branch remota, não uma alegação de checkout local ou Cloud.

Os checks permitidos pelo AGENTS.md foram executados novamente com o Node incluído no Codex: **22 arquivos passaram na verificação de sintaxe, 26 testes passaram sem falhas e 30 quadros passaram na validação estrutural**. Não surgiram falhas nesses checks; não houve correções de código ou mudanças de mecânicas. Evidências e lacunas: [relatório da auditoria](evidence/2026-10-23-stage-1-desktop.md).

O CLI já instalado respondeu à consulta de tarefas Cloud com `tasks: []`; seu seletor não apresentou TorricoDev. A interface web disponível nesta sessão abriu uma página sem login. Essas observações não provam que o ambiente criado pelo usuário inexista; apenas impedem acessá-lo pelos canais verificados. Não houve instalação de dependências, execução de Vite, abertura do jogo, publicação ou merge.

Instalação, lockfile, build e Playwright continuam pendentes. O PR #1 permanece em rascunho. O usuário autorizou criar uma tarefa Cloud separada para esta etapa; o seletor foi reaberto após a mudança para Mark10 e continuou mostrando somente a opção global, sem ambientes nomeados. Falta o link/identificador ou acesso ao ambiente correto. Nenhuma tarefa foi criada ainda. A próxima execução deve partir do ambiente Cloud correto; não repetir esta etapa supondo que uma instrução no chat migre o executor.

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

## Validação do bootstrap e rechecagem da Etapa 1

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

Usuário criou o ambiente inicialmente denominado **TorricoDev**, depois renomeado para **Mark10**, e indicou `https://github.com/TorricoDev/TorricoDev`, branch `main`. O repositório mantém esse nome; a mudança é apenas no nome do ambiente Cloud. O conector confirmou acesso e repositório público contendo apenas README de perfil antes da importação. Usuário autorizou enviar a base em branch de trabalho `codex/roguelite-bootstrap-2026-10-23`, subpasta `games/reliquias-da-ruina/`, preservando perfil/main e usando PR para revisão. Selecionar essa branch para continuar no Cloud. Ainda não houve execução nessa máquina remota; criar o ambiente não migra automaticamente a conversa ou a pasta local.

Envio realizado: **40 arquivos** na subpasta do jogo, disponíveis no [PR #1 em rascunho](https://github.com/TorricoDev/TorricoDev/pull/1). A árvore remota foi conferida: nenhum arquivo ausente, PNGs presentes e SHA do README de perfil idêntico ao original. Nenhuma exclusão; `main` não foi alterada. O PR aguarda build e validação do runtime no Cloud, sem merge automático.

## Fora desta etapa

Combate, esquiva, habilidades, mira de mouse, inimigos, chefes, proceduralidade, progressão, save, toque/gamepad, áudio e arte definitiva. O laboratório de animação está especificado, ainda não implementado. Nenhuma run de 5–15 minutos está disponível.

Próxima ação: concluir validação remota; depois construir o laboratório de animações. Ver [NEXT_STEPS.md](NEXT_STEPS.md).
