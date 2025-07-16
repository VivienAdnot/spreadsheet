/**
 * Grasp V2 - Extension Google Sheets avec Vue.js + TypeScript
 * Cette extension ajoute un sidebar pour uploader le contenu de la feuille vers l'API
 */

/**
 * Fonction appelée à l'ouverture du document
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Grasp V2')
    .addItem('Ouvrir le panneau', 'showSidebar')
    .addToUi();
}

/**
 * Fonction appelée lors de l'installation de l'add-on
 */
function onInstall() {
  onOpen();
}

/**
 * Ouvre le sidebar
 */
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('Grasp V2 - Vue.js + TypeScript')
    .setWidth(300);
  
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Récupère les données de la feuille active
 */
function getSheetData() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    // Récupère les métadonnées
    const sheetName = sheet.getName();
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    
    // Formate les données
    const data = {
      sheets: [{
        name: sheetName,
        data: values,
        rows: lastRow,
        columns: lastColumn
      }],
      metadata: {
        spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
        spreadsheetName: SpreadsheetApp.getActiveSpreadsheet().getName(),
        sheetName: sheetName,
        timestamp: new Date().toISOString(),
        version: "2.0-vue-typescript"
      }
    };
    
    return {
      success: true,
      data: data,
      rowCount: lastRow,
      columnCount: lastColumn
    };
    
  } catch (error) {
    Logger.log('Erreur lors de la récupération des données: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Upload les données vers l'API
 */
function uploadToApi(data) {
  try {
    // URL de l'API via ngrok
    const API_URL = 'https://67151878f9cc.ngrok-free.app/api/upload-spreadsheet';
    
    const payload = {
      timestamp: new Date().toISOString(),
      data: data,
      format: 'json',
      source: 'grasp-v2-vue-typescript'
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(API_URL, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() === 200 && responseData.success) {
      return {
        success: true,
        message: 'Upload réussi !',
        filename: responseData.filename,
        location: responseData.location
      };
    } else {
      throw new Error(responseData.error || 'Erreur inconnue');
    }
    
  } catch (error) {
    Logger.log('Erreur upload API: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Fonction principale d'upload appelée depuis le sidebar Vue
 */
function performUpload() {
  try {
    // Récupère les données de la feuille
    const sheetResult = getSheetData();
    
    if (!sheetResult.success) {
      return {
        success: false,
        error: 'Impossible de récupérer les données: ' + sheetResult.error
      };
    }
    
    // Upload vers l'API
    const uploadResult = uploadToApi(sheetResult.data);
    
    if (uploadResult.success) {
      return {
        success: true,
        message: `✅ Upload réussi (Vue.js)! ${sheetResult.rowCount} lignes et ${sheetResult.columnCount} colonnes envoyées.`,
        details: uploadResult
      };
    } else {
      return {
        success: false,
        error: uploadResult.error
      };
    }
    
  } catch (error) {
    Logger.log('Erreur performUpload: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Obtient les informations de la feuille courante
 */
function getCurrentSheetInfo() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    return {
      success: true,
      info: {
        spreadsheetName: spreadsheet.getName(),
        sheetName: sheet.getName(),
        rows: sheet.getLastRow(),
        columns: sheet.getLastColumn(),
        url: spreadsheet.getUrl()
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}
