# 🔥 Grasp Google Workspace Add-on

Extension Google Sheets publiable sur le Google Workspace Marketplace avec Vue.js + TypeScript.

## 🎯 Différences avec grasp-v2

| Aspect | grasp-v2 | grasp-addon |
|--------|----------|-------------|
| **Architecture** | Code.gs + HtmlService | Cards + iframe externe |
| **Interface** | Sidebar intégré | Iframe dans nouvel onglet |
| **API Access** | google.script.run | HTTP REST uniquement |
| **Déploiement** | Développeur uniquement | Google Workspace Marketplace |
| **Sécurité** | Accès direct aux feuilles | API Google Sheets v4 |
| **Scalabilité** | Limitée | Production-ready |

## 🏗️ Architecture

```
grasp-addon/
├── appsscript.json         ← Manifest Google Workspace Add-on
├── Code.gs                 ← Point d'entrée minimal (Cards)
├── .clasp.json             ← Configuration déploiement
├── frontend/               ← Application Vue.js
│   ├── App.vue             ← Interface principale
│   ├── main.ts             ← Point d'entrée Vue
│   ├── types.ts            ← Types TypeScript
│   └── services/           ← Services API
│       ├── googleSheets.ts ← API Google Sheets v4
│       └── graspApi.ts     ← API Grasp
├── public/
│   └── iframe.html         ← Page HTML pour iframe
├── dist/                   ← Bundles compilés
├── build-addon.js          ← Script de build
└── package.json            ← Configuration Node.js
```

## 🔧 Technologies

- **Vue.js 3** - Framework réactif moderne
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Google Apps Script** - Runtime Google (minimal)
- **Google Sheets API v4** - Accès aux données REST
- **Axios** - Client HTTP
- **Cards Service** - Interface native Google

## 🚀 Installation & Développement

### 1. Installation des dépendances

```bash
cd grasp-addon/
npm install
```

### 2. Configuration

1. **Créer un projet Google Apps Script**
2. **Copier le Script ID** dans `.clasp.json`
3. **Configurer les URLs** dans `Code.gs`

### 3. Développement

```bash
# Développement Vue.js
npm run dev

# Build de production
npm run build

# Build complet add-on
npm run build-addon
```

### 4. Déploiement

```bash
# Déployer vers Google Apps Script
clasp push

# Tester l'add-on
clasp open
```

## 🛠️ Outils & Rôles

### 🔧 **Vite** - Build Frontend
- Compile Vue.js + TypeScript → JavaScript
- Génère `dist/bundle.js` et `dist/bundle.css`
- Hot reload en développement

### 📦 **build-addon.js** - Injection Bundle
- Lit les bundles compilés
- Injecte dans `public/iframe.html`
- Prépare pour déploiement

### 📤 **Clasp** - Déploiement Google
- Upload `Code.gs` et `iframe.html`
- Synchronise avec Google Apps Script
- Publie sur Google Workspace Marketplace

## 🔌 APIs & Services

### 📊 **Google Sheets API v4**
- Lecture/écriture des données
- Métadonnées des spreadsheets
- Authentification OAuth automatique

### 🔥 **Grasp API**
- Upload des données
- Règles de validation
- Endpoints REST

### 🎨 **Cards Service**
- Interface native Google
- Boutons d'action
- Notifications

## 🌐 Flux de données

```
Google Sheets
    ↓ (Cards Service)
Code.gs (point d'entrée)
    ↓ (openLink)
iframe.html (Vue.js app)
    ↓ (Google Sheets API v4)
Lecture/écriture données
    ↓ (Grasp API)
Upload & validation
```

## 🔐 Sécurité & Permissions

### OAuth Scopes requis
```json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/script.container.ui",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

### URL Whitelist
```json
{
  "urlFetchWhitelist": [
    "https://api.grasp.gg",
    "https://sheets.googleapis.com",
    "https://www.googleapis.com"
  ]
}
```

## 🧪 Tests & Validation

### Tests locaux
1. **Interface Vue.js** → `npm run dev`
2. **Build complet** → `npm run build-addon`
3. **Déploiement** → `clasp push`

### Tests add-on
1. **Ouverture Cards** → Google Sheets → Add-ons → Grasp
2. **Interface iframe** → Clic sur "Ouvrir Grasp"
3. **Fonctionnalités** → Validation + Upload

## 📱 Interface utilisateur

### Cards (point d'entrée)
- Header avec logo et titre
- Description des fonctionnalités
- Bouton "Ouvrir Grasp"

### Iframe (application principale)
- Statut de connexion API
- Informations du spreadsheet
- Validation des données
- Upload vers Grasp
- Messages et notifications

## 🎯 Fonctionnalités

### ✅ **Validation des données**
- Règles configurables
- Validation en temps réel
- Affichage des erreurs
- Support des formats (email, date, etc.)

### 🚀 **Upload vers Grasp**
- Formatage automatique
- Gestion des erreurs
- Statut de progression
- Confirmation de succès

### 🔄 **Synchronisation**
- Lecture Google Sheets API
- Mise à jour en temps réel
- Gestion des permissions
- Authentification automatique

## 📈 Avantages de cette architecture

### 🎯 **Publiable**
- Conforme aux standards Google Workspace
- Prêt pour le Marketplace
- Gestion des permissions

### 🔧 **Maintenable**
- Code Vue.js moderne
- Types TypeScript
- Services séparés
- Tests possibles

### 🚀 **Scalable**
- Architecture découplée
- API REST
- Déploiement séparé du frontend
- Monitoring possible

### 🔐 **Sécurisé**
- OAuth Google
- Permissions granulaires
- Validation côté serveur
- Chiffrement HTTPS

## 🔄 Migration depuis grasp-v2

Pour migrer du code existant :

1. **Logique métier** → Déplacer dans `services/`
2. **Validation** → Adapter pour API REST
3. **Interface** → Retravailler pour iframe
4. **Tests** → Adapter pour environnement add-on

## 🚀 Déploiement Production

### 1. Hébergement frontend
- Netlify, Vercel, ou Google Cloud
- HTTPS obligatoire
- Domaine personnalisé

### 2. Configuration add-on
- Mettre à jour `getAddonUrl()` dans `Code.gs`
- Configurer les variables d'environnement
- Tester en mode production

### 3. Publication Marketplace
- Soumettre à Google pour review
- Respecter les guidelines
- Fournir documentation utilisateur

---

**Grasp Add-on** - Production-ready Google Workspace Add-on avec Vue.js + TypeScript
