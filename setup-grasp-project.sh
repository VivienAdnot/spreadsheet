#!/bin/bash

# 🚀 Setup automatique d'un projet Google Apps Script avec TypeScript + Rollup
# Basé sur l'architecture grasp-final - Reproduction exacte en 2 minutes
# 
# Usage: ./setup-grasp-project.sh [nom-du-projet]
# 
# Ce script reproduit EXACTEMENT l'architecture de grasp-final qui a pris
# une journée à optimiser, mais de manière automatique et reproductible.
#
# Prérequis :
# - Node.js (version 12+)
# - Git
# - Compte Google

set -e  # Arrêt en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Header
echo -e "${GREEN}"
echo "🎯 =================================="
echo "   SETUP GRASP PROJECT"  
echo "   Google Apps Script + TypeScript"
echo "=================================="
echo -e "${NC}"

# Vérification des prérequis
log_info "Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé !"
    echo "📥 Installez Node.js depuis : https://nodejs.org/"
    echo "   (Version 12 ou supérieure requise)"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 12 ]; then
    log_error "Node.js version trop ancienne ! (v$NODE_VERSION détectée)"
    echo "📥 Installez Node.js v12+ depuis : https://nodejs.org/"
    exit 1
fi

log_success "Node.js $(node --version) détecté"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    log_error "npm n'est pas installé !"
    echo "📥 npm est généralement inclus avec Node.js"
    exit 1
fi

log_success "npm $(npm --version) détecté"

# Vérifier Git
if ! command -v git &> /dev/null; then
    log_error "Git n'est pas installé !"
    echo "📥 Installez Git :"
    echo "   • macOS : xcode-select --install"
    echo "   • Linux : sudo apt install git"
    echo "   • Windows : https://git-scm.com/"
    exit 1
fi

log_success "Git $(git --version | cut -d' ' -f3) détecté"

log_success "Tous les prérequis sont satisfaits !"
echo

# 1. Demander le nom du projet
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo -e "${BLUE}📖 Usage du script :${NC}"
    echo
    echo "  ./setup-grasp-project.sh [nom-du-projet]"
    echo
    echo -e "${YELLOW}Exemples :${NC}"
    echo "  ./setup-grasp-project.sh mon-extension"
    echo "  ./setup-grasp-project.sh              # Mode interactif"
    echo
    echo -e "${BLUE}🎯 Ce script crée automatiquement :${NC}"
    echo "  • Architecture TypeScript + Rollup complète"
    echo "  • Extension Google Sheets prête à l'emploi"
    echo "  • Connexion et déploiement Google Apps Script"
    echo "  • Environnement de développement avec hot reload"
    echo
    echo -e "${GREEN}✨ En 2 minutes, votre extension sera LIVE !${NC}"
    exit 0
fi

if [ -z "$1" ]; then
    echo -e "${YELLOW}💭 Quel est le nom de votre projet ?${NC}"
    read -p "Nom du projet (ex: my-extension): " PROJECT_NAME
else
    PROJECT_NAME=$1
fi

# Validation du nom
if [ -z "$PROJECT_NAME" ]; then
    log_error "Nom de projet requis !"
    exit 1
fi

log_info "Création du projet: $PROJECT_NAME"

# 2. Créer le dossier projet
if [ -d "$PROJECT_NAME" ]; then
    log_warning "Le dossier $PROJECT_NAME existe déjà !"
    read -p "Continuer quand même ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

log_success "Dossier créé: $PROJECT_NAME/"

# 3. Initialiser package.json
log_info "Configuration package.json..."
cat > package.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "description": "Google Apps Script extension avec TypeScript + Rollup",
  "main": "build/index.js",
  "scripts": {
    "build": "rollup -c",
    "compile": "npm run build",
    "watch": "npm-run-all --parallel watch:*",
    "watch:build": "rollup -c --watch",
    "watch:push": "nodemon --watch build --exec \\"clasp push --force\\"",
    "push": "clasp push --force",
    "login": "clasp login",
    "create": "clasp create --type sheets --title \\"$PROJECT_NAME\\"",
    "open": "clasp open",
    "deploy": "npm run build && npm run push",
    "setup": "npm install && npm run login && npm run create",
    "dev": "npm run watch"
  },
  "keywords": ["google-apps-script", "typescript", "rollup"],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@babel/core": "^7.17.5",
    "@babel/plugin-transform-runtime": "^7.18.2",
    "@babel/preset-env": "^7.12.11",
    "@babel/preset-typescript": "^7.16.7",
    "@babel/runtime": "^7.27.6",
    "@google/clasp": "^2.4.1",
    "@rollup/plugin-babel": "^6.0.4",
    "@rollup/plugin-commonjs": "^25.0.7",
    "@rollup/plugin-node-resolve": "^15.2.3",
    "@types/google-apps-script": "^1.0.83",
    "nodemon": "^3.0.1",
    "npm-run-all": "^4.1.5",
    "rollup": "^4.1.4",
    "rollup-plugin-copy": "^3.5.0",
    "typescript": "^5.2.2"
  }
}
EOF

log_success "package.json configuré"

# 4. Configuration TypeScript
log_info "Configuration TypeScript..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "ES2020",
    "lib": ["ES2019"],
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "types": ["google-apps-script"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build"]
}
EOF

log_success "tsconfig.json configuré"

# 5. Configuration Rollup
log_info "Configuration Rollup..."
cat > rollup.config.js << 'EOF'
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

const extensions = ['.ts', '.js'];

const preventTreeShakingPlugin = () => {
  return {
    name: 'no-treeshaking',
    resolveId(id, importer) {
      if (!importer) {
        // let's not treeshake entry points, as we're not exporting anything in App Scripts
        return { id, moduleSideEffects: 'no-treeshake' };
      }
      return null;
    },
  };
};

export default {
  input: './src/index.ts',
  output: {
    dir: 'build',
    format: 'es',
    compact: true,
  },
  plugins: [
    copy({
      targets: [
        { src: './src/**/*.html', dest: 'build' }
      ]
    }),
    preventTreeShakingPlugin(),
    nodeResolve({
      extensions,
      mainFields: ['jsnext:main', 'main'],
    }),
    commonjs(),
    babel({
      extensions,
      babelHelpers: 'runtime',
      skipPreflightCheck: true,
      compact: true,
    })
  ],
};
EOF

log_success "rollup.config.js configuré"

# 6. Configuration Babel
log_info "Configuration Babel..."
cat > .babelrc << 'EOF'
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "node": "12"
      }
    }],
    "@babel/preset-typescript"
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "regenerator": true
    }]
  ]
}
EOF

log_success ".babelrc configuré"

# 7. Configuration Clasp
log_info "Configuration Clasp..."
cat > .claspignore << 'EOF'
# Dependencies
node_modules/**

# Source files (seul le build/ est déployé)
src/**

# Config files
package.json
package-lock.json
tsconfig.json
rollup.config.js
.babelrc
.claspignore

# Development
.git/**
.vscode/**
README.md
*.sh
EOF

log_success ".claspignore configuré"

# 8. Configuration Google Apps Script
log_info "Configuration Google Apps Script..."
cat > appsscript.json << EOF
{
  "timeZone": "Europe/Paris",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
EOF

log_success "appsscript.json configuré"

# 9. Créer le dossier src et le fichier principal
log_info "Création du code source..."
mkdir -p src

# Créer un nom de fonction valide (enlever tirets, espaces, capitaliser)
FUNCTION_NAME=$(echo "$PROJECT_NAME" | sed 's/[-_]//g' | sed 's/\b\w/\U&/g')

cat > src/index.ts << EOF
/**
 * $PROJECT_NAME - Google Apps Script Extension
 * Architecture: TypeScript + Rollup
 */

/**
 * Fonction appelée à l'ouverture du Google Sheets
 * Crée le menu de l'extension
 */
function onOpen(): void {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('🚀 Lancer $PROJECT_NAME', 'launch$FUNCTION_NAME')
    .addItem('ℹ️ À propos', 'showAbout')
    .addToUi();
}

/**
 * Fonction principale de l'extension
 */
function launch$FUNCTION_NAME(): void {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  
  ui.alert(
    '🎯 $PROJECT_NAME', 
    'Extension TypeScript prête !\\n\\n' +
    'Feuille active: ' + sheet.getName() + '\\n' +
    'Développé avec TypeScript + Rollup',
    ui.ButtonSet.OK
  );
  
  console.log('🎯 $PROJECT_NAME lancé avec succès');
}

/**
 * Affiche les informations sur l'extension
 */
function showAbout(): void {
  const ui = SpreadsheetApp.getUi();
  
  ui.alert(
    'À propos de $PROJECT_NAME',
    '🛠️ Extension Google Apps Script\\n' +
    '⚡ TypeScript + Rollup\\n' +
    '🎯 Architecture moderne\\n\\n' +
    'Prêt pour le développement !',
    ui.ButtonSet.OK
  );
}

/**
 * Fonction de test pour vérifier le fonctionnement
 */
function testFunction(): void {
  console.log('✅ Test OK - Extension configurée correctement');
  return;
}
EOF

log_success "Code source créé: src/index.ts"

# 10. Créer le README
log_info "Création de la documentation..."
cat > README.md << EOF
# 🎯 $PROJECT_NAME

Google Apps Script extension avec architecture TypeScript + Rollup.

## 🚀 Installation

L'environnement est déjà configuré ET déployé ! Votre extension est LIVE !

Pour continuer le développement :

\`\`\`bash
# Mode développement avec hot reload
npm run watch
# ✨ Auto-compile + auto-deploy à chaque changement
\`\`\`

## 💻 Développement

### Mode watch (recommandé)
\`\`\`bash
npm run watch
# ✨ Auto-compile + auto-deploy à chaque changement
\`\`\`

### Mode manuel
\`\`\`bash
npm run compile    # TypeScript → JavaScript
npm run push       # Deploy vers Google Apps Script
npm run open       # Ouvrir l'éditeur Google Apps Script
\`\`\`

## 🏗️ Architecture

\`\`\`
$PROJECT_NAME/
├── 📁 src/                 ← Sources TypeScript
│   └── 📄 index.ts         # Point d'entrée (DEV)
├── 📁 build/               ← Code compilé (AUTO-GÉNÉRÉ)
│   └── 📄 index.js         # Code final déployé
├── 📄 appsscript.json      ← Config Google Apps Script
├── 📄 rollup.config.js     ← Configuration build
├── 📄 tsconfig.json        ← Configuration TypeScript
├── 📄 .babelrc             ← Configuration Babel
├── 📄 .claspignore         ← Fichiers ignorés par clasp
└── 📄 package.json         ← Scripts et dépendances
\`\`\`

## 🔧 Workflow

1. **Modifier** \`src/index.ts\` avec TypeScript
2. **Auto-compilation** → \`build/index.js\` 
3. **Auto-deploy** → Google Apps Script
4. **Tester** dans Google Sheets

## 🎯 Fonctionnalités actuelles

- ✅ Menu d'extension dans Google Sheets
- ✅ Fonction de lancement \`launch$FUNCTION_NAME()\`
- ✅ Fonction "À propos" \`showAbout()\`
- ✅ Fonction de test \`testFunction()\`

## 📝 Ajouter des fonctionnalités

Éditez \`src/index.ts\` et ajoutez vos fonctions TypeScript :

\`\`\`typescript
function maNouvelleFonction(): void {
  // Votre code TypeScript ici
  console.log('🎯 Nouvelle fonctionnalité !');
}
\`\`\`

Le build et le déploiement sont automatiques avec \`npm run watch\` !

---

**$PROJECT_NAME** - Généré avec setup-grasp-project.sh ✨
EOF

log_success "README.md créé"

# 11. Créer le dossier build (vide)
mkdir -p build
echo "# Dossier auto-généré par Rollup" > build/.gitkeep

log_success "Structure du projet complète"

# 12. Installation des dépendances
log_info "Installation des dépendances npm..."
npm install

log_success "Dépendances installées"

# 13. Build initial
log_info "Build initial..."
npm run build

log_success "Build initial réussi"

# 14. Configuration et déploiement automatique Google Apps Script
log_info "Configuration Google Apps Script..."

# Login automatique (si pas déjà connecté)
if [ ! -f ~/.clasprc.json ]; then
    log_info "Connexion à Google Apps Script..."
    npm run login
    log_success "Connexion réussie"
else
    log_info "Déjà connecté à Google Apps Script"
fi

# Créer le projet Google Apps Script
log_info "Création du projet Google Apps Script..."
npm run create
log_success "Projet Google Apps Script créé"

# Premier déploiement
log_info "Premier déploiement du code..."
npm run push
log_success "Code déployé vers Google Apps Script"

# Ouvrir l'éditeur
log_info "Ouverture de l'éditeur Google Apps Script..."
npm run open
log_success "Éditeur ouvert dans le navigateur"

# 15. Message final
echo
echo -e "${GREEN}🎉 =================================="
echo "   PROJET $PROJECT_NAME PRÊT !"
echo "==================================="
echo -e "${NC}"
echo
log_success "🚀 Extension Google Sheets complètement configurée !"
log_success "📝 Code TypeScript déployé et fonctionnel"
log_success "🌐 Éditeur Google Apps Script ouvert"
echo
log_info "Pour continuer le développement:"
echo "• Éditez src/index.ts avec vos fonctionnalités"
echo "• Lancez: npm run watch (auto-compile + auto-deploy)"
echo "• Testez dans Google Sheets avec le menu Extensions"
echo
log_info "Fichiers importants:"
echo "• src/index.ts     → Code source TypeScript"
echo "• build/index.js   → Code compilé (auto-généré)"
echo "• README.md        → Documentation complète"
echo
echo -e "${BLUE}🎯 Votre extension est maintenant LIVE dans Google Apps Script !${NC}"
echo -e "${GREEN}✨ Développement moderne avec TypeScript + Hot Reload activé !${NC}"
echo
