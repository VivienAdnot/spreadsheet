<template>
  <div class="grasp-container">
    <div class="header">
      <h2>🔥 Grasp</h2>
    </div>
    
    <div class="info-section">
      <h3>Informations de la feuille</h3>
      <div class="info-item">
        <span class="info-label">Nom:</span>
        <span class="info-value">{{ sheetInfo.sheetName || 'Chargement...' }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Lignes:</span>
        <span class="info-value">{{ sheetInfo.rows || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Colonnes:</span>
        <span class="info-value">{{ sheetInfo.columns || '-' }}</span>
      </div>
    </div>
    
    <div class="upload-section">
      <button 
        class="upload-btn" 
        :disabled="isUploading"
        @click="startUpload"
      >
        <span v-if="isUploading" class="loading-spinner"></span>
        {{ isUploading ? 'Upload en cours...' : '🚀 Uploader la feuille' }}
      </button>
      
      <!-- Affichage des résultats de validation -->
      <ValidationPanel 
        v-if="validationResults.length > 0"
        :validationResults="validationResults"
      />
      
      <div 
        v-if="statusMessage.show" 
        :class="['status-message', `status-${statusMessage.type}`]"
      >
        {{ statusMessage.text }}
        <button class="status-close" @click="hideStatus">×</button>
      </div>
    </div>
    
    <div class="footer">
      Grasp V2 • Vue.js + TypeScript • Google Sheets Extension
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ValidationPanel from './components/ValidationPanel.vue'
import { validateSheet } from './utils/validation'
import type { SheetInfo, SheetData, GasResult, UploadResult, ProcessedSheetData, UploadPayload, ValidationResult } from './types'

// État réactif
const sheetInfo = ref<SheetInfo>({
  spreadsheetName: '',
  sheetName: '',
  rows: 0,
  columns: 0,
  url: ''
})

const isUploading = ref(false)
const validationResults = ref<ValidationResult[]>([])
const statusMessage = ref({
  show: false,
  text: '',
  type: 'success' as 'success' | 'error' | 'loading'
})

let statusTimeout: ReturnType<typeof setTimeout> | null = null

// ========================================
// LOGIQUE MÉTIER (maintenant dans Vue!)
// ========================================

/**
 * Valide les données de la feuille avec des règles configurables
 */
const validateSheetData = (data: any[][]): ValidationResult[] => {
  // Définir les règles de validation ici
  const rules = [
    {
      column: 1, // Colonne A
      type: 'required' as const
    },
    {
      column: 2, // Colonne B
      type: 'format' as const,
      params: 'email'
    },
    {
      column: 3, // Colonne C
      type: 'range' as const,
      params: { min: 0, max: 100 }
    }
  ]
  
  return validateSheet(data, rules)
}

/**
 * Traite et formate les données pour l'upload
 */
const processSheetData = (rawData: SheetData): ProcessedSheetData => {
  const processed: ProcessedSheetData = {
    sheets: [{
      name: rawData.metadata.sheetName,
      data: rawData.values,
      rows: rawData.metadata.rows,
      columns: rawData.metadata.columns
    }],
    metadata: {
      ...rawData.metadata,
      version: "2.0-vue-typescript",
      processedAt: new Date().toISOString()
    }
  }
  
  return processed
}

/**
 * Prépare le payload final pour l'API
 */
const prepareUploadPayload = (processedData: ProcessedSheetData): UploadPayload => {
  return {
    timestamp: new Date().toISOString(),
    data: processedData,
    format: 'json',
    source: 'grasp-v2-vue-typescript'
  }
}

// ========================================
// FONCTIONS D'INTERFACE
// ========================================

const loadSheetInfo = async () => {
  try {
    const result = await new Promise<GasResult<SheetInfo>>((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .getCurrentSheetInfo()
    })
    
    if (result.success && result.data) {
      sheetInfo.value = result.data
    } else {
      showStatus('Erreur: ' + (result.error || 'Impossible de charger les informations'), 'error')
    }
  } catch (error) {
    showStatus('Erreur: ' + (error as Error).message, 'error')
  }
}

const startUpload = async () => {
  if (isUploading.value) return
  
  isUploading.value = true
  showStatus('Récupération des données...', 'loading')
  
  try {
    // 1. Récupérer les données brutes depuis Google Sheets
    const sheetResult = await new Promise<GasResult<SheetData>>((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .getSheetData()
    })
    
    if (!sheetResult.success || !sheetResult.data) {
      throw new Error(sheetResult.error || 'Impossible de récupérer les données')
    }
    
    showStatus('Validation des données...', 'loading')
    
    // 2. Valider les données (logique métier dans Vue!)
    const validationResults_temp = validateSheetData(sheetResult.data.values)
    validationResults.value = validationResults_temp
    
    if (validationResults_temp.length > 0) {
      const errorCount = validationResults_temp.filter(r => !r.valid).length
      showStatus(`⚠️ ${errorCount} erreur(s) de validation trouvée(s)`, 'error')
      // Pour l'instant on continue, mais on pourrait afficher les erreurs
    }
    
    showStatus('Traitement des données...', 'loading')
    
    // 3. Traiter les données (logique métier dans Vue!)
    const processedData = processSheetData(sheetResult.data)
    
    // 4. Préparer le payload (logique métier dans Vue!)
    const uploadPayload = prepareUploadPayload(processedData)
    
    showStatus('Upload en cours...', 'loading')
    
    // 5. Upload via la fonction GAS (couche réseau uniquement)
    const uploadResult = await new Promise<UploadResult>((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .performUpload(uploadPayload)
    })
    
    if (uploadResult.success) {
      showStatus(`✅ Upload réussi! ${processedData.sheets[0].rows} lignes et ${processedData.sheets[0].columns} colonnes envoyées.`, 'success')
      // Recharger les infos de la feuille
      await loadSheetInfo()
    } else {
      showStatus('Erreur: ' + (uploadResult.error || 'Upload échoué'), 'error')
    }
    
  } catch (error) {
    showStatus('Erreur: ' + (error as Error).message, 'error')
  } finally {
    isUploading.value = false
  }
}

const showStatus = (text: string, type: 'success' | 'error' | 'loading') => {
  statusMessage.value = { show: true, text, type }
  
  // Nettoyer le timeout précédent
  if (statusTimeout) {
    clearTimeout(statusTimeout)
  }
  
  // Masquer automatiquement après un délai
  if (type === 'success') {
    statusTimeout = setTimeout(() => hideStatus(), 20000) // 20 secondes
  } else if (type === 'error') {
    statusTimeout = setTimeout(() => hideStatus(), 30000) // 30 secondes
  }
  // Les messages de loading ne disparaissent pas automatiquement
}

const hideStatus = () => {
  statusMessage.value.show = false
  if (statusTimeout) {
    clearTimeout(statusTimeout)
    statusTimeout = null
  }
}

// Lifecycle
onMounted(() => {
  loadSheetInfo()
})
</script>

<style scoped>
.grasp-container {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 16px;
  background-color: #f8f9fa;
}

.header {
  background: linear-gradient(135deg, #4285f4, #34a853);
  color: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.header h2 {
  margin: 0;
  font-size: 18px;
}

.info-section {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #dadce0;
}

.info-section h3 {
  margin-top: 0;
  color: #5f6368;
  font-size: 14px;
}

.info-item {
  margin-bottom: 8px;
  font-size: 13px;
}

.info-label {
  font-weight: bold;
  color: #5f6368;
}

.info-value {
  color: #202124;
}

.upload-section {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #dadce0;
}

.upload-btn {
  background: #4285f4;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 12px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.upload-btn:hover:not(:disabled) {
  background: #3367d6;
}

.upload-btn:disabled {
  background: #9aa0a6;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.status-message {
  padding: 12px;
  border-radius: 6px;
  margin-top: 12px;
  font-size: 13px;
  position: relative;
}

.status-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-close:hover {
  opacity: 1;
}

.status-success {
  background: #e8f5e8;
  color: #137333;
  border: 1px solid #ceead6;
}

.status-error {
  background: #fce8e6;
  color: #d93025;
  border: 1px solid #f9ab0a;
}

.status-loading {
  background: #e3f2fd;
  color: #1565c0;
  border: 1px solid #bbdefb;
}

.footer {
  text-align: center;
  font-size: 12px;
  color: #5f6368;
  margin-top: 20px;
}
</style>
