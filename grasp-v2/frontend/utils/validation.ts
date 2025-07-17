import type { ValidationResult } from '../types'

/**
 * Valide qu'une cellule n'est pas vide
 */
export const validateRequired = (value: any, row: number, column: number): ValidationResult => {
  const isEmpty = !value || value.toString().trim() === ''
  
  return {
    row,
    column,
    rule: 'required',
    valid: !isEmpty,
    message: isEmpty ? `Cellule ${getCellNotation(row, column)} ne peut pas être vide` : undefined
  }
}

/**
 * Valide qu'une cellule respecte un format (ex: email, date, etc.)
 */
export const validateFormat = (value: any, row: number, column: number, format: string): ValidationResult => {
  const str = value?.toString() || ''
  let isValid = true
  let message = ''
  
  switch (format) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      isValid = emailRegex.test(str)
      message = isValid ? '' : `Format email invalide en ${getCellNotation(row, column)}`
      break
      
    case 'date':
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
      isValid = dateRegex.test(str)
      message = isValid ? '' : `Format date invalide en ${getCellNotation(row, column)} (attendu: DD/MM/YYYY)`
      break
      
    case 'number':
      isValid = !isNaN(parseFloat(str))
      message = isValid ? '' : `Nombre invalide en ${getCellNotation(row, column)}`
      break
      
    default:
      isValid = true
  }
  
  return {
    row,
    column,
    rule: 'format',
    valid: isValid,
    message: message || undefined
  }
}

/**
 * Valide qu'une cellule est dans une plage de valeurs
 */
export const validateRange = (value: any, row: number, column: number, min: number, max: number): ValidationResult => {
  const num = parseFloat(value?.toString() || '')
  const isValid = !isNaN(num) && num >= min && num <= max
  
  return {
    row,
    column,
    rule: 'range',
    valid: isValid,
    message: isValid ? undefined : `Valeur en ${getCellNotation(row, column)} doit être entre ${min} et ${max}`
  }
}

/**
 * Validation personnalisée avec une fonction callback
 */
export const validateCustom = (
  value: any, 
  row: number, 
  column: number, 
  validator: (value: any) => { valid: boolean; message?: string }
): ValidationResult => {
  const result = validator(value)
  
  return {
    row,
    column,
    rule: 'custom',
    valid: result.valid,
    message: result.message || (result.valid ? undefined : `Erreur de validation en ${getCellNotation(row, column)}`)
  }
}

/**
 * Convertit les coordonnées row/column en notation Excel (A1, B2, etc.)
 */
export const getCellNotation = (row: number, column: number): string => {
  const columnLetter = String.fromCharCode(64 + column) // A=65, B=66, etc.
  return `${columnLetter}${row}`
}

/**
 * Valide une feuille entière avec des règles configurables
 */
export const validateSheet = (
  data: any[][],
  rules: Array<{
    column: number
    type: 'required' | 'format' | 'range' | 'custom'
    params?: any
  }>
): ValidationResult[] => {
  const results: ValidationResult[] = []
  
  data.forEach((row, rowIndex) => {
    if (rowIndex === 0) return // Skip header row
    
    rules.forEach(rule => {
      const cellValue = row[rule.column - 1] // Convert to 0-based index
      const actualRow = rowIndex + 1
      const actualColumn = rule.column
      
      let result: ValidationResult
      
      switch (rule.type) {
        case 'required':
          result = validateRequired(cellValue, actualRow, actualColumn)
          break
          
        case 'format':
          result = validateFormat(cellValue, actualRow, actualColumn, rule.params)
          break
          
        case 'range':
          result = validateRange(cellValue, actualRow, actualColumn, rule.params.min, rule.params.max)
          break
          
        case 'custom':
          result = validateCustom(cellValue, actualRow, actualColumn, rule.params)
          break
          
        default:
          return
      }
      
      if (!result.valid) {
        results.push(result)
      }
    })
  })
  
  return results
}
