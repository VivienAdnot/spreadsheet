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
 * Récupère les données brutes de la feuille active
 * (Couche d'accès aux données uniquement)
 */
function getSheetData() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    return {
      success: true,
      data: {
        values: values,
        metadata: {
          spreadsheetId: spreadsheet.getId(),
          spreadsheetName: spreadsheet.getName(),
          sheetName: sheet.getName(),
          rows: sheet.getLastRow(),
          columns: sheet.getLastColumn(),
          url: spreadsheet.getUrl(),
          timestamp: new Date().toISOString()
        }
      }
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
 * Récupère les données d'une plage spécifique
 * (pour les futures fonctionnalités de validation)
 */
function getCellRange(rangeNotation) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const range = sheet.getRange(rangeNotation);
    const values = range.getValues();
    
    return {
      success: true,
      data: {
        values: values,
        range: rangeNotation,
        numRows: range.getNumRows(),
        numColumns: range.getNumColumns()
      }
    };
    
  } catch (error) {
    Logger.log('Erreur getCellRange: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Upload des données formatées vers l'API
 * (Couche d'accès réseau uniquement)
 */
function uploadToApi(formattedData) {
  try {
    // URL de l'API via ngrok
    const API_URL = 'https://67151878f9cc.ngrok-free.app/api/upload-spreadsheet';
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(formattedData)
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
 * Fonction simplifiée d'upload - la logique est maintenant dans Vue.js
 * (Juste un pont entre Vue et les fonctions GAS)
 */
function performUpload(processedData) {
  try {
    // Upload vers l'API avec les données déjà traitées par Vue
    const uploadResult = uploadToApi(processedData);
    
    return uploadResult;
    
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
