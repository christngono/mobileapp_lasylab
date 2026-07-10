# Guide de déploiement — Lasylab

Ce guide couvre le déploiement du **backend** (NestJS + PostgreSQL) et la
publication de l'**application mobile** (Expo).

## 1. Prérequis

- Node.js ≥ 20, npm ≥ 9
- Un PostgreSQL 14+ accessible (managé de préférence : Neon, Supabase, RDS…)
- Une clé **Groq** (https://console.groq.com) pour le module socratique
- Un compte **Expo/EAS** pour builder l'app mobile

## 2. Installation

```bash
npm install
npm run shared:build   # compile les types partagés (requis avant backend)
```

## 3. Backend

### Variables d'environnement (`apps/backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Chaîne PostgreSQL (`postgresql://user:pass@host:5432/db`) |
| `PORT` | Port d'écoute (défaut 3000) |
| `CORS_ORIGINS` | Origines autorisées (séparées par des virgules) |
| `JWT_SECRET` | Secret de signature JWT (⚠️ à changer en prod) |
| `JWT_EXPIRES_IN` | Durée de validité du token (ex. `7d`) |
| `GROQ_API_KEY` | **Clé Groq — reste côté serveur, jamais exposée** |
| `GROQ_BASE_URL` | `https://api.groq.com/openai/v1` |
| `GROQ_MODEL` | Modèle (défaut `llama-3.3-70b-versatile`) |

### Base de données & build

```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate      # ou: npx prisma migrate deploy (en prod)
npm run prisma:seed         # données de démarrage (matières, quiz, stories…)
npm run build
npm run start:prod          # lance dist/main.js
```

### Hébergement

- **Railway / Render / Fly.io** : builder avec `npm run build`, démarrer avec
  `node dist/main.js`, injecter les variables d'env, exécuter
  `npx prisma migrate deploy` au déploiement.
- **Docker** : un `docker-compose.yml` fournit Postgres en local ; en prod,
  utiliser une base managée et conteneuriser le backend séparément.

Vérification : `GET https://<api>/api/health` → `{ "status": "ok" }`.

## 4. Mobile (Expo)

### Configuration de l'URL d'API

Dans `apps/mobile/app.json`, renseigner l'URL publique du backend :

```json
"extra": { "apiUrl": "https://<api>/api" }
```

> En développement sur **appareil physique**, remplacer `localhost` par l'IP
> locale de la machine qui fait tourner le backend.

### Build & publication (EAS)

```bash
cd apps/mobile
npx expo install            # aligne les versions natives sur la SDK Expo
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android   # APK/AAB
eas build --platform ios       # nécessite un compte Apple Developer
```

Puis soumission aux stores :

```bash
eas submit --platform android
eas submit --platform ios
```

## 5. Tests

```bash
# Backend (logique métier : auth, quiz, progression, socratique)
npm run test --workspace @lasylab/backend

# Mobile (utilitaires purs)
npm run test --workspace @lasylab/mobile
```

## 6. Checklist de mise en production

- [ ] `JWT_SECRET` fort et unique
- [ ] `GROQ_API_KEY` configurée côté serveur (jamais dans l'app mobile)
- [ ] `CORS_ORIGINS` restreint au domaine de l'app
- [ ] `prisma migrate deploy` exécuté sur la base de prod
- [ ] `extra.apiUrl` du mobile pointant vers l'API de prod (HTTPS)
- [ ] Seed exécuté (ou contenu pédagogique réel importé)
