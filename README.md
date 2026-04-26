# RepertoryHub

Application web de répertoire musical — partitions, paroles et fichiers audio par voix.

**Stack** : PocketBase (backend/BDD) + Nuxt 4 (frontend, Vue 3) + Tailwind CSS + Pinia

---

## 🐳 Démarrage rapide avec Docker (recommandé)

```bash
# 1. Copier les variables d'environnement
cp .env.example .env
# Éditez .env pour définir PB_ADMIN_EMAIL et PB_ADMIN_PASSWORD

# 2. Lancer les services
docker compose up -d

# 3. Importer les collections PocketBase
#    → Ouvrez http://localhost:8090/_/
#    → Settings → Import collections → collez le contenu de pocketbase/pb_migrations/collections.json
```

- **PocketBase** : http://localhost:8090 (interface admin sur `/_/`)
- **Nuxt** : http://localhost:3000

> **Note** : Le volume `./pocketbase/pb_data` est monté localement — vos données persistent entre les redémarrages.

---

## Développement local (sans Docker)

### Prérequis

- Node.js ≥ 20
- PocketBase binary ([télécharger](https://pocketbase.io/docs/))

---

## 1. Démarrer PocketBase

```bash
# Placer le binaire dans pocketbase/
cd pocketbase
chmod +x ./pocketbase

# Première fois — créer un compte admin dans l'interface
./pocketbase serve --http="localhost:8090"
```

Ouvrez http://localhost:8090/_/ pour créer votre compte admin.

### Importer les collections

Dans l'interface PocketBase → **Settings → Import collections** → collez le contenu de `pb_migrations/collections.json`.

> **Ordre important** : les collections doivent être importées dans cet ordre :
> 1. `categories`
> 2. `audiofiles`  
> 3. `songs`
>
> Ou utilisez l'import JSON complet qui gère les dépendances.

---

## 2. Démarrer le frontend Nuxt

```bash
cd frontend

# Copier la config d'environnement
cp .env.example .env

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur http://localhost:3000.

---

## Variables d'environnement

| Variable | Description | Défaut |
|---|---|---|
| `NUXT_PUBLIC_POCKETBASE_URL` | URL de l'instance PocketBase | `http://localhost:8090` |

---

## Structure du projet

```
namedoc/
├── pocketbase/
│   ├── pocketbase          # Binaire PocketBase (à placer manuellement)
│   └── pb_migrations/
│       └── collections.json
└── frontend/
    ├── assets/css/main.css # Design system global
    ├── components/         # Composants réutilisables
    │   └── admin/          # Formulaires d'administration
    ├── composables/        # Logique API PocketBase
    ├── layouts/            # default (public) + admin (sidebar)
    ├── middleware/         # Protection routes /admin/*
    ├── pages/
    │   ├── index.vue       # Recherche publique
    │   ├── song/[id].vue   # Fiche détaillée
    │   └── admin/          # Back-office
    ├── plugins/pocketbase.ts
    └── stores/auth.ts      # Pinia — session admin
```

---

## Déploiement en production

### PocketBase

```bash
# Avec un service systemd ou Docker
./pocketbase serve \
  --http="0.0.0.0:8090" \
  --dir="./pb_data"
```

### Nuxt (SSR sur Node)

```bash
cd frontend
npm run build
node .output/server/index.mjs
```

### Nuxt (SPA statique)

```bash
cd frontend
npm run generate
# Déployer .output/public/ sur n'importe quel hébergeur statique
```

### Reverse proxy (Caddy ou Nginx)

```
# Caddy example
repertoryhub.example.com {
    reverse_proxy /api/* localhost:8090
    reverse_proxy localhost:3000
}
```

---

## Sécurité

- Les identifiants admin PocketBase ne transitent **jamais** dans le code source.
- Les règles API (`listRule = ""`) permettent la lecture publique des morceaux.
- Les règles de création/modification exigent un token admin PocketBase.
- Activez HTTPS en production (Caddy le fait automatiquement).

---

## Workflow d'ajout d'un morceau

1. Se connecter à `/admin/login`
2. Aller dans **Morceaux → Nouveau morceau**
3. Remplir le titre, la catégorie, le compositeur
4. Uploader la partition (PDF ou image)
5. Ajouter des voix avec **Ajouter une voix** → sélectionner soprano/alto/etc. + fichier MP3
6. Sauvegarder → le morceau apparaît immédiatement sur le site public
