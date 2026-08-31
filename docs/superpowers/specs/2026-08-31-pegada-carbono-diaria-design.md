# Design: Arquivo de prompts para "Pegada de Carbono Diária"

## Contexto

Projeto de conclusão do curso "Formação GitHub Copilot" (DIO). Referência de
inspiração: [PabloNunes/CalculadoraCO2](https://github.com/PabloNunes/CalculadoraCO2),
uma calculadora de emissão de CO2 para viagens (origem → destino → meio de
transporte), construída em HTML/CSS/JS vanilla, com deploy automático no
GitHub Pages.

O objetivo **não é implementar o projeto agora**. O objetivo é entregar um
único arquivo (`prompts-copilot.md`) com uma sequência de prompts prontos que
o usuário vai colar, um de cada vez, no GitHub Copilot para construir o
próprio projeto — reaproveitando o mesmo padrão arquitetural do repositório
de referência, mas com domínio e lógica de cálculo diferentes o suficiente
para não ser cópia.

Há hoje uma pasta `carbon-calculator/` no repositório (não rastreada pelo
git) com os mesmos nomes de arquivo do projeto de referência, todos vazios —
resquício de uma tentativa anterior. Ela será removida por estar órfã.

## Conceito do novo projeto

**"Pegada de Carbono Diária"** — em vez de uma emissão pontual de viagem
(origem/destino/distância), calcula a pegada de carbono **semanal** somando
4 categorias de hábito:

1. **Energia elétrica** — kWh consumidos/semana
2. **Transporte** — km percorridos/semana, por modo (carro, ônibus,
   bicicleta, a pé)
3. **Alimentação** — nº de refeições/semana com carne vermelha,
   frango/peixe, ou vegetariana
4. **Resíduos** — kg de lixo gerado/semana e % reciclado

Diferença estrutural chave em relação ao original: não existe "banco de
rotas" para consultar distância (`routes-data.js` não tem equivalente
direto). O cálculo é uma **soma ponderada de 4 categorias independentes**,
não a escolha de um único modo de transporte para uma única viagem.

Resultado exibido: total de CO2/semana, detalhamento por categoria (qual
pesa mais), comparação com uma média nacional de referência, e créditos de
carbono equivalentes para compensar — mantendo o espírito do original
(resultado + comparação + créditos de carbono) com números e lógica
próprios.

### Fatores de referência (ilustrativos, para uso nos prompts)

Valores aproximados/educativos, no mesmo espírito dos fatores simples que o
projeto original usa (ex: carro = 0,12 kg CO2/km):

- Energia: `0,0817 kg CO2/kWh` (fator médio da matriz elétrica brasileira)
- Transporte: carro `0,12`, ônibus `0,089`, bicicleta `0`, a pé `0`
  (kg CO2/km — mesmos valores-base do original, reaproveitáveis como fatores
  de apoio dentro de uma categoria, não como mecânica central)
- Alimentação: carne vermelha `6,61 kg CO2/refeição`, frango/peixe
  `1,5 kg CO2/refeição`, vegetariana `0,5 kg CO2/refeição`
- Resíduos: `0,5 kg CO2/kg de lixo não reciclado`, reciclagem reduz
  proporcionalmente pelo % reciclado
- Crédito de carbono: mesma unidade do original (`1 crédito = 1.000 kg
  CO2`), preço estimado em BRL por faixa

## Arquitetura (mesma base, conteúdo novo)

| Arquivo | Papel | Equivalente no original |
|---|---|---|
| `index.html` | Formulário com os 4 blocos de categoria + seções de resultado | mesmo papel |
| `css/style.css` | BEM, custom properties, responsivo, paleta própria (não copiar a paleta verde exata) | mesmo papel |
| `js/config.js` | Fatores de emissão por categoria + valores de referência nacional | tinha fatores por transporte; agora por categoria |
| `js/calculator.js` | Funções puras: uma por categoria + total + créditos de carbono | mesmo papel, lógica nova |
| `js/ui.js` | Renderização do detalhamento por categoria e comparação | mesmo papel |
| `js/app.js` | Orquestração, validação de formulário, eventos | mesmo papel |
| `.github/workflows/deploy.yml` | Deploy automático no GitHub Pages | idêntico (infraestrutura, não conteúdo autoral) |
| `README.md` | Descrição do projeto para o curso | novo — original não documentava propósito |

Sem `routes-data.js` — não há mecânica de busca de rota nesse projeto.

## Entregável

Um único arquivo **`prompts-copilot.md`** na raiz do repositório, contendo:

1. Uma introdução curta: como usar (colar um prompt de cada vez no Copilot
   Chat, revisar a saída antes de avançar para o próximo) e o lembrete de
   não copiar/colar código do repositório de referência.
2. **9 prompts em sequência**, cada um autocontido (não depende do usuário
   lembrar contexto de prompts anteriores durante a conversa com o Copilot):
   1. **Contexto do projeto** — objetivo, categorias, stack vanilla JS,
      padrão de arquivos; pede a estrutura de pastas inicial
   2. **HTML** — formulário com os 4 blocos de categoria + seções de
      resultado
   3. **CSS** — visual próprio, responsivo, BEM, tokens CSS
   4. **`config.js`** — fatores de emissão por categoria + valores de
      referência nacional (usa a tabela de fatores acima)
   5. **`calculator.js`** — funções puras de cálculo por categoria + total
      + créditos de carbono
   6. **`ui.js`** — renderização do detalhamento por categoria e
      comparação
   7. **`app.js`** — orquestração, validação de formulário, eventos
   8. **Revisão de qualidade** — pede ao Copilot para revisar edge cases
      (campos vazios, zero, valores negativos) e sugerir melhorias
   9. **README + Deploy** — documentação do projeto e workflow do GitHub
      Actions para GitHub Pages

Cada prompt especifica claramente: arquivo alvo, requisitos funcionais e
requisitos visuais/de qualidade — suficiente para gerar código de qualidade
comparável ao original sem nunca instruir a copiar/colar código de lá.

## Ações no repositório

- Criar `prompts-copilot.md` na raiz.
- Remover a pasta `carbon-calculator/` (não rastreada, todos os arquivos
  vazios, órfã em relação a este plano).
- Commitar `prompts-copilot.md`.

## Fora de escopo

- Implementar o código do projeto em si (isso é trabalho do usuário via
  Copilot, seguindo os prompts).
- Buscar fatores de emissão com precisão científica/auditável — os valores
  são ilustrativos, no mesmo espírito de simplicidade do projeto de
  referência.
