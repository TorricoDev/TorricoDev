# Próximos passos

## 1. Concluir o acesso e a revisão humana

A Etapa 3 gerou um HTML autossuficiente, sem instalação local ou hospedagem pública. O conteúdo passou nos testes offline, mas a abertura direta `file://` foi bloqueada pela política do Chromium remoto. Não há link de prévia privada confirmado nesta sessão. [Método de acesso e limitações](INTERACTIVE_REVIEW.md).

O usuário confirmou que o link do workspace não abre/aparece no cliente. Identificar se o botão de download da visualização entrega o HTML completo de 1,25 MB ou apenas o index fonte de cerca de 6 KB. Ainda é necessário resolver um canal privado de transferência e abrir o arquivo no navegador. A solicitação de abertura de arquivo no painel do Codex foi apenas enfileirada. Não confundir arquivo visível/código com a interface do jogo nem testes Playwright com uso humano. Se o cliente não permitir transferência, será necessário um recurso oficial de exportação/compartilhamento privado ou uma prévia autenticada disponibilizada pelo produto; não criar túneis, links fictícios ou publicação para contornar essa ausência.

Após abrir, revisar movimento/diagonal, colisões e oclusão, pausa/reset/foco e resposta dos controles; no laboratório, quadros, velocidade, guias, alinhamento, transparência, cortes e nitidez. Registrar feedback real. A avaliação humana continua pendente, apesar de 36 testes Node, 19 de navegador Vite e 21 do conteúdo HTML aprovados.

## 2. Preservar o PR e os limites da entrega

- Manter PR #1 em rascunho e sem merge automático até a revisão.
- O HTML em `dist-review/` é ignorado e não deve ser enviado ao repositório público, Pages ou Releases sem autorização específica.
- Não desativar a política de `file://` do navegador gerenciado. O alvo em memória serve apenas para testes do conteúdo; não é um endereço de acesso.
- Outros personagens, navegadores, DPRs fracionários e dispositivos físicos continuam sem teste. Não otimizar/reorganizar o bundle apenas pelo aviso de tamanho do Phaser.

## 3. Reproduzir no Cloud

Usar o checkout existente `/workspace/TorricoDev`, sem worktree, na branch `codex/roguelite-bootstrap-2026-10-23`. Entrar em `games/reliquias-da-ruina/` e executar os comandos de [INTERACTIVE_REVIEW.md](INTERACTIVE_REVIEW.md): `npm ci`, check, testes, validate, build e build:review.

Para testes do Vite, iniciar o preview somente no loopback remoto e definir `GAME_TEST_URL`. Para testar o conteúdo do HTML sem servidor, definir `GAME_TEST_FILE`; a configuração usa rede desativada e respostas em memória. Não declarar esse segundo fluxo como abertura direta de arquivo. `npm run validate` é alias de `validate:assets`; os relatórios antigos pertencem às respectivas etapas, não são o resultado atual.

## 4. Primeiro experimento de combate

Somente após novo pedido e aceitação da base/laboratório: mira contínua, uma espada, um alvo e uma esquiva. Hitboxes e janelas de ataque independentes da arte, arma e VFX em camadas separadas. Medir resposta e legibilidade antes de adicionar arma à distância.

## 5. Vertical slice posterior

Inimigos, chefe, templates e geração por seed, recompensas, vitória/derrota e save local entram incrementalmente após uma sala de combate validada. Run de 5–15 minutos continua sendo alvo de design; nenhum tempo de partida foi medido nesta entrega.
