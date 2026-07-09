# Lasylab — application mobile d'apprentissage socratique

Monorepo de l'application Lasylab : une app mobile éducative (méthode socratique,
leçons, quiz/épreuves, progression) reprenant fidèlement le design de référence
`Lasylab App.dc.html`.

## Stack

- **Mobile** : React Native + Expo (`apps/mobile`)
- **Backend** : NestJS + Prisma, intégration Groq côté serveur (`apps/backend`)
- **Base de données** : PostgreSQL
- **Types partagés** : `packages/shared`

## Structure (npm workspaces)

```
lasylab/
├── apps/
│   ├── mobile/      # Expo + React Native
│   └── backend/     # NestJS + Prisma
└── packages/
    └── shared/      # types & référentiels partagés (matières, DTOs)
```

Chaque app a ses propres scripts de build/déploiement indépendants.

## Prérequis

- Node.js ≥ 20 (voir `.nvmrc`)
- npm ≥ 9 (workspaces)
- PostgreSQL 14+ (à partir de l'étape 2)

## Installation

```bash
npm install            # installe tous les workspaces
npm run shared:build   # compile les types partagés
```

## Scripts racine

| Commande | Effet |
|----------|-------|
| `npm run shared:build` | Compile `packages/shared` |
| `npm run backend:dev`  | Lance le backend NestJS en watch |
| `npm run mobile:start` | Lance le serveur Expo |
| `npm run build`        | Build shared + backend |

## Configuration

Copier `apps/backend/.env.example` vers `apps/backend/.env` et renseigner les
variables. **La clé Groq (`GROQ_API_KEY`) reste exclusivement côté serveur** et
n'est jamais exposée au client.

## Avancement (par étapes)

- [x] **Étape 1** — Setup monorepo, scaffolding Expo + NestJS + shared, design tokens
- [x] **Étape 2** — Modélisation BDD (Prisma/PostgreSQL) + seed
- [ ] Étape 3 — Auth + API de base
- [ ] Étape 4 — Fondations UI mobile
- [ ] Étape 5 — Flux onboarding
- [ ] Étape 6 — Module Leçons
- [ ] Étape 7 — Module Quiz & Épreuves
- [ ] Étape 8 — Module socratique + Groq
- [ ] Étape 9 — Écran Chat IA "Lasy"
- [ ] Étape 10 — Statuts & progression
- [ ] Étape 11 — Tests & finitions
