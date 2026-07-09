# Lasylab — Backend (NestJS + Prisma)

API NestJS de Lasylab : auth, contenu pédagogique, quiz, progression et module
socratique (Groq, clé côté serveur).

## Prérequis

- Node ≥ 20
- Docker (pour Postgres en local) **ou** un PostgreSQL 14+ accessible

## Mise en route

```bash
# depuis la racine du monorepo
npm install
npm run shared:build              # les types partagés doivent être compilés

cd apps/backend
cp .env.example .env              # renseigner DATABASE_URL, JWT_SECRET, GROQ_API_KEY

npm run db:up                     # démarre Postgres via docker-compose
npm run prisma:migrate            # crée la base + applique la migration initiale
npm run prisma:seed               # insère les données du mock
npm run start:dev                 # API sur http://localhost:3000/api
```

Vérification : `GET http://localhost:3000/api/health` renvoie `{ "status": "ok" }`.

## Modèle de données (Prisma)

Défini dans [`prisma/schema.prisma`](prisma/schema.prisma) :

| Modèle | Rôle |
|--------|------|
| `User` | Élève ou parent (relation parent→enfants), série/gemmes/XP |
| `Subject` | Matières (6, slug + couleurs de la charte) |
| `Lesson` / `LessonSlide` | Nœuds intro/leçon d'un parcours + diapositives "stories" |
| `Quiz` / `QuizQuestion` | Nœuds quiz + questions QCM (avec `correctIndex`) |
| `QuizResult` | Résultats d'un élève (score, XP, réponses) |
| `Progress` | Progression par matière (nœuds validés) |
| `Badge` / `UserBadge` | Badges et badges obtenus |
| `SocraticSession` / `SocraticMessage` | Historique des dialogues socratiques |
| `Activity` | Écran Épreuves-exo (méthodes, définitions, épreuves, exercices) |
| `Story` | Écran Status (stories) |

## Seed

`npm run prisma:seed` insère : les 6 matières, la leçon **« Le Discriminant »**
(maths) + son quiz, l'**introduction à la philosophie** + le **quiz de
philosophie** (repris du mock), 4 stories, 9 activités/épreuves, 4 badges, et un
**élève de démo** : `+22900000000` / mot de passe `lasylab`
(progression Français 4 · Philosophie 2, comme l'état initial du prototype).

Le seed est idempotent (upsert / remplacement ciblé).
