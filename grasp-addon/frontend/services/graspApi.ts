import axios, { AxiosResponse } from 'axios'
import type { GraspUploadPayload, GraspApiResponse, ValidationRulesResponse } from '../types'

class GraspApiService {
  private baseUrl = 'https://api.grasp.gg' // URL de production
  private devUrl = 'https://67151878f9cc.ngrok-free.app' // URL de dev avec ngrok

  /**
   * Obtient l'URL de base selon l'environnement
   */
  private getBaseUrl(): string {
    return process.env.NODE_ENV === 'production' ? this.baseUrl : this.devUrl
  }

  /**
   * Upload les données vers l'API Grasp
   */
  async uploadSpreadsheetData(payload: GraspUploadPayload): Promise<GraspApiResponse> {
    try {
      const response: AxiosResponse<GraspApiResponse> = await axios.post(
        `${this.getBaseUrl()}/upload`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 secondes
        }
      )
      return response.data
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      throw error
    }
  }

  /**
   * Récupère les règles de validation depuis l'API
   */
  async getValidationRules(spreadsheetId: string): Promise<ValidationRulesResponse> {
    try {
      const response: AxiosResponse<ValidationRulesResponse> = await axios.get(
        `${this.getBaseUrl()}/validation-rules`,
        {
          params: { spreadsheetId },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des règles:', error)
      // Retourner des règles par défaut si l'API n'est pas disponible
      return {
        success: false,
        rules: [],
        error: 'Service de validation non disponible'
      }
    }
  }

  /**
   * Valide des données spécifiques avec l'API
   */
  async validateData(
    spreadsheetId: string,
    data: any[][],
    rules: string[]
  ): Promise<{ success: boolean; results: any[]; error?: string }> {
    try {
      const response = await axios.post(
        `${this.getBaseUrl()}/validate`,
        {
          spreadsheetId,
          data,
          rules
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Erreur lors de la validation:', error)
      return {
        success: false,
        results: [],
        error: 'Erreur de validation'
      }
    }
  }

  /**
   * Ping l'API pour vérifier la disponibilité
   */
  async ping(): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await axios.get(`${this.getBaseUrl()}/ping`, {
        timeout: 5000
      })
      return { success: true, message: response.data.message }
    } catch (error) {
      return { success: false, message: 'API non disponible' }
    }
  }

  /**
   * Formate les données pour l'upload
   */
  formatUploadPayload(
    spreadsheetId: string,
    spreadsheetName: string,
    sheetName: string,
    data: any[][],
    url: string
  ): GraspUploadPayload {
    return {
      spreadsheetId,
      spreadsheetName,
      sheetName,
      data,
      url,
      source: 'grasp-addon-vue-typescript',
      timestamp: new Date().toISOString()
    }
  }
}

export default new GraspApiService()
