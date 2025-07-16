# Grasp - Extension Goog3. **Vous devriez voir le menu "🔥 Grasp"** dans la barre de menus

## 🔧 ConfigurationSheets

Cette extension permet d'uploader le contenu d'une feuille Google Sheets vers un bucket S3 via une API backend.

## 🚀 Installation

### 1. Créer un nouveau projet Google Apps Script
1. Allez sur [script.google.com](https://script.google.com)
2. Cliquez sur "Nouveau projet"
3. Copiez le contenu des fichiers dans l'éditeur :
   - `Code.gs` → dans le fichier principal
   - `sidebar.html` → créer un nouveau fichier HTML
   - `appsscript.json` → dans le fichier de configuration

### 2. Configuration des permissions
1. Dans l'éditeur Apps Script, allez dans **Manifeste** (appsscript.json)
2. Vérifiez que les permissions OAuth sont correctes :
   - `https://www.googleapis.com/auth/spreadsheets.currentonly`
   - `https://www.googleapis.com/auth/script.container.ui`

### 3. Tester l'extension
1. Ouvrez une feuille Google Sheets
2. Exécutez la fonction `onOpen()` depuis l'éditeur Apps Script
3. Retournez dans Google Sheets
4. Vous devriez voir le menu "📤 S3 Upload" dans la barre de menus

## 🔧 Configuration

### API Backend
Modifiez l'URL dans `Code.gs` ligne 82 :
```javascript
const API_URL = 'VOTRE_URL_API_ICI';
```

### Déploiement
1. Dans Apps Script, cliquez sur **Déployer** > **Nouveau déploiement**
2. Choisissez **Add-on**
3. Configurez les permissions
4. Déployez

## 📊 Utilisation

1. **Ouvrez une feuille Google Sheets**
2. **Cliquez sur "� Grasp"** dans le menu
3. **Cliquez sur "Ouvrir le panneau"**
4. **Le sidebar s'ouvre à droite** avec :
   - Informations de la feuille courante
   - Bouton d'upload
   - Status en temps réel

## 🎯 Fonctionnalités

- ✅ **Sidebar intégré** dans Google Sheets
- ✅ **Lecture automatique** des données de la feuille active
- ✅ **Upload vers API** avec gestion d'erreurs
- ✅ **Interface utilisateur** intuitive
- ✅ **Gestion du statut** en temps réel
- ✅ **Permissions minimales** (lecture seule de la feuille courante)

## 🔗 Structure des données envoyées

```json
{
  "timestamp": "2025-07-16T10:30:00.000Z",
  "data": {
    "sheets": [{
      "name": "Feuille1",
      "data": [["A1", "B1"], ["A2", "B2"]],
      "rows": 2,
      "columns": 2
    }],
    "metadata": {
      "spreadsheetId": "1ABC...",
      "spreadsheetName": "Mon Spreadsheet",
      "sheetName": "Feuille1",
      "timestamp": "2025-07-16T10:30:00.000Z",
      "version": "1.0"
    }
  },
  "format": "json",
  "source": "grasp-extension"
}
```

## 🛠️ Développement

### Logs
Les logs sont disponibles dans Apps Script : **Exécutions** > **Voir les logs**

### Debug
Pour déboguer, utilisez `Logger.log()` dans le code Apps Script.

### Test local
Votre API backend doit être accessible depuis Google Apps Script. Pour tester localement, utilisez ngrok ou un service similaire.
