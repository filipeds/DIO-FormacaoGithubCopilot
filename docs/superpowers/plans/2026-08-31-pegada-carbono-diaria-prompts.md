# Pegada de Carbono Diária — Prompts File Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a single `prompts-copilot.md` file at the repo root containing 9 sequenced, self-contained GitHub Copilot prompts that let the user build their own "Pegada de Carbono Diária" project (inspired by, not copied from, PabloNunes/CalculadoraCO2), and remove the orphaned empty `carbon-calculator/` scaffold.

**Architecture:** This is a content deliverable, not code — there is no application logic to implement in this repo. The two tasks are: (1) clean up the stale orphaned scaffold, (2) author the prompts document per the approved spec.

**Tech Stack:** Markdown only. No build step, no runtime.

## Global Constraints

- Spec source of truth: `docs/superpowers/specs/2026-08-31-pegada-carbono-diaria-design.md`
- Deliverable file: `prompts-copilot.md` at repo root
- Language: Portuguese (pt-BR), matching the user and the reference project
- 9 prompts in sequence, each self-contained (no dependency on the assistant remembering earlier chat turns)
- No prompt may instruct copying/pasting code from the reference repository
- Emission factor values used inside the prompts must match the spec's reference table exactly (energy `0,0817 kg CO2/kWh`; transport car `0,12`, bus `0,089`, bicycle `0`, on foot `0`; food carne vermelha `6,61`, frango/peixe `1,5`, vegetariana `0,5`; resíduos `0,5 kg CO2/kg` não reciclado; crédito de carbono `1 crédito = 1.000 kg CO2`)
- File structure referenced by the prompts must match the spec's architecture table (`index.html`, `css/style.css`, `js/config.js`, `js/calculator.js`, `js/ui.js`, `js/app.js`, `.github/workflows/deploy.yml`, `README.md` — no `routes-data.js` equivalent)

---

### Task 1: Remove orphaned scaffold

**Files:**
- Delete: `carbon-calculator/` (entire directory — `index.html`, `css/style.css`, `js/app.js`, `js/calculator.js`, `js/config.js`, `js/routes-data.js`, `js/ui.js`, all empty, untracked by git)

**Interfaces:** None — this task has no code interfaces. It only removes filesystem clutter unrelated to the new plan.

- [ ] **Step 1: Confirm the directory is untracked and empty before deleting**

Run: `git status --short carbon-calculator/` and `find carbon-calculator -type f -size +0c`

Expected: `git status` shows all files as untracked (`??`), and the `find` command returns no output (confirming every file is 0 bytes — nothing of value would be lost).

- [ ] **Step 2: Delete the directory**

```bash
rm -rf carbon-calculator/
```

- [ ] **Step 3: Verify removal**

Run: `git status --short`

Expected: `carbon-calculator/` no longer appears in the output.

(No commit here — since the directory was untracked, there is nothing for git to record. Proceed directly to Task 2.)

---

### Task 2: Write `prompts-copilot.md`

**Files:**
- Create: `prompts-copilot.md` (repo root)

**Interfaces:** None — this is a standalone Markdown document. It does not import or get imported by anything.

- [ ] **Step 1: Write the file**

Create `prompts-copilot.md` with exactly this content:

````markdown
# Prompts para o GitHub Copilot — Projeto "Pegada de Carbono Diária"

Este arquivo contém uma sequência de prompts para você usar no GitHub
Copilot Chat e construir seu próprio projeto de conclusão do curso
"Formação GitHub Copilot".

O projeto é inspirado em [PabloNunes/CalculadoraCO2](https://github.com/PabloNunes/CalculadoraCO2)
(uma calculadora de emissão de CO2 para viagens), mas com um domínio e uma
lógica de cálculo próprios: em vez de uma viagem pontual, você vai calcular
a **pegada de carbono semanal de hábitos do dia a dia** (energia, transporte,
alimentação e resíduos).

## Como usar

1. Cole os prompts **um de cada vez**, na ordem, no GitHub Copilot Chat
   (ou peça ao Copilot para gerar o arquivo indicado em cada prompt).
2. Leia e entenda o código gerado antes de avançar para o próximo prompt —
   o objetivo do curso é você aprender a orientar o Copilot, não só colecionar
   arquivos.
3. Ajuste livremente qualquer prompt: nomes, paleta de cores, textos. Os
   valores sugeridos (fatores de emissão, cores, textos) são pontos de
   partida, não regras fixas.
4. **Não copie e cole código do repositório de referência.** Os prompts
   abaixo já contêm todo o contexto necessário para o Copilot gerar código
   original.

---

## Prompt 0 — Contexto e estrutura do projeto

```
Vamos construir um projeto chamado "Pegada de Carbono Diária": uma
calculadora web que estima a pegada de carbono SEMANAL de uma pessoa a
partir de 4 categorias de hábitos:

1. Energia elétrica (kWh consumidos na semana)
2. Transporte (km percorridos na semana, por modo: carro, ônibus,
   bicicleta, a pé)
3. Alimentação (número de refeições na semana com carne vermelha,
   frango/peixe, ou vegetarianas)
4. Resíduos (kg de lixo gerado na semana e % reciclado)

Requisitos técnicos:
- HTML, CSS e JavaScript puros (vanilla), sem frameworks e sem build step
- Estrutura de arquivos:
  - index.html
  - css/style.css
  - js/config.js       (fatores de emissão e valores de referência)
  - js/calculator.js   (funções puras de cálculo, sem manipular o DOM)
  - js/ui.js           (funções de renderização, geram HTML a partir de dados)
  - js/app.js          (orquestração: eventos, validação, liga tudo)
  - README.md
- CSS seguindo a metodologia BEM (bloco__elemento--modificador) com
  variáveis de design em :root (cores, espaçamentos, sombras, radius)
- Sem dependências externas (sem npm, sem CDN de framework)

Crie a estrutura de pastas e arquivos vazios acima, com um index.html
mínimo que já referencia os scripts na ordem correta
(config.js, calculator.js, ui.js, app.js) e o style.css.
```

## Prompt 1 — HTML: formulário e seções de resultado

```
No index.html do projeto "Pegada de Carbono Diária", crie o formulário
principal com 4 blocos de input, um por categoria:

1. Bloco "Energia": campo numérico para kWh consumidos na semana
2. Bloco "Transporte": um campo numérico de km por semana para cada um
   dos 4 modos (carro, ônibus, bicicleta, a pé) — pode usar um mini-grid
   com ícone por modo, similar a um seletor de opções
3. Bloco "Alimentação": três campos numéricos — número de refeições na
   semana com carne vermelha, com frango/peixe, e vegetarianas
4. Bloco "Resíduos": campo numérico para kg de lixo gerado na semana, e
   um campo numérico de 0 a 100 para % reciclado

Todos os campos numéricos devem ter valor mínimo 0 e serem obrigatórios
ou ter valor padrão 0. Adicione um botão de submit "Calcular Pegada de
Carbono".

Depois do formulário, crie 3 seções de resultado, inicialmente ocultas
(classe "hidden"), com um container de conteúdo cada:
- #resultado-total (visão geral: total semanal e comparação com a média)
- #resultado-categorias (detalhamento por categoria, qual pesa mais)
- #resultado-creditos (créditos de carbono equivalentes para compensar)

Use nomes de classe seguindo BEM, coerentes com o restante do projeto.
```

## Prompt 2 — CSS: visual, responsividade e BEM

```
Crie o css/style.css do projeto "Pegada de Carbono Diária" com:

- Variáveis CSS em :root para cores, espaçamentos (escala xs/sm/md/lg/xl),
  border-radius e sombras — defina sua PRÓPRIA paleta de cores (não use
  verde/esmeralda; escolha uma paleta diferente que também transmita
  sustentabilidade, por exemplo tons de azul-petróleo e terracota, ou
  azul e amarelo)
- Layout responsivo mobile-first, com breakpoint em 768px
- Estilo dos blocos do formulário (Energia, Transporte, Alimentação,
  Resíduos) com espaçamento consistente e foco visível em inputs
- Grid para o seletor de modos de transporte (2 colunas no mobile, 4 no
  desktop), com estado "selecionado/preenchido" destacado
- Cards de resultado com sombra, borda arredondada, e uma variante de
  destaque para o card de total
- Barra de progresso ou gráfico de barras simples (só CSS, sem
  bibliotecas) para mostrar o peso de cada categoria no total
- Animação leve de fade-in quando os resultados aparecem
- Botão de submit com estado de loading (classe "is-loading") e estado
  disabled

Siga a metodologia BEM para todas as classes.
```

## Prompt 3 — `js/config.js`: fatores de emissão e referência

```
Crie js/config.js do projeto "Pegada de Carbono Diária" com um objeto
global CONFIG contendo:

1. EMISSION_FACTORS, com os fatores de emissão de CO2 por categoria:
   - energy: 0.0817 (kg CO2 por kWh — fator médio da matriz elétrica
     brasileira)
   - transport: { car: 0.12, bus: 0.089, bicycle: 0, walk: 0 } (kg CO2
     por km)
   - food: { redMeat: 6.61, chickenFish: 1.5, vegetarian: 0.5 } (kg CO2
     por refeição)
   - waste: 0.5 (kg CO2 por kg de lixo não reciclado)

2. CARBON_CREDIT, com:
   - KG_PER_CREDIT: 1000
   - PRICE_MIN_BRL: 50
   - PRICE_MAX_BRL: 150

3. NATIONAL_AVERAGE_WEEKLY_KG: um número representando a pegada semanal
   média de referência para comparação (escolha um valor plausível,
   documente no comentário que é uma estimativa educativa)

4. CATEGORY_META: metadados de cada categoria (energy, transport, food,
   waste) para renderização — label em português e um ícone emoji para
   cada uma (ex: energia = ⚡, transporte = 🚗, alimentação = 🍽️,
   resíduos = 🗑️)

Comente cada bloco explicando a origem/natureza aproximada dos valores,
no mesmo estilo de comentários JSDoc que o restante do projeto usa.
```

## Prompt 4 — `js/calculator.js`: lógica de cálculo pura

```
Crie js/calculator.js do projeto "Pegada de Carbono Diária" com um
objeto global Calculator contendo funções PURAS (sem tocar no DOM,
sem console.log), que leem os fatores de CONFIG:

- calculateEnergyEmission(kwh): retorna kg de CO2 da categoria energia
- calculateTransportEmission(kmByMode): recebe um objeto
  { car, bus, bicycle, walk } com km por modo, retorna o total de kg de
  CO2 somando cada modo pelo seu fator
- calculateFoodEmission(meals): recebe um objeto
  { redMeat, chickenFish, vegetarian } com número de refeições, retorna
  o total de kg de CO2
- calculateWasteEmission(kg, recycledPercent): retorna kg de CO2,
  aplicando o fator só sobre a fração NÃO reciclada
  (kg * (1 - recycledPercent/100) * fator)
- calculateTotalFootprint(categoriesInput): recebe um objeto com os 4
  inputs de categoria acima e retorna um objeto:
  { total, byCategory: [{ category, emission, percentageOfTotal }],
    vsNationalAverage: percentual comparado a
    CONFIG.NATIONAL_AVERAGE_WEEKLY_KG }
  ordenando byCategory da maior para a menor emissão
- calculateCarbonCredits(totalEmissionKg): créditos necessários
  (totalEmissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT), arredondado a
  4 casas decimais
- estimateCreditPrice(credits): retorna { min, max, average } em BRL,
  usando CONFIG.CARBON_CREDIT.PRICE_MIN_BRL e PRICE_MAX_BRL

Todos os valores monetários e de emissão devem ser arredondados a 2
casas decimais (exceto créditos, que usam 4). Documente cada função com
JSDoc: parâmetros, tipo de retorno.
```

## Prompt 5 — `js/ui.js`: renderização dos resultados

```
Crie js/ui.js do projeto "Pegada de Carbono Diária" com um objeto
global UI contendo:

Funções utilitárias:
- formatNumber(number, decimals = 2): formata em pt-BR
- formatCurrency(value): formata como Real brasileiro (BRL)
- showElement(elementId) / hideElement(elementId): alternam a classe
  "hidden"
- scrollToElement(elementId): scroll suave até o elemento

Funções de renderização (recebem dados já calculados por Calculator e
retornam uma string HTML):
- renderTotal(totalData): mostra o total semanal em kg de CO2 e a
  comparação percentual com CONFIG.NATIONAL_AVERAGE_WEEKLY_KG (acima ou
  abaixo da média, com cor condizente)
- renderCategoryBreakdown(byCategoryArray): para cada categoria, mostra
  ícone (de CONFIG.CATEGORY_META), label, valor em kg de CO2, e uma
  barra de progresso proporcional ao percentageOfTotal
- renderCarbonCredits(creditsData): mostra créditos necessários e faixa
  de preço estimado (mín/máx/médio), igual ao padrão de "créditos de
  carbono" do restante do projeto

Também crie funções showLoading(buttonElement) e
hideLoading(buttonElement) que trocam o conteúdo do botão de submit por
um spinner + texto "Calculando..." e restauram o texto original depois.
```

## Prompt 6 — `js/app.js`: orquestração e validação

```
Crie js/app.js do projeto "Pegada de Carbono Diária". Dentro de um
listener de DOMContentLoaded:

1. Pegue o formulário pelo id e adicione um listener de submit que:
   - previne o comportamento padrão
   - lê todos os campos: kWh de energia; km de cada modo de transporte;
     número de refeições de cada tipo; kg de lixo e % reciclado
   - valida que nenhum valor é negativo (se for, mostra alert e para)
   - se todos os campos estiverem em branco/zero, mostra alert pedindo
     para preencher pelo menos uma categoria e para
   - mostra o estado de loading no botão (UI.showLoading) e esconde
     resultados anteriores (UI.hideElement nos 3 containers)
   - com um pequeno delay simulado (setTimeout de 1000ms), calcula tudo
     usando Calculator (total, breakdown por categoria, créditos de
     carbono e preço estimado)
   - renderiza os 3 resultados usando UI.renderTotal,
     UI.renderCategoryBreakdown e UI.renderCarbonCredits, injeta no DOM
   - mostra as 3 seções de resultado e faz scroll suave até a primeira
   - restaura o botão (UI.hideLoading)
   - envolve o cálculo e a renderização em try/catch, mostrando um alert
     de erro amigável em caso de exceção e sempre restaurando o botão no
     finally

2. Loga no console uma mensagem confirmando que a calculadora foi
   inicializada.
```

## Prompt 7 — Revisão de qualidade e edge cases

```
Revise o código de js/calculator.js, js/app.js e js/config.js do
projeto "Pegada de Carbono Diária" e verifique especificamente:

1. O que acontece se o usuário deixar TODOS os campos em branco/zero?
   O total deve ser 0, sem erro, e a comparação com a média nacional
   deve funcionar sem divisão por zero.
2. O que acontece se % reciclado for maior que 100 ou negativo? Deve
   ser tratado (limitar entre 0 e 100) antes de calcular.
3. calculateTotalFootprint está ordenando corretamente byCategory da
   maior para a menor emissão, mesmo com categorias em 0?
4. Os valores exibidos na tela nunca aparecem como "NaN" ou
   "undefined" em nenhum cenário de input válido.

Aponte os problemas encontrados e corrija o código diretamente nos
arquivos, mantendo o estilo (JSDoc, nomes de função) já usado.
```

## Prompt 8 — README e deploy no GitHub Pages

```
Crie o README.md do projeto "Pegada de Carbono Diária" descrevendo:
- O que o projeto faz (calculadora de pegada de carbono semanal por
  hábitos: energia, transporte, alimentação, resíduos)
- Que é um projeto de conclusão do curso "Formação GitHub Copilot" (DIO),
  inspirado no projeto CalculadoraCO2 mas com domínio e lógica próprios
- Como rodar localmente (é só abrir o index.html, ou servir a pasta com
  qualquer servidor estático)
- Estrutura de pastas do projeto
- Créditos/fontes dos fatores de emissão usados (deixe claro que são
  valores educativos/aproximados, não uma fonte científica auditada)

Depois, crie .github/workflows/deploy.yml configurando deploy automático
para o GitHub Pages a cada push na branch main, usando as actions
actions/checkout, actions/configure-pages, actions/upload-pages-artifact
e actions/deploy-pages, com as permissions necessárias
(contents: read, pages: write, id-token: write) e concurrency para
evitar deploys simultâneos.
```
````

- [ ] **Step 2: Verify the file contains all required sections**

Run: `grep -c "^## Prompt" prompts-copilot.md`

Expected: `9` (Prompt 0 through Prompt 8).

- [ ] **Step 3: Verify no forbidden content**

Run: `grep -in "copie e cole\|copiar.*código.*referência" prompts-copilot.md`

Expected: exactly one match, inside the "Como usar" section's explicit warning *not* to copy code — not an instruction telling the user to copy code from the reference repo. Read the match to confirm it's the negative instruction, not a positive one.

- [ ] **Step 4: Commit**

```bash
git add prompts-copilot.md
git commit -m "$(cat <<'EOF'
Add Copilot prompts file for Pegada de Carbono Diária capstone project

Sequenced set of 9 self-contained prompts for the GitHub Copilot course
capstone, inspired by PabloNunes/CalculadoraCO2's architecture but with
an independent domain (weekly habit-based footprint instead of
trip-based) and calculation logic.
EOF
)"
```
