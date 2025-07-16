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
import type { SheetInfo, UploadResult } from './types'

// État réactif
const sheetInfo = ref<SheetInfo>({
  spreadsheetName: '',
  sheetName: '',
  rows: 0,
  columns: 0,
  url: ''
})

const isUploading = ref(false)
const statusMessage = ref({
  show: false,
  text: '',
  type: 'success' as 'success' | 'error' | 'loading'
})

let statusTimeout: ReturnType<typeof setTimeout> | null = null

// Fonctions
const loadSheetInfo = async () => {
  try {
    const result = await new Promise<{ success: boolean; info?: SheetInfo; error?: string }>((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .getCurrentSheetInfo()
    })
    
    if (result.success && result.info) {
      sheetInfo.value = result.info
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
  showStatus('Upload en cours...', 'loading')
  
  try {
    const result = await new Promise<UploadResult>((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .performUpload()
    })
    
    if (result.success) {
      showStatus(result.message, 'success')
      // Recharger les infos de la feuille
      await loadSheetInfo()
    } else {
      showStatus('Erreur: ' + (result.error || 'Upload échoué'), 'error')
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
