# Movimento natural das nuvens no hero

## Objetivo

Dar movimento contínuo e natural às nuvens do hero sem clarear, duplicar ou esconder a arte original. O planeta deve manter o contraste visto em `client/public/hero-bg.png`.

## Problema atual

`HeroSection.vue` renderiza a imagem completa do hero três vezes. As duas cópias usam `mix-blend-mode: screen` e `overlay`, enquanto gradientes e `ambient-glow` adicionam mais luminosidade. Essas camadas lavam a composição e criam duplicação visual do planeta.

Estilos Vue e animações CSS também alteram `transform` nas mesmas camadas, criando disputa entre parallax, scroll e animação contínua.

## Solução aprovada

### Arte-base

- Renderizar `hero-bg.png` uma única vez.
- Preservar contraste, enquadramento e cores do arquivo.
- Remover cópias completas usadas como falsas nuvens.
- Reduzir ou remover efeitos brancos que cobrem toda a imagem.

### Camadas de nuvem

- Usar ativos transparentes contendo somente nuvens, sem planeta ou fundo.
- Criar três faixas independentes:
  - nuvem distante atrás do conteúdo, lenta e pouco opaca;
  - nuvem intermediária atrás do conteúdo, com velocidade moderada;
  - nuvem frontal suave, acima do conteúdo, com baixa opacidade.
- Variar duração, posição vertical, escala e atraso para evitar repetição sincronizada.
- Fazer cada faixa atravessar toda a tela em fluxo linear contínuo, sem salto visível no reinício.
- Manter direção principal horizontal, com deslocamento vertical mínimo.

### Legibilidade e profundidade

- Manter título, navegação e descrição legíveis durante todo o ciclo.
- Limitar densidade e opacidade da camada frontal.
- Usar desfoque maior na camada distante e menor na frontal.
- Não aplicar blend que clareie o planeta ou o quadro inteiro.
- Manter parallax de ponteiro e scroll sutil, separado do `transform` usado pelo fluxo das nuvens.

## Organização

`HeroSection.vue` continuará responsável pela composição do hero. O movimento contínuo será encapsulado em um componente visual pequeno, com configuração declarativa das três faixas. Isso evita misturar animação das nuvens com física do planeta, partículas, texto e scroll.

Cada faixa terá dois trilhos repetidos. Enquanto um atravessa a tela, o segundo entra fora da área visível, formando loop contínuo.

## Acessibilidade e desempenho

- Respeitar `prefers-reduced-motion`: mostrar nuvens estáticas e remover parallax.
- Animar somente `transform` e `opacity`.
- Usar `will-change` apenas nas faixas móveis.
- Evitar criar novo loop JavaScript para as nuvens.
- Manter eventos existentes passivos e cancelar todos os `requestAnimationFrame` no unmount.
- Ajustar quantidade e escala das faixas para telas menores.

## Validação

- Comparar hero parado com `hero-bg.png`: planeta não pode ficar mais claro.
- Observar um ciclo completo: não pode haver corte, teleporte ou pausa.
- Confirmar camadas atrás e à frente do conteúdo.
- Confirmar título e descrição legíveis em desktop e mobile.
- Confirmar ausência de erros no console.
- Executar lint e build do cliente.
- Testar com `prefers-reduced-motion: reduce`.

## Fora de escopo

- Alterar textos, tipografia, navegação ou seção de serviços.
- Redesenhar planeta ou substituir a arte-base.
- Adicionar WebGL, bibliotecas de animação ou dependências.
- Refatorar áreas do hero sem relação direta com nuvens, contraste ou ciclo de animação.
