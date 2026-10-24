# Pipeline artística

## Contrato atual

Placeholder original em `public/assets/actors/traveler/`, com manifest em `src/assets/traveler.json`. O jogo carrega os PNGs pelo BootScene; o AnimationDriver registra as ações a partir do manifest. Substituir arte não exige alterar o controlador de movimento, desde que o contrato seja respeitado.

| Categoria | Célula | Política inicial |
| --- | --- | --- |
| Corpo | 48×48 | Silhueta alvo ~32×32; pivô [24,40]; baseline 39; alpha binário |
| Arma | 64×64 | Camada e pivô próprios; oito direções para assimetria |
| Efeito | 64×64 | Camada própria; alpha graduado somente quando declarado |
| Tile | 16×16 | Grade do cenário; ainda desenhado por Graphics no protótipo |

As três últimas categorias são convenções planejadas. O importador e validador atuais são destinados a atores direcionais com oito orientações; não passar tiles ao contrato de ator. Criar o contrato específico de tiles quando houver arte de cenário real.

## Exportação por ação

- PNG RGBA de 8 bits por canal, sem entrelaçamento. Sem JPEG, paleta indexada ou reescala suavizada.
- Colunas = quadros, linhas = direções declaradas. Não colocar intervalos, padding externo ou separadores no atlas.
- Dimensão exata: `cellWidth × frames` por `cellHeight × directions.length`.
- Margem transparente de pelo menos um pixel em cada célula, incluindo cabelo, mãos e equipamento.
- Corpo com alpha 0/255; alinhar os pés em y=39, pivô [24,40]. A oscilação acontece no desenho do corpo, sem deslocar a entidade física.
- Armas e efeitos separados. Offsets futuros serão dados por direção/ação/quadro, revisados com o pivô. Nenhuma arma é implementada aqui.

## Fluxo de produção

1. Definir uma model sheet com frente, costas, perfil e diagonais. Preservar silhueta, paleta e escala.
2. Aprovar quadros-chave; construir poucos intermediários. Não solicitar um spritesheet final extenso de uma só vez.
3. Exportar a ação em PNG e registrar célula, pivô, linhas, contagem, FPS, loop, alpha e origem no manifest.
4. Validar com `npm run validate:assets`. O comando lê todos os manifests JSON em `src/assets/` e os PNGs correspondentes.
5. Carregar pelo registro de animações. Somente conjuntos simétricos permitem `mirrorSafe` e aliases; não espelhar armas assimétricas ou trocar a mão dominante sem uma decisão explícita.
6. Rever em movimento no navegador e no laboratório; conferir as oito orientações, contraste, alinhamento e recortes. Equipamento continua fora da visualização desta etapa. Registrar aprovação humana antes de chamar arte de definitiva.

Os arquivos-fonte editáveis poderão entrar em `art/source/` e paletas em `art/palettes/` quando existirem. Não há dependência de editor de arte instalado no computador do usuário.

## Ferramentas entregues e seus limites

- `tools/generate-placeholders.mjs`: monta deterministicamente os dois PNGs provisórios. Não é um importador geral de quadros de produção.
- `tools/png.mjs`: codec limitado ao contrato RGBA; lê filtros PNG 0–4 e verifica CRC. Falha em formatos não suportados para evitar aprovação silenciosa.
- `tools/validate-assets.mjs`: verifica dimensões exatas, frames, margem transparente, alpha e baseline em cada célula; valida também manifests e aliases.
- `tests/assets.test.js`: regressões para corrupção, filtros, recortes, desalinhamento, células vazias e alpha intermediário.

Esses checks não detectam um rosto voltado para o lado errado, inversão de mão, pé deslizando, cintilação, paleta ruim ou animação pouco expressiva. Também não substituem a revisão visual. Montador geral, detecção de paleta e relatório de ocupação ficam para a etapa de arte real.

## Laboratório visual disponível

`AnimationLabScene` reutiliza manifests e AnimationDriver, com seleção de ator/ação, oito direções simultâneas, playback, pausa e avanço de um quadro, multiplicador local de velocidade e zoom inteiro de 1× a 8×. Fundos claro/escuro/quadriculado e guias de grade, pivô, baseline e hitbox ajudam a inspecionar o corpo provisório. A UI informa quadros, FPS, dimensões, alpha e espelhamentos. A seleção de arma/efeitos continua futura; não há arte definitiva. Ver [guia de uso](ANIMATION_LAB.md).

[Referência SLYNYRD](https://www.slynyrd.com/blog/2025/3/24/pixelblog-55-top-down-character-animation): material de estudo de animação direcional; não reutilizar os assets sem licença.
