# BondiMoto Admin Interface

Interface d'administration moderne pour BondiMoto, développée avec React, TypeScript, Tailwind CSS et ShadCN UI.

## 🚀 Fonctionnalités

- **Authentification sécurisée** avec JWT
- **Tableau de bord** avec statistiques en temps réel
- **Gestion des utilisateurs** (activation, désactivation, suppression)
- **Gestion des trajets** (modération, suppression)
- **Gestion des réservations** (confirmation, annulation)
- **Gestion des avis** (modération, suppression)
- **Gestion des administrateurs** (création, gestion des rôles)
- **Interface responsive** et moderne

## 🛠️ Technologies utilisées

- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **ShadCN UI** pour les composants
- **React Router DOM** pour la navigation
- **Axios** pour les appels API
- **React Hook Form** avec Zod pour la validation
- **React Hot Toast** pour les notifications

## 📋 Prérequis

- Node.js 16+ et npm
- Backend BondiMoto déployé et accessible

## 🔧 Installation

1. **Cloner le repository**
   ```bash
   cd admin
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer l'application en développement**
   ```bash
   npm run dev
   ```

L'application sera accessible à l'adresse : http://localhost:5173

## 🔐 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_BASE_URL=https://bondi-backend.onrender.com/api/v1
```

### Authentification

L'interface utilise l'authentification JWT du backend :
- Les tokens sont stockés dans `localStorage`
- Les appels API incluent automatiquement le header `Authorization: Bearer <token>`
- Redirection automatique vers `/login` si le token est invalide

## 📱 Pages disponibles

### 1. Page de connexion (`/login`)
- Formulaire d'authentification admin
- Validation des champs avec Zod
- Gestion des erreurs de connexion

### 2. Tableau de bord (`/dashboard`)
- Statistiques des utilisateurs, trajets, réservations
- Graphiques d'activité récente
- Actions rapides

### 3. Gestion des utilisateurs (`/users`)
- Liste complète des utilisateurs
- Filtres par statut et recherche
- Actions : activer/désactiver, supprimer

### 4. Gestion des trajets (`/trips`)
- Liste des trajets avec détails
- Filtres par ville et statut
- Actions de modération

### 5. Gestion des réservations (`/reservations`)
- Suivi des réservations
- Confirmation/annulation
- Filtres avancés

### 6. Gestion des avis (`/reviews`)
- Modération des commentaires
- Système de notation
- Actions de suppression

### 7. Gestion des administrateurs (`/admins`)
- Gestion des comptes admin
- Attribution des rôles
- Activation/désactivation

## 🎨 Design System

### Composants ShadCN UI utilisés
- **Button** : Actions principales et secondaires
- **Card** : Conteneurs de contenu
- **Table** : Affichage des données
- **Input** : Champs de saisie
- **Badge** : Statuts et étiquettes
- **Dialog** : Modales et confirmations

### Palette de couleurs
- **Primary** : Bleu (#3B82F6)
- **Secondary** : Gris (#6B7280)
- **Success** : Vert (#10B981)
- **Warning** : Orange (#F59E0B)
- **Error** : Rouge (#EF4444)

## 🔒 Sécurité

- **Authentification JWT** obligatoire
- **Protection des routes** avec `ProtectedRoute`
- **Intercepteurs Axios** pour la gestion des tokens
- **Validation des données** côté client et serveur

## 📊 API Integration

L'interface se connecte au backend via les endpoints suivants :

```typescript
// Authentification
POST /auth/admin/login
GET /admin/me

// Statistiques
GET /admin/stats

// Utilisateurs
GET /users
PUT /users/{id}
DELETE /users/{id}

// Trajets
GET /trips
DELETE /trips/{id}

// Réservations
GET /reservations
POST /reservations/{id}/confirm
POST /reservations/{id}/cancel

// Avis
GET /reviews
DELETE /reviews/{id}

// Administrateurs
GET /admin/admins
POST /admin/admins
PUT /admin/admins/{id}
DELETE /admin/admins/{id}
```

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Déploiement sur Vercel
1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Déploiement sur Netlify
1. Uploadez le dossier `dist` après build
2. Configurez les redirections pour SPA

## 🔧 Développement

### Structure des dossiers
```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants ShadCN UI
│   ├── Layout.tsx      # Layout principal
│   └── ProtectedRoute.tsx
├── hooks/              # Hooks personnalisés
│   └── useAuth.ts      # Hook d'authentification
├── lib/                # Utilitaires
│   ├── api.ts          # Configuration Axios
│   └── utils.ts        # Fonctions utilitaires
├── pages/              # Pages de l'application
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── UsersPage.tsx
│   └── ...
└── main.tsx            # Point d'entrée
```

### Ajout de nouvelles pages
1. Créer le composant dans `src/pages/`
2. Ajouter la route dans `src/App.tsx`
3. Ajouter le lien dans `src/components/Layout.tsx`

### Ajout de nouveaux composants UI
1. Créer le composant dans `src/components/ui/`
2. Suivre les conventions ShadCN UI
3. Exporter dans `src/components/ui/index.ts`

## 🐛 Dépannage

### Problèmes courants

**Erreur de connexion API**
- Vérifiez l'URL du backend dans `src/lib/api.ts`
- Vérifiez que le backend est accessible
- Vérifiez les logs du backend

**Problèmes d'authentification**
- Vérifiez que le token est bien stocké dans localStorage
- Vérifiez les headers Authorization dans les requêtes
- Vérifiez la validité du token côté serveur

**Problèmes de build**
- Vérifiez les versions des dépendances
- Nettoyez le cache : `npm run clean`
- Réinstallez les dépendances : `rm -rf node_modules && npm install`

## 📈 Évolutions futures

- **Notifications en temps réel** avec WebSocket
- **Export de données** (PDF, Excel)
- **Graphiques avancés** avec Recharts
- **Mode sombre**
- **Internationalisation** (i18n)
- **Tests automatisés** avec Jest et Testing Library

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

---

**BondiMoto Admin** - Interface d'administration moderne et intuitive 🚗✨ 