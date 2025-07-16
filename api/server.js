const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Endpoint pour recevoir les données du spreadsheet depuis Grasp
app.post('/api/upload-spreadsheet', (req, res) => {
  try {
    const { timestamp, data, format, source } = req.body;
    
    // Créer un nom de fichier unique
    const filename = `grasp-${Date.now()}.json`;
    const filepath = path.join('/tmp', filename);
    
    // Préparer les données à sauvegarder
    const fileContent = {
      timestamp,
      data,
      format: format || 'json',
      source: source || 'grasp-extension',
      savedAt: new Date().toISOString(),
      filename
    };
    
    // Sauvegarder dans /tmp
    fs.writeFileSync(filepath, JSON.stringify(fileContent, null, 2));
    
    console.log(`✅ Grasp data saved: ${filepath}`);
    console.log(`📊 Data received from ${source || 'Grasp'}:`);
    console.log(`   - Timestamp: ${timestamp}`);
    console.log(`   - Sheets count: ${data.sheets?.length || 0}`);
    console.log(`   - Format: ${format || 'json'}`);
    
    // Réponse de succès
    res.json({
      success: true,
      message: 'Grasp data uploaded successfully!',
      location: filepath,
      filename: filename,
      size: JSON.stringify(fileContent).length
    });
    
  } catch (error) {
    console.error('❌ Error saving data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint pour lister les fichiers sauvegardés
app.get('/api/files', (req, res) => {
  try {
    const files = fs.readdirSync('/tmp')
      .filter(file => file.startsWith('grasp-') && file.endsWith('.json'))
      .map(file => {
        const filepath = path.join('/tmp', file);
        const stats = fs.statSync(filepath);
        return {
          filename: file,
          path: filepath,
          size: stats.size,
          created: stats.birthtime
        };
      })
      .sort((a, b) => b.created - a.created);
    
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint pour télécharger un fichier
app.get('/api/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join('/tmp', filename);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }
    
    res.download(filepath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint de test
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Grasp API is working!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    service: 'Grasp - Google Sheets Extension API',
    timestamp: new Date().toISOString()
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🔥 Grasp API started on http://localhost:${PORT}`);
  console.log(`📁 Files will be saved in /tmp/`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST /api/upload-spreadsheet - Upload from Grasp`);
  console.log(`   GET  /api/files - List saved files`);
  console.log(`   GET  /api/download/:filename - Download a file`);
  console.log(`   GET  /api/test - Test endpoint`);
  console.log(`   GET  /api/status - API status`);
  console.log(`🔗 Ngrok URL: https://67151878f9cc.ngrok-free.app`);
});
