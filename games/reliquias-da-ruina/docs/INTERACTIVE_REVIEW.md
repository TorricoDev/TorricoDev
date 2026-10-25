# Acesso e revisão interativa — Etapa 3

## O que está disponível nesta sessão

Não foi disponibilizada uma URL de prévia privada/encaminhamento de portas pelas ferramentas do Codex desta tarefa. A resposta mais recente do usuário também informa que esse recurso não aparece na interface. O navegador remoto do Playwright e o servidor de loopback são recursos internos de teste; eles não fornecem um endereço acessível no computador do usuário.

A alternativa preparada é **um arquivo HTML autossuficiente**, com Phaser, código do jogo, CSS e os PNGs originais incorporados. Não precisa de servidor, npm, extensão, instalação de software ou conexão de rede para executar seu conteúdo. O arquivo é gerado no Cloud e fica fora do Git público. O usuário confirmou que os links de workspace desta conversa não abrem/aparecem em seu cliente. As ferramentas atuais não têm operação para anexar HTML/ZIP diretamente. Portanto, o arquivo está pronto no executor, mas sua entrega privada ao computador ainda não está resolvida; não apresentar outro caminho de workspace como download garantido.

## Captura recebida e download do visualizador

A captura do usuário mostra uma visualização intitulada “Index”, sem estilos, parada em CARREGANDO e com aviso de erro. Ela contém um ícone de download no canto superior direito. Não é possível concluir apenas pela captura qual arquivo será exportado ou se o visualizador bloqueou seus recursos.

- O pacote HTML completo desta entrega tem **1.246.660 bytes** (cerca de 1,25 MB), um bloco de CSS e sprites incorporados.
- O `index.html` fonte do projeto tem cerca de **6 KB**, não contém CSS incorporado e importa `/src/main.js`; precisa do Vite. Baixar esse index isolado não entrega o jogo executável.
- Se o botão exportar o HTML completo, abrir a cópia no navegador conforme abaixo. Se exportar apenas o index pequeno ou não salvar nada, será necessário um recurso oficial de exportação ou outro canal privado autorizado. Não foi habilitado esse canal por esta integração.

Foi preparado também um ZIP privado de **344.999 bytes**, contendo o mesmo HTML, instruções e checksum. A integridade do ZIP e o hash do HTML foram verificados. Sua existência no workspace não constitui um download disponível ao usuário. [Registro do acompanhamento](evidence/2026-10-25-interactive-review/delivery-followup.json).

## Abrir o arquivo no computador, após recebê-lo

1. Salvar uma cópia do **HTML de revisão fornecido na conversa** como `reliquias-da-ruina.html`. Não salvar apenas o link, uma captura ou a página da conversa.
2. Abrir o arquivo salvo com um navegador moderno, preferencialmente Chrome ou Edge. Pode usar **Ctrl+O** no navegador e selecionar o HTML; no macOS, **Cmd+O**.
3. A sala deve iniciar com o personagem no centro. Clicar na área do jogo se o teclado estiver sem foco.
4. Usar **01 / Sala jogável** e **02 / Laboratório de animações** para alternar. A navegação permanece no mesmo arquivo, mudando apenas a consulta da URL.

Não há um site público ou um novo painel de jogo criado por esse procedimento. Uma visualização de código no Codex ainda exige salvar uma cópia do HTML e abri-la como página no navegador. Se o cliente não permitir baixar/exportar o arquivo, o acesso humano permanece bloqueado por essa etapa de transferência; não há um link remoto alternativo confirmado nesta sessão.

**Limite verificado:** o Chromium gerenciado do executor bloqueia navegação direta `file://` com `ERR_BLOCKED_BY_ADMINISTRATOR`. Nenhuma política ou flag foi alterada. O conteúdo do HTML passou em testes offline com a resposta do documento fornecida em memória, mas isso **não certifica a abertura direta de arquivo no navegador do usuário**. Navegadores corporativos também podem aplicar restrições próprias. Não é necessário nem recomendado desativar proteções para testar esta entrega.

## Roteiro de revisão humana

| Área | O que experimentar | Resultado humano |
| --- | --- | --- |
| Sala | WASD/setas nas oito direções; observar diagonal sem ganho de velocidade | Pendente |
| Sala | Aproximar dos quatro limites e dos cinco obstáculos; conferir pés e oclusão | Pendente |
| Sala | P/Escape e botão de pausa; R e botão de reinício; perder e recuperar foco | Pendente |
| Laboratório | Idle/move, oito orientações, aliases NW/W/SW, pausa e avanço/retorno de quadros | Pendente |
| Laboratório | Velocidade, timeline, zoom 1×–8× e rolagem | Pendente |
| Arte | Fundos claro/escuro/quadriculado, grade, pivô, baseline, hitbox, margens e transparência | Pendente |
| Apresentação | Nitidez, alinhamento, cortes, fluidez e resposta dos controles | Pendente |

Há um personagem provisório, com idle e move. O jogo exige teclado; não há controles de toque. Os testes automatizados não preenchem a coluna de avaliação humana.

## Gerar novamente — somente no Cloud

No diretório `games/reliquias-da-ruina/`:

```sh
npm ci
npm run check
npm test
npm run validate
npm run build
npm run build:review
```

O build normal continua em `dist/`. O HTML fica em `dist-review/reliquias-da-ruina.html`, com tamanho e SHA-256 em `dist-review/metadata.json`. `dist-review/` é ignorado pelo Git; não publicar esse artefato em Releases, Pages, túneis ou hospedagem sem autorização específica. Na entrega desta tarefa, uma cópia também foi colocada no workspace de artefatos, indicada na conversa.

`build:review` usa o Vite já instalado, sem novo plugin/dependência. Gera um único script IIFE, incorpora o CSS e usa URLs `data:` dos PNGs originais. A inicialização aguarda o documento estar pronto, preservando o momento de boot do módulo original. A política do HTML limita seus recursos ao conteúdo incorporado. O caminho de desenvolvimento Vite e suas URLs normais permanecem preservados.

## Reproduzir os testes remotos

Para o build normal, iniciar no Cloud `npm run preview -- --host 127.0.0.1 --port 4173`, e executar em outra sessão:

```sh
GAME_TEST_URL=http://127.0.0.1:4173 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

Para o conteúdo HTML, sem iniciar servidor:

```sh
GAME_TEST_FILE=dist-review/reliquias-da-ruina.html PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

Esse segundo modo lê o HTML e fornece seu documento por roteamento em memória do Playwright, com contexto offline. A origem reservada `.invalid` presente nos fixtures é somente uma identificação de teste: não existe como prévia e não deve ser oferecida ao usuário como endereço. Os mesmos testes da sala/laboratório são executados, mais checks de integridade/portabilidade do conteúdo. A navegação real `file://` continua registrada separadamente como bloqueada pelo ambiente.

## Avançar para combate

Recomendação: **aguardar a revisão humana desta base** e resolver eventual falha de transferência/abertura antes de iniciar combate. Depois da aceitação e de novo pedido, limitar a próxima etapa ao experimento já planejado. Manter PR #1 em rascunho e sem merge automático.
