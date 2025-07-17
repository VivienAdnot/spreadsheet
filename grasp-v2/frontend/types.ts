// Types pour l'interface Google Apps Script
export interface SheetInfo {
  spreadsheetName: string;
  sheetName: string;
  rows: number;
  columns: number;
  url: string;
}

export interface SheetData {
  values: any[][];
  metadata: SheetMetadata;
}

export interface SheetMetadata {
  spreadsheetId: string;
  spreadsheetName: string;
  sheetName: string;
  rows: number;
  columns: number;
  url: string;
  timestamp: string;
}

// Types pour les résultats des appels GAS
export interface GasResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Types pour l'upload
export interface UploadPayload {
  timestamp: string;
  data: ProcessedSheetData;
  format: string;
  source: string;
}

export interface ProcessedSheetData {
  sheets: Array<{
    name: string;
    data: any[][];
    rows: number;
    columns: number;
  }>;
  metadata: SheetMetadata & {
    version: string;
    processedAt: string;
  };
}

export interface UploadResult {
  success: boolean;
  message?: string;
  error?: string;
  filename?: string;
  location?: string;
}

// Types pour les fonctions de validation futures
export interface ValidationRule {
  id: string;
  name: string;
  column: number;
  type: 'required' | 'format' | 'range' | 'custom';
  params: any;
}

export interface ValidationResult {
  row: number;
  column: number;
  rule: string;
  valid: boolean;
  message?: string;
}

// Types pour les plages de cellules
export interface CellRange {
  values: any[][];
  range: string;
  numRows: number;
  numColumns: number;
}

// Interface pour google.script.run
declare global {
  interface Window {
    google: {
      script: {
        run: {
          withSuccessHandler: (handler: (result: any) => void) => any;
          withFailureHandler: (handler: (error: any) => void) => any;
          getSheetData: () => Promise<GasResult<SheetData>>;
          getCellRange: (range: string) => Promise<GasResult<CellRange>>;
          getCurrentSheetInfo: () => Promise<GasResult<SheetInfo>>;
          uploadToApi: (data: UploadPayload) => Promise<UploadResult>;
          performUpload: (data: UploadPayload) => Promise<UploadResult>;
        };
      };
    };
  }
}
