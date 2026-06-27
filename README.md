# KRYPTOS UI

Console de gerenciamento do [KRYPTOS](https://github.com/rafaelfigueredog/kryptos) — Serviço de Orquestração de Tokens.

## Stack

- Vite + React + TypeScript
- Tailwind CSS 4
- React Router v6

## Instalação

```bash
cp .env.example .env
npm install
npm run dev
```

Acesse http://localhost:5173

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_API_URL` | `http://localhost:8090` | URL da API KRYPTOS |

## Pré-requisito

A stack KRYPTOS deve estar rodando:

```bash
cd ../kryptos && docker compose up -d
```
