# Próximos passos

## 1. Concluir validação no Cloud

**Bloqueio confirmado nesta auditoria:** a conversa atual permanece no Desktop. Os checks puros passaram novamente, mas instalação, lockfile, build e navegador não foram executados remotamente. Não iniciar o Laboratório de Animações com base nesses resultados parciais.

Usuário autorizou uma nova tarefa Cloud. Identificar o ambiente TorricoDev pelo link das configurações antes de enviá-la; o seletor do CLI verificado não o apresentou. Não criar em um ambiente diferente nem afirmar que o envio foi concluído sem obter o identificador/URL da tarefa criada.

- Destino autorizado: repositório público `TorricoDev/TorricoDev`, branch `codex/roguelite-bootstrap-2026-10-23`, subpasta `games/reliquias-da-ruina/`. O ambiente informado se chama TorricoDev.
- Abrir tarefa nesse ambiente e selecionar a branch do jogo, entrando na subpasta. Instalar dependências remotamente, gerar/guardar `package-lock.json` e repetir check, testes, validação de assets e build do README.
- Antes de instalar, registrar `pwd`, `git branch --show-current`, `git rev-parse HEAD`, `node --version` e `npm --version`, comprovando o executor remoto e a branch solicitada. A pasta Desktop sem `.git` não atende a essa confirmação.
- Executar `npm install` preservando lockfile existente, caso ele tenha sido criado por outra tarefa. Na árvore auditada não havia lockfile. Guardar o arquivo gerado e os logs; não criar um lockfile manualmente.
- Confirmar suporte a prévia de porta. Executar testes Playwright remotos e revisão visual da sala. Sem suporte a visualização, registrar o impedimento com os resultados disponíveis.
- Verificar WASD/setas, teclas opostas, oito direções, diagonal, colisões nos cinco obstáculos e nos quatro limites, F1, reset, pausa, perda/retorno de foco e resize 1×/2×/3×.
- Verificar camadas e oclusão ao passar à frente/atrás dos pilares, pés e baseline, nitidez e legibilidade a 100% de escala lógica. Capturar evidência apenas de execução real.
- Registrar no PR #1 as correções, saídas dos comandos, versão do navegador, screenshots/traces e limitações. Manter o rascunho enquanto houver validação pendente; não fazer merge automático.

Os testes de navegador atuais cobrem boot, oito orientações com retorno a idle, limite direito/altar e pausa/reset/perda de foco. Eles ainda não substituem a verificação de deslocamento nas oito direções, velocidade diagonal real, todos os obstáculos/limites, mudança de viewport e inspeção visual da nitidez. Executar essas verificações e registrar lacunas sem marcá-las como aprovadas.

## 2. Construir o laboratório de animações

Prioridade depois do primeiro build aprovado: cena com seleção de ação/direção, galeria das oito orientações, grade/pivô/hitbox, frame stepping, zoom inteiro e fundos variados. Reutilizar os mesmos contratos e controlador de animações. Depois validar uma única base artística real antes de produzir muitos quadros.

## 3. Primeiro experimento de combate

Somente após pedido/aceitação da base: mira contínua, uma espada, um alvo e uma esquiva. Hitboxes e janelas de ataque independentes da arte, arma e VFX em camadas separadas. Medir resposta e legibilidade antes de adicionar arma à distância.

## 4. Vertical slice posterior

Inimigos, chefe, templates e geração por seed, recompensas, vitória/derrota e save local entram incrementalmente após uma sala de combate validada. Run de 5–15 minutos é alvo de design; nenhum tempo de partida foi medido nesta entrega.

## Prompt para continuar no ambiente TorricoDev

> No ambiente Cloud TorricoDev, use o repositório TorricoDev/TorricoDev e a branch codex/roguelite-bootstrap-2026-10-23. Entre em games/reliquias-da-ruina e leia AGENTS.md e docs/PROJECT_STATUS.md. Confirme que o executor é Cloud. Preserve arquivos existentes e não configure hospedagem pública, serviços pagos ou infraestrutura externa. Execute a instalação remota de package.json, guarde o lockfile e rode npm run check, npm test, npm run validate:assets e npm run build. Se houver navegador/prévia disponível, execute os testes de integração e valide visualmente a sala. Corrija os problemas encontrados e atualize o status com evidências reais. Não amplie o escopo para combate ou arte final nesta validação.
