// Types pour l'interface Google Apps Script
export interface SheetInfo {
  spreadsheetName: string;
  sheetName: string;
  rows: number;
  columns: number;
  url: string;
}

export interface SheetData {
  name: string;
  data: any[][];
  rows: number;
  columns: number;
}

export interface GraspData {
  sheets: SheetData[];
  metadata: {
    spreadsheetId: string;
    spreadsheetName: string;
    sheetName: string;
    timestamp: string;
    version: string;
  };
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  filename?: string;
  location?: string;
}

export interface UploadResult {
  success: boolean;
  message: string;
  details?: any;
  error?: string;
}

// Interface pour google.script.run
declare global {
  interface Window {
    google: {
      script: {
        run: {
          withSuccessHandler: (handler: (result: any) => void) => any;
          withFailureHandler: (handler: (error: any) => void) => any;
          getCurrentSheetInfo: () => Promise<{ success: boolean; info?: SheetInfo; error?: string }>;
          performUpload: () => Promise<UploadResult>;
        };
      };
    };
  }
}
