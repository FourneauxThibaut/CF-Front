# CF-Front

Vue 3 + TypeScript + Vite. Auth via CF-Back API, Pinia, Tailwind.

## Dev

```bash
bun install   # or npm install
bun run dev   # or npm run dev
```

## Scalingo

Buildpacks (Node.js), pas Docker. Le buildpack détecte `package.json`, lance `npm run build` puis `node server.cjs` pour servir `dist/`.

Variable à définir (Dashboard > Environment) — injectée au build :

- `VITE_API_URL` — URL de l’API CF-Back (ex. `https://cf-back.osc-fr1.scalingo.com`)

Auto-deploy : connecter le repo GitHub dans Scalingo Dashboard > App > Deployment. Chaque push sur la branche configurée déclenche un déploiement.
