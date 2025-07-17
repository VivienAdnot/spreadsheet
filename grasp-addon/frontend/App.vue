<template>
  <div class="grasp-addon">
    <div class="header">
      <h1>🔥 Grasp Add-on</h1>
      <p>Validation & Upload pour Google Sheets</p>
    </div>

    <!-- Statut de connexion -->
    <div class="connection-status">
      <div :class="['status-indicator', apiStatus.connected ? 'connected' : 'disconnected']">
        {{ apiStatus.connected ? '✅ API connectée' : '❌ API déconnectée' }}
      </div>
    </div>

    <!-- Informations du spreadsheet -->
    <div v-if="spreadsheetInfo" class="spreadsheet-info">
      <h3>📊 Document actuel</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Nom:</span>
          <span class="value">{{ spreadsheetInfo.properties.title }}</span>
        </div>
        <div class="info-item">
          <span class="label">Feuille:</span>
          <span class="value">{{ currentSheet }}</span>
        </div>
        <div class="info-item">
          <span class="label">Données:</span>
          <span class="value">{{ sheetData.values.length }} lignes</span>
        </div>
      </div>
    </div>

    <!-- Validation -->
    <div class="validation-section">
      <h3>🔍 Validation des données</h3>
      
      <button 
        @click="validateData" 
        :disabled="isValidating"
        class="btn btn-secondary"
      >
        {{ isValidating ? 'Validation...' : 'Valider les données' }}
      </button>

      <div v-if="validationResults.length > 0" class="validation-results">
        <h4>Résultats de validation</h4>
        <div class="error-count">
          {{ validationResults.filter(r => !r.valid).length }} erreur(s) trouvée(s)
        </div>
        <div class="errors-list">
          <div 
            v-for="result in validationResults.filter(r => !r.valid)" 
            :key="`${result.row}-${result.column}`"
            class="error-item"
          >
            <span class="cell-ref">{{ getCellReference(result.row, result.column) }}</span>
            <span class="error-message">{{ result.message }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload -->
    <div class="upload-section">
      <h3>🚀 Upload des données</h3>
      
      <button 
        @click="uploadData" 
        :disabled="isUploading || validationResults.some(r => !r.valid)"
        class="btn btn-primary"
      >
        {{ isUploading ? 'Upload en cours...' : 'Uploader vers Grasp' }}
      </button>

      <div v-if="uploadResult" class="upload-result">
        <div :class="['result-message', uploadResult.success ? 'success' : 'error']">
          {{ uploadResult.message }}
        </div>
        <div v-if="uploadResult.filename" class="result-details">
          Fichier: {{ uploadResult.filename }}
        </div>
      </div>
    </div>

    <!-- Messages système -->
    <div v-if="systemMessage.show" :class="['system-message', systemMessage.type]">
      {{ systemMessage.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import googleSheetsService from './services/googleSheets'
import graspApiService from './services/graspApi'
import type { 
  SpreadsheetInfo, 
  SheetData, 
  ValidationResult, 
  GraspApiResponse,
  UIState 
} from './types'

// État réactif
const spreadsheetInfo = ref<SpreadsheetInfo | null>(null)
const currentSheet = ref<string>('')
const sheetData = ref<SheetData>({ values: [], range: '', majorDimension: 'ROWS' })
const validationResults = ref<ValidationResult[]>([])
const uploadResult = ref<GraspApiResponse | null>(null)

const isValidating = ref(false)
const isUploading = ref(false)

const apiStatus = reactive({
  connected: false,
  lastCheck: null as Date | null
})

const systemMessage = reactive({
  show: false,
  text: '',
  type: 'info' as 'info' | 'success' | 'error'
})

// Fonctions utilitaires
const getCellReference = (row: number, column: number): string => {
  const columnLetter = String.fromCharCode(65 + column - 1)
  return `${columnLetter}${row}`
}

const showMessage = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
  systemMessage.text = text
  systemMessage.type = type
  systemMessage.show = true
  
  setTimeout(() => {
    systemMessage.show = false
  }, 5000)
}

// Fonctions principales
const loadSpreadsheetData = async () => {
  try {
    const spreadsheetId = googleSheetsService.getCurrentSpreadsheetId()
    const sheetName = googleSheetsService.getCurrentSheetName()
    
    if (!spreadsheetId) {
      throw new Error('ID du spreadsheet non trouvé')
    }

    // Charger les infos du spreadsheet
    spreadsheetInfo.value = await googleSheetsService.getSpreadsheetInfo(spreadsheetId)
    currentSheet.value = sheetName
    
    // Charger les données de la feuille
    sheetData.value = await googleSheetsService.getSheetData(spreadsheetId, sheetName)
    
    showMessage('Données chargées avec succès', 'success')
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    showMessage('Erreur lors du chargement des données', 'error')
  }
}

const validateData = async () => {
  if (!spreadsheetInfo.value) return
  
  isValidating.value = true
  try {
    // Récupérer les règles de validation
    const rulesResponse = await graspApiService.getValidationRules(
      googleSheetsService.getCurrentSpreadsheetId()
    )
    
    if (rulesResponse.success && rulesResponse.rules.length > 0) {
      // Valider avec les règles de l'API
      const validationResponse = await graspApiService.validateData(
        googleSheetsService.getCurrentSpreadsheetId(),
        sheetData.value.values,
        rulesResponse.rules.map(r => r.id)
      )
      
      if (validationResponse.success) {
        validationResults.value = validationResponse.results
      }
    } else {
      // Validation par défaut
      validationResults.value = validateDataLocally(sheetData.value.values)
    }
    
    const errorCount = validationResults.value.filter(r => !r.valid).length
    showMessage(
      errorCount > 0 ? `${errorCount} erreur(s) trouvée(s)` : 'Validation réussie',
      errorCount > 0 ? 'error' : 'success'
    )
  } catch (error) {
    console.error('Erreur lors de la validation:', error)
    showMessage('Erreur lors de la validation', 'error')
  } finally {
    isValidating.value = false
  }
}

const validateDataLocally = (data: any[][]): ValidationResult[] => {
  const results: ValidationResult[] = []
  
  data.forEach((row, rowIndex) => {
    if (rowIndex === 0) return // Skip header
    
    // Validation exemple : première colonne requise
    if (!row[0] || row[0].toString().trim() === '') {
      results.push({
        row: rowIndex + 1,
        column: 1,
        rule: 'required',
        valid: false,
        message: 'Cette cellule est obligatoire'
      })
    }
  })
  
  return results
}

const uploadData = async () => {
  if (!spreadsheetInfo.value || !sheetData.value.values.length) return
  
  isUploading.value = true
  uploadResult.value = null
  
  try {
    const payload = graspApiService.formatUploadPayload(
      googleSheetsService.getCurrentSpreadsheetId(),
      spreadsheetInfo.value.properties.title,
      currentSheet.value,
      sheetData.value.values,
      window.location.href
    )
    
    uploadResult.value = await graspApiService.uploadSpreadsheetData(payload)
    
    showMessage(
      uploadResult.value.success ? 'Upload réussi!' : 'Erreur lors de l\'upload',
      uploadResult.value.success ? 'success' : 'error'
    )
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    showMessage('Erreur lors de l\'upload', 'error')
  } finally {
    isUploading.value = false
  }
}

const checkApiStatus = async () => {
  try {
    const response = await graspApiService.ping()
    apiStatus.connected = response.success
    apiStatus.lastCheck = new Date()
  } catch (error) {
    apiStatus.connected = false
    apiStatus.lastCheck = new Date()
  }
}

// Lifecycle
onMounted(async () => {
  await checkApiStatus()
  await loadSpreadsheetData()
})
</script>

<style scoped>
.grasp-addon {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #4285f4, #34a853);
  color: white;
  border-radius: 8px;
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
}

.header p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.connection-status {
  margin-bottom: 20px;
}

.status-indicator {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-indicator.connected {
  background: #e8f5e8;
  color: #137333;
}

.status-indicator.disconnected {
  background: #fce8e6;
  color: #d93025;
}

.spreadsheet-info {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.spreadsheet-info h3 {
  margin-top: 0;
  color: #5f6368;
  font-size: 16px;
}

.info-grid {
  display: grid;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.info-item .label {
  font-weight: 500;
  color: #5f6368;
}

.info-item .value {
  color: #202124;
}

.validation-section, .upload-section {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.validation-section h3, .upload-section h3 {
  margin-top: 0;
  color: #5f6368;
  font-size: 16px;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #4285f4;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #3367d6;
}

.btn-secondary {
  background: #f8f9fa;
  color: #5f6368;
  border: 1px solid #dadce0;
}

.btn-secondary:hover:not(:disabled) {
  background: #f1f3f4;
}

.validation-results {
  margin-top: 16px;
  padding: 12px;
  background: #fef7e0;
  border-radius: 4px;
  border: 1px solid #fdd663;
}

.validation-results h4 {
  margin: 0 0 8px 0;
  color: #b06000;
  font-size: 14px;
}

.error-count {
  margin-bottom: 12px;
  font-weight: 500;
  color: #b06000;
}

.errors-list {
  max-height: 200px;
  overflow-y: auto;
}

.error-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #f9c23c;
  font-size: 12px;
}

.cell-ref {
  background: #d93025;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.error-message {
  color: #5f6368;
}

.upload-result {
  margin-top: 16px;
  padding: 12px;
  border-radius: 4px;
}

.result-message.success {
  background: #e8f5e8;
  color: #137333;
  border: 1px solid #ceead6;
}

.result-message.error {
  background: #fce8e6;
  color: #d93025;
  border: 1px solid #f9ab0a;
}

.result-details {
  margin-top: 8px;
  font-size: 12px;
  color: #5f6368;
}

.system-message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-size: 14px;
  z-index: 1000;
  max-width: 300px;
}

.system-message.info {
  background: #e3f2fd;
  color: #1565c0;
  border: 1px solid #bbdefb;
}

.system-message.success {
  background: #e8f5e8;
  color: #137333;
  border: 1px solid #ceead6;
}

.system-message.error {
  background: #fce8e6;
  color: #d93025;
  border: 1px solid #f9ab0a;
}
</style>
