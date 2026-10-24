# Relíquias da Ruína — instruções para agentes

## Fonte da verdade e escopo

Leia `docs/PROJECT_STATUS.md`, `docs/DECISIONS.md` e a documentação do sistema alterado antes de editar. O pedido atual do usuário prevalece sobre propostas antigas. Os dois documentos históricos na raiz são preservados; suas referências a Godot e ao vertical slice inteiro foram substituídas pela decisão D001. A base atual inclui uma sala de testes e um Laboratório de Animações separado, com Phaser, JavaScript e Vite. O laboratório reutiliza manifests e AnimationDriver, sem modificar a física para inspeção.

## Modos operacionais automáticos

- **Criação:** ativar para novas funcionalidades ou inicialização. Entregar a menor implementação completa, respeitar contratos existentes, usar placeholders e atualizar status/decisões. Não expandir para combate, geração procedural ou arte final sem pedido.
- **Correção:** ativar para bugs, regressões ou testes falhando. Reproduzir, identificar a causa, corrigir de forma localizada e incluir teste de regressão quando houver comportamento verificável. Preservar sistemas e conteúdo existentes.
- **Auditoria:** ativar quando o usuário pedir revisão, avaliação, diagnóstico ou validação sem implementação. Ler código e executar verificações permitidas; relatar achados com arquivo, gravidade, evidência e limitações. Não alterar comportamento sem autorização já existente. Uma falha durante Criação/Correção continua nesse modo até ser resolvida.

Em pedidos mistos, auditar o trecho afetado, corrigir falhas que bloqueiem a tarefa autorizada e depois criar a funcionalidade. Indicar o modo no primeiro relato de trabalho. Não criar subagentes por padrão.

## Ambiente

- Instalar e executar dependências do projeto somente no executor remoto do Codex Cloud. Não instalar programas, dependências ou navegadores nem iniciar servidores no computador do usuário.
- Em sessão Desktop sem executor remoto, editar fontes e executar somente verificações sem dependências com o runtime já fornecido pelo Codex. Declarar essa diferença. Não declarar build ou validação visual sem execução real.
- Sem hospedagem pública, serviços pagos, infraestrutura externa, publicação de repositório ou envio de dados sem autorização.
- No Cloud: Node >=22.12, `npm install` no primeiro setup; guardar `package-lock.json` gerado e usar `npm ci` nas próximas execuções. Nunca inventar lockfile ou resultados.
- Validar com `npm run check`, `npm test`, `npm run validate:assets` e `npm run build`. Prévia e teste de navegador exigem o ambiente remoto descrito no README.

## Contratos técnicos e artísticos

- JavaScript ESM. Phaser 3 com Arcade Physics; Vite para build. Evitar frameworks adicionais sem necessidade.
- Lógica pura em `src/core`; cenas coordenam componentes. Física não depende da animação nem do alpha dos sprites.
- 320×180; sprites sem antialias; câmera fixa; escala de exibição inteira; manter precisão física fracionária.
- Direções canônicas: N, NE, E, SE, S, SW, W, NW. Diagonais normalizadas; idle preserva a orientação.
- Manifests controlam células, pivô, direções, espelhamento, FPS e loops. Espelhar somente conjuntos explicitamente simétricos. Corpo, sombra, arma e efeitos separados.
- PNG RGBA 8-bit, sem entrelaçamento; validação de dimensões, alpha, margens e base dos pés. Não importar arte de terceiros ou referências como assets.
- Toda entrega inclui verificações executadas, pendências reais e próxima etapa. Atualizar `docs/PROJECT_STATUS.md`; registrar novas decisões em `docs/DECISIONS.md`.
