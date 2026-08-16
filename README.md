# Predictions Sports Prime — V2 Compact

Site estático de predictions esportivas, sem backend, sem banco de dados e sem IA.

## O que mudou na V2

- Home muito mais compacta
- Hero gigante removido
- Today's Predictions no topo
- Cards menores
- 3 jogos por linha em desktop
- Escudos visuais locais dos times
- Identificação visual das ligas
- Cards de ligas mais esportivos
- Header mobile com menu
- Seletor de idioma preparado
- ADS menores e melhor distribuídos
- Latest Predictions em lista compacta
- Tema escuro + verde mantido

## Rodar

```powershell
npm install
npm run dev
```

Abra:

```text
http://localhost:3000
```

## Conteúdo

Edite:

```text
src/data/matches.ts
```

Todos os prognósticos continuam 100% manuais.


## Página de liga

A página de liga agora possui:

- jogos compactos à esquerda
- classificação reduzida à direita
- ADS superior
- ADS lateral abaixo da classificação
- ADS inferior
- tabela recolhível no celular

Os dados de classificação em `src/data/standings.ts` são demonstrativos nesta etapa.


## Premier League — classificação automática

A Premier League agora consulta diretamente o endpoint gratuito V1 do TheSportsDB:

`lookuptable.php?l=4328`

Comportamento:

- consulta feita pelo navegador
- sem backend próprio
- sem banco de dados
- chave pública gratuita `123`
- cache local de 30 minutos
- fallback para `src/data/standings.ts` caso a API falhe

As demais ligas continuam usando os dados locais até a integração ser validada.


## Premier League — rodada compacta

A página da Premier League agora foi preparada para:

- 10 jogos da rodada
- 1 jogo por linha
- cards reduzidos ao máximo
- classificação lateral com 20 clubes
- fallback automático se a API retornar menos de 20 clubes


## V6 — Premier League open data

A Premier League agora usa o dataset CC0 do OpenFootball para:

- identificar automaticamente a rodada atual/próxima
- carregar exatamente os 10 jogos da rodada
- calcular a classificação usando os resultados do próprio dataset
- garantir os 20 clubes
- cache local de 6 horas
- sem API key
- sem cadastro
- sem backend
- sem banco

As predictions continuam manuais: um jogo só recebe `Prediction available`
quando existir uma entrada correspondente em `src/data/matches.ts`.


## V7 — quatro ligas com open data

OpenFootball foi aplicado a:

- Premier League: 20 clubes / 10 jogos por rodada
- La Liga: 20 clubes / 10 jogos por rodada
- Bundesliga: 18 clubes / 9 jogos por rodada
- Serie A: 20 clubes / 10 jogos por rodada

Cada página:

- detecta rodada atual/próxima
- carrega fixtures automaticamente
- calcula classificação pelos resultados
- valida quantidade de clubes e jogos
- usa cache local de 6 horas
- mantém fallback local
- mantém predictions 100% manuais

Fontes públicas CC0:
- openfootball/england
- openfootball/espana
- openfootball/deutschland
- openfootball/italy


## V8 — artwork real com fallback

Escudos e logos agora são carregados do TheSportsDB quando disponíveis.

- escudos dos times via `searchteams.php`
- logos das ligas via `lookupleague.php`
- chave pública gratuita `123`
- cache local de 30 dias
- sem backend
- se a imagem falhar, aparece o badge local com sigla

O OpenFootball continua responsável por fixtures/classificação.


## V9 — página individual compacta

A página de cada prediction publicada agora possui:

- liga + rodada no topo
- escudos dos dois clubes
- data / hora / estádio
- ADS superior
- análise manual em coluna principal
- bloco compacto de predictions à direita
- badge `Available`
- ADS inferior
- layout mobile reduzido
