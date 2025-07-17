// Types pour Google Workspace Add-on
export interface SheetData {
  values: any[][]
  range: string
  majorDimension: string
}

export interface SpreadsheetInfo {
  spreadsheetId: string
  properties: {
    title: string
    locale: string
    autoRecalc: string
    timeZone: string
  }
  sheets: Array<{
    properties: {
      sheetId: number
      title: string
      index: number
      sheetType: string
      gridProperties: {
        rowCount: number
        columnCount: number
      }
    }
  }>
}

export interface GoogleSheetsApiResponse<T = any> {
  values?: any[][]
  range?: string
  majorDimension?: string
  data?: T
  error?: {
    code: number
    message: string
    status: string
  }
}

// Types pour la validation
export interface ValidationRule {
  id: string
  name: string
  column: number
  type: 'required' | 'format' | 'range' | 'custom'
  params: any
}

export interface ValidationResult {
  row: number
  column: number
  rule: string
  valid: boolean
  message?: string
}

// Types pour l'API Grasp
export interface GraspUploadPayload {
  spreadsheetId: string
  spreadsheetName: string
  sheetName: string
  data: any[][]
  url: string
  source: string
  timestamp: string
}

export interface GraspApiResponse {
  success: boolean
  message?: string
  error?: string
  filename?: string
  location?: string
}

// Types pour les endpoints de validation
export interface ValidationRulesResponse {
  success: boolean
  rules: ValidationRule[]
  error?: string
}

// Types pour l'authentification Google
export interface GoogleAuthToken {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
  refresh_token?: string
}

// Types pour l'interface utilisateur
export interface UIState {
  isLoading: boolean
  spreadsheetInfo: SpreadsheetInfo | null
  currentSheet: string
  validationResults: ValidationResult[]
  message: {
    show: boolean
    text: string
    type: 'success' | 'error' | 'info'
  }
}

// Types pour les réponses de l'API Google Sheets
export interface BatchGetResponse {
  spreadsheetId: string
  valueRanges: Array<{
    range: string
    majorDimension: string
    values: any[][]
  }>
}

// Types pour les métadonnées de cellule
export interface CellMetadata {
  row: number
  column: number
  value: any
  formula?: string
  note?: string
  format?: any
}
