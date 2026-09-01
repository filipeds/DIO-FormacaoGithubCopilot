# Pegada de Carbono Diária

Calculadora web que estima a **pegada de carbono semanal** de uma pessoa a
partir de 4 categorias de hábitos do dia a dia:

- ⚡ **Energia** — consumo de eletricidade (kWh/semana)
- 🚗 **Transporte** — km percorridos por modo (carro, ônibus, bicicleta, a pé)
- 🍽️ **Alimentação** — número de refeições por tipo de dieta (carne vermelha,
  frango/peixe, vegetariana)
- 🗑️ **Resíduos** — kg de lixo gerado e percentual reciclado

O resultado mostra o total semanal em kg de CO₂, o detalhamento por
categoria (qual pesa mais), a comparação com uma média nacional de
referência, e os créditos de carbono equivalentes para compensar as
emissões.

## Sobre o projeto

Projeto de conclusão do curso **Formação GitHub Copilot** (DIO). Inspirado
na arquitetura do projeto [CalculadoraCO2](https://github.com/PabloNunes/CalculadoraCO2)
de Pablo Nunes (separação em `config`/`calculator`/`ui`/`app`, HTML/CSS/JS
vanilla, deploy automático no GitHub Pages), mas com domínio e lógica de
cálculo próprios: em vez de estimar a emissão de uma viagem pontual, este
projeto soma a pegada de hábitos semanais em quatro categorias
independentes.

## Como rodar localmente

Não há build step nem dependências. Basta abrir `index.html` no navegador,
ou servir a pasta com qualquer servidor estático, por exemplo:

```bash
npx serve .
```

## Estrutura de pastas

```
pegada-carbono-diaria/
├── index.html          # formulário e seções de resultado
├── css/
│   └── style.css       # estilo (BEM, variáveis CSS, responsivo)
├── js/
│   ├── config.js        # fatores de emissão e metadados
│   ├── calculator.js    # funções puras de cálculo
│   ├── ui.js             # renderização dos resultados
│   └── app.js             # orquestração, validação, eventos
└── tests/                # testes automatizados (node:test)
    ├── config.test.js
    ├── calculator.test.js
    └── helpers/load-scripts.js
```

## Testes

Os testes cobrem `config.js` e `calculator.js` (lógica pura, sem DOM) com
o executor de testes nativo do Node — nenhuma dependência externa é
necessária:

```bash
cd pegada-carbono-diaria
node --test
```

## Fontes dos fatores de emissão

Os valores usados (fator de energia da matriz elétrica brasileira, fatores
de transporte, refeições e resíduos, e a média nacional de referência) são
**estimativas educativas** para fins deste projeto, não uma fonte
científica auditada.
