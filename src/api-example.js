// API backend pour l'upload des données spreadsheet
// Cette version utilise un serveur Express local qui sauvegarde dans /tmp

const API_BASE_URL = 'http://localhost:3001'

// Fonction pour uploader vers l'API backend
export async function realApiCall(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/upload-spreadsheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Upload réussi:', result)
      return {
        success: true,
        message: `Fichier sauvegardé: ${result.filename}`,
        location: result.location,
        size: result.size
      }
    } else {
      throw new Error(result.error || 'Erreur inconnue')
    }
    
  } catch (error) {
    console.error('❌ Erreur API:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Fonction pour lister les fichiers sauvegardés
export async function listFiles() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/files`)
    const result = await response.json()
    return result.files || []
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error)
    return []
  }
}

// Fonction pour télécharger un fichier
export function downloadFile(filename) {
  const url = `${API_BASE_URL}/api/download/${filename}`
  window.open(url, '_blank')
}
