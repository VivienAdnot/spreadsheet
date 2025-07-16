# Grasp V2 - Vue.js + TypeScript

Extension Google Sheets avec Vue.js et TypeScript pour uploader les données vers une API.

## Architecture

```
grasp-v2/
├── frontend/
│   ├── App.vue         ← Composant Vue principal
│   ├── main.ts         ← Point d'entrée Vue
│   ├── types.ts        ← Types TypeScript
│   └── dist/
│       ├── bundle.js   ← Bundle généré par Vite
│       └── bundle.css  ← Styles CSS
├── gas-files/          ← Fichiers deployés sur Google Apps Script
│   ├── Code.gs         ← Google Apps Script
│   ├── sidebar.html    ← HTML avec Vue intégré
│   └── appsscript.json ← Configuration Google Apps Script
├── build-sidebar.js    ← Script pour intégrer Vue dans HTML
├── clasp.json          ← Configuration Clasp (local uniquement)
├── package.json        ← Dépendances et scripts
├── vite.config.ts      ← Configuration Vite
└── tsconfig.json       ← Configuration TypeScript
```

## Installation

```bash
npm install
```

## Développement

```bash
# Développement Vue.js
npm run dev

# Build du projet
npm run build

# Génération du sidebar final
npm run build-sidebar

# Build complet (Vue + Sidebar)
npm run build-all
```

## Déploiement

1. **Configurer clasp.json** avec votre script ID à la racine du projet
2. **Builder le projet** : `npm run build-all`
3. **Déployer** : `npm run deploy` (build + upload vers Google Apps Script)

> **Note :** Seuls les fichiers dans `gas-files/` sont uploadés vers Google Apps Script

## Utilisation

1. Ouvrez votre Google Sheet
2. Menu **🚀 Grasp V2** → **Ouvrir le panneau**
3. Cliquez sur **🚀 Uploader la feuille**
4. Les données sont envoyées vers l'API backend

## Différences avec V1

- ✅ **Vue.js 3** avec Composition API
- ✅ **TypeScript** avec types stricts
- ✅ **Vite** pour le build et le dev
- ✅ **Réactivité** Vue.js native
- ✅ **Composants** réutilisables
- ✅ **Types** pour l'interface Google Apps Script

## API Backend

Utilise la même API que Grasp V1 avec source: `'grasp-v2-vue-typescript'`

## Technologies

- **Vue.js 3** - Framework réactif
- **TypeScript** - Typage statique
- **Vite** - Build tool moderne
- **Google Apps Script** - Backend Google Sheets
- **Express.js** - API REST (partagée)

## Processus de Build & Déploiement

### 1. 📦 Build du Bundle Vue.js

```bash
npm run build
```

**Génère :**
- `frontend/dist/bundle.js` (61 KB) : Vue.js 3 + composant App.vue + logique TypeScript
- `frontend/dist/bundle.css` (2 KB) : Styles CSS avec scope Vue

### 2. 🔧 Injection du Bundle dans le Sidebar

```bash
npm run build-sidebar
```

**Le script `build-sidebar.js` :**
1. Lit `frontend/dist/bundle.js` et `frontend/dist/bundle.css`
2. Injecte le CSS dans `<style>` du template `gas-files/sidebar.html`
3. Injecte le JavaScript dans `<script>` du template
4. Génère le fichier final `gas-files/sidebar.html` (191 KB)

### 3. 🚀 Déploiement vers Google Apps Script

```bash
npm run deploy
```

**Upload uniquement :**
- `gas-files/Code.gs` : Fonctions Google Apps Script
- `gas-files/sidebar.html` : HTML avec Vue.js intégré (191 KB)
- `gas-files/appsscript.json` : Configuration GAS

## 🌐 Configuration Backend & Ngrok

### API Backend (partagée avec V1)

```bash
# Démarrer l'API backend
cd ../api
npm install
npm start
# → API disponible sur http://localhost:3000
```

### Ngrok (exposition publique)

```bash
# Terminal séparé - exposer l'API
ngrok http 3000
# → Génère une URL publique (ex: https://abc123.ngrok.io)
```

### ⚠️ Important : URL Ngrok change à chaque redémarrage

**À chaque redémarrage de ngrok, l'URL change !**

1. **Relancer ngrok** : `ngrok http 3000`
2. **Copier la nouvelle URL** (ex: `https://xyz789.ngrok.io`)
3. **Mettre à jour Code.gs** dans `gas-files/Code.gs` :

```javascript
// Ligne 19 dans gas-files/Code.gs
const API_URL = 'https://NOUVELLE-URL-NGROK.ngrok.io/upload';
```

4. **Redéployer** : `npm run deploy`

### 🚀 Workflow quotidien

```bash
# 1. Démarrer l'API
cd ../api && npm start

# 2. Démarrer ngrok (terminal séparé)
ngrok http 3000

# 3. Copier l'URL ngrok et mettre à jour gas-files/Code.gs
# 4. Redéployer si l'URL a changé
npm run deploy
```

### 4. 🎯 Résultat dans Google Sheets

1. **Code.gs** : Crée le menu "🚀 Grasp V2" et affiche le sidebar
2. **sidebar.html** : Se charge avec Vue.js intégré
3. **Vue.js** : Monte le composant App.vue dans `<div id="app">`
4. **Interface** : Réactive et fonctionnelle avec TypeScript

### 📊 Flux de Données

```
frontend/App.vue (TypeScript)
    ↓ (npm run build)
frontend/dist/bundle.js (61 KB)
    ↓ (npm run build-sidebar)
gas-files/sidebar.html (191 KB)
    ↓ (npm run deploy)
Google Apps Script
    ↓ (sidebar ouvert)
Interface Vue.js dans Google Sheets
```

### 🔍 Contenu des Fichiers

| Fichier | Contenu | Taille |
|---------|---------|--------|
| `frontend/App.vue` | Composant Vue + TypeScript | Source |
| `frontend/dist/bundle.js` | Vue.js 3 + App compilé | 61 KB |
| `frontend/dist/bundle.css` | Styles CSS avec scope | 2 KB |
| `gas-files/sidebar.html` | HTML + Vue.js injecté | 191 KB |
| `gas-files/Code.gs` | Google Apps Script | 4.5 KB |
