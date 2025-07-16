# 🔧 API Backend

Backend Express.js partagé pour les extensions Google Sheets Grasp V1 et V2.

## 🚀 Démarrage

```bash
npm install
npm start
# → API disponible sur http://localhost:3000
```

## 📡 Endpoints

### POST /upload
Upload des données de Google Sheets

**Body :**
```json
{
  "spreadsheetName": "Mon Spreadsheet",
  "sheetName": "Feuil1",
  "data": [
    ["A1", "B1", "C1"],
    ["A2", "B2", "C2"]
  ],
  "url": "https://docs.google.com/spreadsheets/d/...",
  "source": "grasp-v1" // ou "grasp-v2-vue-typescript"
}
```

**Response :**
```json
{
  "success": true,
  "message": "Données uploadées avec succès",
  "filename": "spreadsheet_20250716_143052.json"
}
```

## 💾 Stockage

Les données sont sauvegardées dans `uploads/` avec un nom unique :
```
uploads/
├── spreadsheet_20250716_143052.json
├── spreadsheet_20250716_143125.json
└── ...
```

## 🌐 Exposition publique

Pour que Google Apps Script puisse accéder à l'API, utilisez **ngrok** :

```bash
# Terminal séparé
ngrok http 3000
# → Génère une URL publique (ex: https://abc123.ngrok.io)
```

⚠️ **Important :** L'URL ngrok change à chaque redémarrage !

## 🔧 Configuration CORS

L'API accepte les requêtes depuis :
- `script.google.com` (Google Apps Script)
- `localhost` (développement local)

## 📝 Logs

Les requêtes sont loggées dans la console :
```
[2025-07-16 14:30:52] Upload from grasp-v1: Mon Spreadsheet (Feuil1) - 25 rows
[2025-07-16 14:31:15] Upload from grasp-v2-vue-typescript: Autre Sheet (Data) - 50 rows
```

## 🛠️ Personnalisation

Pour ajouter des fonctionnalités :

1. **Validation des données** dans le middleware
2. **Base de données** au lieu de fichiers JSON
3. **Authentification** avec tokens
4. **Webhooks** pour notifier d'autres services

## 📚 Dépendances

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "body-parser": "^1.20.2"
}
```

---

**API Backend** - Shared Express.js server for Grasp extensions
