# 🚀 Setup Grasp Project

Script automatique pour créer des extensions Google Sheets avec TypeScript + Rollup en 2 minutes.

## ✨ Ce que fait ce script

**UNE SEULE COMMANDE** pour avoir :
- 🏗️ **Architecture TypeScript + Rollup** complète et optimisée
- 📱 **Extension Google Sheets** prête à l'emploi  
- ☁️ **Déploiement automatique** vers Google Apps Script
- ⚡ **Hot reload** pour le développement

**Résultat :** Extension Google Sheets LIVE et fonctionnelle !

## 🎯 Prérequis

Avant d'utiliser le script, assurez-vous d'avoir :

### 1. **Node.js** (version 12+)
```bash
# Vérifier si installé :
node --version
npm --version

# Installer si nécessaire :
# https://nodejs.org/
```

### 2. **Git**
```bash
# Vérifier si installé :
git --version

# Installer si nécessaire :
# macOS : xcode-select --install
# Linux : sudo apt install git  
# Windows : https://git-scm.com/
```

### 3. **Compte Google**
- Avoir un compte Google (Gmail, etc.)
- Première utilisation : accepter les permissions Google Apps Script

### ✅ Vérification rapide
```bash
node --version  # Doit afficher v12+ 
npm --version   # Doit afficher une version
git --version   # Doit afficher une version
```

## 🚀 Utilisation

### Télécharger le script
```bash
curl -O https://raw.githubusercontent.com/VivienAdnot/spreadsheet/main/setup-grasp-project.sh
chmod +x setup-grasp-project.sh
```

### Option 1 : Avec nom de projet
```bash
./setup-grasp-project.sh mon-extension-geniale
```

### Option 2 : Mode interactif
```bash
./setup-grasp-project.sh
# Le script demande le nom du projet
```

### Aide
```bash
./setup-grasp-project.sh --help
```

## 🎯 Ce qui se passe automatiquement

1. ✅ **Vérification des prérequis** (Node.js, Git)
2. ✅ **Création de l'architecture** TypeScript + Rollup
3. ✅ **Installation des dépendances** npm
4. ✅ **Build initial** du code TypeScript
5. ✅ **Connexion Google Apps Script** (clasp login)
6. ✅ **Création du projet Google Sheets** + Apps Script
7. ✅ **Premier déploiement** du code
8. ✅ **Ouverture de l'éditeur** Google Apps Script

**Temps total : ~2 minutes** ⏱️

## 📂 Structure générée

```
mon-extension/
├── 📁 src/                 ← Sources TypeScript
│   └── 📄 index.ts         # Point d'entrée (DEV)
├── 📁 build/               ← Code compilé (AUTO-GÉNÉRÉ)
│   └── 📄 index.js         # Code final déployé
├── 📄 appsscript.json      ← Config Google Apps Script
├── 📄 rollup.config.js     ← Configuration build
├── 📄 tsconfig.json        ← Configuration TypeScript
├── 📄 .babelrc             ← Configuration Babel
├── 📄 .claspignore         ← Fichiers ignorés par clasp
├── 📄 package.json         ← Scripts et dépendances
└── 📄 README.md            ← Documentation du projet
```

## 🔧 Développement après création

### Mode développement (recommandé)
```bash
cd mon-extension
npm run watch
# ✨ Auto-compile + auto-deploy à chaque changement
```

### Commandes disponibles
```bash
npm run compile    # TypeScript → JavaScript
npm run push       # Deploy vers Google Apps Script
npm run open       # Ouvrir l'éditeur Google Apps Script
npm run watch      # Mode développement avec hot reload
```

## 🎯 Fonctionnalités incluses

L'extension générée contient :

- ✅ **Menu dans Google Sheets** (Extensions → Votre extension)
- ✅ **Fonction principale** avec interface utilisateur
- ✅ **Fonction "À propos"** avec informations
- ✅ **Fonction de test** pour vérifier le fonctionnement
- ✅ **Architecture TypeScript** avec types Google Apps Script
- ✅ **Build system** optimisé pour Google Apps Script

## 📝 Ajouter des fonctionnalités

1. **Éditez** `src/index.ts` avec vos fonctions TypeScript
2. **Sauvegardez** - Le code est auto-compilé et déployé
3. **Testez** dans Google Sheets avec le menu Extensions

Exemple :
```typescript
function maNouvelleFonction(): void {
  const ui = SpreadsheetApp.getUi();
  ui.alert('🎯 Ma nouvelle fonctionnalité !');
}
```

## 🆚 Avantages vs configuration manuelle

| Aspect | Configuration manuelle | **Ce script** |
|--------|----------------------|---------------|
| **Temps de setup** | 1-2 heures | **2 minutes** |
| **Configuration** | 15+ fichiers à créer | **Automatique** |
| **Erreurs** | Beaucoup de debug | **Zéro erreur** |
| **Architecture** | À apprendre/optimiser | **Production-ready** |
| **Déploiement** | Setup complexe | **Automatique** |

## 🐛 Résolution de problèmes

### Erreur "Node.js n'est pas installé"
```bash
# Installer Node.js depuis https://nodejs.org/
node --version  # Vérifier l'installation
```

### Erreur "Git n'est pas installé"
```bash
# macOS
xcode-select --install

# Linux
sudo apt install git

# Windows
# Télécharger depuis https://git-scm.com/
```

### Problème de permissions Google
- Aller sur https://script.google.com/
- Accepter les permissions lors du premier login
- Re-lancer le script

### Extension non visible dans Google Sheets
1. Ouvrir le Google Sheets créé par le script
2. Actualiser la page (F5)
3. Aller dans Extensions → Le menu devrait apparaître

## 🎯 Architecture technique

### Pipeline de build
```
📝 TypeScript (src/index.ts)
    ↓ Rollup + Babel
📦 JavaScript optimisé (build/index.js)
    ↓ Clasp
☁️ Google Apps Script
    ↓ 
📱 Extension Google Sheets
```

### Technologies utilisées
- **TypeScript** - Types et développement moderne
- **Rollup** - Bundler optimisé pour Google Apps Script  
- **Babel** - Transpilation compatible
- **Clasp** - CLI Google Apps Script
- **npm-run-all** - Parallélisation des tâches

## 📚 Ressources

- [📖 Documentation TypeScript](https://www.typescriptlang.org/)
- [📖 Google Apps Script](https://developers.google.com/apps-script)
- [📖 Clasp CLI](https://github.com/google/clasp)
- [📖 Rollup](https://rollupjs.org/)

## 🤝 Contribution

Ce script reproduit l'architecture optimisée de `grasp-final` qui a nécessité une journée complète de développement et de debug. Il automatise tout le processus pour permettre à quiconque de créer des extensions Google Sheets modernes en quelques minutes.

---

**Setup Grasp Project** - Extensions Google Sheets en 2 minutes ✨
