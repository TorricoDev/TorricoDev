# GDD — RELÍQUIAS DA RUÍNA (nome provisório)

**Versão:** 0.1 • **Data:** 23/10/2026 • **Status:** proposta inicial baseada nas 68 respostas do questionário

> Importante: as escolhas da pessoa idealizadora são registradas na seção A. As seções seguintes incluem recomendações técnicas e criativas, ainda sujeitas a validação com protótipos. Não transformar sugestões em requisitos irreversíveis sem testar.

## 1. Visão do jogo

**Pitch:** Um roguelite de ação medieval-fantástico em pixel art, com arenas top-down, combate rápido em oito direções, esquiva, armas corpo a corpo e à distância, habilidades e chefes de padrões marcantes. A cada partida de 5–15 minutos o jogador combina recompensas aleatórias e evolui, enquanto desbloqueia progressão permanente entre tentativas.

**Pilares de design**
1. **Combate legível e responsivo:** movimentação livre, esquiva confiável, ataques com antecipação visível, ataques dos chefes justos.
2. **Progressão que muda a forma de jogar:** escolhas de melhoria significativas dentro de cada run; melhorias permanentes moderadas.
3. **Arte reutilizável:** pixel art chibi 32×32, direção visual consistente e spritesheets com convenções automáticas.
4. **Partidas enxutas:** tempo-alvo de 5–15 minutos por região, com câmera fixa por sala.
5. **Escopo publicável:** construir um vertical slice de um bioma, depois expandir apenas com base em testes.

**Inspirações declaradas:** Moonlighter (visual e progressão); Kingdom Two Crowns (paletas e atmosfera medieval); Exit the Gungeon (energia do combate). Referências, não cópia de assets ou level design.

## 2. Estrutura da partida (proposta para resolver Q3 ainda aberta)

1. Escolha uma região desbloqueada e uma arma inicial.
2. Entre em uma sequência procedural de **salas pré-desenhadas** conectadas por regras de acessibilidade, sem mudar a câmera dentro de cada arena.
3. Enfrente ondas curtas; ao finalizar uma sala, receba uma opção de evolução ou um recurso.
4. Escolha um aprimoramento entre três opções em pontos predeterminados da run.
5. Enfrente um miniboss opcional (apenas se não comprometer duração) e um chefe final.
6. Receba recompensa, registre recorde e use recursos para desbloqueios persistentes.

**Duração alvo:** iniciante ~12–15 min, experiente ~6–10 min; medir na prática. Cada run percorre **uma região** (não três), preservando o limite de tempo. Para o jogo completo, três regiões disponíveis com identidade própria, desbloqueadas progressivamente.

**Estrutura proposta inicial:** entrada → 4–6 salas de combate → 1 sala de recompensa/descanso → chefe. Definir comprimento após cronometração. Salas de evento devem funcionar sem NPCs ou diálogo.

## 3. Combate, movimentação e controles

### Controles de teclado + mouse (proposta)
- `WASD`: mover livremente em oito direções; normalizar vetores diagonais.
- `Mouse`: apontar livremente em 360°; **representar o corpo em uma das oito orientações visuais**, por quantização angular.
- `Botão esquerdo`: ataque da arma equipada.
- `Botão direito`: habilidade especial.
- `Shift`: esquiva com recarga e curta janela de invulnerabilidade a calibrar.
- `Q` / roda do mouse: alternar arma, caso haja duas equipadas.
- `E`: abrir baús/coletar/interagir; simplificar com coleta automática para itens triviais.

**Cuidado:** ângulo real do projétil e hitbox do golpe usam o vetor de mira, não uma direção visual artificial de 45°; para melee, garantir coerência entre arco visível e hitbox. Em repouso, o personagem preserva a última direção de mira válida. Os oito sprites não implicam somente oito ângulos possíveis de projétil.

### Regras do combate
- Movimento e ataques devem responder imediatamente ao input; sem frames arbitrários de atraso.
- Ataques distinguem `startup` (antecipação), `active` (dano), `recovery` (finalização).
- Chefes apresentam antecipação clara do ataque; esquiva útil, mas sem tornar personagens invencíveis o tempo inteiro.
- Recuo e partículas indicam dano; screen shake mínimo e opcional.
- Colisão e janelas de dano independentes da caixa visual do PNG.
- Não permitir animação de ataque travar o movimento por tempo excessivo; calibrar cancelamentos.
- Cada tipo de inimigo tem um padrão central reconhecível; não exigir IA complexa.

### Armas e habilidades
- MVP: espada curta e arco mágico, uma habilidade ativa, uma esquiva.
- Alvo de lançamento: três armas-base com comportamentos diferentes, três habilidades ativas, aprimoramentos aleatórios que modificam dano, área, projéteis ou risco/recompensa.
- Equipamentos trocáveis: **apenas armas** (escolha expressa), não prometer múltiplos conjuntos de roupas/armaduras.
- Corpo e animações reutilizados entre armas da mesma família, com `WeaponOverlay` e `AttackVFX` separados.

### Progressão
- **Dentro da run:** escolhas entre 3 modificadores; por exemplo, ricochete, sangramento, ataque em arco, troca de alcance por velocidade, projétil extra com penalidade.
- **Entre runs:** desbloqueio de arsenal, opções iniciais e pequenas melhorias. Manter dificuldade desafiadora; privilegiar variedade em vez de crescimento permanente ilimitado de atributos.
- Permitir combinações fortes, mas estabelecer limites anti-loop e testes de balanceamento.

## 4. Mundo e geração procedural

**Tema:** fantasia medieval aventureira, sem história principal ou NPCs; ambientação via arquitetura, objetos e cores.

**Regiões finais propostas (nomes temporários):**
1. **Bosque das Ruínas**: vegetação, pedras e fortificações cobertas de musgo; criaturas da floresta.
2. **Fortaleza das Brasas**: muralhas, forjas, cinzas e máquinas antigas.
3. **Cripta dos Ecos**: pedras frias, cristais e sombras, com boa legibilidade dos projéteis.

Para o vertical slice, construir somente o Bosque. O sistema procedural organiza **templates manuais** com marcadores de portas, pontos de spawn e áreas livres para esquiva. Gerador determinístico por `seed`; validar conectividade, acessibilidade do chefe e spawns fora da área inicial. Não usar geometria aleatória solta que bloqueie progressão.

**Câmera:** fixa por sala, sem alterações de altura; pequenas transições opcionais entre salas. Nenhum salto/plataforma.

**Inimigos:** arte única por tipo, mas compartilhar interfaces, componentes, hitboxes e contratos de sprites. Três arquétipos iniciais: perseguidor corpo a corpo, atirador telegráfico, investidor/dash. Chefe inicial: **Sentinela do Bosque** (nome provisório), com três padrões: investida sinalizada, arco de projéteis e ataque de área com zona segura.

## 5. Bíblia de arte (proposta)

- **Estética:** pixel art moderna equilibrada, proporção chibi, contorno colorido (não preto puro universal), paleta moderada e consistente, luz principalmente embutida nos sprites.
- **Fonte visual:** personagem de **32×32 px** como alvo inicial; spritesheet com célula de **48×48 px** para corpo e movimento. A célula inclui margem transparente para oscilações e equipamentos leves.
- **Tiles base:** 16×16 px, composição em múltiplos; cenários com mistura de tiles e decoração única.
- **Resolução lógica:** 320×180 px (16:9); escalar em fator inteiro sempre que possível, mantendo pixel nítido e barras discretas em janelas incompatíveis.
- **Render:** nearest-neighbor; evitar antialias nos sprites; arredondar posicionamentos visuais para pixels inteiros, com hitboxes e movimento em precisão de ponto flutuante.
- **Paleta de trabalho:** ~32–48 cores principais por conjunto de ambiente, com uso criterioso de variantes; em geral 8–16 cores por personagem comum. Valores a validar na primeira arte-base.
- **Contorno:** variação cromática segundo material/sombra, boa leitura sobre chão de biomas diferentes.
- **Formas:** cabeça grande, braços e pernas curtos legíveis, armas com silhuetas distintas, mínimo ruído de textura.
- **Atmosfera:** no máximo iluminação global sutil por região; efeitos de fogo/água/vegetação com loops de 4–8 frames. Partículas em pixel art e sem suavização.
- **UI:** cartoon ilustrada, com botões grandes e poucos ícones; indicadores de vida, esquiva, habilidade e evolução. Não cobrir área relevante de combate.
- **Som:** orquestral/fantasia, temas curtos em loop e SFX de impacto destacados.

**Regra visual de aceitação:** personagem continua reconhecível a 100% de escala lógica e em movimento, tanto em chão claro quanto escuro. Contraste do projétil inimigo precisa prevalecer sobre decoração.

## 6. Sistema de oito direções e spritesheets

**Ordem canônica de direções:** `N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`. O movimento é livre; a orientação vem do ângulo de mira quando houver mira ativa, senão do movimento, senão da última orientação.

**Base de arte simétrica:** desenhar `N, NE, E, SE, S` e gerar as orientações `NW ← espelhar NE`, `W ← espelhar E`, `SW ← espelhar SE`.

**Exceções:** assimetria forte de cabelo, mão dominante, arma ou escudo pode exigir oito direções desenhadas. Espelhamento nunca pode colocar arma em mão incorreta se isso for regra de personagem. No MVP, evitar assimetria que não agregue jogabilidade.

### Animações por personagem jogador

| Ação | Frames por orientação BASE | Velocidade inicial | Observação |
|---|---:|---|---|
| Idle | 3 | timings variáveis/lentos | respiração e piscada opcional |
| Locomoção | 6 | caminhada 8 FPS, corrida 12 FPS | reutilizar MESMOS frames em velocidades diferentes inicialmente |
| Ataque básico | 4 | ~12–18 FPS, conforme arma | fase startup/active/recovery marcada por dados |
| Esquiva | 2 | sincronizar com duração física | após-imagem/partículas separadas |
| Dano | 1 | evento breve | flash/recuo por código |
| Morte | 4 (1 orientação universal inicialmente) | ~6–10 FPS | animação única evita 8 variantes |

Total sugerido para produção final inicial: `idle 3×5=15; movimento 6×5=30; ataque 4×5=20; esquiva 2×5=10; dano 1×5=5; morte 4×1=4`; **84 desenhos únicos de corpo** (sem contar armas/VFX), antes de variantes. Para prototipagem econômica: idle 1, movimento 4, ataque 4, esquiva 2, dano 1 por 5 bases, morte 4 universal = **64 desenhos**. Implementar o pipeline com placeholders e construir a arte em etapas; não solicitar à IA dezenas de quadros coerentes de uma vez.

**Atlas de locomoção (exemplo):** 6 colunas (frames) × 5 linhas (orientações base `N, NE, E, SE, S`) × 48×48 px = **288×240 px**. Esse arquivo é *fonte artística*, e o jogo apresenta oito direções após espelhamento controlado. Se algum tipo precisar de oito linhas genuínas, o manifest determina isso. Padronizar posição do pé/pivô em todas as células.

**Atlas de ataque (exemplo):** 4 colunas × 5 linhas × 64×64 px = **256×320 px**, apenas quando braço/arma forem desenhados no corpo. Com arma em camada independente, usar célula de 48×48 para corpo e overlay próprio.

**Metadados por ação:** tamanho de célula, frames, linhas/orientações, FPS, `loop`, eixo de espelhamento, posição dos pés (`foot_anchor`), eventos `hit_start`, `hit_end`, `projectile_spawn`, offsets de arma, revisão e fonte. Nunca inferir automaticamente hitbox a partir do alpha do PNG.

### Animações dos inimigos
- Inimigos de combate simples: `idle 1–2`, `move 4`, `attack 3–4`, `hurt 1`, `death 3–4`; criar 4 ou 8 direções conforme a mecânica realmente exigir.
- Boss: frames adicionais somente em antecipações e ataques exclusivos; padrões visualmente marcantes podem vir de partículas, telegraphs e armas, não dezenas de quadros corporais.
- Objetos de cenário: loops de 4–8 quadros, quando necessário; objetos estáticos não precisam de animação.

### Regras de qualidade de sprites
- PNG RGBA com fundo transparente; nenhuma sombra externa borrada.
- Alpha binário 0/255 para pixels de personagem (efeitos especiais podem ter exceções documentadas).
- Pixel grid consistente; sem interpolação ou pixels intermediários artificiais.
- `foot_anchor` consistente e sombras posicionadas em entidade/camada separada.
- Não mover a câmera/posição física do jogador para simular bob da cabeça.
- Não cortar arma/cabelo/pés em células; todas as orientações alinhadas e testadas em preview de rotação.
- Não usar escala não inteira nos sprites artísticos.

## 7. Tecnologia recomendada

**Engine:** Godot 4.x estável, GDScript e renderer **Compatibility** para exportação Web/HTML5. Usar exportação Web single-thread como padrão inicial; WebAssembly/WebGL 2.0 e teste real em navegadores. Evitar C# para Web no Godot 4 no escopo inicial.

**Arquitetura mínima sugerida**

```text
project/
  scenes/
    main.tscn
    player/player.tscn
    enemies/enemy_base.tscn
    rooms/room_base.tscn
    bosses/boss_base.tscn
    ui/hud.tscn
    tools/animation_preview.tscn
  scripts/
    player/player_controller.gd
    combat/weapon_controller.gd
    combat/hitbox.gd
    combat/hurtbox.gd
    animations/direction_resolver.gd
    animations/animation_driver.gd
    procedural/run_generator.gd
    progression/run_upgrades.gd
    progression/meta_progression.gd
    data/animation_manifest.gd
  art/
    source/     # concepção, quadros-base e arquivos editáveis
    exported/   # spritesheets prontos para engine
    palettes/
  data/
    characters/
    weapons/
    rooms/
    upgrades/
  tools/
    build_spritesheets.py
    validate_spritesheets.py
    generate_manifests.py
  tests/
  docs/
    GDD.md
    ART_BIBLE.md
    ANIMATION_SPEC.md
    DECISIONS.md
    AGENTS.md
```

Separar combate e hitboxes da parte visual: o controlador da animação recebe `action`, `facing`, `weapon_class`, `speed`; não deve decidir quanto dano um golpe causa. Qualquer habilidade ou inimigo novo deve ser configurável por recursos/dados, com mínimo de código duplicado.

**Persistência no navegador:** salvar opções, desbloqueios e progresso localmente por API de armazenamento adequada ao Web build; testar após recarregar e considerar limite/limpeza do armazenamento pelo navegador. Sem conta/login (coerente com single-player rápido).

## 8. Pipeline assistida por IA — NÃO confiar em geração de spritesheet completa em uma passada

1. **Brief visual:** gerar conceitos e moodboard (IA como apoio, não como fonte automática de frames finais).
2. **Model sheet:** selecionar UM personagem-base; validar frente, costas, perfil e diagonais; padronizar paleta, silhueta e pivô.
3. **Frames-chave:** desenhar ou corrigir os extremos do movimento primeiro; duplicar e editar poucos quadros intermediários.
4. **Export limpo:** exportar PNG RGBA por quadro/ação/direção, sem interpolação ou redimensionamento suavizado.
5. **Montagem:** `build_spritesheets.py` ordena quadros em atlas determinístico e gera manifest JSON.
6. **Validação automática:** dimensões, transparência, quantidade de quadros, ocupação/cortes, offsets e nomenclatura.
7. **Validação visual:** preview em oito direções e rotação; playback a 1×, 2× e 4× e fundos claros/escuros.
8. **Importação engine:** carregar atlas/frames e aliases de flip; comparar física, telegraph e hitbox com frame certo.
9. **Regressão:** alterações na arte não devem quebrar pivot, colisão, direção, contagem de quadros ou builds Web.

**Exemplo de contrato de arquivo:**

```text
art/exported/player/body/move.png
art/exported/player/body/move.json
art/exported/player/body/idle.png
art/exported/player/body/idle.json
art/exported/player/weapons/sword.png
```

**Exemplo de manifest (ilustrativo):**

```json
{
  "animation": "move",
  "cell_size": [48, 48],
  "frames_per_direction": 6,
  "directions_in_sheet": ["N", "NE", "E", "SE", "S"],
  "mirrors": {"NW": "NE", "W": "E", "SW": "SE"},
  "foot_anchor": [24, 40],
  "fps_walk": 8,
  "fps_run": 12,
  "loop": true
}
```

**Editor de sprites sugerido:** Aseprite (pago) ou LibreSprite (alternativa gratuita), além de scripts Python/Pillow para manipulação e auditoria. Não usar processamento que blurre os pixels.

## 9. Conteúdo e fases de produção

### Etapa 0 — Definir contratos (sem investir em arte final)
- Godot Web com renderer correto, 320×180, scaling inteiro, teclado+mouse.
- Uma sala fixa de teste.
- Controle 8 direções, mira 360°, placeholders 32×32, contador de seed.
- Criação de `AGENTS.md`, `ART_BIBLE.md`, `ANIMATION_SPEC.md`, regras de importação e testes básicos.

### Etapa 1 — Vertical slice jogável
- Um personagem, uma arma melee e uma ranged (ou seleção entre elas).
- Uma esquiva, uma habilidade ativa, HP/dano/hitstop discreto.
- Três tipos de inimigo e um chefe de três padrões.
- Seis layouts manuais de sala combinados proceduralmente.
- Cinco a oito melhorias durante a run, três a cinco desbloqueios permanentes.
- Uma região, efeitos essenciais, HUD, música/SFX provisórios.
- Sessão completa com vitória/derrota, retorno ao menu e save local.

### Etapa 2 — Finalização e publicação pequena
- Polimento das animações: locomoção de seis frames e todos os oito ângulos de exibição.
- Mais variedade de salas/inimigos, balanceamento e acessibilidade básica.
- Segundo bioma; terceiro somente se a estabilidade, o cronograma e os testes permitirem.
- Ao finalizar, publicar build HTML5 com tempos de carregamento e FPS adequados.

**Critério para encerrar escopo:** jogo publicável de um bioma completo com um chefe é preferível a três biomas incompletos. Se a expansão for viável, meta total de três biomas e três chefes.

## 10. Critérios objetivos de aceitação

- Teclas WASD e mira respondem sem atraso perceptível; diagonal não aumenta velocidade.
- Oito orientações visuais estão corretas; espelhamento não quebra equipamento/arma.
- Pixel art mantém nitidez em resoluções comuns; fundos não escondem projéteis.
- Qualquer sprite importado possui manifest válido; verificadores falham em PNGs inválidos.
- Jogador não recebe dano fora de janelas telegráficas por inconsistência visual.
- Salas geradas têm caminho entrada→chefe; spawn não ocorre em paredes ou dentro do personagem.
- Run terminável em 5–15 minutos após ajustes baseados em testes reais.
- Progresso permanente recupera corretamente após recarregar o navegador (limitações do armazenamento explicitadas).
- Build exportado roda em navegador desktop compatível e não depende de C#.
- O sistema aceita adicionar um inimigo e uma nova arma sem reescrever PlayerController.

## A. Resumo fiel das respostas fornecidas (1–68)

1. Roguelite / Roguelike; 2. Rápido e cheio de ação; 3. Ainda não sei; 4. Evolução do personagem; 5. Fantasia medieval; 6. Aventura; 7. Jogo pequeno e completo; 8. Sem história relevante.

9. Top-down de ação; 10. Oito direções; 11. Fixa por sala; 12. Terreno plano; 13. Navegador.

14. Moderno e equilibrado; 15. 32×32 px; 16. Chibi; 17. Contorno colorido; 18. Paleta moderada e consistente; 19. Iluminação simples embutida nos sprites; 20. Cenários de detalhamento moderado; 21. Mistura de silhueta, contorno e animação.

22. Todos os personagens usam base semelhante; 23. Troca de armas apenas; 24. Avaliar método de animação mais simples; 25. Escolher frames de caminhada após testes; 26. Ataques dependem da ação; 27. Movimento fluido, mas econômico; 28. Respiração leve e piscadas; 29. Somente animações essenciais; 30. Espelhar sempre que possível.

31. Movimento livre em todas as direções; 32. Andar, correr e esquivar; 33. Combate corpo a corpo e à distância; 34. Habilidades variadas; 35. Inimigos variados com padrões próprios; 36. Níveis, atributos, habilidades e equipamentos; 37. Roguelite com progressão permanente; 38. Coletar e abrir objetos.

39. Tiles e elementos únicos; 40. Três a quatro biomas; 41. Artes únicas por inimigo; 42. Poucos chefes marcantes; 43. Pixel art com partículas; 44. Recuo e partículas; 45. Loops ambientais de 4–8 frames; 46. Iluminação por horário apenas.

47. Engine recomendada pelo assistente; 48. IA como apoio artístico; 49. Organização de spritesheets conforme arquitetura; 50. Células por categoria; 51. Combinar técnicas de variação; 52. Facilidade de desenvolvimento; 53. Pipeline completa com testes de qualidade; 54. Codex como desenvolvedor principal; 55. Todas as ferramentas de testes de animação.

56. Single-player; 57. 5–15 minutos por partida; 58. Desafiadora; 59. Interface cartoon e ilustrada; 60. Trilha orquestral/fantasia; 61. Sem NPCs; 62. Procedural; 63. Publicar um jogo pequeno.

64. Moonlighter, Kingdom Two Crowns e Exit the Gungeon; 65. Evitar jogo muito poluído, sem fluidez e feio; 66. Chefes com ataques únicos e marcantes, boss fights lendárias; 67. A IA deve gerar a arte, com validação humana; 68. Uma experiência divertida e desafiadora.

## Referências técnicas

- SLYNYRD / Raymond Schlitter, **Pixelblog #55 — Top Down Character Animation** (31 mar. 2025): https://www.slynyrd.com/blog/2025/3/24/pixelblog-55-top-down-character-animation
- Godot: exportação Web: https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html
- Godot: AnimatedSprite2D: https://docs.godotengine.org/en/stable/classes/class_animatedsprite2d.html

**Próxima validação importante:** criar um único personagem-base em cinco orientações artísticas, testar as oito visuais no navegador e concluir 1 sala de combate antes de comissionar toda a arte.
