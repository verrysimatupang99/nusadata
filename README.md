# NusaData — Indonesia in numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/verrysimatupang99/nusadata/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/verrysimatupang99/nusadata/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

NusaData is an original, dependency-free static national statistics portal for the Republic of Indonesia. It presents a dense dashboard, national accounts, population structure, prices, labour, all 38 provinces, a searchable fifty-series indicator catalogue, a statistical release calendar, and a methodology/source ledger.

The site is hand-built HTML, CSS and JavaScript. Charts are inline SVG rendered by small ES modules: line charts, grouped and horizontal bars, a population pyramid, composition donuts, sparklines and a schematic province tile atlas. There is no runtime network access and no framework or font download.

## Data sources

Figures are compiled and rounded from named publications, with source and year shown beside the numbers: BPS–Statistics Indonesia quarterly GDP releases through Q3 2025, CPI releases through October 2025, Sakernas February 2025, Susenas poverty March 2025, population projections and provincial estimates; Bank Indonesia policy/reserve releases through November 2025; Ministry of Finance APBN figures; Ministry of Manpower Regulation No. 16 of 2024; and World Bank WDI 2024 series for selected demographic indicators.

## Run locally

```sh
node serve.ts
```

Then open `http://localhost:8080`.

## Hand in the entry

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` clears stale files inside the output's `app/` and `screenshots/` subdirectories only, copies the current trees, writes the byte-exact `dossier.json` with `vendor/makefun-frontend.ts`, and prints a deterministic manifest. It also accepts `--output <directory>`.

## Screenshots and checks

```sh
node tools/shoot.mjs
node tools/check.mjs
```

The screenshot tool drives headless Chrome over the DevTools protocol, serves `app/` locally, captures the entries in `shots.json`, checks dimensions and byte budgets, and fails on browser console errors. The checker scans for forbidden external references, unresolved local assets, disallowed browser features and file-size budgets.

<sub>Entered on [make.fun](https://make.fun/?ref=&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
