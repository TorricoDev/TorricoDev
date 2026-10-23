# Especificação de animações v1

## Direções, estados e responsabilidade

Ordem canônica: `N, NE, E, SE, S, SW, W, NW`. Coordenadas de tela: X positivo para direita, Y positivo para baixo. Normalizar o vetor de entrada antes da velocidade física. Facing é o octante visual mais próximo; vetor nulo preserva o facing anterior, inicialmente S.

Estados implementados: `idle` quando não há intenção de movimento; `move` caso contrário. Pausa congela física e playback, sem criar uma ação artística. Reinício retorna ao spawn em idle/S. Ações futuras (`attack`, `dodge`, `hurt`, `death`) precisarão de prioridades, transições e cancelamentos definidos antes da implementação. Não há combate nem esquiva nesta entrega.

## Spritesheets provisórios

| Ação | Quadros por linha | Linhas | Dimensão PNG | FPS | Loop |
| --- | --- | --- | --- | --- | --- |
| idle | 2 | 5 | 96×240 | 4 | sim |
| move | 4 | 5 | 192×240 | 10 | sim |

Linhas: N, NE, E, SE, S. Aliases horizontais: NW←NE, W←E, SW←SE. O placeholder não representa armas nem mão dominante. Produção real poderá usar oito linhas sem aliases. O GDD histórico propõe idle de 3 quadros e movimento de 6; esses números são alvos futuros, não requisitos do placeholder.

## Manifest executável

Ver `src/assets/traveler.json`:

- `schemaVersion`, `id`, `category` e `cell`: identidade e contrato da célula.
- `directions`: ordem exata das linhas. Cobertura obrigatória das oito orientações por linhas reais ou aliases.
- `mirrors`, `mirrorSafe`: somente espelhamento horizontal de bases diretas e pivô X central. Sem aliases encadeados ou espelhamento vertical.
- `footAnchor`: origem de apresentação da entidade; `baselineY`: último pixel opaco dos pés em cada frame corporal.
- `alphaMode`: `binary` para corpo; `graded` pode ser usado em futuros efeitos.
- `animations[action]`: caminho PNG sob `assets/`, quadros por linha, FPS de 1–60 e loop booleano.
- `provenance`: registrar geração, autoria/licença e posterior revisão.

Texture key: `id:action`. Animation key: `id:action:sourceDirection`. Intervalo de frames: `row × frames` até `(row+1) × frames - 1`. Mirroring seleciona a mesma animação de origem com `flipX` separado. `sprite.play(key, true)` evita reinício contínuo enquanto uma tecla permanece pressionada.

AnimationDriver não altera velocidade, caixa de colisão, dano ou câmera. A física mantém valores fracionários; câmera e apresentação arredondam pixels na renderização. Hitbox atual: 12×8, offset [18,32] dentro da célula; não depende de pixels opacos.

## Extensões planejadas

- FPS de caminhada/corrida como variantes de dados, sem duplicar frames quando desnecessário.
- Eventos de apresentação por frame para áudio e VFX. Startup/active/recovery, dano, cooldown e projéteis precisam de tempo de simulação próprio, sincronizado explicitamente; FPS artístico não controla regra de combate.
- Armas com pivôs/offsets próprios e política de espelhamento independente. Efeitos em camada separada, sem alterar o corpo ou inferir sua colisão.
- Migração versionada do manifest antes de adicionar duração variável de frames, ações sem oito direções ou eventos. O schema v1 não declara suporte a esses recursos.

Validação estrutural está automatizada. Fluidez, direção e nitidez em movimento ainda dependem de revisão visual no Cloud.
