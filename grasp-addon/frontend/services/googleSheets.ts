import axios, { AxiosResponse } from 'axios'
import type { SpreadsheetInfo, SheetData, GoogleSheetsApiResponse, BatchGetResponse } from '../types'

class GoogleSheetsService {
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets'
  private accessToken: string | null = null

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    try {
      // En Google Workspace Add-on, le token est automatiquement disponible
      // via ScriptApp.getOAuthToken() mais nous devons l'obtenir côté client
      this.accessToken = await this.getAccessToken()
    } catch (error) {
      console.error('Erreur d\'authentification:', error)
    }
  }

  private async getAccessToken(): Promise<string> {
    // Dans un vrai add-on, on utiliserait:
    // return ScriptApp.getOAuthToken()
    // Mais ici on simule ou on utilise une méthode alternative
    return new Promise((resolve, reject) => {
      // Simuler l'obtention du token OAuth
      // Dans la vraie implémentation, cela viendrait de l'authentification Google
      const token = localStorage.getItem('google_access_token')
      if (token) {
        resolve(token)
      } else {
        reject(new Error('Token d\'accès non disponible'))
      }
    })
  }

  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    }
  }

  /**
   * Récupère les informations d'un spreadsheet
   */
  async getSpreadsheetInfo(spreadsheetId: string): Promise<SpreadsheetInfo> {
    try {
      const response: AxiosResponse<SpreadsheetInfo> = await axios.get(
        `${this.baseUrl}/${spreadsheetId}`,
        { headers: this.getAuthHeaders() }
      )
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des infos:', error)
      throw error
    }
  }

  /**
   * Récupère les données d'une plage de cellules
   */
  async getSheetData(spreadsheetId: string, range: string): Promise<SheetData> {
    try {
      const response: AxiosResponse<GoogleSheetsApiResponse> = await axios.get(
        `${this.baseUrl}/${spreadsheetId}/values/${range}`,
        { headers: this.getAuthHeaders() }
      )
      
      return {
        values: response.data.values || [],
        range: response.data.range || range,
        majorDimension: response.data.majorDimension || 'ROWS'
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error)
      throw error
    }
  }

  /**
   * Récupère les données de plusieurs plages
   */
  async batchGetSheetData(spreadsheetId: string, ranges: string[]): Promise<BatchGetResponse> {
    try {
      const rangesParam = ranges.join('&ranges=')
      const response: AxiosResponse<BatchGetResponse> = await axios.get(
        `${this.baseUrl}/${spreadsheetId}/values:batchGet?ranges=${rangesParam}`,
        { headers: this.getAuthHeaders() }
      )
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération batch:', error)
      throw error
    }
  }

  /**
   * Met à jour les données d'une plage
   */
  async updateSheetData(
    spreadsheetId: string, 
    range: string, 
    values: any[][]
  ): Promise<void> {
    try {
      await axios.put(
        `${this.baseUrl}/${spreadsheetId}/values/${range}`,
        {
          values: values,
          majorDimension: 'ROWS'
        },
        { 
          headers: this.getAuthHeaders(),
          params: { valueInputOption: 'RAW' }
        }
      )
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      throw error
    }
  }

  /**
   * Obtient l'ID du spreadsheet actuel
   */
  getCurrentSpreadsheetId(): string {
    // Dans un Google Workspace Add-on, on peut obtenir l'ID depuis l'URL
    // ou depuis les paramètres de contexte
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('spreadsheetId') || ''
  }

  /**
   * Obtient le nom de la feuille active
   */
  getCurrentSheetName(): string {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('sheetName') || 'Sheet1'
  }
}

export default new GoogleSheetsService()
