# DIO — Formação GitHub Copilot

Projeto de conclusão do curso **Formação GitHub Copilot** (DIO).

🌍 **App publicado:** https://filipeds.github.io/DIO-FormacaoGithubCopilot/

## O que tem neste repositório

### [`pegada-carbono-diaria/`](pegada-carbono-diaria/)

O projeto principal: uma calculadora web que estima a **pegada de carbono
semanal** de uma pessoa a partir de 4 categorias de hábitos (energia,
transporte, alimentação e resíduos). HTML/CSS/JS puro, sem build step, com
testes automatizados (`node:test`) e deploy automático no GitHub Pages.

Inspirado na arquitetura do projeto [CalculadoraCO2](https://github.com/PabloNunes/CalculadoraCO2)
de Pablo Nunes, mas com domínio e lógica de cálculo próprios — veja o
[README do projeto](pegada-carbono-diaria/README.md) para detalhes.

### [`prompts-copilot.md`](prompts-copilot.md)

Os prompts usados no GitHub Copilot para construir o projeto acima, em uma
sequência de 9 etapas (contexto, HTML, CSS, dados, cálculo, UI,
orquestração, revisão de qualidade, documentação/deploy).

### [`docs/superpowers/`](docs/superpowers/)

Documentação do processo de desenvolvimento: specs de design e planos de
implementação usados para chegar ao resultado final.

## Deploy

O deploy do `pegada-carbono-diaria/` para o GitHub Pages roda
automaticamente via GitHub Actions
([`.github/workflows/deploy-pegada-carbono-diaria.yml`](.github/workflows/deploy-pegada-carbono-diaria.yml))
a cada push na `main` que altere a pasta do projeto.
