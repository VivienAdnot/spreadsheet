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

## 🏗️ Architecture Refactorisée

### 📋 Séparation des responsabilités

**Avant :**
```
Code.gs → Toute la logique (données + business + validation)
App.vue → Interface uniquement
```

**Après :**
```
Code.gs → Couche d'accès aux données uniquement
App.vue → Logique métier + validation + traitement
Components/ → Composants réutilisables
Utils/ → Utilitaires de validation
```

### 🔧 **Code.gs** - Couche d'accès aux données

```javascript
// Fonctions d'accès aux données Google Sheets
function getSheetData() { /* Récupère les données brutes */ }
function getCellRange(range) { /* Récupère une plage spécifique */ }
function getCurrentSheetInfo() { /* Infos de la feuille */ }
function uploadToApi(data) { /* Upload réseau */ }
function performUpload(processedData) { /* Bridge vers API */ }
```

### 🎨 **App.vue** - Logique métier

```vue
<script setup lang="ts">
// Validation des données
const validateSheetData = (data) => { /* Règles de validation */ }

// Traitement des données
const processSheetData = (data) => { /* Formatage */ }

// Préparation upload
const prepareUploadPayload = (data) => { /* Payload API */ }
</script>
```

### 🔍 **ValidationPanel.vue** - Composant de validation

```vue
<template>
  <div class="validation-panel">
    <div v-if="errorCount > 0">
      ⚠️ {{ errorCount }} erreur(s) trouvée(s)
    </div>
    <!-- Affichage des erreurs par cellule -->
  </div>
</template>
```

### 🛠️ **utils/validation.ts** - Utilitaires

```typescript
// Validation configurable
export const validateSheet = (data, rules) => { /* ... */ }

// Types de validation
export const validateRequired = (value, row, col) => { /* ... */ }
export const validateFormat = (value, row, col, format) => { /* ... */ }
export const validateRange = (value, row, col, min, max) => { /* ... */ }
export const validateCustom = (value, row, col, validator) => { /* ... */ }
```

### 🎯 **Avantages de cette architecture**

- ✅ **Logique testable** en Vue.js
- ✅ **Validation réactive** avec TypeScript
- ✅ **Règles configurables** depuis l'interface
- ✅ **Séparation claire** des responsabilités
- ✅ **Extensible** pour futures fonctionnalités
- ✅ **Composants réutilisables**

### 🔮 **Prêt pour les fonctionnalités avancées**

Cette architecture permet maintenant d'ajouter facilement :
- Validation avec règles du backend
- Sélection de plages spécifiques
- Validation en temps réel
- Règles personnalisées par colonne
- Interface de configuration des validations

## API Backend

Utilise la même API que Grasp V1 avec source: `'grasp-v2-vue-typescript'`

## Technologies

- **Vue.js 3** - Framework réactif
- **TypeScript** - Typage statique
- **Vite** - Build tool moderne
- **Google Apps Script** - Backend Google Sheets
- **Express.js** - API REST (partagée)

## 🛠️ Outils & Rôles

### 🔧 **Vite** - Build Tool Frontend

**Ce que fait Vite :**
```bash
npm run build
```

**Input :**
```
frontend/
├── App.vue         ← Composant Vue avec <template>, <script>, <style>
├── main.ts         ← Point d'entrée TypeScript
└── types.ts        ← Types TypeScript
```

**Output :**
```
frontend/dist/
├── bundle.js       ← Vue.js + TypeScript compilé (61 KB)
└── bundle.css      ← Styles CSS extraits (2 KB)
```

**Transformations :**
- ✅ **Vue SFC** → JavaScript vanilla
- ✅ **TypeScript** → JavaScript 
- ✅ **CSS scoped** → CSS normal
- ✅ **Import/Export** → Code compatible navigateur
- ✅ **Minification** → Code optimisé

### 📤 **Clasp** - Déploiement Google Apps Script

**Ce que fait Clasp :**
```bash
npm run deploy
```

**Input :**
```
gas-files/
├── Code.gs         ← Google Apps Script (JavaScript)
├── sidebar.html    ← HTML avec Vue.js injecté
└── appsscript.json ← Configuration Google Apps Script
```

**Action :**
- ✅ **Authentification** Google
- ✅ **Upload** fichiers vers Google Apps Script
- ✅ **Synchronisation** avec le projet Google
- ✅ **Déploiement** dans Google Sheets

### 🔄 **Flux complet**

```
1. App.vue (Vue + TypeScript)
        ↓ (Vite build)
2. bundle.js + bundle.css
        ↓ (build-sidebar.js)
3. sidebar.html avec Vue injecté
        ↓ (Clasp deploy)
4. Google Apps Script (accessible dans Google Sheets)
```

### 🎯 **Analogie simple**

- **Vite** = Compilateur (transforme ton code moderne en code compatible)
- **Clasp** = Livreur (prend tes fichiers et les met sur Google)

**Note :** Pas besoin de **Rollup** - Vite utilise Rollup en interne pour le bundling.

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
