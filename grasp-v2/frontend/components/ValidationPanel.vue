<template>
  <div class="validation-panel">
    <h3>🔍 Validation des données</h3>
    
    <div v-if="validationResults.length === 0" class="validation-success">
      ✅ Aucune erreur détectée
    </div>
    
    <div v-else class="validation-errors">
      <div class="error-summary">
        ⚠️ {{ errorCount }} erreur(s) trouvée(s)
      </div>
      
      <div class="error-list">
        <div 
          v-for="result in validationResults" 
          :key="`${result.row}-${result.column}`"
          class="error-item"
        >
          <span class="error-location">{{ getCellNotation(result.row, result.column) }}</span>
          <span class="error-message">{{ result.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Types locaux pour éviter les problèmes d'import
interface ValidationResult {
  row: number
  column: number
  rule: string
  valid: boolean
  message?: string
}

interface Props {
  validationResults: ValidationResult[]
}

const props = defineProps<Props>()

const errorCount = computed(() => 
  props.validationResults.filter(r => !r.valid).length
)

const getCellNotation = (row: number, column: number): string => {
  const columnLetter = String.fromCharCode(64 + column) // A=65, B=66, etc.
  return `${columnLetter}${row}`
}
</script>

<style scoped>
.validation-panel {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #dadce0;
}

.validation-panel h3 {
  margin-top: 0;
  color: #5f6368;
  font-size: 14px;
}

.validation-success {
  color: #137333;
  background: #e8f5e8;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ceead6;
  font-size: 13px;
}

.validation-errors {
  color: #d93025;
}

.error-summary {
  background: #fce8e6;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #f9ab0a;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: bold;
}

.error-list {
  max-height: 200px;
  overflow-y: auto;
}

.error-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #f1f3f4;
  font-size: 12px;
}

.error-location {
  background: #ea4335;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.error-message {
  flex: 1;
  color: #5f6368;
}
</style>
